import { createClient } from '@supabase/supabase-js';

/**
 * Cliente Supabase com service role — apenas para uso em API routes/cron (server-side).
 * Bypassa RLS. NUNCA expor ao client ou usar em Server Components com dados do usuário.
 * Env: SUPABASE_SERVICE_ROLE_KEY (e NEXT_PUBLIC_SUPABASE_URL).
 */
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY e NEXT_PUBLIC_SUPABASE_URL são obrigatórios para o cliente admin.');
  }
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
