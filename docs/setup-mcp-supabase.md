# Implementação via MCP Supabase

## O que foi implementado (MCP user-supabase nPhish)

### 1. Schema fin (migration `001_schema_fin`)

- **Projeto:** `jagerqrvcdraxkuqkrip` (https://jagerqrvcdraxkuqkrip.supabase.co)
- **Schemas/tabelas:** `fin.clientes`, `fin.contratos`, `fin.categorias`, `fin.receitas`, `fin.despesas`, `fin.rentabilidade`, `fin.alertas`, `fin.configuracoes`, `fin.sync_log`
- **Views:** `vw_rentabilidade_cliente`, `vw_contratos_vencendo`, `vw_fluxo_caixa`
- **Triggers:** `updated_at` em clientes, contratos, receitas, despesas
- **RLS:** políticas SELECT para `authenticated`; INSERT/UPDATE em `fin.alertas`
- **Grants:** USAGE em `fin`, SELECT nas tabelas
- **Dados iniciais:** 5 registros em `fin.configuracoes`

### 2. Edge Function sync-omie

- **Status:** Deploy inicial via MCP (versão simplificada para validação).
- **URL:** `https://jagerqrvcdraxkuqkrip.supabase.co/functions/v1/sync-omie`
- **Secrets necessários:** `OMIE_APP_KEY`, `OMIE_APP_SECRET` (configurar em Settings > Edge Functions > Secrets).

### 3. Deploy da versão completa do sync-omie

A função completa (sync real com Omie) está em `src/supabase/functions/sync-omie/index.ts`. Para fazer deploy:

**Opção A – Supabase CLI** (recomendado):

```bash
# Estrutura supabase/functions já criada
cd ness.OS
supabase link --project-ref jagerqrvcdraxkuqkrip  # requer acesso ao projeto
supabase functions deploy sync-omie --project-ref jagerqrvcdraxkuqkrip
```

**Opção B – Dashboard Supabase**

1. Acesse https://supabase.com/dashboard/project/jagerqrvcdraxkuqkrip
2. Edge Functions > Create function > sync-omie
3. Cole o conteúdo de `src/supabase/functions/sync-omie/index.ts`

### 4. Testar o sync

```bash
# Sync completo
curl -X POST https://jagerqrvcdraxkuqkrip.supabase.co/functions/v1/sync-omie \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphZ2VycXJ2Y2RyYXhrdXFrcmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NjMyOTMsImV4cCI6MjA4NTMzOTI5M30.-UwOktkZLzc-B1EwJEvTBOuKBzsF-YBS-GhgM6ofPB0" \
  -H "Content-Type: application/json"

# Sync específico
curl -X POST https://jagerqrvcdraxkuqkrip.supabase.co/functions/v1/sync-omie \
  -H "Authorization: Bearer <ANON_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"tipos": ["categorias", "clientes"]}'
```

### 5. Frontend (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=https://jagerqrvcdraxkuqkrip.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

**Nota:** O MCP Supabase usado é o `user-supabase nPhish`, vinculado ao projeto `jagerqrvcdraxkuqkrip`. Para usar outro projeto (ex.: ness.OS dedicado), configure um MCP Supabase para esse projeto.
