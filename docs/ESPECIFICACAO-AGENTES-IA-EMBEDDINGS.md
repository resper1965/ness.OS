# Agentes de IA e Embeddings — Especificação Técnica

> O ness.OS deve ser preparado para IA desde o banco de dados.

---

## 1. Vector Database

### Extensão pgvector

- **Onde:** Supabase
- **Migration:** `009_pgvector_embeddings.sql`
- **Status:** ✅ Implementado

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### Tabela `document_embeddings`

| Coluna | Tipo | Uso |
|--------|------|-----|
| id | uuid | PK |
| source_type | text | `'playbook'` \| `'post'` (evoluir para `'service'` se Public Bot usar catálogo) |
| source_id | uuid | FK implícito ao playbook ou post |
| content_chunk | text | Trecho de texto embedado |
| embedding | vector(1536) | OpenAI text-embedding-ada-002 (ou text-embedding-3-small) |
| metadata | jsonb | Metadados opcionais |
| created_at | timestamptz | |

**Fontes de dados:**
- **ness.OPS:** Playbooks técnicos
- **ness.GROWTH:** Posts publicados (blog)

**Função RPC:** `match_document_embeddings(query_embedding, match_count, filter_source_type)` — busca por similaridade cosseno.

---

## 2. Agentes (Vercel AI SDK)

### 2.1 Internal Knowledge Bot

| Atributo | Valor |
|----------|-------|
| **Contexto** | Playbooks Técnicos |
| **Usuário** | Técnico / Operacional |
| **Função** | Tirar dúvidas de procedimento **sem alucinar** |
| **Rota** | `/api/chat/playbooks` |
| **UI** | `/app/ops/playbooks/chat` |
| **Auth** | Requer sessão (authenticated) |

**Implementação:** RAG sobre `document_embeddings` com `filter_source_type = 'playbook'`. System prompt instrui a responder **apenas** com base nos trechos retornados.

**Regras anti-alucinação (RF.OPS.03):**
- Responder SOMENTE com conteúdo extraído dos trechos. Proibido inventar, generalizar ou adicionar informações externas.
- Se o contexto não contiver a resposta: mensagem padrão "Não encontrei essa informação nos playbooks..."
- Qualquer procedimento citado deve estar explícito no contexto.

**Status:** ✅ Implementado e validado

---

### 2.2 Public Sales Bot (no Site)

| Atributo | Valor |
|----------|-------|
| **Contexto** | Catálogo de Serviços + Posts Públicos |
| **Usuário** | Visitante do site |
| **Função** | Responder "O que a NESS faz?" e **capturar Lead** |
| **Rota** | `/api/chat/public` (a construir) |
| **UI** | Widget ou página no site público (`app/(site)`) |
| **Auth** | Sem auth (anon) |

**Implementação necessária:**
- RAG sobre `document_embeddings` com `filter_source_type` permitindo `'post'` e conteúdo de serviços (evoluir schema se necessário: `source_type = 'service'` ou incluir serviços nos chunks)
- System prompt: responder sobre soluções ness.; convidar a deixar contato
- **Captura de Lead:** ao final da conversa ou em CTA, redirecionar para formulário de contato ou registrar lead (nome, email) via `inbound_leads`
- **Rate limit** e moderação para abuso (anon)

**Status:** ⏳ Planejado (RF.GRO / Chatbot RAG público)

---

## 3. Resumo de dependências

| Componente | Depende de |
|------------|------------|
| pgvector | Supabase |
| document_embeddings | pgvector |
| Internal Knowledge Bot | document_embeddings (playbook), Vercel AI SDK, OpenAI API |
| Public Sales Bot | document_embeddings (post + service), Vercel AI SDK, OpenAI API, inbound_leads |

**Variáveis de ambiente:** `OPENAI_API_KEY` (embeddings + chat)

---

## 4. Evolução do schema para Public Sales Bot

Para o Public Sales Bot responder sobre o catálogo de serviços:

- **Opção A:** Adicionar `source_type = 'service'` em `document_embeddings`; embedar `name`, `marketing_pitch`, `marketing_title`, `marketing_body` dos serviços ativos
- **Opção B:** Incluir resumo dos serviços nos chunks de posts ou em conteúdo estático
- **Recomendação:** Opção A — melhor recall para perguntas como "O que a NESS faz?", "Quais serviços oferecem?"

Atualizar `document_embeddings_source_check` e função `match_document_embeddings` para aceitar `filter_source_type` múltiplos ou `'all'` (post + service).
