---
type: doc
name: architecture
description: System architecture, layers, patterns, and design decisions
category: architecture
generated: 2026-01-29
status: filled
scaffoldVersion: "2.0.0"
---

# Arquitetura do ness.OS

## Visão em camadas

```
Frontend (Next.js 14 + shadcn) → Vercel
        ↓
Supabase: Auth | Postgres+RLS | pgvector | Storage | Realtime | Edge Functions
        ↓
Externos: Omie ERP | Claude/OpenAI | Cloud APIs
```

## Componentes

| Camada | Tecnologia | Função |
|--------|------------|--------|
| Frontend | Next.js 14 + TS | App em `src/app/`: dashboard; fin, ops, growth, jur, gov, people (hubs + sub-páginas) |
| UI | Radix + Tailwind, Recharts | `src/components/` (layout, ui, modules) |
| Hooks | `src/hooks/use-fin.ts` | useContratos, useRentabilidade, useAlertas, etc.; queries `fin.*` |
| Lib | `src/lib/` | Supabase client, tipos `fin`, utils |
| Auth | Supabase Auth + RBAC | Login (`src/app/auth/login`); AuthContext; guards; middleware; roles: superadmin, adm-area, user-area |
| DB | PostgreSQL | `fin` em `src/database/001_schema_fin.sql`; RBAC em `supabase/migrations/001_rbac_schema.sql` |
| Vector | pgvector | Embeddings RAG (planejado) |
| Storage | Supabase Storage | PDFs, contratos |
| Realtime | Supabase Realtime | Notificações |
| Functions | Edge (Deno) | `sync-omie`, agentes; em `src/supabase/functions/` |
| Cron | pg_cron | Jobs agendados |
| LLM | Claude API | Agentes |

## Schemas (Postgres)

- **Implementado:** `fin` em [src/database/001_schema_fin.sql](../../src/database/001_schema_fin.sql); RBAC em [supabase/migrations/001_rbac_schema.sql](../../supabase/migrations/001_rbac_schema.sql) (`profiles`, `user_permissions`, `audit_log`; RPC `get_my_permissions`). Ver [docs/DATABASE_SCHEMA](../../docs/DATABASE_SCHEMA.md).
- **Planejados:** `ops`, `growth`, `jur`, `gov`, `people`, `kb`. Migrations futuras; ver [docs/plan-ajuste-schema-ao-projeto](../../docs/plan-ajuste-schema-ao-projeto.md) e [docs/DEVELOPMENT_PLAN](../../docs/DEVELOPMENT_PLAN.md).

## Padrões

- **APIs:** PostgREST (auto) + Edge Functions (custom).
- **RAG:** pgvector + embeddings (ex.: OpenAI ada-002); funções `buscar_casos_similares` etc.
- **Agentes da aplicação:** Edge Functions por agente (ex.: precificação, ciclo de vida, sync Omie).
- **Segurança:** RLS, TLS, AES em repouso, audit logs, Vault para secrets.

## Integração Site Institucional

Integração completa: páginas do site em apps/site; admin em apps/admin. Recursos agregados por módulo: **ness.PEOPLE** (vagas), **ness.GROWTH** (blog, knowledge, IA, branding, media, analytics), **ness.OPS** (processes, ncirt). Chatbot e APIs de IA no ness.OS; site consome. Ver [plan-integracao-nessos-site-institucional](../../docs/plan-integracao-nessos-site-institucional.md).

## Decisões

- Supabase como backend único para MVP (custo ~\$95/mês).
- Agentes pesados podem usar worker externo (Railway/Render) se necessário.
