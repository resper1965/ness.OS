'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export type AuthState = { error?: string };

export async function signIn(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email?.trim() || !password?.trim()) {
    return { error: 'E-mail e senha são obrigatórios.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });

  if (error) {
    return { error: error.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : error.message };
  }

  redirect('/app');
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
