'use server';

import { getServerClient } from '@/lib/supabase/queries/base';
import { revalidatePath } from 'next/cache';

/**
 * Timesheet Timer — ness.OPS (MR).
 * Plano: .context/plans/mobile-timesheet-timer.md
 * Colaborador escolhe cliente/contrato/playbook, inicia e para o timer; registros em time_entries.
 */

const today = new Date().toISOString().slice(0, 10);

/** Clientes com pelo menos um contrato ativo (vigente hoje). */
export async function getClientsForTimer(): Promise<{ id: string; name: string }[]> {
  const supabase = await getServerClient();
  const { data: clients } = await supabase.from('clients').select('id, name').order('name');
  const { data: contracts } = await supabase.from('contracts').select('client_id, start_date, end_date');
  if (!clients?.length) return [];
  const activeClientIds = new Set(
    (contracts ?? []).filter((c) => {
      const startOk = !c.start_date || c.start_date <= today;
      const endOk = !c.end_date || c.end_date >= today;
      return startOk && endOk;
    }).map((c) => c.client_id)
  );
  return clients.filter((c) => activeClientIds.has(c.id));
}

/** Contratos ativos do cliente (vigência hoje). */
export async function getContractsByClient(clientId: string): Promise<{ id: string; mrr: number; start_date: string | null; end_date: string | null }[]> {
  const supabase = await getServerClient();
  const { data } = await supabase
    .from('contracts')
    .select('id, mrr, start_date, end_date')
    .eq('client_id', clientId)
    .order('start_date', { ascending: false });
  const list = (data ?? []) as { id: string; mrr: number; start_date: string | null; end_date: string | null }[];
  return list.filter((c) => {
    const startOk = !c.start_date || c.start_date <= today;
    const endOk = !c.end_date || c.end_date >= today;
    return startOk && endOk;
  });
}

/** Playbooks para dropdown (id, title). */
export async function getPlaybooksForTimer(): Promise<{ id: string; title: string }[]> {
  const supabase = await getServerClient();
  const { data } = await supabase.from('playbooks').select('id, title').order('title');
  return (data ?? []) as { id: string; title: string }[];
}

/** Inicia o timer: cria time_entry com ended_at null. Retorna id e started_at. */
export async function startTimer(contractId: string, playbookId?: string | null): Promise<{ id?: string; started_at?: string; error?: string }> {
  const supabase = await getServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Não autenticado.' };

  const { data, error } = await supabase
    .from('time_entries')
    .insert({
      user_id: user.id,
      contract_id: contractId,
      playbook_id: playbookId || null,
      started_at: new Date().toISOString(),
      ended_at: null,
    })
    .select('id, started_at')
    .single();

  if (error) return { error: error.message };
  revalidatePath('/app/ops/timer');
  return { id: data.id, started_at: data.started_at };
}

/** Atualiza um registro de tempo (corrigir fim ou observação). Apenas próprio registro (RLS). */
export async function updateTimeEntry(
  entryId: string,
  payload: { ended_at?: string | null; notes?: string | null }
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await getServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Não autenticado.' };

  const body: { ended_at?: string | null; notes?: string | null } = {};
  if ('ended_at' in payload) body.ended_at = payload.ended_at ?? null;
  if (payload.notes !== undefined) body.notes = payload.notes || null;

  const { error } = await supabase
    .from('time_entries')
    .update(body)
    .eq('id', entryId)
    .eq('user_id', user.id);

  if (error) return { error: error.message };
  revalidatePath('/app/ops/timer');
  return { success: true };
}

/** Para o timer: atualiza ended_at. duration_minutes é calculado pela coluna generated. */
export async function stopTimer(entryId: string): Promise<{ success?: boolean; duration_minutes?: number; error?: string }> {
  const supabase = await getServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Não autenticado.' };

  const { data, error } = await supabase
    .from('time_entries')
    .update({ ended_at: new Date().toISOString() })
    .eq('id', entryId)
    .eq('user_id', user.id)
    .select('duration_minutes')
    .single();

  if (error) return { error: error.message };
  revalidatePath('/app/ops/timer');
  return { success: true, duration_minutes: data?.duration_minutes ?? undefined };
}

/** Timer ativo do usuário (um único registro com ended_at null). */
export async function getActiveTimer(): Promise<{
  id: string;
  contract_id: string;
  playbook_id: string | null;
  started_at: string;
  contracts?: { clients?: { name: string } | null } | null;
  playbooks?: { title: string } | null;
} | null> {
  const supabase = await getServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('time_entries')
    .select(`
      id,
      contract_id,
      playbook_id,
      started_at,
      contracts ( clients ( name ) ),
      playbooks ( title )
    `)
    .eq('user_id', user.id)
    .is('ended_at', null)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return data as typeof data & { contracts?: { clients?: { name: string } | null } | null; playbooks?: { title: string } | null } | null;
}

/** Entradas de tempo do usuário hoje (para listagem na tela do timer). */
export async function getTimeEntriesToday(): Promise<{
  id: string;
  started_at: string;
  ended_at: string | null;
  duration_minutes: number | null;
  notes: string | null;
  contracts?: { clients?: { name: string } | null } | null;
  playbooks?: { title: string } | null;
}[]> {
  const supabase = await getServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('time_entries')
    .select(`
      id,
      started_at,
      ended_at,
      duration_minutes,
      notes,
      contracts ( clients ( name ) ),
      playbooks ( title )
    `)
    .eq('user_id', user.id)
    .gte('started_at', `${today}T00:00:00.000Z`)
    .order('started_at', { ascending: false });

  return (data ?? []) as unknown as {
    id: string;
    started_at: string;
    ended_at: string | null;
    duration_minutes: number | null;
    notes: string | null;
    contracts?: { clients?: { name: string } | null } | null;
    playbooks?: { title: string } | null;
  }[];
}

/** Resumo do mês: horas do timer por contrato (view agregada). RLS: usuário vê só seus totais. */
export async function getTimeEntriesSummaryThisMonth(): Promise<{
  contract_id: string;
  client_name: string | null;
  month: string;
  total_minutes: number;
  total_hours: number;
}[]> {
  const supabase = await getServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const now = new Date();
  const firstDay = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

  const { data } = await supabase
    .from('v_time_entries_by_contract_month')
    .select('contract_id, client_name, month, total_minutes, total_hours')
    .eq('month', firstDay)
    .order('total_minutes', { ascending: false });

  return (data ?? []) as { contract_id: string; client_name: string | null; month: string; total_minutes: number; total_hours: number }[];
}

/** Roles permitidos para disparar a sincronização timer → performance_metrics. */
const SYNC_METRICS_ROLES = ['admin', 'superadmin', 'ops'];

/**
 * Sincroniza performance_metrics a partir de time_entries (agregação por contract_id + mês).
 * Job/cron pode chamar a API POST /api/cron/sync-performance-metrics com CRON_SECRET.
 * Na UI, apenas admin/ops/superadmin podem disparar manualmente.
 */
export async function syncPerformanceMetricsFromTimer(): Promise<{
  success?: boolean;
  updated?: number;
  error?: string;
}> {
  const supabase = await getServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Não autenticado.' };

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  const role = (profile?.role as string) ?? '';
  if (!SYNC_METRICS_ROLES.includes(role)) {
    return { error: 'Sem permissão. Apenas admin, ops ou superadmin.' };
  }

  const { data, error } = await supabase.rpc('sync_performance_metrics_from_time_entries');

  if (error) return { error: error.message };
  const count = Array.isArray(data) ? data.length : 0;
  revalidatePath('/app/ops/metricas');
  revalidatePath('/app/ops/timer');
  revalidatePath('/app/fin/rentabilidade');
  return { success: true, updated: count };
}
