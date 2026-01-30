-- pgvector + document_embeddings para RAG e Agentes IA
-- Modelo padrão: OpenAI text-embedding-ada-002 (1536 dims)

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS public.document_embeddings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type text NOT NULL,       -- 'playbook' | 'post'
  source_id uuid NOT NULL,
  content_chunk text NOT NULL,
  embedding vector(1536),          -- ada-002; ajustar se outro modelo
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT document_embeddings_source_check
    CHECK (source_type IN ('playbook', 'post'))
);

-- Índice para busca por similaridade (IVFFlat)
-- lists = rows/1000 é heurística; aumentar se tabela crescer muito
CREATE INDEX IF NOT EXISTS document_embeddings_embedding_idx
  ON public.document_embeddings
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 1);  -- Aumentar após popular (ex: lists = sqrt(rows))

-- RLS: apenas autenticados podem ler (agentes internos)
ALTER TABLE public.document_embeddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "document_embeddings_select_authenticated"
  ON public.document_embeddings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "document_embeddings_insert_authenticated"
  ON public.document_embeddings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "document_embeddings_delete_authenticated"
  ON public.document_embeddings FOR DELETE
  TO authenticated
  USING (true);

COMMENT ON TABLE public.document_embeddings IS
  'Vetores para RAG: playbooks (ness.OPS) e posts (ness.GROWTH). Usado por Internal Knowledge Bot e Agente de Propostas.';
