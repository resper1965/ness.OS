'use server';

import { getServerClient } from '@/lib/supabase/queries/base';
import { redirect } from 'next/navigation';

export type AuthState = { error?: string; redirect?: string };

export async function signIn(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email?.trim() || !password?.trim()) {
    return { error: 'E-mail e senha são obrigatórios.' };
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
  if (!url || !key) {
    return { error: 'Configuração incompleta. Verifique as variáveis de ambiente no Vercel (NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY ou NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY).' };
  }

  try {
    const supabase = await getServerClient();
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });

    if (error) {
      return { error: error.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : error.message };
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes('fetch') || msg.includes('Failed to fetch') || msg.includes('ECONNREFUSED') || msg.includes('ENOTFOUND')) {
      return { error: 'Não foi possível conectar ao servidor. Verifique: (1) variáveis de ambiente no Vercel, (2) se o projeto Supabase está ativo (não pausado).' };
    }
    return { error: msg };
  }

  const redirectTo = (formData.get('redirect') as string)?.trim() || '/app';
  return { redirect: redirectTo.startsWith('/') ? redirectTo : '/app' };
}

export async function signOut() {
  const supabase = await getServerClient();
  await supabase.auth.signOut();
  redirect('/login');
}
