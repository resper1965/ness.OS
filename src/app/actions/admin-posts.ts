'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { postSchema } from '@/lib/validators/schemas';

export type PostFormState = { success?: boolean; error?: string };

export async function createPost(
  _prevState: unknown,
  formData: FormData
): Promise<PostFormState> {
  const parsed = postSchema.safeParse({
    title: formData.get('title'),
    slug: formData.get('slug'),
    seo_description: formData.get('seo_description') || undefined,
    content_markdown: formData.get('content_markdown') || undefined,
    is_published: formData.get('is_published') === 'on',
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Dados inválidos' };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Não autenticado.' };

  const { error } = await supabase.from('public_posts').insert({
    title: parsed.data.title,
    slug: parsed.data.slug,
    seo_description: parsed.data.seo_description ?? null,
    content_markdown: parsed.data.content_markdown ?? null,
    is_published: parsed.data.is_published ?? false,
    published_at: parsed.data.is_published ? new Date().toISOString() : null,
    author_id: user.id,
  });

  if (error) return { error: error.message };
  revalidatePath('/app/growth/posts');
  revalidatePath('/blog');
  return { success: true };
}

export async function updatePost(
  id: string,
  _prevState: unknown,
  formData: FormData
): Promise<PostFormState> {
  const parsed = postSchema.safeParse({
    title: formData.get('title'),
    slug: formData.get('slug'),
    seo_description: formData.get('seo_description') || undefined,
    content_markdown: formData.get('content_markdown') || undefined,
    is_published: formData.get('is_published') === 'on',
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Dados inválidos' };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Não autenticado.' };

  const payload: Record<string, unknown> = {
    title: parsed.data.title,
    slug: parsed.data.slug,
    seo_description: parsed.data.seo_description ?? null,
    content_markdown: parsed.data.content_markdown ?? null,
    is_published: parsed.data.is_published ?? false,
  };
  if (parsed.data.is_published) {
    payload.published_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('public_posts')
    .update(payload)
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/app/growth/posts');
  revalidatePath(`/app/growth/posts/${id}`);
  revalidatePath('/blog');
  return { success: true };
}
