'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitApplication(_prev: unknown, formData: FormData): Promise<{ success?: boolean; error?: string }> {
  const jobId = formData.get('job_id') as string;
  const name = (formData.get('candidate_name') as string)?.trim();
  const email = (formData.get('candidate_email') as string)?.trim();
  const linkedin = (formData.get('linkedin_url') as string) || null;
  const message = (formData.get('message') as string) || null;
  if (!jobId || !name || !email) return { error: 'Nome e e-mail obrigatórios.' };

  const supabase = await createClient();
  const { error } = await supabase.from('job_applications').insert({
    job_id: jobId, candidate_name: name, candidate_email: email, linkedin_url: linkedin, message,
  });
  if (error) return { error: error.message };
  revalidatePath('/carreiras');
  return { success: true };
}
