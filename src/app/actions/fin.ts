'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// === CLIENTS ===

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

// === CONTRACTS ===

export async function createContract(
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const clientId = formData.get('client_id') as string;
  const mrr = parseFloat((formData.get('mrr') as string) || '0');
  const startDate = (formData.get('start_date') as string) || null;
  const endDate = (formData.get('end_date') as string) || null;
  const renewalDate = (formData.get('renewal_date') as string) || null;
  const adjustmentIndex = (formData.get('adjustment_index') as string) || null;

  if (!clientId) return { error: 'Cliente obrigatório.' };

  const supabase = await createClient();
  const { error } = await supabase.from('contracts').insert({
    client_id: clientId,
    mrr,
    start_date: startDate || null,
    end_date: endDate || null,
    renewal_date: renewalDate || null,
    adjustment_index: adjustmentIndex || null,
  });
  if (error) return { error: error.message };
  revalidatePath('/app/fin/contratos');
  revalidatePath('/app/fin/rentabilidade');
  return { success: true };
}
