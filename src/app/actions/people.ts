'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

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

  const supabase = await createClient();
  const { error } = await supabase.from('public_jobs').insert({
    title,
    slug,
    department,
    description_html: description,
    is_open: true,
  });
  if (error) return { error: error.message };
  revalidatePath('/app/people/vagas');
  revalidatePath('/carreiras');
  return { success: true };
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

  const supabase = await createClient();
  const { error } = await supabase
    .from('public_jobs')
    .update({
      title,
      slug,
      department,
      description_html: description,
      is_open: isOpen,
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

  const supabase = await createClient();
  const { error } = await supabase.from('job_applications').insert({
    job_id: jobId,
    candidate_name: name,
    candidate_email: email,
    linkedin_url: linkedin,
    message,
  });
  if (error) return { error: error.message };
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

  const supabase = await createClient();
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
