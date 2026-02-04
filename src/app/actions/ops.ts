'use server';

import { generateEmbeddings } from '@/lib/ai/embedding';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const BUCKET = 'os-assets';
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

// === PLAYBOOKS ===

export async function createPlaybook(
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const content = formData.get('content_markdown') as string;
  const tagsRaw = (formData.get('tags') as string)?.trim();
  const lastReviewed = (formData.get('last_reviewed_at') as string)?.trim() || null;
  const tags = tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : [];

  if (!title?.trim() || !slug?.trim()) return { error: 'Título e slug obrigatórios.' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Não autenticado.' };

  const { data: playbook, error } = await supabase.from('playbooks').insert({
    title: title.trim(),
    slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
    content_markdown: content || null,
    tags: tags.length ? tags : null,
    last_reviewed_at: lastReviewed,
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

/** Wrapper para useFormState: lê id do formData e chama updatePlaybook. */
export async function updatePlaybookFromForm(
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const id = formData.get('_id') as string;
  if (!id) return { error: 'ID do playbook não encontrado.' };
  return updatePlaybook(id, _prev, formData);
}

export async function updatePlaybook(
  id: string,
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const content = formData.get('content_markdown') as string;
  const tagsRaw = (formData.get('tags') as string)?.trim();
  const lastReviewed = (formData.get('last_reviewed_at') as string)?.trim() || null;
  const tags = tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : [];

  if (!title?.trim() || !slug?.trim()) return { error: 'Título e slug obrigatórios.' };

  const supabase = await createClient();
  const { error } = await supabase
    .from('playbooks')
    .update({
      title: title.trim(),
      slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
      content_markdown: content || null,
      tags: tags.length ? tags : null,
      last_reviewed_at: lastReviewed,
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

// === ASSETS ===

export async function uploadAsset(
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string; path?: string }> {
  const file = formData.get('file') as File | null;
  const folder = (formData.get('folder') as string) || '';

  if (!file || file.size === 0) return { error: 'Selecione um arquivo.' };
  if (file.size > MAX_SIZE) return { error: 'Arquivo muito grande (máx. 10MB).' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Não autenticado.' };

  const ext = file.name.split('.').pop() || 'bin';
  const name = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const path = folder ? `${folder}/${name}` : name;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) return { error: error.message };
  return { success: true, path };
}

export async function listAssets(folder = ''): Promise<{ name: string; path: string }[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.storage.from(BUCKET).list(folder || undefined, { limit: 100 });

    if (error) return [];

    const items = (data ?? []).filter((f) => f.name);
    return items.map((f) => ({
      name: f.name as string,
      path: folder ? `${folder}/${f.name}` : (f.name as string),
    }));
  } catch {
    return [];
  }
}

// === MÉTRICAS ===

export async function saveMetric(
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const contractId = formData.get('contract_id') as string;
  const month = formData.get('month') as string;
  const hours = parseFloat((formData.get('hours_worked') as string) || '0');
  const hourlyRate = parseFloat((formData.get('hourly_rate') as string) || '0');
  const cost = parseFloat((formData.get('cost_input') as string) || '0');
  const sla = formData.get('sla_achieved') === 'on';

  if (!contractId || !month) return { error: 'Contrato e mês obrigatórios.' };

  const supabase = await createClient();
  const monthDate = `${month}-01`;
  const { error } = await supabase.from('performance_metrics').upsert(
    { contract_id: contractId, month: monthDate, hours_worked: hours, hourly_rate: hourlyRate, cost_input: cost, sla_achieved: sla },
    { onConflict: 'contract_id,month' }
  );

  if (error) return { error: error.message };
  revalidatePath('/app/ops/metricas');
  revalidatePath('/app/fin/rentabilidade');
  return { success: true };
}
