'use server';

import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const leadSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  company: z.string().optional(),
  message: z.string().optional(),
  origin_url: z.string().optional(),
});

export type LeadFormState = {
  success?: boolean;
  error?: string;
};

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

  if (error) {
    return { error: 'Erro ao enviar. Tente novamente.' };
  }

  return { success: true };
}
