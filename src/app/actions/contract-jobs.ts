'use server';

import { getServerClient } from '@/lib/supabase/queries/base';
import { revalidatePath } from 'next/cache';

export async function getContractServiceActions(contractId: string) {
  const supabase = await getServerClient();
  const { data, error } = await supabase
    .from('contracts_service_actions')
    .select(`
      *,
      service_actions (
        id,
        title,
        slug,
        estimated_cost_total,
        complexity_factor
      )
    `)
    .eq('contract_id', contractId);

  if (error) {
    console.error('Error fetching contract service actions:', error);
    return [];
  }

  return data ?? [];
}

export async function linkServiceActionToContractForm(
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const contractId = formData.get('contract_id') as string;
  const serviceActionId = formData.get('service_action_id') as string;
  const quantity = parseFloat((formData.get('quantity') as string) || '1');
  const unitPrice = formData.get('unit_price') as string;

  if (!contractId || !serviceActionId) {
    return { error: 'Contract e Service Action são obrigatórios.' };
  }

  const supabase = await getServerClient();
  const { error } = await supabase.from('contracts_service_actions').insert({
    contract_id: contractId,
    service_action_id: serviceActionId,
    quantity,
    unit_price: unitPrice ? parseFloat(unitPrice) : null,
  });

  if (error) return { error: error.message };
  revalidatePath(`/app/fin/contratos/${contractId}/jobs`);
  revalidatePath('/app/fin/rentabilidade');
  return { success: true };
}

export async function unlinkServiceActionFromContractForm(
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const contractId = formData.get('contract_id') as string;
  const serviceActionId = formData.get('service_action_id') as string;

  if (!contractId || !serviceActionId) {
    return { error: 'IDs inválidos.' };
  }

  const supabase = await getServerClient();
  const { error } = await supabase
    .from('contracts_service_actions')
    .delete()
    .eq('contract_id', contractId)
    .eq('service_action_id', serviceActionId);

  if (error) return { error: error.message };
  revalidatePath(`/app/fin/contratos/${contractId}/jobs`);
  revalidatePath('/app/fin/rentabilidade');
  return { success: true };
}
