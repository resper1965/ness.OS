import { embed, embedMany } from 'ai';
import { createClient } from '@/lib/supabase/server';
import { openai } from '@ai-sdk/openai';

// text-embedding-3-small = 1536 dims (compatível com document_embeddings)

function chunkBySentences(input: string, maxChunkSize = 500): string[] {
  const trimmed = input.trim();
  if (!trimmed) return [];
  const sentences = trimmed
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const chunks: string[] = [];
  let current = '';
  for (const s of sentences) {
    if (current.length + s.length + 1 > maxChunkSize && current) {
      chunks.push(current);
      current = s;
    } else {
      current = current ? `${current} ${s}` : s;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

export type EmbeddingSourceType = 'playbook' | 'post' | 'service';

export async function generateEmbeddings(
  value: string,
  sourceType: EmbeddingSourceType,
  sourceId: string
): Promise<void> {
  const chunks = chunkBySentences(value);
  if (chunks.length === 0) return;

  const { embeddings } = await embedMany({
    model: openai.embedding('text-embedding-3-small'),
    values: chunks,
  });

  const supabase = await createClient();
  const rows = chunks.map((content, i) => ({
    source_type: sourceType,
    source_id: sourceId,
    content_chunk: content,
    embedding: `[${embeddings[i].join(',')}]`,
    metadata: {},
  }));

  await supabase.from('document_embeddings').delete().eq('source_type', sourceType).eq('source_id', sourceId);

  if (rows.length > 0) {
    await supabase.from('document_embeddings').insert(rows);
  }
}

export async function findRelevantPlaybookContent(
  query: string,
  limit = 4
): Promise<Array<{ content_chunk: string; similarity: number }>> {
  const { embedding } = await embed({
    model: openai.embedding('text-embedding-3-small'),
    value: query.replace(/\n/g, ' '),
  });

  const supabase = await createClient();
  const embeddingStr = `[${embedding.join(',')}]`;

  const { data, error } = await supabase.rpc('match_document_embeddings', {
    query_embedding: embeddingStr,
    match_count: limit,
    filter_source_type: 'playbook',
  });

  if (error) {
    console.error('findRelevantPlaybookContent error:', error);
    return [];
  }

  return (data ?? []).map((r: { content_chunk: string; similarity: number }) => ({
    content_chunk: r.content_chunk,
    similarity: r.similarity,
  }));
}

export async function findRelevantPublicContent(
  query: string,
  limit = 4
): Promise<Array<{ content_chunk: string; similarity: number }>> {
  const { embedding } = await embed({
    model: openai.embedding('text-embedding-3-small'),
    value: query.replace(/\n/g, ' '),
  });

  const supabase = await createClient();
  const embeddingStr = `[${embedding.join(',')}]`;

  const { data, error } = await supabase.rpc('match_document_embeddings', {
    query_embedding: embeddingStr,
    match_count: limit,
    filter_source_type: 'public',
  });

  if (error) {
    console.error('findRelevantPublicContent error:', error);
    return [];
  }

  return (data ?? []).map((r: { content_chunk: string; similarity: number }) => ({
    content_chunk: r.content_chunk,
    similarity: r.similarity,
  }));
}
