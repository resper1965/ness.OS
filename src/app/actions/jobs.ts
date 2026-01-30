'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createJob(_prev: unknown, formData: FormData): Promise<{ success?: boolean; error?: string }> {
  const title = (formData.get('title') as string)?.trim();
  const slug = (formData.get('slug') as string)?.trim().toLowerCase().replace(/\s+/g, '-');
  const department = (formData.get('department') as string) || null;
  const description = (formData.get('description_html') as string) || null;
  if (!title || !slug) return { error: 'Título e slug obrigatórios.' };

  const supabase = await createClient();
  const { error } = await supabase.from('public_jobs').insert({
    title, slug, department, description_html: description, is_open: true,
  });
  if (error) return { error: error.message };
  revalidatePath('/app/people/vagas');
  revalidatePath('/carreiras');
  return { success: true };
}

export async function updateJob(id: string, _prev: unknown, formData: FormData): Promise<{ success?: boolean; error?: string }> {
  const title = (formData.get('title') as string)?.trim();
  const slug = (formData.get('slug') as string)?.trim().toLowerCase().replace(/\s+/g, '-');
  const department = (formData.get('department') as string) || null;
  const description = (formData.get('description_html') as string) || null;
  const isOpen = formData.get('is_open') === 'on';
  if (!title || !slug) return { error: 'Título e slug obrigatórios.' };

  const supabase = await createClient();
  const { error } = await supabase.from('public_jobs').update({
    title, slug, department, description_html: description, is_open: isOpen, updated_at: new Date().toISOString(),
  }).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/app/people/vagas');
  revalidatePath('/carreiras');
  return { success: true };
}
