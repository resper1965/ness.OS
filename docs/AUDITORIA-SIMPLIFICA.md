# Auditoria SIMPLIFICA — ness.OS

> Gerado em 2026-02-02 | Fase 1 do plano de redução de complexidade

## 1. Server Actions — Duplicações

**Total:** 23 arquivos, 64 chamadas a `createClient` / `createServerClient`

### Mapeamento por domínio

| Domínio | Arquivos atuais | Ação proposta |
|---------|-----------------|---------------|
| **growth** | leads, admin-leads, posts, admin-posts, services, admin-services, success-cases, proposals-ai | Consolidar em `growth.ts` |
| **ops** | playbooks, assets, metricas | Consolidar em `ops.ts` |
| **fin** | contracts, clients | Consolidar em `fin.ts` |
| **people** | jobs, job-application, gaps | Consolidar em `people.ts` |
| **jur** | compliance | Consolidar em `jur.ts` |
| **gov** | policies | Consolidar em `gov.ts` |
| **ai** | content-ai, proposals-ai | Consolidar em `ai.ts` |
| **site** | cases-public, jobs-public, static-pages | Manter ou mover para `site.ts` |
| **auth** | auth | Manter separado |

### Candidatos a consolidação imediata
- `leads.ts` + `admin-leads.ts` → mesmo domínio (leads)
- `posts.ts` + `admin-posts.ts` → mesmo domínio (posts)
- `services.ts` + `admin-services.ts` → mesmo domínio (serviços)

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
