-- RF.GRO: Public Sales Bot - source_type 'service' para RAG no site

ALTER TABLE public.document_embeddings
  DROP CONSTRAINT IF EXISTS document_embeddings_source_check;

ALTER TABLE public.document_embeddings
  ADD CONSTRAINT document_embeddings_source_check
  CHECK (source_type IN ('playbook', 'post', 'service'));

-- RLS: anon pode ler apenas post e service (para Chatbot público)
CREATE POLICY "document_embeddings_select_anon_public"
  ON public.document_embeddings FOR SELECT
  TO anon
  USING (source_type IN ('post', 'service'));

-- Atualizar RPC para aceitar 'public' = post + service
CREATE OR REPLACE FUNCTION match_document_embeddings(
  query_embedding vector(1536),
  match_count int DEFAULT 4,
  filter_source_type text DEFAULT 'playbook'
)
RETURNS TABLE (content_chunk text, similarity float)
LANGUAGE sql
STABLE
AS $$
  SELECT
    de.content_chunk,
    1 - (de.embedding <=> query_embedding)::float as similarity
  FROM document_embeddings de
  WHERE
    CASE
      WHEN filter_source_type = 'public' THEN de.source_type IN ('post', 'service')
      ELSE de.source_type = filter_source_type
    END
  ORDER BY de.embedding <=> query_embedding
  LIMIT match_count;
$$;
