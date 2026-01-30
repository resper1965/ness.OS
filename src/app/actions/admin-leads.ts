'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const VALID_STATUSES = ['new', 'contacted', 'qualified', 'discarded'] as const;

export async function updateLeadStatus(id: string, status: string) {
  if (!VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
    return { error: 'Status inválido.' };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('inbound_leads')
    .update({ status })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/app/growth/leads');
  return { success: true };
}
