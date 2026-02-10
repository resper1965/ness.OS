'use server';

import { getServerClient } from '@/lib/supabase/queries/base';
import { revalidatePath } from 'next/cache';
import { getOmieFaturamentoForPeriod, getLastErpSync } from '@/app/actions/data';
import { emitModuleEvent } from '@/lib/events/emit';
import { processModuleEvent } from '@/lib/events/process';

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
    faturamentoPorOmie = await getOmieFaturamentoForPeriod({ dataInicio, dataFim });
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
  const { data: inserted, error } = await supabase
    .from('contracts')
    .insert({
      client_id: clientId,
      mrr,
      start_date: startDate || null,
      end_date: endDate || null,
      renewal_date: renewalDate || null,
      adjustment_index: adjustmentIndex || null,
    })
    .select('id')
    .single();
  if (error) return { error: error.message };
  const contractId = inserted?.id ?? null;
  const payload = { client_id: clientId, mrr, start_date: startDate, end_date: endDate };
  await emitModuleEvent('fin', 'contract.created', contractId, payload);
  await processModuleEvent('fin', 'contract.created', payload);
  revalidatePath('/app/fin/contratos');
  revalidatePath('/app/fin/rentabilidade');
  return { success: true };
}

// === DASHBOARD CFO (visão executiva) ===

export type CfoDashboardData = {
  mrrTotal: number;
  contractCount: number;
  activeClientsCount: number;
  marginAvgPct: number | null;
  contractsNegativeMarginCount: number;
  contractsNegativeMarginPct: number;
  reconciliationAlertsCount: number;
  renewalPipeline30: number;
  renewalPipeline90: number;
  lastErpSync: { date: string | null; status: string | null };
  top5ConcentrationPct: number;
  mrrRecognized: number;
  omieRevenueMonth: number | null;
  deltaRevenue: number;
  deltaRevenuePct: number | null;
  adjustmentExposedCount: number;
  adjustmentExposedMrr: number;
  // Novos campos para alinhamento da hierarquia
  totalBudgetedCost: number;
  totalActualCost: number;
  budgetVariance: number;
};

const CFO_FIN_VIEW_ROLES = ['fin', 'cfo', 'admin', 'superadmin'];

/** Retorna true se o role pode ver a visão CFO no dashboard. */
export async function canViewCfoDashboard(role: string | null): Promise<boolean> {
  return role != null && CFO_FIN_VIEW_ROLES.includes(role);
}

/**
 * KPIs para o dashboard executivo (Visão CFO).
 * Usado no dashboard principal (/app) para roles fin, cfo, admin, superadmin.
 */
export async function getCfoDashboardData(): Promise<CfoDashboardData> {
  const supabase = await getServerClient();
  const today = new Date().toISOString().slice(0, 10);
  const in30 = new Date();
  in30.setDate(in30.getDate() + 30);
  const in30Str = in30.toISOString().slice(0, 10);
  const in90 = new Date();
  in90.setDate(in90.getDate() + 90);
  const in90Str = in90.toISOString().slice(0, 10);

  const fmt = (d: Date) =>
    `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const dataInicio = fmt(firstDay);
  const dataFim = fmt(lastDay);

  const [
    contractsRes,
    rentabilityRes,
    reconciliationAlerts,
    lastSync,
    omieAgg,
    budgetVsActualRes
  ] = await Promise.all([
    supabase.from('contracts').select('id, client_id, mrr, renewal_date, end_date, adjustment_index'),
    supabase.from('contract_rentability').select('revenue, rentability'),
    getReconciliationAlerts(),
    getLastErpSync(),
    getOmieFaturamentoForPeriod({ dataInicio, dataFim }).catch(() => ({}) as Record<string, number>),
    supabase.from('v_contract_budget_vs_actual').select('budgeted_cost, actual_cost'),
  ]);

  const contracts = contractsRes.data ?? [];
  const rentability = (rentabilityRes.data ?? []) as { revenue: number; rentability: number }[];
  const mrrTotal = contracts.reduce((acc, c) => acc + Number(c.mrr ?? 0), 0);
  const contractCount = contracts.length;
  const activeClientsCount = new Set(contracts.map((c) => c.client_id).filter(Boolean)).size;

  let marginAvgPct: number | null = null;
  let contractsNegativeMarginCount = 0;
  const totalRevenue = rentability.reduce((a, r) => a + Number(r.revenue ?? 0), 0);
  const totalRentability = rentability.reduce((a, r) => a + Number(r.rentability ?? 0), 0);
  if (totalRevenue > 0) {
    marginAvgPct = (totalRentability / totalRevenue) * 100;
  }
  rentability.forEach((r) => {
    if (Number(r.rentability ?? 0) < 0) contractsNegativeMarginCount++;
  });
  const contractsNegativeMarginPct =
    rentability.length > 0 ? (contractsNegativeMarginCount / rentability.length) * 100 : 0;

  const budgetVsActual = (budgetVsActualRes?.data ?? []) as { budgeted_cost: number; actual_cost: number }[];
  const totalBudgetedCost = budgetVsActual.reduce((acc, v) => acc + Number(v.budgeted_cost), 0);
  const totalActualCost = budgetVsActual.reduce((acc, v) => acc + Number(v.actual_cost), 0);
  const budgetVariance = totalBudgetedCost - totalActualCost;

  const renewalPipeline30 = contracts
    .filter((c) => c.renewal_date && c.renewal_date >= today && c.renewal_date <= in30Str)
    .reduce((acc, c) => acc + Number(c.mrr ?? 0), 0);
  const renewalPipeline90Set = new Set<string>();
  contracts.forEach((c) => {
    if (c.renewal_date && c.renewal_date >= today && c.renewal_date <= in90Str) renewalPipeline90Set.add(c.id);
    if (c.end_date && c.end_date >= today && c.end_date <= in90Str) renewalPipeline90Set.add(c.id);
  });
  const renewalPipeline90 = contracts
    .filter((c) => renewalPipeline90Set.has(c.id))
    .reduce((acc, c) => acc + Number(c.mrr ?? 0), 0);

  const lastErpSync = {
    date: lastSync?.started_at ? new Date(lastSync.started_at).toLocaleDateString('pt-BR') : null,
    status: lastSync?.status ?? null,
  };

  const mrrByClient: Record<string, number> = {};
  contracts.forEach((c) => {
    const id = c.client_id ?? '';
    mrrByClient[id] = (mrrByClient[id] ?? 0) + Number(c.mrr ?? 0);
  });
  const sorted = Object.entries(mrrByClient)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const top5Mrr = sorted.reduce((a, [, m]) => a + m, 0);
  const top5ConcentrationPct = mrrTotal > 0 ? (top5Mrr / mrrTotal) * 100 : 0;

  const omieRevenueMonth = Object.values(omieAgg).reduce((a, v) => a + v, 0) || null;
  const deltaRevenue = mrrTotal - (omieRevenueMonth ?? 0);
  const deltaRevenuePct =
    mrrTotal > 0 && omieRevenueMonth != null ? (deltaRevenue / mrrTotal) * 100 : null;

  const adjustmentExposed = contracts.filter((c) => c.adjustment_index != null && c.adjustment_index.trim() !== '');
  const adjustmentExposedCount = adjustmentExposed.length;
  const adjustmentExposedMrr = adjustmentExposed.reduce((acc, c) => acc + Number(c.mrr ?? 0), 0);

  return {
    mrrTotal,
    contractCount,
    activeClientsCount,
    marginAvgPct,
    contractsNegativeMarginCount,
    contractsNegativeMarginPct,
    reconciliationAlertsCount: reconciliationAlerts.length,
    renewalPipeline30,
    renewalPipeline90,
    lastErpSync,
    top5ConcentrationPct,
    mrrRecognized: mrrTotal,
    omieRevenueMonth,
    deltaRevenue,
    deltaRevenuePct,
    adjustmentExposedCount,
    adjustmentExposedMrr,
    // Novos campos para alinhamento da hierarquia
    totalBudgetedCost,
    totalActualCost,
    budgetVariance,
  };
}

// === CONTRACTS SERVICE ACTIONS (Alignment) ===

export async function linkServiceActionToContract(
  contractId: string,
  serviceActionId: string,
  quantity = 1,
  unitPrice?: number
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await getServerClient();
  const { error } = await supabase.from('contracts_service_actions').insert({
    contract_id: contractId,
    service_action_id: serviceActionId,
    quantity,
    unit_price: unitPrice || null,
  });

  if (error) return { error: error.message };
  revalidatePath('/app/fin/rentabilidade');
  return { success: true };
}

export async function unlinkServiceActionFromContract(
  contractId: string,
  serviceActionId: string
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await getServerClient();
  const { error } = await supabase
    .from('contracts_service_actions')
    .delete()
    .eq('contract_id', contractId)
    .eq('service_action_id', serviceActionId);

  if (error) return { error: error.message };
  revalidatePath('/app/fin/rentabilidade');
  return { success: true };
}

// === RELATÓRIOS (fin-rel) ===

export type MrrReportRow = {
  client_id: string;
  client_name: string;
  mrr: number;
  contract_count: number;
};

export type RentabilityReportRow = {
  contract_id: string;
  client_name: string;
  revenue: number;
  total_cost: number;
  rentability: number;
};

export type LifecycleReportRow = {
  contract_id: string;
  client_name: string;
  mrr: number;
  start_date: string | null;
  end_date: string | null;
  renewal_date: string | null;
  adjustment_index: string | null;
};

export type OmieRevenueReportRow = {
  client_name: string;
  omie_codigo: string;
  valor: number;
};

export type OmieRevenueReportResult = {
  rows: OmieRevenueReportRow[];
  total: number;
};

/** MRR total e por cliente. Opcional: filtrar por clientId. */
export async function getMrrReport(options?: { clientId?: string }): Promise<MrrReportRow[]> {
  const supabase = await getServerClient();
  let q = supabase
    .from('contracts')
    .select('client_id, mrr')
    .order('client_id');
  if (options?.clientId) q = q.eq('client_id', options.clientId);
  const { data: contracts } = await q;
  if (!contracts?.length) return [];

  const { data: clients } = await supabase.from('clients').select('id, name');
  const clientMap = new Map((clients ?? []).map((c) => [c.id, { name: c.name }]));

  const agg: Record<string, { mrr: number; count: number; name: string }> = {};
  for (const row of contracts) {
    const name = clientMap.get(row.client_id)?.name ?? 'Sem nome';
    if (!agg[row.client_id]) agg[row.client_id] = { mrr: 0, count: 0, name };
    agg[row.client_id].mrr += Number(row.mrr ?? 0);
    agg[row.client_id].count += 1;
  }
  return Object.entries(agg).map(([client_id, { name, mrr, count }]) => ({
    client_id,
    client_name: name,
    mrr,
    contract_count: count,
  }));
}

/** Rentabilidade por contrato (view contract_rentability). */
export async function getRentabilityReport(): Promise<RentabilityReportRow[]> {
  const supabase = await getServerClient();
  const { data } = await supabase.from('contract_rentability').select('*');
  return (data ?? []) as RentabilityReportRow[];
}

/** Reconciliação MRR vs Omie (mês corrente). Reutiliza getReconciliationAlerts. */
export async function getReconciliationReport(): Promise<ReconciliationAlert[]> {
  return getReconciliationAlerts();
}

/** Contratos com renovação ou vencimento no intervalo. Datas em YYYY-MM-DD. */
export async function getLifecycleReport(options?: {
  fromDate?: string;
  toDate?: string;
}): Promise<LifecycleReportRow[]> {
  const supabase = await getServerClient();
  const from = options?.fromDate ?? new Date().toISOString().slice(0, 10);
  const to =
    options?.toDate ??
    (() => {
      const d = new Date();
      d.setDate(d.getDate() + 90);
      return d.toISOString().slice(0, 10);
    })();

  const [resRenewal, resEnd] = await Promise.all([
    supabase
      .from('contracts')
      .select('id, mrr, start_date, end_date, renewal_date, adjustment_index, clients(name)')
      .not('renewal_date', 'is', null)
      .gte('renewal_date', from)
      .lte('renewal_date', to)
      .order('renewal_date', { ascending: true }),
    supabase
      .from('contracts')
      .select('id, mrr, start_date, end_date, renewal_date, adjustment_index, clients(name)')
      .not('end_date', 'is', null)
      .gte('end_date', from)
      .lte('end_date', to)
      .order('end_date', { ascending: true }),
  ]);

  const seen = new Set<string>();
  const rows: LifecycleReportRow[] = [];
  const mapRow = (r: Record<string, unknown>) => {
    const clients = r.clients as { name?: string } | null;
    const name = clients?.name ?? 'Sem nome';
    return {
      contract_id: r.id as string,
      client_name: name,
      mrr: Number(r.mrr ?? 0),
      start_date: (r.start_date as string) ?? null,
      end_date: (r.end_date as string) ?? null,
      renewal_date: (r.renewal_date as string) ?? null,
      adjustment_index: (r.adjustment_index as string) ?? null,
    };
  };
  for (const r of resRenewal.data ?? []) {
    const id = (r as Record<string, unknown>).id as string;
    if (!seen.has(id)) {
      seen.add(id);
      rows.push(mapRow(r as Record<string, unknown>));
    }
  }
  for (const r of resEnd.data ?? []) {
    const id = (r as Record<string, unknown>).id as string;
    if (!seen.has(id)) {
      seen.add(id);
      rows.push(mapRow(r as Record<string, unknown>));
    }
  }
  rows.sort((a, b) => {
    const da = a.renewal_date ?? a.end_date ?? '';
    const db = b.renewal_date ?? b.end_date ?? '';
    return da.localeCompare(db);
  });
  return rows;
}

/** Faturamento Omie por período. Datas em DD/MM/YYYY. Usa snapshot quando disponível (período de um mês). */
export async function getOmieRevenueReport(options: {
  dataInicio: string;
  dataFim: string;
}): Promise<OmieRevenueReportResult> {
  const faturamentoPorOmie = await getOmieFaturamentoForPeriod(options);
  const supabase = await getServerClient();
  const { data: clients } = await supabase.from('clients').select('id, name, omie_codigo').not('omie_codigo', 'is', null);
  const byCodigo = new Map((clients ?? []).map((c) => [c.omie_codigo!, { name: c.name }]));

  const rows: OmieRevenueReportRow[] = [];
  let total = 0;
  for (const [omie_codigo, valor] of Object.entries(faturamentoPorOmie)) {
    const name = byCodigo.get(omie_codigo)?.name ?? `Cliente ${omie_codigo}`;
    rows.push({ client_name: name, omie_codigo, valor });
    total += valor;
  }
  rows.sort((a, b) => b.valor - a.valor);
  return { rows, total };
}

export type BudgetVsActualReportRow = {
  contract_id: string;
  client_name: string;
  revenue: number;
  budgeted_cost: number;
  actual_cost: number;
  cost_variance: number;
};

/** Relatório comparativo Budget vs Real. */
export async function getBudgetVsActualReport(): Promise<BudgetVsActualReportRow[]> {
  const supabase = await getServerClient();
  const { data } = await supabase.from('v_contract_budget_vs_actual').select('*');
  return (data ?? []) as BudgetVsActualReportRow[];
}
