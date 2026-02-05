# Etapa 8 — Migração corp site / site legacy: decisão

**Workflow:** workflow-unico-etapas-abertas-nessos  
**Planos:** migracao-corp-site-ness, migracao-site-legacy

---

## Conclusão

A migração corp-site / site legacy **já está implementada** no repositório ness.OS.

## Evidência

| Item | Status |
|------|--------|
| **Rotas (site)** | `src/app/(site)/`: /, /sobre, /contato, /blog, /blog/[slug], /carreiras, /carreiras/[slug]/candidatar, /casos, /casos/[slug], /legal/[slug], /nessos, /solucoes, /solucoes/[slug] |
| **Componentes site** | `src/components/site/`: hero-section, feature-grid, cta-banner, prose-content, solucao-detail-content, site-header, site-footer, contact-form, application-form, etc. |
| **Seed corp-site** | `supabase/seed/002_corp_site_content.sql` — services_catalog e static_pages (pt-BR) |
| **Script extração** | `scripts/seed-from-corp-site.js` — gera SQL a partir de _reference/corp-site-ness (uso local) |
| **Documentação** | `docs/MAPEAMENTO-CORP-SITE.md`, `docs/PLANO-MIGRACAO-SITE-LEGACY.md` |

## Phase-0 (clone _reference)

- **migracao-corp-site-ness** phase-0: clonar `corp-site-ness` em `_reference/corp-site-ness`.
- **Decisão:** Não executar clone no fluxo do workflow. A pasta `_reference/` está em `.gitignore`; o seed `002_corp_site_content.sql` já existe no repo. Quem precisar **regenerar** o seed deve clonar localmente e rodar `node scripts/seed-from-corp-site.js`.

## Status Etapa 8

**Concluída** — escopo dos planos atendido (estrutura, páginas, seed, docs). Clone local opcional para regeneração de seed.
