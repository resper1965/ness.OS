---
type: doc
name: data-flow
description: How data moves through the system and external integrations
category: data-flow
generated: 2026-01-30
status: filled
scaffoldVersion: "2.0.0"
---

# Data Flow & Integrations

## Visão geral

O ness.OS é uma base única Next.js que expõe duas frentes: **site público (ness.WEB)** e **app interno (ness.OS)**. Ambos compartilham o mesmo banco Supabase. Dados entram via formulários (contato, candidatura, leads), são persistidos em tabelas e consumidos tanto pelo site (leitura) quanto pelo app (escrita e edição).

## Module Dependencies

- **`src/app/(site)/`** → `src/app/actions` (growth, jobs-public, cases-public, static-pages)
- **`src/app/app/`** → `src/app/actions` (growth, ops, fin, people, jur, gov), `src/components/*`
- **`src/components/*`** → `src/lib/supabase`, `src/lib/validators/schemas.ts`
- **`src/app/actions/*`** → `src/lib/supabase/server`, `createClient`
- **`src/app/api/`** (chat, jur) → `src/lib/ai/embedding`, `src/lib/supabase/server`
- **`src/lib/ai/`** → OpenAI (generateText, embed), pgvector

## Service Layer

- **Supabase Client** — `createClient()` em `src/lib/supabase/server.ts` e `client.ts`; todas as operações de dados passam por ele.
- **Embedding / RAG** — `src/lib/ai/embedding.ts`: `generateEmbeddings`, `findRelevantPlaybookContent`, `findRelevantPublicContent`; alimenta chat playbooks e chat público.
- **Server Actions** — `growth.ts`, `ops.ts`, `fin.ts`, `people.ts`, `jur.ts`, `gov.ts`, `ai.ts`; funções como `submitLead`, `createPost`, `updatePlaybook`, `saveMetric`, etc.

## High-level Flow

```
[Visitante] → formulário contato/candidatura → Server Action → Supabase (inbound_leads, job_applications)
[Usuário logado] → formulários app → Server Action → Supabase (playbooks, posts, contracts, etc.)
[Site público] → pages Server Components → getPostBySlug, getActiveServices, etc. → Supabase (leitura)
[API chat] → mensagem → findRelevant* → generateText → resposta
```

### Fluxo Site ↔ App

| Origem | Ação | Destino |
|--------|------|---------|
| Visitante | Preenche contato | `inbound_leads` |
| Visitante | Candidata a vaga | `job_applications` |
| Visitante | Lê blog, vagas, soluções | `public_posts`, `public_jobs`, `services_catalog` (leitura) |
| Usuário logado | Cria post, serviço, lead | Mesmas tabelas (escrita) |
| Usuário logado | Cria playbook, contrato, métrica | `playbooks`, `contracts`, `performance_metrics` |

## Internal Movement

- **Trava de catálogo:** `services_catalog.playbook_id` → `playbooks`; Propostas usam playbook via Agente de Propostas.
- **Integridade referencial:** `contracts.client_id` → `clients`; `performance_metrics.contract_id` → `contracts`; `training_gaps.playbook_id` → `playbooks`.
- **Sem filas ou pub/sub:** movimento é síncrono via Server Actions e queries Supabase.

## External Integrations

- **Supabase:** PostgreSQL, Auth, Storage; conexão via `createClient` e env `NEXT_PUBLIC_SUPABASE_*`.
- **OpenAI:** `generateText` e `embed` via Vercel AI SDK; env `OPENAI_API_KEY`.
- **Vercel:** deploy; variáveis de ambiente para Supabase e OpenAI.

## Related Resources

- [Architecture Notes](./architecture.md)
- [Project Overview](./project-overview.md)
- [docs/INTEGRACAO-AMBIENTES-E-IA.md](../../docs/INTEGRACAO-AMBIENTES-E-IA.md)
