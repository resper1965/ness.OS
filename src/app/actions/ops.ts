'use server';

import { generateEmbeddings } from '@/lib/ai/embedding';
import { getServerClient, withSupabase } from '@/lib/supabase/queries/base';
import { revalidatePath } from 'next/cache';
import { emitModuleEvent } from '@/lib/events/emit';
import { processModuleEvent } from '@/lib/events/process';

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
  const estDuration = (formData.get('estimated_duration_minutes') as string)?.trim();
  const estValue = (formData.get('estimated_value') as string)?.trim();

  if (!title?.trim() || !slug?.trim()) return { error: 'Título e slug obrigatórios.' };

  const supabase = await getServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Não autenticado.' };

  const payload: Record<string, unknown> = {
    title: title.trim(),
    slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
    content_markdown: content || null,
    tags: tags.length ? tags : null,
    last_reviewed_at: lastReviewed,
    created_by: user.id,
  };
  if (estDuration !== undefined && estDuration !== '') payload.estimated_duration_minutes = parseFloat(estDuration);
  if (estValue !== undefined && estValue !== '') payload.estimated_value = parseFloat(estValue);

  const { data: playbook, error } = await supabase.from('playbooks').insert(payload).select('id').single();

  if (error) return { error: error.message };
  if (playbook?.id && content?.trim()) {
    try {
      await generateEmbeddings(content, 'playbook', playbook.id);
    } catch (e) {
      console.error('Embedding playbook failed:', e);
    }
  }
  await emitModuleEvent('ops', 'playbook.created', playbook?.id ?? null, { title: title.trim(), slug: slug.trim().toLowerCase().replace(/\s+/g, '-') });
  await processModuleEvent('ops', 'playbook.created', { title: title.trim(), slug: slug.trim().toLowerCase().replace(/\s+/g, '-') });
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
  const estDuration = (formData.get('estimated_duration_minutes') as string)?.trim();
  const estValue = (formData.get('estimated_value') as string)?.trim();

  if (!title?.trim() || !slug?.trim()) return { error: 'Título e slug obrigatórios.' };

  const supabase = await getServerClient();
  const updatePayload: Record<string, unknown> = {
    title: title.trim(),
    slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
    content_markdown: content || null,
    tags: tags.length ? tags : null,
    last_reviewed_at: lastReviewed,
    updated_at: new Date().toISOString(),
  };
  if (estDuration !== undefined && estDuration !== '') updatePayload.estimated_duration_minutes = parseFloat(estDuration);
  else updatePayload.estimated_duration_minutes = null;
  if (estValue !== undefined && estValue !== '') updatePayload.estimated_value = parseFloat(estValue);
  else updatePayload.estimated_value = null;

  const { error } = await supabase.from('playbooks').update(updatePayload).eq('id', id);

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

// === TASKS (composição Task → Playbook → Service) ===

export type TaskRow = {
  id: string;
  playbook_id: string;
  title: string;
  slug: string;
  sort_order: number;
  description: string | null;
  estimated_duration_minutes: number | null;
  estimated_value: number | null;
  created_at: string;
  updated_at: string;
};

export async function getTasksByPlaybook(playbookId: string): Promise<TaskRow[]> {
  const supabase = await getServerClient();
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('playbook_id', playbookId)
    .order('sort_order', { ascending: true });

  if (error) return [];
  return (data ?? []) as TaskRow[];
}

export async function getTask(taskId: string): Promise<TaskRow | null> {
  const supabase = await getServerClient();
  const { data, error } = await supabase.from('tasks').select('*').eq('id', taskId).single();
  if (error || !data) return null;
  return data as TaskRow;
}

function parseMetric(v: string | null | undefined): number | null {
  if (v === undefined || v === null || v === '') return null;
  const n = parseFloat(v);
  return Number.isNaN(n) ? null : n;
}

export async function createTask(
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const playbookId = formData.get('playbook_id') as string;
  const title = (formData.get('title') as string)?.trim();
  const slugRaw = (formData.get('slug') as string)?.trim();
  const description = (formData.get('description') as string)?.trim() || null;
  const estDuration = parseMetric((formData.get('estimated_duration_minutes') as string)?.trim());
  const estValue = parseMetric((formData.get('estimated_value') as string)?.trim());

  if (!playbookId || !title) return { error: 'Playbook e título obrigatórios.' };
  if (estDuration == null && estValue == null) return { error: 'Informe ao menos uma métrica: duração (min) ou valor (R$).' };

  const slug = slugRaw || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const supabase = await getServerClient();
  const { data: maxOrder } = await supabase.from('tasks').select('sort_order').eq('playbook_id', playbookId).order('sort_order', { ascending: false }).limit(1).single();
  const sortOrder = (maxOrder?.sort_order ?? -1) + 1;

  const { error } = await supabase.from('tasks').insert({
    playbook_id: playbookId,
    title,
    slug,
    sort_order: sortOrder,
    description: description || null,
    estimated_duration_minutes: estDuration,
    estimated_value: estValue,
    updated_at: new Date().toISOString(),
  });

  if (error) return { error: error.message };
  revalidatePath(`/app/ops/playbooks/${playbookId}`);
  return { success: true };
}

export async function updateTask(
  taskId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const title = (formData.get('title') as string)?.trim();
  const slugRaw = (formData.get('slug') as string)?.trim();
  const description = (formData.get('description') as string)?.trim() || null;
  const estDuration = parseMetric((formData.get('estimated_duration_minutes') as string)?.trim());
  const estValue = parseMetric((formData.get('estimated_value') as string)?.trim());

  if (!title) return { error: 'Título obrigatório.' };
  if (estDuration == null && estValue == null) return { error: 'Informe ao menos uma métrica: duração (min) ou valor (R$).' };

  const slug = slugRaw || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const supabase = await getServerClient();
  const { data: task } = await supabase.from('tasks').select('playbook_id').eq('id', taskId).single();
  const { error } = await supabase
    .from('tasks')
    .update({
      title,
      slug,
      description: description || null,
      estimated_duration_minutes: estDuration,
      estimated_value: estValue,
      updated_at: new Date().toISOString(),
    })
    .eq('id', taskId);

  if (error) return { error: error.message };
  if (task?.playbook_id) revalidatePath(`/app/ops/playbooks/${task.playbook_id}`);
  return { success: true };
}

/** Wrapper para useFormState: lê _task_id do formData e chama updateTask. */
export async function updateTaskFromForm(
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const taskId = formData.get('_task_id') as string;
  if (!taskId) return { error: 'ID da task não encontrado.' };
  return updateTask(taskId, _prev, formData);
}

export async function deleteTask(taskId: string): Promise<{ success?: boolean; error?: string }> {
  const supabase = await getServerClient();
  const { data: task } = await supabase.from('tasks').select('playbook_id').eq('id', taskId).single();
  const { error } = await supabase.from('tasks').delete().eq('id', taskId);

  if (error) return { error: error.message };
  if (task?.playbook_id) revalidatePath(`/app/ops/playbooks/${task.playbook_id}`);
  return { success: true };
}

/** Wrapper para form action: lê task_id do formData e chama deleteTask. */
export async function deleteTaskFromForm(
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const taskId = formData.get('task_id') as string;
  if (!taskId) return { error: 'ID da task não encontrado.' };
  return deleteTask(taskId);
}

/** Troca sort_order da task com a anterior (sobe na lista). */
export async function moveTaskUp(taskId: string): Promise<{ success?: boolean; error?: string }> {
  const supabase = await getServerClient();
  const { data: task } = await supabase.from('tasks').select('playbook_id, sort_order').eq('id', taskId).single();
  if (!task) return { error: 'Task não encontrada.' };

  const { data: prev } = await supabase
    .from('tasks')
    .select('id, sort_order')
    .eq('playbook_id', task.playbook_id)
    .lt('sort_order', task.sort_order)
    .order('sort_order', { ascending: false })
    .limit(1)
    .single();

  if (!prev) return { success: true };

  const { error: e1 } = await supabase.from('tasks').update({ sort_order: prev.sort_order, updated_at: new Date().toISOString() }).eq('id', taskId);
  if (e1) return { error: e1.message };
  const { error: e2 } = await supabase.from('tasks').update({ sort_order: task.sort_order, updated_at: new Date().toISOString() }).eq('id', prev.id);
  if (e2) return { error: e2.message };

  revalidatePath(`/app/ops/playbooks/${task.playbook_id}`);
  return { success: true };
}

/** Troca sort_order da task com a próxima (desce na lista). */
export async function moveTaskDown(taskId: string): Promise<{ success?: boolean; error?: string }> {
  const supabase = await getServerClient();
  const { data: task } = await supabase.from('tasks').select('playbook_id, sort_order').eq('id', taskId).single();
  if (!task) return { error: 'Task não encontrada.' };

  const { data: next } = await supabase
    .from('tasks')
    .select('id, sort_order')
    .eq('playbook_id', task.playbook_id)
    .gt('sort_order', task.sort_order)
    .order('sort_order', { ascending: true })
    .limit(1)
    .single();

  if (!next) return { success: true };

  const { error: e1 } = await supabase.from('tasks').update({ sort_order: next.sort_order, updated_at: new Date().toISOString() }).eq('id', taskId);
  if (e1) return { error: e1.message };
  const { error: e2 } = await supabase.from('tasks').update({ sort_order: task.sort_order, updated_at: new Date().toISOString() }).eq('id', next.id);
  if (e2) return { error: e2.message };

  revalidatePath(`/app/ops/playbooks/${task.playbook_id}`);
  return { success: true };
}

/** Wrapper para form: lê task_id e chama moveTaskUp. */
export async function moveTaskUpFromForm(formData: FormData): Promise<{ success?: boolean; error?: string }> {
  const taskId = formData.get('task_id') as string;
  if (!taskId) return { error: 'ID da task não encontrado.' };
  return moveTaskUp(taskId);
}

/** Wrapper para form: lê task_id e chama moveTaskDown. */
export async function moveTaskDownFromForm(formData: FormData): Promise<{ success?: boolean; error?: string }> {
  const taskId = formData.get('task_id') as string;
  if (!taskId) return { error: 'ID da task não encontrado.' };
  return moveTaskDown(taskId);
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

  const supabase = await getServerClient();
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
    const supabase = await getServerClient();
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

  const supabase = await getServerClient();
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

// === WORKFLOWS (HITL) ===

/** Resolve aprovação pendente (aprovar ou rejeitar). Atualiza workflow_pending_approvals e revalida /app/ops/workflows. */
export async function resolveWorkflowApproval(
  approvalId: string,
  status: 'approved' | 'rejected',
  resolutionPayload?: Record<string, unknown>
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await getServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Não autenticado.' };

  const { error } = await supabase
    .from('workflow_pending_approvals')
    .update({
      status,
      resolved_at: new Date().toISOString(),
      resolved_by: user.id,
      resolution_payload: resolutionPayload ?? null,
    })
    .eq('id', approvalId)
    .eq('status', 'pending');

  if (error) return { error: error.message };
  revalidatePath('/app/ops/workflows');
  return { success: true };
}
// === SERVICE ACTIONS (Jobs: conjunto de SOPs/Playbooks) ===

export type ServiceActionRow = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  complexity_factor: number;
  estimated_duration_total: number;
  estimated_cost_total: number;
  created_at: string;
  updated_at: string;
};

export async function getServiceActions(): Promise<ServiceActionRow[]> {
  const supabase = await getServerClient();
  const { data, error } = await supabase.from('service_actions').select('*').order('title');
  if (error) return [];
  return (data ?? []) as ServiceActionRow[];
}

export async function createServiceAction(
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string; id?: string }> {
  const title = (formData.get('title') as string)?.trim();
  const slugRaw = (formData.get('slug') as string)?.trim();
  const description = (formData.get('description') as string)?.trim() || null;
  const complexity = parseFloat((formData.get('complexity_factor') as string) || '1.0');

  if (!title) return { error: 'Título obrigatório.' };
  const slug = slugRaw || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const supabase = await getServerClient();
  const { data, error } = await supabase.from('service_actions').insert({
    title,
    slug,
    description,
    complexity_factor: complexity,
  }).select('id').single();

  if (error) return { error: error.message };
  revalidatePath('/app/ops/service-actions');
  return { success: true, id: data.id };
}

export async function updateServiceAction(
  id: string,
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const title = (formData.get('title') as string)?.trim();
  const slugRaw = (formData.get('slug') as string)?.trim();
  const description = (formData.get('description') as string)?.trim() || null;
  const complexity = parseFloat((formData.get('complexity_factor') as string) || '1.0');

  if (!title) return { error: 'Título obrigatório.' };
  const slug = slugRaw || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const supabase = await getServerClient();
  const { error } = await supabase.from('service_actions').update({
    title,
    slug,
    description,
    complexity_factor: complexity,
    updated_at: new Date().toISOString(),
  }).eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/app/ops/service-actions');
  revalidatePath(`/app/ops/service-actions/${id}`);
  return { success: true };
}

/** Wrapper para useFormState ou action direto para updateServiceAction. */
export async function updateServiceActionFromForm(
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const id = formData.get('_id') as string;
  if (!id) return { error: 'ID not found' };
  return updateServiceAction(id, _prev, formData);
}

export async function linkPlaybookToServiceAction(
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const serviceActionId = formData.get('service_action_id') as string;
  const playbookId = formData.get('playbook_id') as string;
  const sortOrder = parseInt((formData.get('sort_order') as string) || '0');

  const supabase = await getServerClient();
  const { error } = await supabase.from('service_action_playbooks').insert({
    service_action_id: serviceActionId,
    playbook_id: playbookId,
    sort_order: sortOrder,
  });

  if (error) return { error: error.message };
  revalidatePath(`/app/ops/service-actions/${serviceActionId}`);
  return { success: true };
}
