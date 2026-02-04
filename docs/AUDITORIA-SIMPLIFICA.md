# Auditoria SIMPLIFICA — ness.OS

> Gerado em 2026-02-02 | Fase 1 do plano de redução de complexidade | Atualizado 2026-02

## Estado atual (2026-02)

- **Actions:** 12 arquivos em `src/app/actions/` (growth, ops, fin, people, jur, gov, ai, data, auth, timesheet, static-pages, cases-public, jobs-public). Todos usam `createClient` de `@/lib/supabase/server` (sem createServerClient).
- **Schemas Zod:** Centralizados em `src/lib/validators/schemas.ts` (leadSchema, postSchema). riskSchema local em `api/jur/risk/analyze/route.ts`.
- **ts-prune:** Exports não referenciados incluem getPolicies, getStaticPageSlugs, TableSkeleton, SECTION_HEADER_HEIGHT_PX, FORM_WIDTH, SPACING_CLASSES, LeadInput, PostInput — candidatos a uso futuro ou remoção após confirmação.

---

## 1. Server Actions — Duplicações (histórico)

**Total atual:** 12 arquivos, dezenas de chamadas a `createClient` (uma por função que acessa DB).

### Mapeamento por domínio (já consolidado)

| Domínio | Arquivo | Conteúdo |
|---------|---------|----------|
| **growth** | growth.ts | Leads, posts, services, success-cases, brand_assets |
| **ops** | ops.ts | Playbooks, assets, métricas |
| **fin** | fin.ts | Clients, contracts, reconciliation |
| **people** | people.ts | Jobs, applications, gaps, feedback_360 |
| **jur** | jur.ts | Compliance frameworks, checks |
| **gov** | gov.ts | Policies, versions, acceptances |
| **ai** | ai.ts | Content AI, proposals AI |
| **data** | data.ts | ERP sync, Omie, BCB, indicators |
| **auth** | auth.ts | Login, callback |
| **site** | cases-public, jobs-public, static-pages | Conteúdo público |

### Candidatos a consolidação imediata (já feitos)
- Leads, posts, services, cases consolidados em growth.ts
- Playbooks, assets, métricas em ops.ts; contracts/clients em fin.ts; jobs/gaps em people.ts

---

## 2. Componentes — Padrões repetidos

**Forms por módulo:**
- growth: case-form, post-editor-form, proposta-form, service-form, service-edit-form
- fin: client-form, contract-form
- people: job-form, job-edit-form, gap-form
- ops: playbook-editor-form, metricas-form, asset-upload-form
- gov: policy-form
- jur: compliance-check-form

**Padrão comum:** Forms com React Hook Form ou useFormState + Server Action.

**Candidatos a EntityForm genérico:** client-form, contract-form, job-form, gap-form, policy-form, compliance-check-form (formulários CRUD simples).

---

## 3. Schemas Zod

| Arquivo | Schema |
|---------|--------|
| admin-posts.ts | postSchema |
| leads.ts | leadSchema |
| api/jur/risk/analyze/route.ts | riskSchema |

**Ação:** Centralizar em `src/lib/validators/schemas.ts`.

---

## 4. Código morto (ts-prune)

Exports não referenciados (verificar antes de remover):
- policies.ts: getPolicies, createPolicy (createPolicyFromForm usa createPolicyImpl)
- static-pages.ts: getStaticPageSlugs
- feature-grid.tsx: FeatureGrid

Maioria em .next/types são gerados — ignorar.

---

## 5. Priorização

| Prioridade | Item | Impacto | Esforço |
|------------|------|---------|---------|
| Alta | Criar withSupabase base | Reduz boilerplate em 64 pontos | Baixo |
| Alta | Consolidar growth (leads+posts+services) | -6 arquivos | Médio |
| Média | Consolidar ops (playbooks+assets+metricas) | -3 arquivos | Baixo |
| Média | Centralizar schemas Zod | Fonte única de verdade | Baixo |
| Baixa | EntityForm/DataTable genéricos | -10+ componentes | Alto |

---

## DoD Fase 1 ✅

- [x] Lista de Server Actions com lógica duplicada
- [x] Lista de componentes com padrão idêntico
- [x] Lista de schemas Zod repetidos
- [x] Lista de código morto
- [x] Documento AUDITORIA-SIMPLIFICA.md

---

## Execução SIMPLIFICA (2026-02-02)

### Fase 2 (parcial)
- [x] Criado `src/lib/supabase/queries/base.ts` (withSupabase)
- [x] Criado `src/app/actions/growth.ts` — consolidou leads + admin-leads
- [x] Removidos leads.ts, admin-leads.ts (-2 arquivos)
- [x] Imports atualizados: contact-form, lead-kanban, leads.test

### Fase 4 (parcial)
- [x] Criado `src/lib/validators/schemas.ts` — leadSchema, postSchema
- [x] admin-posts.ts passa a importar postSchema do central

### Fase 2 (continuação)
- [x] Criado `src/app/actions/ops.ts` — playbooks, assets, metricas (-3 arquivos)
- [x] Criado `src/app/actions/fin.ts` — clients, contracts (-2 arquivos)
- [x] Criado `src/app/actions/people.ts` — jobs, job-application, gaps (-3 arquivos)
- [x] Removidos: playbooks, assets, metricas, contracts, clients, jobs, job-application, gaps

### Fase 5 (parcial)
- [x] Migration 026_simplifica_indexes.sql — índices em leads, posts, jobs, contracts

### Fase 3 (parcial)
- [x] Criado `src/components/shared/status-badge.tsx` — badge com variantes (success, warning, error, etc.)
- [x] Criado `src/components/shared/data-table.tsx` — tabela genérica com colunas configuráveis
- [x] Vagas, Gaps, Contratos passam a usar DataTable + StatusBadge

### Consolidação final (2026-02-02)
- [x] growth.ts — posts, services, success-cases (+ leads já existente)
- [x] jur.ts — compliance (getFrameworks, getChecksByFramework, createComplianceCheck)
- [x] gov.ts — policies (getPolicies, getPolicyById, create/update, acceptances)
- [x] ai.ts — content-ai + proposals-ai (generatePostFromCase, generateProposalWithAI)
- [x] Removidos: admin-posts, posts, admin-services, services, success-cases, compliance, policies, content-ai, proposals-ai
- [x] **Actions: 17 → 8** (growth, ops, fin, people, jur, gov, ai + auth/site)

### Fase 6 — Validação Final
- [x] npm test — 3 passed
- [x] tsc --noEmit — OK
- [x] npm run lint — OK
- [x] npm run build — OK
- [x] docs/VALIDACAO-SIMPLIFICA.md
