# AGENTS.md — ness.OS

Orientações para a **IA que desenvolve** o repositório ness.OS. **Não confundir** os **agentes da aplicação** (produto) com os **Playbooks AI** (roles em `.context/agents/`). Ver [docs/context-separation.md](docs/context-separation.md).

## Contexto do projeto

- **Visão:** [README.md](README.md), [ARCHITECTURE.md](ARCHITECTURE.md).
- **Arquitetura e fluxos:** [docs/architecture/](docs/architecture/), [docs/architecture/data-flow.md](docs/architecture/data-flow.md).
- **Agentes da aplicação** (10 agentes de negócio): [docs/agents/agents-specification.md](docs/agents/agents-specification.md).
- **Modelo de dados:** [docs/data-model/conceptual-model.md](docs/data-model/conceptual-model.md).
- **Integrações:** [docs/integrations/omie-erp.md](docs/integrations/omie-erp.md).
- **Separação agentes vs Playbooks AI:** [docs/context-separation.md](docs/context-separation.md).

## Stack

- **Frontend:** Next.js 14, TypeScript, shadcn/ui, Tailwind. Deploy: Vercel.
- **Backend:** Supabase (Auth, Postgres, pgvector, Storage, Realtime, Edge Functions). Cron: pg_cron.
- **LLM:** Claude API. RAG: pgvector + embeddings.
- **ORM:** Drizzle ou Prisma.

## Regras para a IA que desenvolve

1. Respeitar **ARCHITECTURE.md** e os fluxos em **docs/architecture/data-flow.md**. Não introduzir silos nem tecnologias fora do stack sem consentimento.
2. Novos **agentes da aplicação** como Edge Functions (Deno); RAG em **kb** com pgvector. Integrações via REST; secrets em Supabase Vault.
3. Schemas **fin**, **ops**, **growth**, **jur**, **gov**, **people**, **kb**. RLS em tabelas sensíveis.
4. Atualizar documentação relevante (incl. `docs/`, `ARCHITECTURE.md`) quando alterar comportamento ou modelo.
5. Para mudanças não triviais, usar workflow PREVC (`.context/workflow`) quando disponível.
6. **Não misturar** agentes da aplicação com Playbooks AI: usar sempre os termos corretos (ver [context-separation](docs/context-separation.md)).

## Contexto AI

- **Docs estruturados:** [.context/docs/](.context/docs/) (project-overview, architecture, data-flow, glossary, etc.).
- **Playbooks AI** (roles da IA dev): [.context/agents/](.context/agents/) — architect, backend, database, feature-developer, etc. **Não são** os agentes da aplicação.
- **Skills:** [.context/skills/](.context/skills/).

## PR e commits

- Conventional Commits. Referenciar issue/módulo quando aplicável.
- Garantir que migrations, RLS e alterações em **agentes da aplicação** estejam cobertos por testes quando existirem.
