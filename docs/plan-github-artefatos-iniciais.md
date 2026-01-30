# Plano: Leitura no GitHub — SQL inicial, sync-omie e SETUP

## Objetivo

Ler e referenciar no projeto os artefatos iniciais do ness.OS presentes no **GitHub** (`resper1965/ness.OS`, branch `main`): schema SQL `fin`, Edge Function **sync-omie** e **SETUP.md**.

---

## 1. Onde estão (GitHub)

| Artefato | Caminho no repositório | Descrição |
|----------|------------------------|-----------|
| **Schema inicial fin** | `src/database/001_schema_fin.sql` | 9 tabelas, 3 views, 2 functions, triggers, RLS, cron |
| **Edge Function sync-omie** | `src/supabase/functions/sync-omie/index.ts` | Sync Omie: clientes, contratos, receitas, despesas, categorias |
| **SETUP** | `SETUP.md` (raiz) | Passo a passo para subir o ambiente |

---

## 2. Conteúdo lido (resumo)

### 2.1 `001_schema_fin.sql`

- **Extensões:** `uuid-ossp`, `pg_cron`
- **Schema:** `fin`
- **Tabelas (9):**  
  `fin.clientes`, `fin.contratos`, `fin.categorias`, `fin.receitas`, `fin.despesas`, `fin.rentabilidade`, `fin.alertas`, `fin.configuracoes`, `fin.sync_log`
- **Views (3):**  
  `fin.vw_rentabilidade_cliente`, `fin.vw_contratos_vencendo`, `fin.vw_fluxo_caixa`
- **Functions (2):**  
  `fin.calcular_rentabilidade(contrato_id, periodo)`, `fin.gerar_alertas_vencimento()`
- **Triggers:** `updated_at` em clientes, contratos, receitas, despesas
- **RLS:** políticas de SELECT para `authenticated` nas tabelas principais
- **Cron:** `gerar-alertas-vencimento` (diário 8h)
- **Grants:** `authenticated` com USAGE em `fin`, SELECT nas tabelas, INSERT/UPDATE em `fin.alertas`

### 2.2 `sync-omie/index.ts`

- **Stack:** Deno, `@supabase/supabase-js`, API Omie REST.
- **Secrets:** `OMIE_APP_KEY`, `OMIE_APP_SECRET`; `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
- **Sync por tipo:**  
  `categorias` → `fin.categorias`  
  `clientes` → `fin.clientes`  
  `contratos` → `fin.contratos` (com lookup `cliente_id` por `omie_id`)  
  `receitas` → `fin.receitas` (últimos 90 dias; opcional `contrato_id` se houver projeto)  
  `despesas` → `fin.despesas` (últimos 90 dias)
- **Ordem padrão:** categorias → clientes → contratos → receitas → despesas.
- **Request:** `POST /functions/v1/sync-omie`; body opcional `{ "tipos": ["clientes", "contratos"] }` para sync parcial.
- **Log:** cada tipo grava em `fin.sync_log` (tipo, status, processados, erros, duração).
- **Helpers:** `parseOmieDate`, `formatOmieDate`, `mapStatusContrato`, `mapStatusTitulo`.

### 2.3 `SETUP.md`

- Pré-requisitos: Supabase, Omie, Node 18+, Supabase CLI.
- Passos: (1) Projeto Supabase, (2) Rodar `001_schema_fin.sql` no SQL Editor, (3) Secrets Omie, (4) Deploy `sync-omie`, (5) Testes com `curl`, (6) Cron pg_cron para sync diário 3h, (7) `.env.local` frontend.
- Estrutura de arquivos: `src/database/`, `src/supabase/functions/sync-omie/`, `docs/`, `ARCHITECTURE.md`.
- Troubleshooting: auth Omie, RLS, timeout da Edge Function.

---

## 3. Clone local

- O clone em `nessOS/ness.OS` pode estar **atrás** do `main`. Para ter `src/` e `SETUP.md` localmente:
  ```bash
  cd ness.OS && git pull origin main
  ```
- Se houver alterações locais (ex.: `ARCHITECTURE.md`, `docs/context-separation.md`, `.context/`), avaliar merge ou stash antes do pull.

---

## 4. Próximos passos sugeridos

1. **Alinhar clone:** `git pull` e resolver conflitos se existirem.
2. **Documentação:** Manter `docs/integrations/omie-erp.md` e `ARCHITECTURE.md` apontando para `src/database/001_schema_fin.sql`, `src/supabase/functions/sync-omie/` e `SETUP.md`.
3. **Deploy:** Seguir `SETUP.md` para configurar Supabase, schema, secrets e deploy da `sync-omie`.
4. **Testes:** Validar sync com `tipos` parciais e sync completo; checar `fin.sync_log` e tabelas `fin.*`.
5. **Frontend:** Ver §6; app Next.js já no repositório. Rodar `npm i` e `npm run dev`; configurar `.env.local` a partir de `.env.example`.

---

## 6. Novos passos no GitHub (frontend Next.js)

**Commits recentes** (após schema + sync-omie + SETUP) adicionaram o frontend Next.js 14. Integração com nossos planos e AI-context: ver [plan-github-novos-passos-integracao](plan-github-novos-passos-integracao.md).

## 7. Novos passos no GitHub (auth + RBAC)

**12 commits** (auth, RBAC, login, admin users). Ver §7 de [plan-github-novos-passos-integracao](plan-github-novos-passos-integracao.md).

| Artefato | Caminho | Descrição |
|----------|---------|-----------|
| RBAC schema | `supabase/migrations/001_rbac_schema.sql` | `profiles`, `user_permissions`, `audit_log`; roles: superadmin, adm-area, user-area |
| Auth | `src/app/auth/login/`, `src/contexts/AuthContext.tsx`, `src/components/auth/guards.tsx` | Login, provider, proteção por role |
| Admin | `src/app/admin/users/` | Gestão de usuários |
| Docs | `docs/DATABASE_SCHEMA.md`, `docs/DEVELOPMENT_PLAN.md` | Schema completo e roadmap |

### 6.1 Estrutura e artefatos

| Item | Caminho | Descrição |
|------|---------|-----------|
| App Next.js | `src/app/` | App Router: `layout`, `page`, `globals.css`, `dashboard`, `fin/contratos`, `fin/rentabilidade`, `fin/alertas` |
| Componentes | `src/components/` | `layout/app-layout`, `ui/card`, `ui/badge`, `modules/kpi-card` |
| Lib | `src/lib/` | `supabase.ts` (createClient, tipos `Cliente`|`Contrato`|`Receita`|`Despesa`), `utils.ts` |
| Config | raiz | `package.json`, `next.config.js`, `tailwind.config.ts`, `tsconfig.json`, `postcss.config.js` |
| Env | `.env.example` | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` |

### 6.2 Stack frontend

- Next.js 14, React 18, TypeScript.
- `@supabase/ssr` + `@supabase/supabase-js`, Radix UI, Tailwind, `lucide-react`, `recharts`, `date-fns`, `clsx` / `tailwind-merge` / `class-variance-authority`.

### 6.3 Uso de `fin`

- `src/lib/supabase.ts` define tipos alinhados ao schema `fin`. Páginas `fin/*` e dashboard preparam consumo de `fin.*` (hoje parte com dados mock; substituir por queries Supabase quando integrar).

---

## 5. Referências

- Repo: [resper1965/ness.OS](https://github.com/resper1965/ness.OS)
- Omie API: [developer.omie.com.br](https://developer.omie.com.br)
- Schema: [src/database/001_schema_fin.sql](../src/database/001_schema_fin.sql)
- Edge Function: [src/supabase/functions/sync-omie/index.ts](../src/supabase/functions/sync-omie/index.ts)
- Setup: [SETUP.md](../SETUP.md)
- [Plano: Novos passos GitHub e integração (frontend, AI-context)](plan-github-novos-passos-integracao.md)
