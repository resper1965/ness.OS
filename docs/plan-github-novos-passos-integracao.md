# Plano: Novos passos no GitHub e integração (AI-context)

## Objetivo

Ler os **novos passos** no GitHub (frontend Next.js, `src/app`, `src/components`, `src/lib`, etc.), integrá-los aos **planos existentes** ([plan-github-artefatos-iniciais](plan-github-artefatos-iniciais.md), [plan-ajuste-schema-ao-projeto](plan-ajuste-schema-ao-projeto.md)) e manter o **AI-context** (`.context/docs`, `.context/agents`) alinhado.

---

## 1. Novos passos lidos no GitHub

**Branch:** `main`. **Commits recentes:** frontend Next.js 14, páginas `fin`, componentes, lib Supabase/utils.

### 1.1 Estrutura atual de `src/`

Ver §5.2 para estrutura completa. Resumo: `app/` (dashboard, fin, ops, growth, jur, gov, people + sub-páginas ops); `components/`; `hooks/use-fin.ts`; `lib/`; `database/`; `supabase/functions/`.

### 1.2 Config e env

- **package.json:** Next 14, React 18, `@supabase/ssr` + `@supabase/supabase-js`, Radix, Tailwind, Recharts, date-fns, etc.
- **.env.example:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **next.config.js, tailwind.config.ts, tsconfig.json, postcss.config.js.**

### 1.3 Uso de `fin`

- `src/lib/supabase.ts` define tipos; `src/hooks/use-fin.ts` fornece hooks (`useContratos`, `useRentabilidade`, etc.) que consultam `fin.*` via Supabase. Páginas podem usar hooks ou mocks.

---

## 2. Integração com os planos existentes

### 2.1 [plan-github-artefatos-iniciais](plan-github-artefatos-iniciais.md)

- Adicionada **§6. Novos passos no GitHub (frontend Next.js)** com estrutura, stack e uso de `fin`.
- **Próximos passos (§4):** item 5 sobre frontend (`npm i`, `npm run dev`, `.env.local`).
- **Referências:** link para este plano.

### 2.2 [plan-ajuste-schema-ao-projeto](plan-ajuste-schema-ao-projeto.md)

- **§7. Frontend** descreve `src/app`, `src/components`, `src/lib` e consumo de `fin.*`.
- **Checklist:** incluir frontend no AI-context e no getMap.
- **Referências:** link para este plano.

---

## 3. Atualizações no AI-context

### 3.1 `.context/docs`

- **architecture.md:** `src/app`, `src/components`, `src/lib`; frontend consome `fin` via Supabase.
- **data-flow.md:** Frontend lê `fin.*` (dashboard, contratos, rentabilidade, alertas); migrar mocks para queries.
- **project-overview.md:** Stack inclui Next.js app; estrutura `src/` conforme §1.1.
- **tooling.md:** `npm`, `next`, `tailwind`; scripts `dev`, `build`, `lint`; `.env.local` a partir de `.env.example`.
- **development-workflow.md:** `npm i` → `npm run dev`; deploy Vercel; `.env.example` como base.

### 3.2 `.context/agents`

- **frontend-specialist.md:** Responsabilidades em `src/app`, `src/components`, `src/lib`; Supabase client e tipos `fin`; UI com Radix + Tailwind.
- **feature-developer.md:** Novas features em app Router ou `fin/*`; uso de `createClient` e tipos em `lib/supabase.ts`.

### 3.3 Context MCP

- **getMap:** Incluir `src/app`, `src/components`, `src/lib` (e já `src/database`, `src/supabase`).
- **buildSemantic:** Rodar após alterações nos docs (ex.: `contextType: "documentation"` ou `"compact"`).

---

## 4. Checklist

- [x] Pull dos novos commits (`git pull origin main`).
- [x] Atualizar [plan-github-artefatos-iniciais](plan-github-artefatos-iniciais.md) (§6, §4.5, referências).
- [x] Atualizar [plan-ajuste-schema-ao-projeto](plan-ajuste-schema-ao-projeto.md) (§7, checklist, referências).
- [x] Criar este plano e ligá-lo aos demais.
- [x] Atualizar `.context/docs` (architecture, data-flow, project-overview, tooling, development-workflow).
- [x] Atualizar `.context/agents` (frontend-specialist, feature-developer).
- [x] Rodar **getMap** e **buildSemantic** (context MCP).
- [x] **Atualização jan/30:** Pull 14 commits (hubs, ops sub-páginas, use-fin, vercel, .gitignore, README); integrar em planos e AI-context.
- [x] **Atualização atual:** Pull 12 commits (auth, RBAC, login, admin users, DATABASE_SCHEMA, DEVELOPMENT_PLAN); integrar em planos e AI-context.
- [x] **Deploy Vercel etapa 1 (jan/30):** secrets Supabase configurados; deploy prod em ness-os.vercel.app; correções TypeScript (admin, AuthContext, use-fin, server, middleware); plano plan-deploy-vercel-etapa1.

---

## 5. Atualização (jan/30) – Novidades integradas

**14 commits** pós-frontend inicial. Integrado via `git pull origin main`.

### 5.1 Novos artefatos

| Item | Caminho | Descrição |
|------|---------|-----------|
| Hubs módulos | `src/app/fin/page.tsx`, `ops/page.tsx`, `growth/page.tsx`, `jur/page.tsx`, `gov/page.tsx`, `people/page.tsx` | Páginas hub por módulo |
| OPS sub-páginas | `src/app/ops/recursos/`, `timesheet/`, `chamados/`, `custos/` | Recursos, timesheet, chamados, custos |
| Hook use-fin | `src/hooks/use-fin.ts` | `useContratos`, `useRentabilidade`, `useAlertas`, etc.; queries Supabase para `fin.*` |
| Vercel | `vercel.json` | framework nextjs, region gru1, env Supabase |
| Git | `.gitignore` | node_modules, .env.local, etc. |
| Docs | `README.md` | Instruções completas, estrutura, status dos módulos |

### 5.2 Estrutura `src/` atual

```
src/
├── app/
│   ├── dashboard/, page.tsx, layout.tsx, globals.css
│   ├── fin/ (page hub + contratos, rentabilidade, alertas)
│   ├── ops/ (page hub + recursos, timesheet, chamados, custos)
│   ├── growth/, jur/, gov/, people/ (page hub cada um)
│   └── ...
├── components/ (layout, ui, modules)
├── hooks/ (use-fin.ts)
├── lib/ (supabase, utils)
├── database/ (001_schema_fin.sql)
└── supabase/functions/sync-omie/
```

### 5.3 use-fin.ts

- Hooks: `useContratos`, `useRentabilidade`, `useAlertas`, `useReceitas`, `useDespesas` (e possíveis variações).
- Queries em `fin.contratos`, `fin.rentabilidade`, `fin.alertas`, `fin.receitas`, `fin.despesas` com joins a `fin.clientes`.
- Substitui mocks nas páginas fin quando usado.

---

## 7. Atualização (auth + RBAC) – Novidades integradas

**12 commits** pós-jan/30. Integrado via `git pull origin main`.

### 7.1 Novos artefatos

| Item | Caminho | Descrição |
|------|---------|-----------|
| RBAC schema | `supabase/migrations/001_rbac_schema.sql` | `profiles`, `user_permissions`, `audit_log`; roles: superadmin, adm-area, user-area |
| Auth login | `src/app/auth/login/page.tsx` | Página de login |
| Admin users | `src/app/admin/users/page.tsx` | Gestão de usuários (admin) |
| AuthContext | `src/contexts/AuthContext.tsx` | Provider com perfil, permissões, `get_my_permissions` RPC |
| Auth guards | `src/components/auth/guards.tsx` | Componentes de proteção por role |
| Middleware | `src/middleware.ts` | Proteção de rotas |
| Supabase client | `src/lib/supabase/client.ts` | `createBrowserClient` (@supabase/ssr) |
| Supabase server | `src/lib/supabase/server.ts` | Server client |
| Auth lib | `src/lib/auth/index.ts` | Exports auth |
| Auth types | `src/types/auth.ts` | UserProfile, UserPermissions, SystemModule, etc. |
| DATABASE_SCHEMA | `docs/DATABASE_SCHEMA.md` | Schema completo (FIN, OPS, GROWTH, JUR, GOV, PEOPLE, AI) |
| DEVELOPMENT_PLAN | `docs/DEVELOPMENT_PLAN.md` | Roadmap, fases, epics, user stories |

### 7.2 Estrutura `src/` atualizada

```
src/
├── app/
│   ├── admin/users/          # Nova
│   ├── auth/login/           # Nova
│   ├── dashboard/, fin/, ops/, growth/, jur/, gov/, people/
│   └── ...
├── components/auth/guards.tsx # Nova
├── contexts/AuthContext.tsx   # Nova
├── lib/
│   ├── auth/index.ts         # Nova
│   ├── supabase/client.ts    # Nova
│   ├── supabase/server.ts    # Nova
│   ├── supabase.ts           # Existente (fin types)
│   └── utils.ts
├── middleware.ts             # Nova
├── types/auth.ts             # Nova
└── ...
```

### 7.3 RBAC e Auth

- **Roles:** `superadmin`, `adm-area`, `user-area`
- **Módulos:** `fin`, `ops`, `growth`, `jur`, `gov`, `people`, `admin`
- **Ações:** `create`, `read`, `update`, `delete`, `export`, `approve`
- **RPC:** `get_my_permissions` para obter permissões do usuário logado

---

## 8. Referências

- [plan-github-integracao-ai-context](plan-github-integracao-ai-context.md) — fluxo reutilizável para GitHub → local → AI-context
- [plan-github-artefatos-iniciais](plan-github-artefatos-iniciais.md)
- [plan-ajuste-schema-ao-projeto](plan-ajuste-schema-ao-projeto.md)
- [DATABASE_SCHEMA](DATABASE_SCHEMA.md) · [DEVELOPMENT_PLAN](DEVELOPMENT_PLAN.md)
- [SETUP.md](../SETUP.md) · [.env.example](../.env.example)
- [ARCHITECTURE.md](../ARCHITECTURE.md) · [.context/](../.context/)
