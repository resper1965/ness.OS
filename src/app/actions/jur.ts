'use server';

import { getServerClient, withSupabase } from '@/lib/supabase/queries/base';
import { revalidatePath } from 'next/cache';

export async function getFrameworks() {
  const { data, error } = await withSupabase(async (sb) => {
    const { data: d, error: e } = await sb
      .from('compliance_frameworks')
      .select('id, name, code')
      .order('name');
    if (e) throw new Error(e.message);
    return d ?? [];
  });
  return error ? [] : data ?? [];
}

export async function getChecksByFramework(frameworkId: string) {
  const { data, error } = await withSupabase(async (sb) => {
    const { data: d, error: e } = await sb
      .from('compliance_checks')
      .select('id, process_ref, status, notes, created_at')
      .eq('framework_id', frameworkId)
      .order('created_at', { ascending: false });
    if (e) throw new Error(e.message);
    return d ?? [];
  });
  return error ? [] : data ?? [];
}

export async function createComplianceCheckFromForm(_prev: unknown, formData: FormData) {
  return createComplianceCheck(formData);
}

export async function createComplianceCheck(formData: FormData) {
  const frameworkId = formData.get('framework_id') as string;
  const processRef = formData.get('process_ref') as string;
  const status = formData.get('status') as string;

  if (!frameworkId || !processRef) return { error: 'Framework e processo obrigatórios.' };

  const supabase = await getServerClient();
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
