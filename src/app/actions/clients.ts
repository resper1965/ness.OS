'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addClient(
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const name = (formData.get('name') as string)?.trim();
  if (!name) return { error: 'Nome obrigatório.' };

  const supabase = await createClient();
  const { error } = await supabase.from('clients').insert({ name });
  if (error) return { error: error.message };
  revalidatePath('/app/fin/contratos');
  return { success: true };
}
