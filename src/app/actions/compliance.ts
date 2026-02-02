'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getFrameworks() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('compliance_frameworks')
    .select('id, name, code')
    .order('name');
  return data ?? [];
}

export async function getChecksByFramework(frameworkId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('compliance_checks')
    .select('id, process_ref, status, notes, created_at')
    .eq('framework_id', frameworkId)
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function createComplianceCheck(formData: FormData) {
  const frameworkId = formData.get('framework_id') as string;
  const processRef = formData.get('process_ref') as string;
  const status = formData.get('status') as string;

  if (!frameworkId || !processRef) return { error: 'Framework e processo obrigatórios.' };

  const supabase = await createClient();
  const { error } = await supabase.from('compliance_checks').insert({
    framework_id: frameworkId,
    process_ref: processRef.trim(),
    status: status || 'pending',
    notes: (formData.get('notes') as string)?.trim() || null,
  });

  if (error) return { error: error.message };
  revalidatePath('/app/jur/conformidade');
  return { success: true };
}
