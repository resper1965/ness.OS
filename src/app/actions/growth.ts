'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { leadSchema, postSchema } from '@/lib/validators/schemas';

const VALID_STATUSES = ['new', 'qualified', 'proposal', 'won', 'lost'] as const;

export type LeadFormState = { success?: boolean; error?: string };
export type PostFormState = { success?: boolean; error?: string };

// === LEADS ===

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

// === POSTS ===

export async function getPosts(limit = 10) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('public_posts')
    .select('id, slug, title, seo_description, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getPostBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('public_posts')
    .select('id, slug, title, content_markdown, seo_description, published_at, author_id')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
  if (error || !data) return null;
  return data;
}

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
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? 'Dados inválidos' };

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
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? 'Dados inválidos' };

  const supabase = await createClient();
  const payload: Record<string, unknown> = {
    title: parsed.data.title,
    slug: parsed.data.slug,
    seo_description: parsed.data.seo_description ?? null,
    content_markdown: parsed.data.content_markdown ?? null,
    is_published: parsed.data.is_published ?? false,
  };
  if (parsed.data.is_published) payload.published_at = new Date().toISOString();

  const { error } = await supabase.from('public_posts').update(payload).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/app/growth/posts');
  revalidatePath(`/app/growth/posts/${id}`);
  revalidatePath('/blog');
  return { success: true };
}

// === SERVICES ===

/** Serviços ativos para home e listagens (id, name, slug, marketing_pitch) */
export async function getActiveServices() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('services_catalog')
    .select('id, name, slug, marketing_pitch')
    .eq('is_active', true)
    .order('name');
  return data ?? [];
}

export async function getServiceBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('services_catalog')
    .select('id, name, slug, marketing_title, marketing_body, marketing_pitch, marketing_features, cover_image_url, content_json')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();
  if (error || !data) return null;
  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    marketing_title: data.marketing_title ?? null,
    marketing_body: data.marketing_body ?? null,
    marketing_pitch: data.marketing_pitch,
    marketing_features: data.marketing_features,
    cover_image_url: data.cover_image_url,
    content_json: data.content_json ?? null,
  };
}

export async function createService(
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const name = (formData.get('name') as string)?.trim();
  const slug = (formData.get('slug') as string)?.trim().toLowerCase().replace(/\s+/g, '-');
  const playbookId = (formData.get('playbook_id') as string) || null;
  const pitch = (formData.get('marketing_pitch') as string) || null;
  const marketingTitle = (formData.get('marketing_title') as string)?.trim() || null;
  const marketingBody = (formData.get('marketing_body') as string)?.trim() || null;
  if (!name || !slug) return { error: 'Nome e slug obrigatórios.' };
  if (!playbookId) return { error: 'Serviço precisa estar vinculado a um playbook.' };

  const supabase = await createClient();
  const { error } = await supabase.from('services_catalog').insert({
    name, slug, playbook_id: playbookId, marketing_pitch: pitch,
    marketing_title: marketingTitle, marketing_body: marketingBody, is_active: false,
  });
  if (error) return { error: error.message };
  revalidatePath('/app/growth/services');
  revalidatePath('/solucoes');
  return { success: true };
}

export async function updateService(
  id: string,
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const name = (formData.get('name') as string)?.trim();
  const slug = (formData.get('slug') as string)?.trim().toLowerCase().replace(/\s+/g, '-');
  const playbookId = (formData.get('playbook_id') as string) || null;
  const pitch = (formData.get('marketing_pitch') as string) || null;
  const marketingTitle = (formData.get('marketing_title') as string)?.trim() || null;
  const marketingBody = (formData.get('marketing_body') as string)?.trim() || null;
  const isActive = formData.get('is_active') === 'on';
  if (!name || !slug) return { error: 'Nome e slug obrigatórios.' };
  if (!playbookId) return { error: 'Serviço precisa estar vinculado a um playbook.' };

  const supabase = await createClient();
  const { error } = await supabase.from('services_catalog').update({
    name, slug, playbook_id: playbookId, marketing_pitch: pitch,
    marketing_title: marketingTitle, marketing_body: marketingBody, is_active: isActive,
  }).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/app/growth/services');
  revalidatePath('/solucoes');
  return { success: true };
}

// === SUCCESS CASES ===

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
    title, slug, raw_data: rawData, summary, is_published: isPublished,
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
