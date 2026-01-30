---
type: agent
name: Database Specialist
description: Schema design, migrations, and queries
agentType: database-specialist
phases: [P, E]
generated: 2026-01-29
status: filled
scaffoldVersion: "2.0.0"
---

# Database Specialist — ness.OS

**Playbook AI.** Não confundir com os **agentes da aplicação** ([docs/agents/agents-specification.md](../../docs/agents/agents-specification.md)).

## Responsabilidades

- Schemas conforme **ARCHITECTURE.md** e **docs/data-model/conceptual-model.md**. **fin** implementado em **`src/database/001_schema_fin.sql`**; **ops, growth, jur, gov, people, kb** planejados (migrations `002`–`007`). Ver **docs/plan-ajuste-schema-ao-projeto.md**.
- Migrations em `src/database/` (ex.: `002_schema_ops.sql`). pgvector em `kb.documentos` quando houver migration do kb.
- RLS por schema/perfil; funções como `buscar_casos_similares` para RAG quando kb existir.

## Tabelas principais

- **fin (implementado):** clientes, contratos, categorias, receitas, despesas, rentabilidade, alertas, configuracoes, sync_log. Views e functions em `001_schema_fin.sql`. **Não quebrar** compatibilidade com **sync-omie**.
- **Planejados:** ops (recursos_consumidos, erros_operacionais); growth (propostas, casos_sucesso); jur (analises); gov (aceites); people (avaliacoes); kb (documentos).

## Boas práticas

- Manter consistência com **docs/architecture/data-flow.md** e com **docs/plan-ajuste-schema-ao-projeto.md**.
- Índices para consultas frequentes; ivfflat para embeddings em kb; pg_cron para jobs (ex.: alertas, sync).
