'use server';

import { generateEmbeddings } from '@/lib/ai/embedding';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createPlaybook(
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const content = formData.get('content_markdown') as string;

  if (!title?.trim() || !slug?.trim()) return { error: 'Título e slug obrigatórios.' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Não autenticado.' };

  const { data: playbook, error } = await supabase.from('playbooks').insert({
    title: title.trim(),
    slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
    content_markdown: content || null,
    created_by: user.id,
  }).select('id').single();

  if (error) return { error: error.message };
  if (playbook?.id && content?.trim()) {
    try {
      await generateEmbeddings(content, 'playbook', playbook.id);
    } catch (e) {
      console.error('Embedding playbook failed:', e);
    }
  }
  revalidatePath('/app/ops/playbooks');
  return { success: true };
}

export async function updatePlaybook(
  id: string,
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const content = formData.get('content_markdown') as string;

  if (!title?.trim() || !slug?.trim()) return { error: 'Título e slug obrigatórios.' };

  const supabase = await createClient();
  const { error } = await supabase
    .from('playbooks')
    .update({
      title: title.trim(),
      slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
      content_markdown: content || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) return { error: error.message };
  if (content?.trim()) {
    try {
      await generateEmbeddings(content, 'playbook', id);
    } catch (e) {
      console.error('Embedding playbook failed:', e);
    }
  }
  revalidatePath('/app/ops/playbooks');
  revalidatePath(`/app/ops/playbooks/${id}`);
  return { success: true };
}
