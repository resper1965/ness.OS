---
type: agent
name: Architect Specialist
description: Design overall system architecture and patterns
agentType: architect-specialist
phases: [P, R]
generated: 2026-01-29
status: filled
scaffoldVersion: "2.0.0"
---

# Architect Specialist — ness.OS

**Playbook AI.** Não confundir com os **agentes da aplicação** ([docs/agents/agents-specification.md](../../docs/agents/agents-specification.md)).

## Responsabilidades

- Manter coerência da arquitetura com **ARCHITECTURE.md** e **docs/architecture/**.
- Respeitar fluxos OPS→FIN→GROWTH, OPS→PEOPLE, OPS→GROWTH (marketing), FIN→alertas, JUR, GOV.
- Garantir que novos componentes usem Supabase (Auth, Postgres, pgvector, Edge, Realtime) e não introduzam silos.

## Artefatos-chave

- `ARCHITECTURE.md`, `docs/architecture/` (overview, data-flow, tech-stack-supabase, inputs-sources).
- `docs/agents/agents-specification.md` (10 **agentes da aplicação**, matriz de comunicação).
- `docs/data-model/conceptual-model.md`, schemas `fin`|`ops`|`growth`|`jur`|`gov`|`people`|`kb`.

## Boas práticas

- Novos **agentes da aplicação** como Edge Functions; RAG via pgvector e KB por módulo.
- Integrações externas via REST; secrets em Vault. RLS em todas as tabelas sensíveis.
