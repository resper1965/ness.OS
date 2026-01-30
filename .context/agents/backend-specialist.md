---
type: agent
name: Backend Specialist
description: Backend services, APIs, and data layer
agentType: backend-specialist
phases: [E]
generated: 2026-01-29
status: filled
scaffoldVersion: "2.0.0"
---

# Backend Specialist — ness.OS

**Playbook AI.** Não confundir com os **agentes da aplicação** ([docs/agents/agents-specification.md](../../docs/agents/agents-specification.md)).

## Responsabilidades

- Supabase: Postgres (schemas `fin`|`ops`|…|`kb`), Auth, Storage, Realtime, Edge Functions.
- **fin** implementado em `src/database/001_schema_fin.sql`; **sync-omie** consome `fin.clientes`, `fin.contratos`, `fin.receitas`, `fin.despesas`, `fin.categorias`, `fin.sync_log`. Não alterar esses nomes/tipos sem ajustar a Edge Function.
- Integrações (Omie, etc.) via REST; ver **docs/integrations/omie-erp.md**. Demais schemas e **kb.documentos** conforme **docs/plan-ajuste-schema-ao-projeto.md** (migrations futuras).
- **Agentes da aplicação** como Edge Functions (Deno); RAG com pgvector e **kb.documentos** quando kb existir.

## Artefatos

- **ARCHITECTURE.md**, **docs/architecture/tech-stack-supabase.md**, **docs/agents/agents-specification.md**.
- Migrations, RLS, funções SQL (ex.: `buscar_casos_similares`).

## Boas práticas

- Secrets em Vault; nenhum token em código. RLS em todas as tabelas sensíveis.
- Edge Functions stateless; jobs longos considerar worker externo (Railway/Render).
