'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createSuccessCase(
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const title = (formData.get('title') as string)?.trim();
  const slug = (formData.get('slug') as string)?.trim().toLowerCase().replace(/\s+/g, '-');
  const rawData = (formData.get('raw_data') as string)?.trim() || null;
  const summary = (formData.get('summary') as string)?.trim() || null;
  const isPublished = formData.get('is_published') === 'on';
  if (!title || !slug) return { error: 'Título e slug obrigatórios.' };

  const supabase = await createClient();
  const { error } = await supabase.from('success_cases').insert({
    title,
    slug,
    raw_data: rawData,
    summary,
    is_published: isPublished,
  });
  if (error) return { error: error.message };
  revalidatePath('/app/growth/casos');
  revalidatePath('/casos');
  return { success: true };
}

export async function updateSuccessCase(
  id: string,
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const title = (formData.get('title') as string)?.trim();
  const slug = (formData.get('slug') as string)?.trim().toLowerCase().replace(/\s+/g, '-');
  const rawData = (formData.get('raw_data') as string)?.trim() || null;
  const summary = (formData.get('summary') as string)?.trim() || null;
  const contentHtml = (formData.get('content_html') as string)?.trim() || null;
  const isPublished = formData.get('is_published') === 'on';
  if (!title || !slug) return { error: 'Título e slug obrigatórios.' };

  const supabase = await createClient();
  const { error } = await supabase
    .from('success_cases')
    .update({ title, slug, raw_data: rawData, summary, content_html: contentHtml, is_published: isPublished, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/app/growth/casos');
  revalidatePath(`/app/growth/casos/${id}`);
  revalidatePath('/casos');
  return { success: true };
}
