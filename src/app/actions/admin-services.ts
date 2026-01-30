'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createService(_prev: unknown, formData: FormData): Promise<{ success?: boolean; error?: string }> {
  const name = (formData.get('name') as string)?.trim();
  const slug = (formData.get('slug') as string)?.trim().toLowerCase().replace(/\s+/g, '-');
  const playbookId = (formData.get('playbook_id') as string) || null;
  const pitch = (formData.get('marketing_pitch') as string) || null;
  if (!name || !slug) return { error: 'Nome e slug obrigatórios.' };
  if (!playbookId) return { error: 'Serviço precisa estar vinculado a um playbook.' };

  const supabase = await createClient();
  const { error } = await supabase.from('services_catalog').insert({
    name, slug, playbook_id: playbookId, marketing_pitch: pitch, is_active: false,
  });
  if (error) return { error: error.message };
  revalidatePath('/app/growth/services');
  revalidatePath('/solucoes');
  return { success: true };
}

export async function updateService(id: string, _prev: unknown, formData: FormData): Promise<{ success?: boolean; error?: string }> {
  const name = (formData.get('name') as string)?.trim();
  const slug = (formData.get('slug') as string)?.trim().toLowerCase().replace(/\s+/g, '-');
  const playbookId = (formData.get('playbook_id') as string) || null;
  const pitch = (formData.get('marketing_pitch') as string) || null;
  const isActive = formData.get('is_active') === 'on';
  if (!name || !slug) return { error: 'Nome e slug obrigatórios.' };
  if (!playbookId) return { error: 'Serviço precisa estar vinculado a um playbook.' };

  const supabase = await createClient();
  const { error } = await supabase.from('services_catalog').update({
    name, slug, playbook_id: playbookId, marketing_pitch: pitch, is_active: isActive,
  }).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/app/growth/services');
  revalidatePath('/solucoes');
  return { success: true };
}
