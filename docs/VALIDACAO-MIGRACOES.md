# Validação — Planos de Migração (ness.OS)

> Checklist para validar migrações **corp-site** e **site legacy**. Ref: [MAPEAMENTO-CORP-SITE.md](./MAPEAMENTO-CORP-SITE.md), [PLANO-MIGRACAO-SITE-LEGACY.md](./PLANO-MIGRACAO-SITE-LEGACY.md).

---

## 1. Migração corp-site (corp-site-ness → ness.OS)

**Fonte:** `_reference/corp-site-ness`. **Destino:** `services_catalog`, `static_pages`, rotas `/solucoes/[slug]`, `/legal/[slug]`.

| Item | Como validar |
|------|--------------|
| Produtos/Soluções | Conferir MAPEAMENTO-CORP-SITE (nsecops, ninfraops, trustness, etc.). Seed: `node scripts/seed-from-corp-site.js` → `002_corp_site_content.sql`. |
| Legais | Slugs privacidade, termos, lgpd, cookies, compliance, certificacoes. Rotas `/legal/[slug]`. |
| Rotas | /nsecops → /solucoes/nsecops; /privacy → /legal/privacidade. |
| Conteúdo | Abrir /solucoes/nsecops, /legal/privacidade no browser; conferir título e corpo. |

---

## 2. Migração site legacy (pages → App Router)

**Fonte:** `_reference/legacy_site/pages`. **Destino:** `src/app/(site)/`.

| Item | Como validar |
|------|--------------|
| Institucionais | Rotas `/`, `/sobre`, `/contato` existem e renderizam. |
| Serviços | `/solucoes/[slug]` usa dados de services_catalog. |
| Blog | `/blog`, `/blog/[slug]` com public_posts. |
| Carreiras | `/carreiras`, `/carreiras/[slug]/candidatar` com public_jobs. |
| Legais | `/legal/[slug]` com static_pages. |

---

## 3. Execução

1. App rodando (`npm run dev`), banco com seeds aplicados.
2. Corp-site: rodar seed; abrir rotas; conferir mapeamento e conteúdo.
3. Site legacy: abrir cada rota e comparar com plano (PLANO-MIGRACAO-SITE-LEGACY.md).
