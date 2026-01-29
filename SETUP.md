# Setup do ness.OS

## Pré-requisitos

- Conta no [Supabase](https://supabase.com)
- Credenciais do [Omie](https://developer.omie.com.br/my-apps/)
- Node.js 18+
- Supabase CLI

## 1. Criar Projeto Supabase

1. Acesse https://supabase.com/dashboard
2. Clique em "New Project"
3. Configure:
   - Nome: `ness-os`
   - Database Password: (anote!)
   - Region: `South America (São Paulo)`
4. Aguarde a criação (~2 min)

## 2. Configurar Banco de Dados

1. No dashboard do Supabase, vá em **SQL Editor**
2. Cole o conteúdo de `src/database/001_schema_fin.sql`
3. Clique em **Run**

## 3. Configurar Secrets

No dashboard do Supabase, vá em **Settings > Edge Functions > Secrets**:

```
OMIE_APP_KEY=sua_app_key
OMIE_APP_SECRET=sua_app_secret
```

## 4. Deploy da Edge Function

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Linkar projeto
supabase link --project-ref SEU_PROJECT_REF

# Deploy da função
supabase functions deploy sync-omie
```

## 5. Testar Sync

```bash
# Sync completo
curl -X POST https://SEU_PROJECT.supabase.co/functions/v1/sync-omie \
  -H "Authorization: Bearer SEU_ANON_KEY" \
  -H "Content-Type: application/json"

# Sync específico
curl -X POST https://SEU_PROJECT.supabase.co/functions/v1/sync-omie \
  -H "Authorization: Bearer SEU_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"tipos": ["clientes", "contratos"]}'
```

## 6. Configurar Cron (Sync Automático)

No SQL Editor do Supabase:

```sql
-- Sync diário às 3h da manhã
SELECT cron.schedule(
  'sync-omie-diario',
  '0 3 * * *',
  $$
  SELECT net.http_post(
    url := 'https://SEU_PROJECT.supabase.co/functions/v1/sync-omie',
    headers := '{"Authorization": "Bearer SEU_SERVICE_ROLE_KEY"}'::jsonb,
    body := '{}'::jsonb
  )
  $$
);
```

## 7. Variáveis de Ambiente (Frontend)

Crie `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
```

## Estrutura de Arquivos

```
ness-os/
├── src/
│   ├── database/
│   │   └── 001_schema_fin.sql      # Schema inicial
│   └── supabase/
│       └── functions/
│           └── sync-omie/
│               └── index.ts         # Edge Function
├── docs/                            # Documentação
└── ARCHITECTURE.md
```

## Verificar Instalação

1. Acesse **Table Editor** no Supabase
2. Verifique se as tabelas `fin.*` foram criadas
3. Execute o sync manual
4. Verifique se os dados foram importados

## Troubleshooting

### Erro de autenticação Omie
- Verifique se `OMIE_APP_KEY` e `OMIE_APP_SECRET` estão corretos
- Verifique se o app está ativo no portal Omie

### Erro de RLS
- Para desenvolvimento, desabilite temporariamente:
  ```sql
  ALTER TABLE fin.clientes DISABLE ROW LEVEL SECURITY;
  ```

### Timeout na Edge Function
- Aumente o timeout: `supabase functions deploy sync-omie --timeout 300`
- Faça sync em partes: `{"tipos": ["clientes"]}`

## Próximos Passos

1. [ ] Criar frontend Next.js
2. [ ] Implementar dashboard de rentabilidade
3. [ ] Adicionar autenticação SSO
4. [ ] Integrar ness.OPS (horas/custos)
