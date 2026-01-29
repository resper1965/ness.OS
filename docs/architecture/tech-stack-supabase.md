# Arquitetura Técnica — Supabase

> Proposta de implementação do ness.OS usando Supabase como backend

## Viabilidade: ✅ SIM

O Supabase oferece todos os componentes necessários:

| Necessidade ness.OS | Supabase | Status |
|---------------------|----------|--------|
| Banco relacional | PostgreSQL | ✅ Nativo |
| Autenticação | Supabase Auth | ✅ Nativo |
| Storage de arquivos | Supabase Storage | ✅ Nativo |
| APIs automáticas | PostgREST | ✅ Nativo |
| Realtime | Supabase Realtime | ✅ Nativo |
| Vector DB (RAG) | pgvector | ✅ Extensão |
| Edge Functions | Deno/TypeScript | ✅ Nativo |
| Cron Jobs | pg_cron | ✅ Extensão |
| Webhooks | Database Webhooks | ✅ Nativo |

---

## Arquitetura Proposta

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                        │
│                    Next.js / React (Vercel)                                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            SUPABASE                                          │
├─────────────┬─────────────┬─────────────┬─────────────┬─────────────────────┤
│    Auth     │  Database   │   Storage   │  Realtime   │   Edge Functions    │
│             │ PostgreSQL  │             │             │      (Deno)         │
│  • SSO      │  • Tabelas  │  • PDFs     │  • Alertas  │  • Agentes IA       │
│  • RBAC     │  • pgvector │  • Docs     │  • Updates  │  • Webhooks         │
│  • MFA      │  • pg_cron  │  • Imagens  │  • Notific. │  • Integrações      │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
              ┌──────────┐   ┌──────────┐   ┌──────────┐
              │  Omie    │   │  OpenAI  │   │  Outros  │
              │  ERP     │   │  Claude  │   │  APIs    │
              └──────────┘   └──────────┘   └──────────┘
```

---

## Stack Completa

| Camada | Tecnologia | Justificativa |
|--------|------------|---------------|
| **Frontend** | Next.js 14 + TypeScript | SSR, App Router, integração nativa Supabase |
| **UI** | shadcn/ui + Tailwind | Componentes prontos, customizável |
| **Auth** | Supabase Auth | SSO, MFA, RBAC nativo |
| **Database** | PostgreSQL (Supabase) | Relacional + pgvector |
| **ORM** | Drizzle ou Prisma | Type-safe, migrations |
| **APIs** | PostgREST + Edge Functions | Auto-gerado + custom |
| **RAG/Embeddings** | pgvector + OpenAI | Bases de conhecimento |
| **LLM** | Claude API / OpenAI | Agentes de IA |
| **Storage** | Supabase Storage | PDFs, contratos, docs |
| **Realtime** | Supabase Realtime | Alertas, notificações |
| **Cron** | pg_cron | Ciclo de vida, syncs |
| **Deploy** | Vercel | CI/CD automático |

---

## Estrutura do Banco (PostgreSQL)

```sql
-- Habilitar extensões
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schema por módulo
CREATE SCHEMA fin;    -- ness.FIN
CREATE SCHEMA ops;    -- ness.OPS
CREATE SCHEMA growth; -- ness.GROWTH
CREATE SCHEMA jur;    -- ness.JUR
CREATE SCHEMA gov;    -- ness.GOV
CREATE SCHEMA people; -- ness.PEOPLE
CREATE SCHEMA kb;     -- Bases de conhecimento (RAG)

-- Exemplo: Tabela de contratos (fin)
CREATE TABLE fin.contratos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES fin.clientes(id),
  numero VARCHAR(50) UNIQUE,
  valor_mensal DECIMAL(15,2),
  data_inicio DATE,
  data_fim DATE,
  indice_reajuste VARCHAR(10), -- IGPM, IPCA
  status VARCHAR(20) DEFAULT 'ATIVO',
  omie_id BIGINT, -- ID no Omie para sync
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exemplo: Base de conhecimento com embeddings (kb)
CREATE TABLE kb.documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  modulo VARCHAR(20), -- GROWTH, OPS, FIN, JUR, GOV, PEOPLE
  tipo VARCHAR(50),   -- contrato_sucesso, manual, politica
  titulo VARCHAR(255),
  conteudo TEXT,
  embedding VECTOR(1536), -- OpenAI ada-002
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para busca vetorial
CREATE INDEX ON kb.documentos 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

---

## Edge Functions (Agentes)

```typescript
// supabase/functions/agente-precificacao/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  
  const { escopo, cliente_id } = await req.json()
  
  // 1. Buscar custos históricos (ness.OPS)
  const { data: recursos } = await supabase
    .from('ops.recursos_consumidos')
    .select('*')
    .eq('cliente_id', cliente_id)
    .order('periodo', { ascending: false })
    .limit(6)
  
  // 2. Buscar overhead atual (ness.FIN)
  const { data: config } = await supabase
    .from('fin.configuracoes')
    .select('overhead_percent, margem_default')
    .single()
  
  // 3. Calcular preço
  const custoMedio = calcularMediaCustos(recursos)
  const preco = custoMedio * (1 + config.overhead_percent) * (1 + config.margem_default)
  
  return new Response(JSON.stringify({ 
    preco_sugerido: preco,
    breakdown: { custoMedio, overhead: config.overhead_percent, margem: config.margem_default }
  }))
})
```

---

## Cron Jobs (pg_cron)

```sql
-- Alerta de contratos vencendo em 90 dias
SELECT cron.schedule(
  'alerta-vencimento-90d',
  '0 8 * * *', -- Todo dia às 8h
  $$
    INSERT INTO fin.alertas (tipo, contrato_id, mensagem)
    SELECT 
      'VENCIMENTO_90D',
      id,
      'Contrato vence em ' || (data_fim - CURRENT_DATE) || ' dias'
    FROM fin.contratos
    WHERE data_fim BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '90 days'
    AND status = 'ATIVO'
  $$
);

-- Sync diário com Omie (trigger Edge Function)
SELECT cron.schedule(
  'sync-omie-diario',
  '0 3 * * *', -- Todo dia às 3h
  $$
    SELECT net.http_post(
      url := 'https://seu-projeto.supabase.co/functions/v1/sync-omie',
      headers := '{"Authorization": "Bearer ' || current_setting('app.service_key') || '"}'::jsonb
    )
  $$
);
```

---

## RAG com pgvector

```typescript
// Busca semântica para Smart Proposals
async function buscarCasosSimilares(descricaoCliente: string) {
  // 1. Gerar embedding da descrição
  const embedding = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: descricaoCliente
  })
  
  // 2. Buscar casos similares no pgvector
  const { data } = await supabase.rpc('buscar_casos_similares', {
    query_embedding: embedding.data[0].embedding,
    match_threshold: 0.7,
    match_count: 5
  })
  
  return data
}

-- Function no PostgreSQL
CREATE FUNCTION buscar_casos_similares(
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT
) RETURNS TABLE (id UUID, titulo TEXT, conteudo TEXT, similarity FLOAT)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    d.titulo,
    d.conteudo,
    1 - (d.embedding <=> query_embedding) AS similarity
  FROM kb.documentos d
  WHERE d.modulo = 'GROWTH'
    AND d.tipo = 'contrato_sucesso'
    AND 1 - (d.embedding <=> query_embedding) > match_threshold
  ORDER BY d.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

---

## Custos Estimados (Supabase)

| Plano | Preço | Limite |
|-------|-------|--------|
| **Free** | $0/mês | 500MB DB, 1GB Storage, 2M Edge invocations |
| **Pro** | $25/mês | 8GB DB, 100GB Storage, 2M Edge invocations |
| **Team** | $599/mês | Ilimitado, SOC2, suporte prioritário |

**Recomendação:** Iniciar com **Pro** ($25/mês), migrar para **Team** quando escalar.

---

## Vantagens Supabase para ness.OS

1. **Velocidade de desenvolvimento** — APIs automáticas, auth pronto
2. **pgvector nativo** — RAG sem infra adicional
3. **Edge Functions** — Agentes serverless
4. **Realtime** — Alertas instantâneos
5. **Custo** — Muito mais barato que soluções enterprise
6. **Open source** — Pode migrar para self-hosted se necessário

## Limitações a Considerar

1. **Edge Functions** — Cold start pode ser lento para agentes complexos
2. **pgvector** — Para milhões de embeddings, considerar Pinecone/Qdrant
3. **Processamento pesado** — Jobs longos precisam de worker externo (Railway, Render)

---

## Alternativa: Supabase + Worker Externo

Para agentes de IA com processamento longo:

```
Supabase (DB + Auth + Realtime)
      │
      ▼
Railway / Render / Fly.io (Python Workers)
      │
      ├── Agente de Precificação
      ├── Agente de Marketing (LLM)
      ├── Agente de Análise Contratual (NLP)
      └── Sync Omie (batch)
```

---

## Próximos Passos

1. **Criar projeto Supabase** — https://supabase.com/dashboard
2. **Configurar schema inicial** — Migrations com Drizzle
3. **Implementar auth** — SSO com Google/Microsoft
4. **Criar Edge Function de sync Omie** — MVP do ness.FIN
5. **Configurar pgvector** — Base de conhecimento inicial

---

## Conclusão

**Supabase é viável e recomendado** para o ness.OS por:
- Custo baixo para MVP
- Stack moderna e produtiva
- Todos os componentes necessários nativos
- Possibilidade de escalar ou migrar depois

Única ressalva: agentes de IA muito pesados podem precisar de worker externo (Railway/Render), mas isso é fácil de integrar.
