---
type: doc
name: project-overview
description: High-level overview of the project, its purpose, and key components
category: overview
generated: 2026-02-02
status: filled
scaffoldVersion: "2.0.0"
---

# ness.OS + ness.WEB

Ecossistema unificado: site institucional público (ness.WEB) + plataforma de gestão interna (ness.OS).

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

- DataTable, StatusBadge em `components/shared/`
- lib/validators/schemas.ts (leadSchema, postSchema)

## Plano Mestre

**docs/PLANO-COMPLETO-NESSOS-SITE.md** — Roadmap completo em 4 sprints.

## SIMPLIFICA (concluído)

Plano de redução de complexidade executado. Actions: 23 → 8 arquivos principais.
