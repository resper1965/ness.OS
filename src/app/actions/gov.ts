'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getPolicies() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('policies')
    .select(`
      id,
      title,
      slug,
      created_at,
      policy_versions(id, version, content_text, created_at)
    `)
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function getPolicyById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('policies')
    .select(`
      id,
      title,
      slug,
      policy_versions(id, version, content_text, effective_at, created_at)
    `)
    .eq('id', id)
    .single();
  return data;
}

export async function createPolicyFromForm(_prev: unknown, formData: FormData) {
  return createPolicyImpl(formData);
}

export async function updatePolicyFromForm(
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const id = formData.get('id') as string;
  if (!id) return { error: 'ID ausente.' };
  return updatePolicy(id, formData);
}

async function createPolicyImpl(formData: FormData) {
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const contentText = formData.get('content_text') as string;

  if (!title?.trim()) return { error: 'Título obrigatório.' };

  const supabase = await createClient();
  const finalSlug = (slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')).trim() || undefined;

  const { data: policy, error: errPolicy } = await supabase
    .from('policies')
    .insert({ title: title.trim(), slug: finalSlug || null })
    .select('id')
    .single();

  if (errPolicy) return { error: errPolicy.message };

  const { error: errVer } = await supabase
    .from('policy_versions')
    .insert({
      policy_id: policy.id,
      content_text: contentText?.trim() || '',
      version: 1,
    });

  if (errVer) return { error: errVer.message };

  revalidatePath('/app/gov/politicas');
  revalidatePath('/app/gov/aceites');
  return { success: true, id: policy.id };
}

export async function updatePolicy(id: string, formData: FormData) {
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const contentText = formData.get('content_text') as string;

  if (!title?.trim()) return { error: 'Título obrigatório.' };

  const supabase = await createClient();
  const finalSlug = (slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')).trim() || null;

  const { error: errPolicy } = await supabase
    .from('policies')
    .update({ title: title.trim(), slug: finalSlug })
    .eq('id', id);

  if (errPolicy) return { error: errPolicy.message };

  const { data: latest } = await supabase
    .from('policy_versions')
    .select('version')
    .eq('policy_id', id)
    .order('version', { ascending: false })
    .limit(1)
    .single();

  const nextVersion = (latest?.version ?? 0) + 1;

  const { error: errVer } = await supabase
    .from('policy_versions')
    .insert({
      policy_id: id,
      content_text: contentText?.trim() || '',
      version: nextVersion,
    });

  if (errVer) return { error: errVer.message };

  revalidatePath('/app/gov/politicas');
  revalidatePath('/app/gov/aceites');
  return { success: true };
}

export async function getPendingAcceptances() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single();
  if (!profile) return [];

  const { data: accepted } = await supabase
    .from('policy_acceptances')
    .select('policy_version_id')
    .eq('profile_id', profile.id);

  const acceptedIds = new Set((accepted ?? []).map((a) => a.policy_version_id));

  const { data: versions } = await supabase
    .from('policy_versions')
    .select(`id, version, content_text, created_at, policies(id, title, slug)`)
    .order('created_at', { ascending: false });

  return (versions ?? []).filter((v) => !acceptedIds.has(v.id));
}

export async function acceptPolicyVersion(policyVersionId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Não autenticado.' };

  const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single();
  if (!profile) return { error: 'Perfil não encontrado.' };

  const { error } = await supabase
    .from('policy_acceptances')
    .insert({ policy_version_id: policyVersionId, profile_id: profile.id });

  if (error) return { error: error.message };

  revalidatePath('/app/gov/aceites');
  return { success: true };
}
