'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { leadSchema } from '@/lib/validators/schemas';

const VALID_STATUSES = ['new', 'qualified', 'proposal', 'won', 'lost'] as const;

export type LeadFormState = { success?: boolean; error?: string };

/** Submit lead (formulário público de contato) */
export async function submitLead(
  _prevState: LeadFormState,
  formData: FormData
): Promise<LeadFormState> {
  const parsed = leadSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    company: formData.get('company') || undefined,
    message: formData.get('message') || undefined,
    origin_url: formData.get('origin_url') || undefined,
  });

  if (!parsed.success) {
    const firstError = parsed.error.flatten().fieldErrors;
    const msg = Object.values(firstError).flat().join(', ') || 'Dados inválidos';
    return { error: msg };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('inbound_leads').insert({
    name: parsed.data.name,
    email: parsed.data.email,
    company: parsed.data.company ?? null,
    message: parsed.data.message ?? null,
    origin_url: parsed.data.origin_url ?? null,
    status: 'new',
  });

  if (error) return { error: 'Erro ao enviar. Tente novamente.' };
  return { success: true };
}

/** Update lead status (Kanban admin) */
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
