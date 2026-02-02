'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createGap(_prev: unknown, formData: FormData): Promise<{ success?: boolean; error?: string }> {
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
