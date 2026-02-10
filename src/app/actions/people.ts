'use server';

import { getServerClient } from '@/lib/supabase/queries/base';
import { revalidatePath } from 'next/cache';
import { emitModuleEvent } from '@/lib/events/emit';
import { processModuleEvent } from '@/lib/events/process';

// === JOBS ===

export async function createJob(
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const title = (formData.get('title') as string)?.trim();
  const slug = (formData.get('slug') as string)?.trim().toLowerCase().replace(/\s+/g, '-');
  const department = (formData.get('department') as string) || null;
  const description = (formData.get('description_html') as string) || null;
  if (!title || !slug) return { error: 'Título e slug obrigatórios.' };

  const contractId = (formData.get('contract_id') as string)?.trim() || null;
  const supabase = await getServerClient();
  const { data: inserted, error } = await supabase.from('public_jobs').insert({
    title,
    slug,
    department,
    description_html: description,
    is_open: true,
    contract_id: contractId || null,
  }).select('id').single();
  if (error) return { error: error.message };
  await emitModuleEvent('people', 'job.created', inserted?.id ?? null, { title, slug, department: department ?? undefined });
  await processModuleEvent('people', 'job.created', { title, slug, department: department ?? undefined });
  revalidatePath('/app/people/vagas');
  revalidatePath('/carreiras');
  return { success: true };
}

/** Wrapper para useFormState: lê id do formData e chama updateJob. */
export async function updateJobFromForm(
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const id = formData.get('_id') as string;
  if (!id) return { error: 'ID da vaga não encontrado.' };
  return updateJob(id, _prev, formData);
}

export async function updateJob(
  id: string,
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const title = (formData.get('title') as string)?.trim();
  const slug = (formData.get('slug') as string)?.trim().toLowerCase().replace(/\s+/g, '-');
  const department = (formData.get('department') as string) || null;
  const description = (formData.get('description_html') as string) || null;
  const isOpen = formData.get('is_open') === 'on';
  if (!title || !slug) return { error: 'Título e slug obrigatórios.' };

  const contractId = (formData.get('contract_id') as string)?.trim() || null;
  const supabase = await getServerClient();
  const { error } = await supabase
    .from('public_jobs')
    .update({
      title,
      slug,
      department,
      description_html: description,
      is_open: isOpen,
      contract_id: contractId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/app/people/vagas');
  revalidatePath('/carreiras');
  return { success: true };
}

// === JOB APPLICATIONS ===

export async function submitApplication(
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const jobId = formData.get('job_id') as string;
  const name = (formData.get('candidate_name') as string)?.trim();
  const email = (formData.get('candidate_email') as string)?.trim();
  const linkedin = (formData.get('linkedin_url') as string) || null;
  const message = (formData.get('message') as string) || null;
  if (!jobId || !name || !email) return { error: 'Nome e e-mail obrigatórios.' };

  const supabase = await getServerClient();
  const { data: inserted, error } = await supabase.from('job_applications').insert({
    job_id: jobId,
    candidate_name: name,
    candidate_email: email,
    linkedin_url: linkedin,
    message,
  }).select('id').single();
  if (error) return { error: error.message };
  await emitModuleEvent('people', 'job_application.created', inserted?.id ?? null, { job_id: jobId, candidate_email: email });
  await processModuleEvent('people', 'job_application.created', { job_id: jobId, candidate_email: email });
  revalidatePath('/carreiras');
  return { success: true };
}

// === TRAINING GAPS ===

export async function createGap(
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const employeeId = formData.get('employee_id') as string;
  const playbookId = (formData.get('playbook_id') as string) || null;
  const description = (formData.get('description') as string)?.trim();
  const severity = (formData.get('severity') as string) || 'medium';
  if (!employeeId || !description) return { error: 'Colaborador e correção obrigatórios.' };
  if (!playbookId) return { error: 'Playbook violado obrigatório.' };

  const supabase = await getServerClient();
  const { error } = await supabase.from('training_gaps').insert({
    employee_id: employeeId,
    playbook_id: playbookId,
    description,
    severity,
  });
  if (error) return { error: error.message };
  revalidatePath('/app/people/gaps');
  return { success: true };
}

// === FEEDBACK 360º ===

export async function createFeedback360FromForm(
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const subjectId = (formData.get('subject_id') as string)?.trim();
  const criteria = (formData.get('criteria') as string)?.trim();
  const scoreStr = formData.get('score') as string;
  const score = scoreStr ? parseInt(scoreStr, 10) : null;
  const comment = (formData.get('comment') as string)?.trim() || null;

  if (!subjectId) return { error: 'Colaborador avaliado obrigatório.' };
  if (score == null || Number.isNaN(score) || score < 1 || score > 5) return { error: 'Score deve ser entre 1 e 5.' };

  const supabase = await getServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Não autenticado.' };

  const { error } = await supabase.from('feedback_360').insert({
    subject_id: subjectId,
    rater_id: user.id,
    criteria: criteria || null,
    score,
    comment,
  });

  if (error) return { error: error.message };
  revalidatePath('/app/people/avaliacao');
  return { success: true };
}

export async function getFeedback360ScoresBySubject(): Promise<{ subject_id: string; full_name: string | null; avg_score: number; count: number }[]> {
  const supabase = await getServerClient();
  const { data: rows } = await supabase
    .from('feedback_360')
    .select('subject_id, score');
  if (!rows?.length) return [];

  const bySubject: Record<string, { sum: number; count: number }> = {};
  for (const r of rows) {
    if (!r.subject_id) continue;
    if (!bySubject[r.subject_id]) bySubject[r.subject_id] = { sum: 0, count: 0 };
    bySubject[r.subject_id].sum += r.score ?? 0;
    bySubject[r.subject_id].count += 1;
  }

  const { data: profiles } = await supabase.from('profiles').select('id, full_name');
  const nameMap = new Map((profiles ?? []).map((p) => [p.id, p.full_name]));

  return Object.entries(bySubject).map(([subject_id, { sum, count }]) => ({
    subject_id,
    full_name: nameMap.get(subject_id) ?? null,
    avg_score: count > 0 ? Math.round((sum / count) * 100) / 100 : 0,
    count,
  }));
}
