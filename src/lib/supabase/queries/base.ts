import { createClient } from '@/lib/supabase/server';

export type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

/** Retorna o client Supabase do server. Use em actions que fazem várias operações ou precisam de auth.getUser(). */
export async function getServerClient(): Promise<SupabaseClient> {
  return createClient();
}

/**
 * Executa uma função com o client Supabase. Centraliza criação do client e tratamento de erro.
 * Uso: withSupabase(sb => { const { data, error } = await sb.from('tabela').select(); if (error) throw new Error(error.message); return data; })
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
