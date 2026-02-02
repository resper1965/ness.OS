---
type: doc
name: architecture
description: System architecture, layers, patterns, and design decisions
category: architecture
generated: 2026-02-02
status: filled
scaffoldVersion: "2.0.0"
---

# Arquitetura ness.OS

## Rotas

- `app/(site)/` — Site público (blog, carreiras, contato, soluções, casos)
- `app/(app)/` — Dashboard interno (growth, ops, fin, people, jur, gov)
- `app/api/` — API routes (chat/playbooks, chat/public, jur/risk)

## Camadas

1. **Pages** — Server Components, fetch via createClient
2. **Actions** — Server Actions em growth, ops, fin, people, jur, gov, ai
3. **Components** — Client/Server, shared (DataTable, StatusBadge), módulos
4. **Lib** — supabase (server, client, queries/base), validators/schemas, ai/embedding

## Padrões

- **SecOps First** — Lógica no servidor, RLS no DB
- **Server Actions** — Formulários via useFormState + action
- **Foreign Keys** — Integridade referencial obrigatória
