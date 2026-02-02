# Plano de Redução de Complexidade — ness.OS

> **Trigger:** `SIMPLIFICA` | **Status:** Ready | **Gerado:** 2026-02-02

## Contexto

O ness.OS cresceu organicamente com 6 módulos (GROWTH, OPS, FIN, PEOPLE, JUR, GOV).
Com esse crescimento, surgiram duplicações e padrões inconsistentes que aumentam o custo de manutenção.

### Restrições Definidas

| Restrição | Implicação |
|-----------|------------|
| **Nunca multi-tenancy** | Sistema interno de uma empresa apenas |
| **Apenas Supabase + Vercel** | Sem serviços externos (Sentry, Redis, AWS) |
| **Monolito otimizado** | Não quebrar em microserviços |

### Por que NÃO microserviços?

1. **Complexidade operacional** — 6 deploys vs 1 deploy
2. **Latência** — Chamadas de rede entre serviços
3. **Consistência** — Transações distribuídas são difíceis
4. **Custo** — Mais infraestrutura = mais custo
5. **Equipe** — Microserviços exigem mais pessoas

**Decisão:** Manter monolito Next.js, mas **modularizar internamente**.

---

## Diagnóstico Atual

### Problemas Identificados

#### 1. Server Actions Fragmentadas
```
src/app/actions/
├── posts.ts           # GROWTH
├── leads.ts           # GROWTH
├── admin-leads.ts     # GROWTH (duplica leads.ts?)
├── playbooks.ts       # OPS
├── jobs.ts            # PEOPLE
├── compliance.ts      # JUR
├── content-ai.ts      # IA
├── proposals-ai.ts    # IA
├── assets.ts          # OPS
└── ...
```

**Problema:** Cada action cria seu próprio client Supabase, repete validação, repete tratamento de erro.

#### 2. Componentes Duplicados Entre Módulos
```
components/growth/lead-form.tsx      → Form com React Hook Form + Zod
components/fin/contract-form.tsx     → Form com React Hook Form + Zod (mesmo padrão)
components/people/job-form.tsx       → Form com React Hook Form + Zod (mesmo padrão)
```

**Problema:** 6 módulos × ~5 componentes similares = ~30 componentes que poderiam ser ~10.

#### 3. Schemas Zod Espalhados
```
// Em cada form/action:
const schema = z.object({ ... })

// Repetido em múltiplos lugares
```

**Problema:** Mesmo schema definido em action E no form. Alteração precisa ser feita em 2+ lugares.

#### 4. Código Morto Potencial
- Migrations antigas com tabelas nunca populadas
- Funções exportadas mas não importadas
- Componentes criados mas não usados nas rotas

---

## Solução Proposta

### Arquitetura Target

```
src/
├── app/
│   ├── (site)/              # Rotas públicas (thin)
│   ├── app/                 # Rotas internas (thin)
│   ├── api/                 # API routes
│   └── actions/             # Server actions CONSOLIDADAS
│       ├── growth.ts        # Posts, Leads, Proposals, Cases, Services
│       ├── ops.ts           # Playbooks, Assets, Metrics
│       ├── fin.ts           # Contracts, Clients, Profitability
│       ├── people.ts        # Jobs, Applications, Gaps, Evaluations
│       ├── jur.ts           # Compliance, Legal-docs, Risk
│       ├── gov.ts           # Policies, Acceptances
│       └── ai.ts            # Content-AI, Proposals-AI (centralizado)
│
├── components/
│   ├── shared/              # NOVO: Componentes reutilizáveis
│   │   ├── data-table.tsx   # Tabela genérica
│   │   ├── entity-form.tsx  # Form genérico
│   │   ├── status-badge.tsx # Badge de status
│   │   ├── kanban-board.tsx # Kanban genérico
│   │   └── confirm-dialog.tsx
│   ├── site/                # Componentes do site público
│   ├── app/                 # Layout do app (sidebar, nav)
│   └── [módulo]/            # Componentes ESPECÍFICOS do módulo
│       └── (apenas o que não é genérico)
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── queries/         # NOVO: Queries reutilizáveis
│   │       ├── growth.ts
│   │       ├── ops.ts
│   │       └── ...
│   ├── validators/
│   │   └── schemas.ts       # NOVO: Todos os schemas Zod
│   ├── ai/
│   │   ├── embedding.ts
│   │   ├── chat.ts
│   │   └── prompts.ts       # NOVO: Prompts centralizados
│   └── utils.ts
│
└── types/
    └── index.ts             # NOVO: Tipos globais (inferidos de Zod)
```

---

## Fases de Execução

### FASE 1: Auditoria (Não mexer em código)

**Objetivo:** Mapear antes de agir.

**Entregas:**
1. Lista de Server Actions com lógica duplicada
2. Lista de componentes com padrão idêntico
3. Lista de schemas Zod repetidos
4. Lista de código morto (via `ts-prune`)

**Comandos:**
```bash
# Encontrar padrões de Supabase client
grep -rn "createServerClient" src/app/actions/

# Encontrar schemas Zod
grep -rn "z.object" src/

# Encontrar código não usado
npx ts-prune
```

**DoD Fase 1:**
- [ ] Documento com lista completa de duplicações
- [ ] Priorização por impacto (alto/médio/baixo)

---

### FASE 2: Consolidar Server Actions

**Objetivo:** Reduzir ~15 arquivos para ~7 arquivos.

#### Passo 2.1 — Criar base reutilizável

```typescript
// src/lib/supabase/queries/base.ts
import { createServerClient } from '@/lib/supabase/server'
import { SupabaseClient } from '@supabase/supabase-js'

export async function withSupabase<T>(
  fn: (supabase: SupabaseClient) => Promise<T>
): Promise<{ data: T | null; error: string | null }> {
  try {
    const supabase = await createServerClient()
    const result = await fn(supabase)
    return { data: result, error: null }
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : 'Erro desconhecido' }
  }
}
```

#### Passo 2.2 — Migrar por domínio

**growth.ts:**
```typescript
'use server'

import { withSupabase } from '@/lib/supabase/queries/base'
import { leadSchema, postSchema, serviceSchema } from '@/lib/validators/schemas'
import { revalidatePath } from 'next/cache'

// === LEADS ===
export async function getLeads() {
  return withSupabase(sb =>
    sb.from('inbound_leads').select('*').order('created_at', { ascending: false })
  )
}

export async function updateLeadStatus(id: string, status: string) {
  const result = await withSupabase(sb =>
    sb.from('inbound_leads').update({ status }).eq('id', id)
  )
  revalidatePath('/app/growth/leads')
  return result
}

// === POSTS ===
export async function getPosts() {
  return withSupabase(sb =>
    sb.from('public_posts').select('*').order('created_at', { ascending: false })
  )
}

export async function createPost(data: z.infer<typeof postSchema>) {
  const validated = postSchema.parse(data)
  const result = await withSupabase(sb =>
    sb.from('public_posts').insert(validated)
  )
  revalidatePath('/app/growth/posts')
  return result
}

// ... continua para services, cases, proposals
```

**DoD Fase 2:**
- [ ] Todos os arquivos de action consolidados por domínio
- [ ] Nenhuma duplicação de `createServerClient()`
- [ ] Build passa sem erros
- [ ] Commit: `refactor(actions): consolida server actions por domínio`

---

### FASE 3: Unificar Componentes

**Objetivo:** Criar componentes genéricos em `shared/`.

#### Passo 3.1 — DataTable Genérico

```typescript
// src/components/shared/data-table.tsx
'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { useState, useMemo } from 'react'

interface Column<T> {
  key: keyof T
  header: string
  render?: (value: T[keyof T], row: T) => React.ReactNode
}

interface DataTableProps<T extends Record<string, any>> {
  data: T[]
  columns: Column<T>[]
  searchKey?: keyof T
  actions?: (row: T) => React.ReactNode
  emptyMessage?: string
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchKey,
  actions,
  emptyMessage = 'Nenhum registro encontrado'
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!searchKey || !search) return data
    return data.filter(row =>
      String(row[searchKey]).toLowerCase().includes(search.toLowerCase())
    )
  }, [data, search, searchKey])

  return (
    <div className="space-y-4">
      {searchKey && (
        <Input
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      )}
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(col => (
              <TableHead key={String(col.key)}>{col.header}</TableHead>
            ))}
            {actions && <TableHead>Ações</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="text-center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((row, i) => (
              <TableRow key={i}>
                {columns.map(col => (
                  <TableCell key={String(col.key)}>
                    {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                  </TableCell>
                ))}
                {actions && <TableCell>{actions(row)}</TableCell>}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
```

**Uso:**
```typescript
// Antes: components/growth/leads-table.tsx (100+ linhas)
// Depois:
<DataTable
  data={leads}
  columns={[
    { key: 'name', header: 'Nome' },
    { key: 'email', header: 'Email' },
    { key: 'status', header: 'Status', render: (v) => <StatusBadge status={v} type="lead" /> },
  ]}
  searchKey="name"
  actions={(row) => <LeadActions lead={row} />}
/>
```

#### Passo 3.2 — EntityForm Genérico

```typescript
// src/components/shared/entity-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type FieldType = 'text' | 'email' | 'number' | 'textarea' | 'select'

interface FieldConfig {
  name: string
  label: string
  type: FieldType
  placeholder?: string
  options?: { value: string; label: string }[]
}

interface EntityFormProps<T extends z.ZodObject<any>> {
  schema: T
  fields: FieldConfig[]
  defaultValues?: Partial<z.infer<T>>
  onSubmit: (data: z.infer<T>) => Promise<void>
  submitLabel?: string
  isLoading?: boolean
}

export function EntityForm<T extends z.ZodObject<any>>({
  schema,
  fields,
  defaultValues,
  onSubmit,
  submitLabel = 'Salvar',
  isLoading = false
}: EntityFormProps<T>) {
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {fields.map(field => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name as any}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  {field.type === 'textarea' ? (
                    <Textarea {...formField} placeholder={field.placeholder} />
                  ) : field.type === 'select' ? (
                    <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                      <SelectTrigger>
                        <SelectValue placeholder={field.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input {...formField} type={field.type} placeholder={field.placeholder} />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : submitLabel}
        </Button>
      </form>
    </Form>
  )
}
```

**DoD Fase 3:**
- [ ] `DataTable` substituindo tabelas específicas
- [ ] `EntityForm` substituindo forms específicos
- [ ] `StatusBadge` unificado
- [ ] Componentes específicos movidos para `shared/`
- [ ] Commit: `refactor(components): cria componentes shared reutilizáveis`

---

### FASE 4: Centralizar Schemas e Utils

**Objetivo:** Uma fonte de verdade para validação.

```typescript
// src/lib/validators/schemas.ts
import { z } from 'zod'

// === GROWTH ===
export const leadSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  email: z.string().email('Email inválido'),
  company: z.string().optional(),
  message: z.string().min(10, 'Mensagem muito curta'),
})

export const postSchema = z.object({
  title: z.string().min(5),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  content_markdown: z.string().min(100),
  meta_description: z.string().max(160).optional(),
  cover_image: z.string().url().optional(),
  is_published: z.boolean().default(false),
})

// === FIN ===
export const contractSchema = z.object({
  client_id: z.string().uuid(),
  mrr_value: z.number().positive(),
  start_date: z.string(),
  end_date: z.string().optional(),
  renewal_date: z.string(),
  readjustment_index: z.enum(['IPCA', 'IGPM', 'NONE']),
})

// === PEOPLE ===
export const jobSchema = z.object({
  title: z.string().min(5),
  description_html: z.string(),
  department: z.string(),
  is_open: z.boolean().default(true),
})

// ... outros schemas

// === TIPOS INFERIDOS ===
export type Lead = z.infer<typeof leadSchema>
export type Post = z.infer<typeof postSchema>
export type Contract = z.infer<typeof contractSchema>
export type Job = z.infer<typeof jobSchema>
```

**DoD Fase 4:**
- [ ] Todos schemas em um arquivo
- [ ] Tipos exportados via `z.infer`
- [ ] Imports atualizados em actions e forms
- [ ] Commit: `refactor(lib): centraliza schemas Zod`

---

### FASE 5: Otimização Database

**Objetivo:** Limpar schema Supabase.

#### Passo 5.1 — Auditoria via SQL

```sql
-- Tabelas sem registros (possível código morto)
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name NOT IN (
  SELECT tablename FROM pg_stat_user_tables WHERE n_live_tup > 0
);

-- Colunas nunca populadas
SELECT table_name, column_name
FROM information_schema.columns
WHERE table_schema = 'public'
AND is_nullable = 'YES';
-- (verificar manualmente quais têm todos NULL)

-- Índices que podem ajudar
SELECT tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public';
```

#### Passo 5.2 — Adicionar Índices

```sql
-- Índices para queries frequentes
CREATE INDEX IF NOT EXISTS idx_leads_status ON inbound_leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON inbound_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_published ON public_posts(is_published) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_jobs_open ON public_jobs(is_open) WHERE is_open = true;
CREATE INDEX IF NOT EXISTS idx_contracts_renewal ON contracts(renewal_date);
```

**DoD Fase 5:**
- [ ] Auditoria de tabelas/colunas não usadas
- [ ] Índices adicionados para queries frequentes
- [ ] Migration criada: `supabase/migrations/XXX_optimization_indexes.sql`
- [ ] Commit: `refactor(db): adiciona índices e otimiza schema`

---

### FASE 6: Validação Final

**Checklist obrigatório:**

```bash
# 1. Tipos
pnpm tsc --noEmit

# 2. Lint
pnpm lint

# 3. Testes
pnpm test

# 4. Build
pnpm build
```

**Teste manual:**
- [ ] Login/Logout funciona
- [ ] Cada módulo carrega (GROWTH, OPS, FIN, PEOPLE, JUR, GOV)
- [ ] CRUD funciona em cada módulo
- [ ] Chatbot público responde
- [ ] Upload de assets funciona
- [ ] Site público renderiza (blog, carreiras, soluções)

**DoD Fase 6:**
- [ ] Build de produção sem erros
- [ ] Todos os testes passando
- [ ] Verificação manual OK
- [ ] Commit: `chore: validação redução de complexidade`

---

## Métricas de Sucesso

| Métrica | Atual | Target | Como Medir |
|---------|-------|--------|------------|
| Arquivos em `actions/` | ~15 | 7 | `ls src/app/actions/*.ts \| wc -l` |
| Componentes totais | ~50 | ~30 | `find src/components -name "*.tsx" \| wc -l` |
| Schemas Zod duplicados | ~20 | 1 | `grep -r "z.object" src \| wc -l` |
| Linhas de código | ? | -20% | `cloc src/` |
| Bundle size | ? | -15% | `pnpm build` output |

---

## Cronograma Sugerido

| Fase | Duração | Dependência |
|------|---------|-------------|
| Fase 1 - Auditoria | 1 sessão | - |
| Fase 2 - Actions | 1-2 sessões | Fase 1 |
| Fase 3 - Componentes | 1-2 sessões | Fase 2 |
| Fase 4 - Schemas | 1 sessão | Fase 2 |
| Fase 5 - Database | 1 sessão | Fase 4 |
| Fase 6 - Validação | 1 sessão | Todas |

**Total estimado:** 6-8 sessões de trabalho

---

## Rollback

Se algo quebrar em produção:

1. **Código:** `git revert <commit>` da fase problemática
2. **Database:** Restaurar backup Supabase (Dashboard > Backups)
3. **Deploy:** Rollback no Vercel (Dashboard > Deployments > Redeploy versão anterior)

---

## Referências

- [ai-context plan](../.context/plans/reducao-complexidade-codebase.md)
- [Arquitetura Técnica](./ARQUITETURA-TECNICA-NESSOS.md)
- [PRD Global](./PRD-GLOBAL-NESSOS-NESSWEB.md)
