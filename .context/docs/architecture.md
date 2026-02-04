---
type: doc
name: architecture
description: System architecture, layers, patterns, and design decisions
category: architecture
generated: 2026-02-03
status: filled
scaffoldVersion: "2.0.0"
---

# Arquitetura ness.OS

**Visão dos 6 módulos:** [ness-os-definicao-visao](../plans/ness-os-definicao-visao.md)

## Rotas

- `app/(site)/` — Site público (blog, carreiras, contato, soluções, casos)
- `app/(app)/` — Dashboard interno (growth, ops, fin, people, jur, gov)
- `app/api/` — API routes (chat/playbooks, chat/public, jur/risk)

## Layout do app (/app/*)

- **Estrutura:** `AppLayout` → sidebar fixa + `main` com `overflow-auto`. Conteúdo de cada página dentro de `PageContent`.
- **Sidebar:** `AppSidebar` — largura 224px (w-56); header "ness.OS" com altura 64px e uma linha separadora.
- **Header da página:** `AppPageHeader` — **fixo** (`position: fixed`, left: 224px, right: 0, z-10); altura 64px; não desaparece ao rolar. Espaçador abaixo evita sobreposição do conteúdo.
- **Constantes:** `src/lib/header-constants.ts` (APP_HEADER_HEIGHT_PX = 64). Referência: [docs/LAYOUT-APP-HEADERS.md](../../docs/LAYOUT-APP-HEADERS.md).

## Camadas

1. **Pages** — Server Components, fetch via createClient
2. **Actions** — Server Actions em **data** (sync Omie, consultas ERP), growth, ops, fin, people, jur, gov, ai
3. **Components** — Client/Server, shared (DataTable, StatusBadge), módulos
4. **Lib** — supabase (server, client, queries/base), validators/schemas, ai/embedding, **data/omie** (cliente Omie, server-only)

## Padrões

- **SecOps First** — Lógica no servidor, RLS no DB
- **Server Actions** — Formulários via useFormState + action
- **Foreign Keys** — Integridade referencial obrigatória
