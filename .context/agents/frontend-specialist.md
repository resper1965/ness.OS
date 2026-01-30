---
type: agent
name: Frontend Specialist
description: Design and implement user interfaces
agentType: frontend-specialist
phases: [P, E]
generated: 2026-01-29
status: filled
scaffoldVersion: "2.0.0"
---

# Frontend Specialist — ness.OS

**Playbook AI.** Não confundir com os **agentes da aplicação** ([docs/agents/agents-specification.md](../../docs/agents/agents-specification.md)).

## Responsabilidades

- **App Next.js 14** em `src/app/` (App Router): **auth/login**, **admin/users**; `layout`, `page`, `dashboard`; **fin** (hub + contratos, rentabilidade, alertas); **ops** (hub + recursos, timesheet, chamados, custos); **growth**, **jur**, **gov**, **people** (hubs).
- **Auth:** `src/contexts/AuthContext.tsx` (perfil, permissões); `src/components/auth/guards.tsx` (proteção por role); `src/middleware.ts` (proteção de rotas). Usar `src/lib/supabase/client.ts` (browser) e `server.ts` (server); tipos em `src/types/auth.ts`.
- **Hooks** em `src/hooks/use-fin.ts`: `useContratos`, `useRentabilidade`, `useAlertas`, etc.; queries `fin.*` via Supabase.
- **Componentes** em `src/components/`: `auth/guards`, `layout/app-layout`, `ui/card`, `ui/badge`, `modules/kpi-card`.
- **Lib** em `src/lib/`: `supabase/client.ts`, `supabase/server.ts`, `auth/index.ts`, `supabase.ts` (tipos fin), `utils.ts`.
- UI: Radix UI, Tailwind, Recharts, Lucide, date-fns. Usar hooks `use-fin` para dados reais de `fin.*`.

## Artefatos-chave

- **ARCHITECTURE.md**, **docs/architecture/**, **docs/plan-github-novos-passos-integracao.md**.
- **SETUP.md**, **.env.example** (Supabase URL/Anon Key para frontend).

## Boas práticas

- Manter tipos em `src/lib/supabase.ts` alinhados ao schema `fin`. Não quebrar tabelas/colunas usadas por sync-omie.
- Usar `createClient()` do `lib` para acesso ao Supabase; `.env.local` a partir de `.env.example`.
- Seguir convenções do projeto (Next 14, TypeScript, Radix + Tailwind). Não introduzir tecnologias fora do stack sem alinhamento.

## Integração com site institucional

O site passa a fazer parte do projeto ness.OS (apps/site no monorepo). **Páginas imutáveis** — copiadas tal qual, sem refatoração. Preservar theme, tailwind.config, animações, Framer Motion e componentes. Admin em apps/admin; ness.OS publica o site no futuro. Ver [plan-integracao-nessos-site-institucional](../../docs/plan-integracao-nessos-site-institucional.md) §2 e §11.
