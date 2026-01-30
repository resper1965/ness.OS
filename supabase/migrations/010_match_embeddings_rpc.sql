-- Função RPC para busca por similaridade (RAG)
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
  WHERE de.source_type = filter_source_type
  ORDER BY de.embedding <=> query_embedding
  LIMIT match_count;
$$;
