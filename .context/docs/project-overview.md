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

**Definição canônica:** [ness-os-definicao-visao](../plans/ness-os-definicao-visao.md) — 6 módulos de negócio (GROWTH, OPS, FIN, JUR, GOV, PEOPLE) + ness.DATA (camada de dados).

## Stack

Next.js 14 (App Router), Supabase, Tailwind, shadcn/ui, Vercel AI SDK, pgvector

## Server Actions (consolidados)

| Arquivo | Domínio | Funções |
|---------|---------|---------|
| data.ts | ness.DATA | sync Omie, consultas ERP (clientes, contas a receber) |
| growth.ts | ness.GROWTH | leads, posts, services, success-cases |
| ops.ts | ness.OPS | playbooks, assets, metricas |
| fin.ts | ness.FIN | clients, contracts (consome dados via DATA) |
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

- **Shell:** `SidebarProvider` → `AppSidebar` + `SidebarInset`. Layout inspirado no Bundui (sidebar colapsável, header global).
- **Sidebar:** `AppSidebar` — colapsável (224px expandida, 48px recolhida; mobile = drawer). Header "ness.OS" 64px + `SidebarTrigger`; nav via `nav-config`.
- **Header global:** `AppHeader` — `SidebarTrigger` + breadcrumb (Módulo / Página). 64px.
- **Header da página:** `AppPageHeader` — fixo, 64px; títulos de seção dentro do conteúdo.
- **Docs:** [docs/LAYOUT-APP-HEADERS.md](../../docs/LAYOUT-APP-HEADERS.md), [docs/DESIGN-TOKENS.md](../../docs/DESIGN-TOKENS.md).
- **Plano components/layout Bundui:** [bundui-layout-components-nessos](../plans/bundui-layout-components-nessos.md) — adoção de [components/layout](https://github.com/bundui/shadcn-ui-kit-dashboard/tree/main/components/layout) do Bundui (sidebar shell, header, breadcrumb, page shell) no ness.OS.
- **Plano theme-customizer Bundui:** [bundui-theme-customizer-nessos](../plans/bundui-theme-customizer-nessos.md) — adequação do [theme-customizer](https://github.com/bundui/shadcn-ui-kit-dashboard/tree/main/components/theme-customizer) do Bundui ao ness.OS (light/dark, persistência, DESIGN-TOKENS).

## Página de explicação completa do ness.OS

**Plano ai-context:** [pagina-explicacao-nessos-completa](../plans/pagina-explicacao-nessos-completa.md) — página única (site `/nessos` ou app `/app/sobre`) que explica o ness.OS por completo (definição, 6 módulos + ness.DATA, fluxos de valor/dados, stack, detalhamento) usando .context/docs e .context/plans como fonte. **Spec:** docs/PLANO-PAGINA-EXPLICACAO-NESSOS.md.

## Plano Mestre

**docs/PLANO-COMPLETO-NESSOS-SITE.md** — Roadmap completo em 4 sprints.

## SIMPLIFICA (concluído)

Plano de redução de complexidade executado. Actions: 23 → 8 arquivos principais.
