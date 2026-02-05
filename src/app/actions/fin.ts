'use server';

import { getServerClient } from '@/lib/supabase/queries/base';
import { revalidatePath } from 'next/cache';
import { getOmieContasReceber } from '@/app/actions/data';

// Sync Omie e consultas ERP: ness.DATA (app/actions/data.ts). FIN consome via DATA.
export type ReconciliationAlert = {
  client_id: string;
  client_name: string;
  mrr: number;
  faturamento_omie: number;
  divergencia: number;
};

const TOLERANCIA_PERCENT = 0.05;
const TOLERANCIA_FIXA = 50;

/**
 * Compara MRR (contracts) com faturamento Omie por cliente.
 * Retorna lista de clientes com divergência acima da tolerância (5% ou R$ 50).
 */
export async function getReconciliationAlerts(): Promise<ReconciliationAlert[]> {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const fmt = (d: Date) =>
    `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  const dataInicio = fmt(firstDay);
  const dataFim = fmt(lastDay);

  let faturamentoPorOmie: Record<string, number>;
  try {
    faturamentoPorOmie = await getOmieContasReceber({ dataInicio, dataFim });
  } catch {
    return [];
  }

  const supabase = await getServerClient();
  const { data: contracts } = await supabase
    .from('contracts')
    .select('client_id, mrr');
  if (!contracts?.length) return [];

  const { data: clients } = await supabase.from('clients').select('id, name, omie_codigo');
  const clientMap = new Map((clients ?? []).map((c) => [c.id, c]));

  const mrrPorClient: Record<string, { mrr: number; name: string; omie_codigo: string | null }> = {};
  for (const row of contracts) {
    const client = clientMap.get(row.client_id);
    const name = client?.name ?? 'Sem nome';
    const omie_codigo = client?.omie_codigo ?? null;
    if (!mrrPorClient[row.client_id]) {
      mrrPorClient[row.client_id] = { mrr: 0, name, omie_codigo };
    }
    mrrPorClient[row.client_id].mrr += Number(row.mrr ?? 0);
  }

  const alerts: ReconciliationAlert[] = [];
  for (const [clientId, { mrr, name, omie_codigo }] of Object.entries(mrrPorClient)) {
    if (!omie_codigo || mrr <= 0) continue;
    const faturamento_omie = faturamentoPorOmie[omie_codigo] ?? 0;
    const tolerancia = Math.max(mrr * TOLERANCIA_PERCENT, TOLERANCIA_FIXA);
    const divergencia = Math.abs(mrr - faturamento_omie);
    if (divergencia > tolerancia) {
      alerts.push({
        client_id: clientId,
        client_name: name,
        mrr,
        faturamento_omie,
        divergencia,
      });
    }
  }
  return alerts;
}

// === CLIENTS ===

export async function addClient(
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const name = (formData.get('name') as string)?.trim();
  if (!name) return { error: 'Nome obrigatório.' };

  const supabase = await getServerClient();
  const { error } = await supabase.from('clients').insert({ name });
  if (error) return { error: error.message };
  revalidatePath('/app/fin/contratos');
  return { success: true };
}

// === CONTRACTS ===

export async function createContract(
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const clientId = formData.get('client_id') as string;
  const mrr = parseFloat((formData.get('mrr') as string) || '0');
  const startDate = (formData.get('start_date') as string) || null;
  const endDate = (formData.get('end_date') as string) || null;
  const renewalDate = (formData.get('renewal_date') as string) || null;
  const adjustmentIndex = (formData.get('adjustment_index') as string) || null;

  if (!clientId) return { error: 'Cliente obrigatório.' };

  const supabase = await getServerClient();
  const { error } = await supabase.from('contracts').insert({
    client_id: clientId,
    mrr,
    start_date: startDate || null,
    end_date: endDate || null,
    renewal_date: renewalDate || null,
    adjustment_index: adjustmentIndex || null,
  });
  if (error) return { error: error.message };
  revalidatePath('/app/fin/contratos');
  revalidatePath('/app/fin/rentabilidade');
  return { success: true };
}
