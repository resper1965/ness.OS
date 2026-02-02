#!/usr/bin/env node
/**
 * Gera SQL de seed a partir do corp-site-ness (public/locales/pt).
 * Executar: node scripts/seed-from-corp-site.js > supabase/seed/002_corp_site_content.sql
 */

const fs = require('fs');
const path = require('path');

const REF = path.join(__dirname, '../_reference/corp-site-ness/public/locales/pt');

function esc(s) {
  return s == null || s === '' ? 'NULL' : `'${String(s).replace(/'/g, "''")}'`;
}

function jsonEsc(obj) {
  return "'" + JSON.stringify(obj || {}).replace(/'/g, "''") + "'::jsonb";
}

// Produtos/serviços com página completa no products.json
const PRODUCT_KEYS = [
  'nsecops', 'ninfraops', 'ndevarch', 'nautoops', 'ncirt', 'nprivacy',
  'nfaturasons', 'nflow', 'forense', 'trustness', 'dpoaas'
];

// Slug para cada key (dpoaas -> trustness-dpo)
const SLUG_MAP = {
  dpoaas: 'trustness-dpo',
};

function getSlug(key) {
  return SLUG_MAP[key] || key;
}

function getProductName(prod, key) {
  if (!prod || !prod.hero) return key;
  const t = prod.hero.title || prod.hero.headline || '';
  return t.replace(/<[^>]+>/g, '').trim() || key;
}

const products = JSON.parse(fs.readFileSync(path.join(REF, 'products.json'), 'utf8'));
const legal = JSON.parse(fs.readFileSync(path.join(REF, 'legal.json'), 'utf8'));

console.log('-- Seed corp-site-ness (pt-BR) - ' + new Date().toISOString());
console.log('-- Executar após migrations 002, 011');
console.log('');

// services_catalog
console.log('-- === SERVICES_CATALOG (produtos + soluções unificados) ===');
for (const key of PRODUCT_KEYS) {
  const prod = products[key];
  if (!prod) continue;
  const slug = getSlug(key);
  const hero = prod.hero || {};
  const title = getProductName(prod, key);
  const desc = hero.description || hero.subtitle || '';
  const content = {
    hero: prod.hero,
    whyItMatters: prod.whyItMatters,
    useCases: prod.useCases,
    useCasesTitle: prod.useCasesTitle,
    resources: prod.resources,
    resourcesTitle: prod.resourcesTitle,
    resourcesSubtitle: prod.resourcesSubtitle,
    metrics: prod.metrics,
    metricsTitle: prod.metricsTitle,
    metricsSubtitle: prod.metricsSubtitle,
    process: prod.process,
    processTitle: prod.processTitle,
    processSubtitle: prod.processSubtitle,
    cta: prod.cta,
  };
  console.log(`
INSERT INTO public.services_catalog (name, slug, marketing_pitch, marketing_title, marketing_body, content_json, is_active, playbook_id)
VALUES (
  ${esc(title)},
  ${esc(slug)},
  ${esc(desc)},
  ${esc(title)},
  ${esc(desc)},
  ${jsonEsc(content)},
  true,
  (SELECT id FROM public.playbooks WHERE slug = ${esc(slug)} LIMIT 1)
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  marketing_pitch = EXCLUDED.marketing_pitch,
  marketing_title = EXCLUDED.marketing_title,
  marketing_body = EXCLUDED.marketing_body,
  content_json = EXCLUDED.content_json,
  is_active = EXCLUDED.is_active,
  playbook_id = EXCLUDED.playbook_id;
`);
}

// static_pages (legal)
console.log('');
console.log('-- === STATIC_PAGES (legal) ===');

function legalToSections(legalObj) {
  const sections = [];
  const stripHtml = (s) => (s || '').replace(/<[^>]+>/g, '').trim();
  if (legalObj.sections && Array.isArray(legalObj.sections)) {
    for (const s of legalObj.sections) {
      const items = Array.isArray(s.items) ? s.items.map((i) => (typeof i === 'string' ? i : i.right ? i.right + ': ' + i.description : i.title + ': ' + i.description)) : undefined;
      sections.push({ title: stripHtml(s.title), content: s.content || '', items, note: s.note });
    }
    return sections;
  }
  if (legalObj.hero) {
    sections.push({ title: stripHtml(legalObj.hero.title) || 'Introdução', content: legalObj.hero.subtitle || '' });
  }
  if (legalObj.intro) {
    sections.push({ title: 'Introdução', content: [legalObj.intro.paragraph1, legalObj.intro.paragraph2].filter(Boolean).join('\n\n') });
  }
  if (legalObj.principles) {
    sections.push({
      title: legalObj.principles.title,
      content: legalObj.principles.subtitle || '',
      items: legalObj.principles.items?.map((i) => i.title + ': ' + i.description),
    });
  }
  if (legalObj.rights) {
    sections.push({
      title: legalObj.rights.title,
      content: legalObj.rights.intro || '',
      items: legalObj.rights.items?.map((i) => i.right + ': ' + i.description),
    });
  }
  if (legalObj.security) {
    sections.push({
      title: legalObj.security.title,
      content: legalObj.security.intro || '',
      items: legalObj.security.items?.map((i) => i.title + ': ' + i.description),
    });
  }
  if (legalObj.dpo) {
    const dpoItems = legalObj.dpo.responsibilities || [];
    const contact = legalObj.dpo.contact;
    const contactStr = contact
      ? [contact.company, contact.dpoEmailValue, contact.phoneValue, contact.addressValue].filter(Boolean).join(' | ')
      : '';
    sections.push({
      title: legalObj.dpo.title,
      content: (legalObj.dpo.intro || '') + (contactStr ? '\n\n' + contactStr : ''),
      items: dpoItems.length ? dpoItems : undefined,
    });
  }
  if (legalObj.whatAre) {
    sections.push({ title: legalObj.whatAre.title, content: legalObj.whatAre.description });
  }
  if (legalObj.types && legalObj.types.items) {
    sections.push({
      title: legalObj.types.title,
      content: legalObj.types.subtitle || '',
      items: legalObj.types.items.map((i) => i.title + ': ' + i.description),
    });
  }
  if (legalObj.frameworks) {
    sections.push({
      title: legalObj.frameworks.title,
      content: legalObj.frameworks.subtitle || '',
      items: legalObj.frameworks.items?.flatMap((f) => [f.title + ' - ' + f.subtitle + ': ' + f.description].concat((f.items || []).map((x) => '  • ' + x))),
    });
  }
  if (legalObj.regulatory) {
    sections.push({
      title: legalObj.regulatory.title,
      content: legalObj.regulatory.subtitle || '',
      items: legalObj.regulatory.items?.map((r) => r.name + ': ' + r.description + ' (' + r.status + ')'),
    });
  }
  if (legalObj.commitments) {
    sections.push({
      title: legalObj.commitments.title,
      content: legalObj.commitments.subtitle || '',
      items: legalObj.commitments.items?.map((c) => c.title + ': ' + c.description),
    });
  }
  if (legalObj.categories) {
    for (const [key, cat] of Object.entries(legalObj.categories)) {
      if (cat && cat.items) {
        sections.push({
          title: cat.title,
          content: '',
          items: cat.items.map((i) => i.name + ' (' + (i.issuer || '') + '): ' + (i.description || '') + (i.count ? ' - ' + i.count : '')),
        });
      }
    }
  }
  return sections;
}

const legalPages = [
  { slug: 'privacidade', title: 'Política de Privacidade', data: legal.privacy },
  { slug: 'termos', title: 'Termos de Uso', data: legal.terms },
  { slug: 'lgpd', title: 'LGPD e Proteção de Dados', data: legal.lgpd },
  { slug: 'cookies', title: 'Política de Cookies', data: legal.cookies },
  { slug: 'compliance', title: 'Compliance', data: legal.compliance },
  { slug: 'certificacoes', title: 'Certificações', data: legal.certifications },
];

for (const p of legalPages) {
  if (!p.data) continue;
  const sections = legalToSections(p.data);
  if (sections.length === 0) continue;
  const content = { sections };
  console.log(`
INSERT INTO public.static_pages (slug, title, seo_description, content_json, last_updated)
VALUES (
  ${esc(p.slug)},
  ${esc(p.title)},
  ${esc(p.title + ' - NESS')},
  ${jsonEsc(content)},
  '2025-11-10'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content_json = EXCLUDED.content_json,
  last_updated = EXCLUDED.last_updated;
`);
}

console.log('');
console.log('-- Fim seed corp-site-ness');
