---
type: doc
name: project-overview
description: High-level overview of the project, its purpose, and key components
category: overview
generated: 2026-01-29
status: filled
scaffoldVersion: "2.0.0"
---

# Visão geral do ness.OS

## Propósito

**ness.OS** é um Sistema Operacional de Gestão Empresarial Inteligente: plataforma baseada em **agentes da aplicação** interconectados (ness.) que transforma dados operacionais em decisões estratégicas.

## Objetivos

- Quebrar silos organizacionais via **agentes da aplicação** e bases de conhecimento compartilhadas.
- Evoluir a empresa de estrutura reativa para organização guiada por dados e IA.

## Módulos e agentes da aplicação

| Módulo | Foco | Agentes da aplicação |
|--------|------|----------------------|
| **ness.GROWTH** | Comercial e Marketing | Vendas, Precificação, Marketing |
| **ness.OPS** | Operações | Homogeneização, Mapeamento de Recursos |
| **ness.FIN** | CFO Digital | Rentabilidade, Ciclo de Vida |
| **ness.JUR** | Jurídico | Análise Contratual |
| **ness.GOV** | Governança | Compliance |
| **ness.PEOPLE** | Talentos | Correlação de Treinamento |

6 módulos, 10 agentes da aplicação, 6 bases de conhecimento (RAG). **Não confundir** com Playbooks AI (`.context/agents/`). Ver [context-separation](../../docs/context-separation.md).

## Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Radix UI, Tailwind, Recharts, `@supabase/ssr` (Vercel). App em `src/app/`: **auth/login**; **admin/users**; dashboard; **fin** (hub + contratos, rentabilidade, alertas); **ops** (hub + recursos, timesheet, chamados, custos); **growth**, **jur**, **gov**, **people** (hubs). Componentes em `src/components/` (incl. `auth/guards`); contextos em `src/contexts/AuthContext.tsx`; hooks em `src/hooks/use-fin.ts`; lib em `src/lib/` (Supabase client/server, auth, tipos `fin`); `middleware.ts` para proteção de rotas.
- **Backend:** Supabase (Auth, Postgres, pgvector, Storage, Realtime, Edge Functions). Schemas: `fin` em `src/database/001_schema_fin.sql`; RBAC (`profiles`, `user_permissions`, `audit_log`) em `supabase/migrations/001_rbac_schema.sql`; sync Omie em `src/supabase/functions/sync-omie/`.
- **Integrações:** Omie ERP, Clockify, GLPI, clouds, Wazuh, LinkedIn, DocuSign.
- **LLM:** Claude API.

## Público-alvo

Equipes de operação, comercial, financeiro, jurídico e RH que consomem dashboards, propostas, alertas e pareceres gerados pelos **agentes da aplicação**.

## Começando

1. Ver [ARCHITECTURE.md](../../ARCHITECTURE.md) e [docs/architecture/](../../docs/architecture/).
2. **Setup:** [SETUP.md](../../SETUP.md). Frontend: `npm i`, `npm run dev`; `.env.local` a partir de [.env.example](../../.env.example).
3. Roadmap: Fase 1 (Infra + ness.FIN/Omie) → 2 (ness.OPS) → 3 (ness.GROWTH) → 4 (ness.JUR/GOV) → 5 (ness.PEOPLE). Ver [plan-github-novos-passos-integracao](../../docs/plan-github-novos-passos-integracao.md).
