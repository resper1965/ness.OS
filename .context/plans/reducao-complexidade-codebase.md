---
status: ready
generated: 2026-02-02
planVinculado: docs/PLANO-REDUCAO-COMPLEXIDADE.md
constrains:
  - "Apenas Supabase + Vercel"
  - "Nunca multi-tenancy"
  - "Monolito otimizado"
---

# Redução de Complexidade — ness.OS

> Simplificar codebase sem quebrar em microserviços. Foco em eliminar duplicação, consolidar abstrações e otimizar estrutura mantendo stack Supabase + Vercel.

**Documento completo:** [docs/PLANO-REDUCAO-COMPLEXIDADE.md](../docs/PLANO-REDUCAO-COMPLEXIDADE.md)

**Trigger:** **"SIMPLIFICA"**, "reduz complexidade" ou "otimiza codebase"

## Princípios

| Princípio | Descrição |
|-----------|-----------|
| **Monolito coeso** | Manter Next.js único, não quebrar em serviços |
| **Stack fixo** | Apenas Supabase (DB, Auth, Storage) + Vercel (Deploy, Edge) |
| **Single-tenant** | Sistema interno de uma empresa, nunca SaaS multi-tenant |
| **DRY pragmático** | Eliminar duplicação real, não criar abstrações prematuras |

## Resumo das Fases

| Fase | Foco | Entregas |
|------|------|----------|
| 1 | Auditoria | Mapa de duplicações, componentes redundantes, actions similares |
| 2 | Server Actions | Consolidar actions por domínio, remover duplicados |
| 3 | Componentes | Unificar componentes similares entre módulos |
| 4 | Lib/Utils | Centralizar funções utilitárias, remover código morto |
| 5 | Database | Otimizar queries, remover tabelas/colunas não usadas |
| 6 | Validação | Testes, build, verificar que nada quebrou |

---

## FASE 1 — Auditoria de Complexidade

**Objetivo:** Mapear toda duplicação e redundância antes de agir.

### Passo 1.1 — Server Actions Duplicadas
```bash
# Identificar actions com lógica similar
grep -r "createServerClient" src/app/actions/ --include="*.ts"
```

**Verificar:**
- [ ] Actions que fazem operações CRUD similares em tabelas diferentes
- [ ] Padrões de validação Zod repetidos
- [ ] Tratamento de erros duplicado

**Entrega:** Lista de actions candidatas a consolidação

### Passo 1.2 — Componentes Redundantes
```
src/components/
├── growth/    # Forms, Tables, Cards
├── ops/       # Forms, Tables, Cards
├── fin/       # Forms, Tables, Cards
├── people/    # Forms, Tables, Cards
├── jur/       # Forms, Tables, Cards
└── gov/       # Forms, Tables, Cards
```

**Verificar:**
- [ ] Forms com estrutura idêntica (só muda campos)
- [ ] Tables com mesmo padrão (só muda colunas)
- [ ] Cards/Lists repetidos entre módulos

**Entrega:** Lista de componentes a unificar

### Passo 1.3 — Código Morto
- [ ] Imports não utilizados
- [ ] Funções exportadas mas nunca chamadas
- [ ] Componentes órfãos
- [ ] Migrations aplicadas mas tabelas não usadas

**Entrega:** Lista de código a remover

---

## FASE 2 — Consolidação de Server Actions

**Objetivo:** Reduzir de ~15 arquivos de actions para ~6 domínios.

### Estrutura Atual (problemática)
```
src/app/actions/
├── posts.ts
├── leads.ts
├── admin-leads.ts      # ← duplica leads.ts?
├── playbooks.ts
├── jobs.ts
├── compliance.ts
├── content-ai.ts
├── proposals-ai.ts
├── assets.ts
└── ... (outros)
```

### Estrutura Proposta
```
src/app/actions/
├── growth.ts           # posts, leads, proposals, cases, services
├── ops.ts              # playbooks, assets, metrics
├── fin.ts              # contracts, clients, profitability
├── people.ts           # jobs, applications, gaps, evaluations
├── jur.ts              # compliance, legal-docs, risk
├── gov.ts              # policies, acceptances
└── ai.ts               # content-ai, proposals-ai (IA centralizada)
```

### Passo 2.1 — Criar action base reutilizável
```typescript
// src/lib/actions/base.ts
import { createServerClient } from '@/lib/supabase/server'

export async function withSupabase<T>(
  fn: (supabase: SupabaseClient) => Promise<T>
): Promise<T> {
  const supabase = await createServerClient()
  return fn(supabase)
}

export function createCrudActions<T>(tableName: string) {
  return {
    list: () => withSupabase(sb => sb.from(tableName).select('*')),
    get: (id: string) => withSupabase(sb => sb.from(tableName).select('*').eq('id', id).single()),
    create: (data: Partial<T>) => withSupabase(sb => sb.from(tableName).insert(data)),
    update: (id: string, data: Partial<T>) => withSupabase(sb => sb.from(tableName).update(data).eq('id', id)),
    delete: (id: string) => withSupabase(sb => sb.from(tableName).delete().eq('id', id)),
  }
}
```

### Passo 2.2 — Migrar actions existentes
- [ ] Consolidar `leads.ts` + `admin-leads.ts` → `growth.ts`
- [ ] Mover `posts.ts` → `growth.ts`
- [ ] Mover `playbooks.ts` + `assets.ts` → `ops.ts`
- [ ] Mover `jobs.ts` → `people.ts`
- [ ] Mover `compliance.ts` → `jur.ts`
- [ ] Consolidar `content-ai.ts` + `proposals-ai.ts` → `ai.ts`

**Commit:** `refactor(actions): consolida server actions por domínio`

---

## FASE 3 — Unificação de Componentes

**Objetivo:** Criar componentes genéricos reutilizáveis entre módulos.

### Passo 3.1 — DataTable Genérico
```typescript
// src/components/shared/data-table.tsx
interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  searchKey?: keyof T
  actions?: (row: T) => React.ReactNode
}

export function DataTable<T>({ data, columns, searchKey, actions }: DataTableProps<T>) {
  // Implementação única para todas as tabelas
}
```

**Substituir:**
- [ ] `components/growth/leads-table.tsx`
- [ ] `components/fin/contracts-table.tsx`
- [ ] `components/people/jobs-table.tsx`
- [ ] `components/ops/playbooks-table.tsx`

### Passo 3.2 — EntityForm Genérico
```typescript
// src/components/shared/entity-form.tsx
interface EntityFormProps<T extends z.ZodObject<any>> {
  schema: T
  defaultValues?: Partial<z.infer<T>>
  onSubmit: (data: z.infer<T>) => Promise<void>
  fields: FieldConfig[]
}
```

**Substituir:**
- [ ] `components/growth/lead-form.tsx`
- [ ] `components/growth/post-form.tsx`
- [ ] `components/fin/contract-form.tsx`
- [ ] `components/people/job-form.tsx`

### Passo 3.3 — StatusBadge Unificado
```typescript
// src/components/shared/status-badge.tsx
type StatusType = 'lead' | 'job' | 'contract' | 'playbook' | 'compliance'

const STATUS_CONFIG: Record<StatusType, Record<string, { label: string; variant: string }>> = {
  lead: { new: { label: 'Novo', variant: 'default' }, qualified: { label: 'Qualificado', variant: 'blue' } },
  // ...
}
```

**Commit:** `refactor(components): cria componentes shared reutilizáveis`

---

## FASE 4 — Centralização de Lib/Utils

**Objetivo:** Uma única fonte de verdade para utilities.

### Estrutura Proposta
```
src/lib/
├── supabase/
│   ├── client.ts       # Browser client
│   ├── server.ts       # Server client
│   └── admin.ts        # Service role (se necessário)
├── ai/
│   ├── embedding.ts    # Embeddings OpenAI
│   ├── chat.ts         # Chat completions
│   └── prompts.ts      # System prompts centralizados
├── validators/
│   └── schemas.ts      # Todos os schemas Zod
├── constants/
│   └── index.ts        # Constantes globais
└── utils.ts            # Helpers genéricos (cn, formatDate, etc)
```

### Passo 4.1 — Centralizar Schemas Zod
```typescript
// src/lib/validators/schemas.ts
export const leadSchema = z.object({ ... })
export const postSchema = z.object({ ... })
export const contractSchema = z.object({ ... })
// Todos os schemas em um lugar
```

### Passo 4.2 — Remover Código Morto
```bash
# Usar TypeScript compiler para encontrar exports não usados
npx ts-prune
```

**Commit:** `refactor(lib): centraliza utils e remove código morto`

---

## FASE 5 — Otimização Database

**Objetivo:** Limpar schema sem afetar funcionalidade.

### Passo 5.1 — Auditoria de Tabelas
```sql
-- Encontrar tabelas vazias ou sem uso
SELECT schemaname, tablename
FROM pg_tables
WHERE schemaname = 'public';

-- Verificar foreign keys órfãs
SELECT * FROM information_schema.referential_constraints;
```

### Passo 5.2 — Otimizar Queries
- [ ] Adicionar índices em colunas frequentemente filtradas
- [ ] Verificar N+1 queries nas Server Actions
- [ ] Usar `select()` específico em vez de `select('*')`

### Passo 5.3 — Consolidar Views
```sql
-- View única de rentabilidade (se houver múltiplas)
CREATE OR REPLACE VIEW v_profitability AS
SELECT
  c.id,
  c.client_id,
  c.mrr_value,
  COALESCE(SUM(pm.hours_consumed * pm.hourly_rate), 0) as total_cost,
  c.mrr_value - COALESCE(SUM(pm.hours_consumed * pm.hourly_rate), 0) as profit
FROM contracts c
LEFT JOIN performance_metrics pm ON pm.contract_id = c.id
GROUP BY c.id;
```

**Commit:** `refactor(db): otimiza schema e adiciona índices`

---

## FASE 6 — Validação Final

**Objetivo:** Garantir que simplificação não quebrou nada.

### Passo 6.1 — Testes
```bash
# Rodar todos os testes
pnpm test

# Verificar tipos
pnpm tsc --noEmit

# Lint
pnpm lint
```

### Passo 6.2 — Build de Produção
```bash
pnpm build
```

### Passo 6.3 — Checklist Final
- [ ] Todas as rotas funcionam
- [ ] Auth funciona (login/logout)
- [ ] CRUD de cada módulo funciona
- [ ] Chatbot público responde
- [ ] Análise de risco JUR funciona
- [ ] Upload de assets funciona

**Commit:** `chore: validação final redução de complexidade`

---

## Métricas de Sucesso

| Métrica | Antes | Depois | Meta |
|---------|-------|--------|------|
| Arquivos em `actions/` | ~15 | ~7 | -50% |
| Componentes duplicados | ~20 | ~5 | -75% |
| Linhas de código | ? | ? | -20% |
| Tempo de build | ? | ? | -10% |
| Bundle size | ? | ? | -15% |

---

## Ordem de Execução

1. **FASE 1** primeiro — não mexer em código antes de mapear
2. **FASE 2-4** podem ser paralelas se times diferentes
3. **FASE 5** após código estabilizado
4. **FASE 6** obrigatória antes de merge

---

## Rollback

Se algo quebrar:
1. `git revert` dos commits da fase problemática
2. Restaurar backup Supabase (se alterou schema)
3. Redeploy versão anterior no Vercel

---

## Evidence & Follow-up

| Artefato | Responsável | Status |
|----------|-------------|--------|
| Mapa de duplicações (Fase 1) | - | Pendente |
| PR consolidação actions | - | Pendente |
| PR componentes shared | - | Pendente |
| Relatório métricas antes/depois | - | Pendente |
