# Auditoria SIMPLIFICA — ness.OS

**Data:** 2026-02-05  
**Workflow:** simplifica-reducao-complexidade (Fase P — Planning)  
**Plano:** [reducao-complexidade-codebase](.context/plans/reducao-complexidade-codebase.md)

Objetivo: mapear duplicações e redundâncias antes de alterar código. DoD da Fase 1.

---

## 1. Server Actions

### 1.1 Estado atual

| Arquivo        | Uso de `createClient()` | Observação                          |
|----------------|--------------------------|-------------------------------------|
| ai.ts          | 3x                       | Chat, embeddings, propostas        |
| auth.ts        | 2x                       | Login, session                       |
| cases-public.ts| 2x                       | Casos públicos                      |
| data.ts        | 4x                       | Dashboard, indicadores, ERP         |
| fin.ts         | 4x                       | Contratos, clientes, rentabilidade  |
| gov.ts         | 7x                       | Políticas, aceites                  |
| growth.ts      | 12x                      | Leads, posts, casos, serviços       |
| jobs-public.ts | 2x                       | Vagas públicas                      |
| jur.ts         | 4x                       | Conformidade, risco                 |
| ops.ts         | 6x                       | Playbooks, assets, métricas, timer  |
| people.ts      | 6x                       | Vagas, gaps, feedback               |
| static-pages.ts| 2x                       | Páginas estáticas                   |
| timesheet.ts   | 9x                       | Time entries, agregações           |

**Total:** 13 arquivos, dezenas de chamadas `const supabase = await createClient()` repetidas.

### 1.2 Base reutilizável existente (não utilizada)

- `src/lib/supabase/queries/base.ts` exporta `withSupabase(fn)`.
- **Nenhuma** action importa ou usa `withSupabase`; todas instanciam o client manualmente.

**Ação recomendada:** Migrar actions para `withSupabase()` (Fase 2 do plano) para reduzir duplicação e centralizar tratamento de erro.

### 1.3 Consolidação por domínio

Estrutura atual já está agrupada por domínio (growth, ops, fin, people, jur, gov, ai). Não há arquivos óbvios duplicados (ex.: admin-leads vs leads). O ganho principal está em usar a base reutilizável e, se desejado, funções CRUD genéricas.

---

## 2. Componentes

### 2.1 Shared já existentes e em uso

| Componente     | Onde é usado                                      |
|----------------|---------------------------------------------------|
| DataTable      | fin/contratos, people/gaps, people/vagas          |
| EntityForm     | people/gaps (wrapper)                             |
| StatusBadge    | people/gaps, people/vagas                          |

### 2.2 Páginas que ainda usam `<table>` manual

Candidatas a migrar para `DataTable` (ou variante):

- app/fin/alertas
- app/growth/brand
- app/jur/conformidade
- app/gov/aceites, app/gov/politicas
- app/ops/playbooks, app/ops/workflows, app/ops/indicators
- app/people/avaliacao, app/people/candidatos
- app/growth/upsell, app/growth/services, app/growth/posts, app/growth/casos
- app/fin/rentabilidade

**Ação recomendada:** Fase 3 do plano — substituir essas tabelas por `DataTable<T>` onde fizer sentido (mesmas colunas dinâmicas, filtros, etc.).

### 2.3 Forms por módulo

Cada domínio tem forms específicos (ContractForm, JobForm, PolicyForm, CaseForm, etc.). O plano prevê um `EntityForm<T>` genérico; hoje o `EntityForm` existe como container de layout (título, children), não como formulário com schema Zod. Os forms específicos continuam necessários; a unificação seria por convenção (FieldConfig, schema único) e não por remoção dos forms de domínio.

---

## 3. Schemas Zod

### 3.1 Centralizados em `src/lib/validators/schemas.ts`

- `leadSchema` / `LeadInput`
- `postSchema` / `PostInput`

### 3.2 Fora do arquivo central

- `src/app/api/jur/risk/analyze/route.ts`: `riskSchema` (z.object com clauses).

**Ação recomendada:** Mover `riskSchema` para `schemas.ts` e reexportar (Fase 4), mantendo uma única fonte de schemas de validação.

---

## 4. Código morto / subutilizado (ts-prune)

### 4.1 Exports não usados fora do módulo (relevantes)

| Arquivo                          | Export              | Observação                    |
|----------------------------------|----------------------|-------------------------------|
| `lib/supabase/queries/base.ts`   | `withSupabase`       | Não usado por nenhuma action  |
| `app/actions/gov.ts`             | `getPolicies`        | Verificar se é API interna    |
| `app/actions/static-pages.ts`    | `getStaticPageSlugs` | Verificar uso                  |
| `lib/design-tokens.ts`           | `SPACING`, `FORM_WIDTH` | Possível uso apenas interno  |
| `lib/validators/schemas.ts`      | `LeadInput`, `PostInput` | Tipos; podem ser usados em forms |

### 4.2 ts-prune completo

Vários outros exports aparecem como “used in module” (uso interno). Tipos de layout Next (PageProps, LayoutProps) e componentes UI (shadcn) são esperados. Para limpeza agressiva, rodar `npx ts-prune` e revisar cada item; para esta auditoria, o foco é `withSupabase` e funções exportadas que não são chamadas em nenhum lugar.

**Ação recomendada:** Fase 4 — adotar `withSupabase` nas actions; depois rodar ts-prune de novo e remover ou marcar como internos os exports realmente mortos.

---

## 5. Resumo e próximos passos

| Área            | Situação                                           | Próxima fase |
|-----------------|----------------------------------------------------|--------------|
| Server Actions  | Padrão repetido; base `withSupabase` existe e não é usada | Fase 2       |
| Componentes     | DataTable/EntityForm/StatusBadge em uso em 3 páginas; várias tabelas manuais | Fase 3       |
| Schemas Zod     | 2 em schemas.ts; 1 em API route                    | Fase 4       |
| Código morto    | withSupabase e poucos exports não usados           | Fase 4       |

**DoD Fase 1 (Auditoria):** Este documento.  
**Próximo passo no workflow:** Concluir Fase C (Confirmation) e encerrar workflow; depois continuar plano (Fases 3–4).

---

## 6. O que foi feito (Fase E — Execution)

**Data:** 2026-02-05

### 6.1 Server Actions — base única

- **`src/lib/supabase/queries/base.ts`**
  - Exportado **`getServerClient()`** para actions que fazem várias operações ou usam `auth.getUser()`.
  - **`withSupabase(fn)`** usado para leituras com tratamento de erro centralizado.
- **Todas as 13 actions** passaram a usar **`getServerClient()`** ou **`withSupabase`** (nenhuma mais usa `createClient()` de `@/lib/supabase/server`).
- **Funções migradas para `withSupabase`:** growth (getPosts, getPostBySlug, getActiveServices, getServiceBySlug), jur (getFrameworks, getChecksByFramework), static-pages (getStaticPageBySlug, getStaticPageSlugs).

### 6.2 Schemas Zod centralizados

- **`riskSchema`** e tipo **`RiskAnalysisResult`** movidos para **`src/lib/validators/schemas.ts`**.
- **`src/app/api/jur/risk/analyze/route.ts`** importa `riskSchema` de `schemas` e usa `getServerClient()`.

### 6.3 Validação

- Build (`npm run build`), testes (`npm test`), tipos (`npx tsc --noEmit`) — OK.

### 6.4 Pendente (Fases 3–4 do plano)

- Migrar mais páginas com `<table>` manual para **DataTable** (Fase 3).
- Centralizar mais schemas/prompts; rodar ts-prune e remover código morto (Fase 4).

---

*© 2025 ness. Todos os direitos reservados.*
