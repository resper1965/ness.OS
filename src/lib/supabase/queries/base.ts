import { createClient } from '@/lib/supabase/server';

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

/**
 * Executa uma função com o client Supabase. Centraliza criação do client e tratamento de erro.
 * Uso: withSupabase(sb => sb.from('tabela').select('*'))
 */
export async function withSupabase<T>(
  fn: (supabase: SupabaseClient) => Promise<T>
): Promise<{ data: T | null; error: string | null }> {
  try {
    const supabase = await createClient();
    const result = await fn(supabase);
    return { data: result, error: null };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erro desconhecido';
    return { data: null, error: msg };
  }
}
