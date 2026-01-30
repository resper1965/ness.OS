'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createContract(
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const clientId = formData.get('client_id') as string;
  const mrr = parseFloat((formData.get('mrr') as string) || '0');
  const startDate = (formData.get('start_date') as string) || null;
  const endDate = (formData.get('end_date') as string) || null;

  if (!clientId) return { error: 'Cliente obrigatório.' };

  const supabase = await createClient();
  const { error } = await supabase.from('contracts').insert({
    client_id: clientId,
    mrr,
    start_date: startDate || null,
    end_date: endDate || null,
  });
  if (error) return { error: error.message };
  revalidatePath('/app/fin/contratos');
  revalidatePath('/app/fin/rentabilidade');
  return { success: true };
}
