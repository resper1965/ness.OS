'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

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
