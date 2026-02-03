---
type: doc
name: project-overview
description: High-level overview of the project, its purpose, and key components
category: overview
generated: 2026-02-03
status: filled
scaffoldVersion: "2.0.0"
---

# ness.OS + ness.WEB

Ecossistema unificado: site institucional público (ness.WEB) + plataforma de gestão interna (ness.OS). O ness.OS atua como **Sistema Nervoso Digital** da NESS — orquestrador de negócios com foco em conhecimento padronizado, rentabilidade real e gestão ativa.

**Definição canônica:** [ness-os-definicao-visao](../plans/ness-os-definicao-visao.md) — 6 módulos (GROWTH, OPS, FIN, JUR, GOV, PEOPLE).

## Stack

Next.js 14 (App Router), Supabase, Tailwind, shadcn/ui, Vercel AI SDK, pgvector

## Server Actions (consolidados)

| Arquivo | Domínio | Funções |
|---------|---------|---------|
| growth.ts | ness.GROWTH | leads, posts, services, success-cases |
| ops.ts | ness.OPS | playbooks, assets, metricas |
| fin.ts | ness.FIN | clients, contracts |
| people.ts | ness.PEOPLE | jobs, job-application, gaps |
| jur.ts | ness.JUR | compliance (frameworks, checks) |
| gov.ts | ness.GOV | policies, acceptances |
| ai.ts | IA | generatePostFromCase, generateProposalWithAI |
| auth.ts | Auth | — |
| cases-public, jobs-public, static-pages | Site | — |

## Componentes shared

- DataTable, StatusBadge, AppPageHeader, PageContent em `components/shared/`
- lib/validators/schemas.ts (leadSchema, postSchema)
- lib/header-constants.ts (APP_HEADER_HEIGHT_PX = 64, SECTION_HEADER_HEIGHT_PX = 52)

## Layout do app (/app/*)

- **Sidebar:** `AppSidebar` (w-56, 224px); header "ness.OS" 64px, uma linha (`border-b`).
- **Header da página:** `AppPageHeader` — fixo (`position: fixed`), 64px, não some ao rolar; alinhado à direita da sidebar.
- **Docs:** [docs/LAYOUT-APP-HEADERS.md](../../docs/LAYOUT-APP-HEADERS.md), [docs/DESIGN-TOKENS.md](../../docs/DESIGN-TOKENS.md).

## Plano Mestre

**docs/PLANO-COMPLETO-NESSOS-SITE.md** — Roadmap completo em 4 sprints.

## SIMPLIFICA (concluído)

Plano de redução de complexidade executado. Actions: 23 → 8 arquivos principais.
