---
status: ready
generated: 2026-01-29
planSlug: migracao-corp-site-ness
phases:
  - phase-0
  - phase-1
  - phase-2
  - phase-3
  - phase-4
constrains:
  - "Preservar conteúdo e layout do site existente corp-site-ness"
  - "Stack: Next.js App Router, Supabase, Tailwind (ness.OS)"
  - "Blog, vagas, soluções: tecnologias do ness.OS (public_posts, public_jobs, services_catalog)"
---

# Migração corp-site-ness → ness.OS

> Copiar o site existente (https://github.com/resper1965/corp-site-ness), preservar conteúdo e layout, migrar para o projeto ness.OS em construção. Tecnologias de blog, vagas, etc. são as já criadas; o conteúdo vem do site anterior. Todo conteúdo deve ser seedado.

**Trigger:** "migração corp-site", "migrar site ness", "corp-site-ness"

**Referência:** [docs/PLANO-MIGRACAO-SITE-LEGACY.md](../../docs/PLANO-MIGRACAO-SITE-LEGACY.md)

---

## Decisões (confirmadas)

| # | Decisão |
|---|---------|
| 1 | Acesso ao repo disponível |
| 2 | **(B)** Recriar visualmente com componentes atuais (HeroSection, CTABanner, etc.) |
| 3 | Unificar produtos + soluções em `services_catalog`; conteúdo do corp-site → seed |
| 4 | Migrar apenas pt-BR; i18n na próxima versão |
| 5 | **(B)** Rotas dinâmicas: trustness, forense, ncirt no banco, template /solucoes/[slug] (ou /paginas/[slug]) |

---

## Fases

### phase-0 — Obter código-fonte
| stepIndex | Ação | Comando | Entrega |
|-----------|------|---------|---------|
| 1 | Clonar corp-site-ness | `git clone https://github.com/resper1965/corp-site-ness _reference/corp-site-ness` | Pasta _reference/corp-site-ness |
| 2 | Validar estrutura | Listar pages/, public/locales/, components/ | Inventário de arquivos |

### phase-1 — Inventário e extração de conteúdo
| stepIndex | Ação | Fonte | Destino |
|-----------|------|-------|---------|
| 1 | Extrair serviços/soluções | public/locales/pt/products.json (e en, es se i18n) | SQL INSERT services_catalog |
| 2 | Extrair páginas legais | public/locales/pt/legal.json | SQL INSERT static_pages |
| 3 | Extrair blog (se houver) | blog_posts ou equivalente | SQL INSERT public_posts |
| 4 | Extrair vagas (se houver) | jobs ou equivalente | SQL INSERT public_jobs |
| 5 | Documentar mapeamento | — | docs/MAPEAMENTO-CORP-SITE.md |

### phase-2 — Layout e componentes
| stepIndex | Ação | Artefato |
|-----------|------|----------|
| 1 | Copiar/adaptar layout do corp-site | src/app/(site)/layout.tsx, header, footer |
| 2 | Replicar componentes de página (Hero, FeatureGrid, etc.) | src/components/site/* |
| 3 | Garantir fidelidade visual | Comparação side-by-side |

### phase-3 — Migração de páginas
| stepIndex | Ação | Rota destino |
|-----------|------|--------------|
| 1 | Home | / |
| 2 | Sobre | /sobre |
| 3 | Contato | /contato |
| 4 | Carreiras | /carreiras (tech: public_jobs) |
| 5 | Soluções listagem + [slug] | /solucoes, /solucoes/[slug] |
| 6 | Blog listagem + [slug] | /blog, /blog/[slug] (tech: public_posts) |
| 7 | Casos | /casos, /casos/[slug] |
| 8 | Legais | /legal/[slug] (tech: static_pages) |
| 9 | Produtos unificados em soluções | — (já em phase-3 step 5) |
| 10 | trustness, forense, ncirt | /solucoes/[slug] — conteúdo no banco |

### phase-4 — Seed e validação
| stepIndex | Ação | Comando |
|-----------|------|---------|
| 1 | Gerar seed | `node scripts/seed-from-corp-site.js > supabase/seed/002_corp_site_content.sql` |
| 2 | Executar seed no Supabase | Copiar conteúdo de 002_corp_site_content.sql no SQL Editor do Dashboard |
| 3 | Build | `npm run build` |
| 4 | Smoke test | Home, soluções, blog, contato, carreiras, legal |

---

## Entregáveis

- `_reference/corp-site-ness/` — cópia do repositório para referência
- `scripts/seed-corp-site-*.sql` — seeds de conteúdo
- `docs/MAPEAMENTO-CORP-SITE.md` — mapeamento páginas/rotas/conteúdo
- Páginas migradas em `src/app/(site)/` com conteúdo do seed
