'use server';

import { getServerClient } from '@/lib/supabase/queries/base';
import { revalidatePath } from 'next/cache';
import { listarClientes, listarContasReceber, listarServicos } from '@/lib/omie/client';

/**
 * ness.DATA — Coletas de dados de fontes externas (Omie, BCB, indicadores, etc.).
 * Módulos de negócio (FIN, OPS, GROWTH, PEOPLE) consomem via estas actions; não chamam APIs externas diretamente.
 */

const ERP_SYNC_ALLOWED_ROLES = ['admin', 'superadmin', 'cfo', 'fin'];
const ERP_SYNC_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutos

// === ERP SYNC (Omie) ===

export type ErpSyncResult = { success?: boolean; error?: string; logId?: string; recordCount?: number };

export async function syncOmieErp(): Promise<ErpSyncResult> {
  const supabase = await getServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Não autenticado.' };

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  const role = (profile?.role as string) ?? '';
  if (!ERP_SYNC_ALLOWED_ROLES.includes(role)) {
    return { error: 'Sem permissão para sincronizar ERP. Apenas admin, superadmin, cfo ou fin.' };
  }

  const { data: lastSync } = await supabase
    .from('erp_sync_log')
    .select('started_at')
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (lastSync?.started_at) {
    const elapsed = Date.now() - new Date(lastSync.started_at).getTime();
    if (elapsed < ERP_SYNC_COOLDOWN_MS) {
      const minutos = Math.ceil((ERP_SYNC_COOLDOWN_MS - elapsed) / 60_000);
      return { error: `Aguarde ${minutos} minuto(s) para sincronizar novamente.` };
    }
  }

  const { data: logRow, error: insertErr } = await supabase
    .from('erp_sync_log')
    .insert({ status: 'running' })
    .select('id')
    .single();
  if (insertErr || !logRow?.id) {
    return { error: insertErr?.message ?? 'Falha ao criar registro de sync.' };
  }

  try {
    let recordCount = 0;
    let page = 1;
    const perPage = 50;
    let hasMore = true;

    const tagCliente = process.env.OMIE_TAG_APENAS_CLIENTE?.trim();
    const filtro = tagCliente ? { filtro: { tags: [tagCliente] } } : {};

    while (hasMore) {
      const res = await listarClientes({ pagina: page, registros_por_pagina: perPage, ...filtro });
      const list = res.clientes_cadastro ?? res.lista_clientes_cadastro ?? [];
      for (const c of list) {
        const codigo = c.codigo_cliente_omie?.toString() ?? null;
        const doc = (c.cnpj_cpf ?? '').toString().replace(/\D/g, '') || null;
        const name = (c.razao_social ?? (c as { nome_fantasia?: string }).nome_fantasia ?? '').toString().trim() || 'Sem nome';
        const email = (c.email ?? '').toString().trim() || null;
        if (!codigo && !doc) continue;

        let existing: { id: string } | null = null;
        if (codigo) {
          const { data: byOmie } = await supabase.from('clients').select('id').eq('omie_codigo', codigo).limit(1).maybeSingle();
          existing = byOmie;
        }
        if (!existing && doc) {
          const { data: byDoc } = await supabase.from('clients').select('id').eq('document', doc).limit(1).maybeSingle();
          existing = byDoc;
        }

        if (existing) {
          await supabase
            .from('clients')
            .update({
              name,
              document: doc ?? undefined,
              contact_email: email ?? undefined,
              omie_codigo: codigo ?? undefined,
            })
            .eq('id', existing.id);
        } else {
          await supabase.from('clients').insert({
            name,
            document: doc,
            contact_email: email,
            omie_codigo: codigo,
          });
        }
        recordCount++;
      }
      const totalPages = res.total_de_paginas ?? 1;
      hasMore = page < totalPages && list.length >= perPage;
      page++;
    }

    await supabase
      .from('erp_sync_log')
      .update({ status: 'success', finished_at: new Date().toISOString(), record_count: recordCount })
      .eq('id', logRow.id);
    revalidatePath('/app/fin/contratos');
    revalidatePath('/app/fin/rentabilidade');
    return { success: true, logId: logRow.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro ao sincronizar com Omie.';
    await supabase
      .from('erp_sync_log')
      .update({
        status: 'error',
        finished_at: new Date().toISOString(),
        error_message: msg.slice(0, 500),
      })
      .eq('id', logRow.id);
    return { error: msg, logId: logRow.id };
  }
}

/**
 * Sincroniza o cadastro de serviços do Omie com service_actions.
 * Alinha o catálogo técnico (ERP) com as Service Actions (Jobs) do nessOS.
 */
export async function syncOmieServices(): Promise<ErpSyncResult> {
  const supabase = await getServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Não autenticado.' };

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  const role = (profile?.role as string) ?? '';
  if (!ERP_SYNC_ALLOWED_ROLES.includes(role)) {
    return { error: 'Sem permissão para sincronizar serviços.' };
  }

  try {
    let recordCount = 0;
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const res = await listarServicos({ pagina: page, registros_por_pagina: 50 });
      const list = res.servicos_cadastro ?? [];

      for (const s of list) {
        const omieId = s.int_serv_codigo;
        if (!omieId) continue;

        const { data: existing } = await supabase
          .from('service_actions')
          .select('id')
          .eq('omie_servico_id', omieId)
          .maybeSingle();

        const payload = {
          title: s.descricao || 'Serviço Omie',
          slug: s.codigo || `omie-${omieId}`,
          omie_servico_id: omieId,
          // Não sobrescrevemos Estimated Cost se já existir, pois o Omie tem Preço de Venda
          // Mas podemos inicializar se for novo
          updated_at: new Date().toISOString(),
        };

        if (existing) {
          await supabase.from('service_actions').update(payload).eq('id', existing.id);
        } else {
          await supabase.from('service_actions').insert(payload);
        }
        recordCount++;
      }

      const totalPages = res.total_de_paginas ?? 1;
      hasMore = page < totalPages && list.length >= 50;
      page++;
    }

    revalidatePath('/app/ops/service-actions');
    return { success: true, recordCount };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Erro ao sincronizar serviços.' };
  }
}

export async function getLastErpSync() {
  const supabase = await getServerClient();
  const { data } = await supabase
    .from('erp_sync_log')
    .select('id, started_at, finished_at, status, record_count, error_message')
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

/** Resumo dos dados persistidos (ERP + indicadores + snapshots + acontecimentos) para a página ness.DATA. */
export type DataDashboardSummary = {
  clientsTotal: number;
  clientsWithOmie: number;
  lastSync: Awaited<ReturnType<typeof getLastErpSync>>;
  indicatorsCount: number;
  /** Último mês com snapshot de faturamento Omie (YYYY-MM-01). */
  lastErpRevenuePeriod: string | null;
  /** Última data com cotação/índice BCB. */
  lastBcbRatesDate: string | null;
  /** Total de eventos em module_events. */
  eventsTotal: number;
  /** Total de linhas em event_aggregates (acontecimentos agregados). */
  eventAggregatesCount: number;
  /** Últimas agregações por período (para exibir na página). */
  recentEventAggregates: EventAggregateRow[];
  /** Último período com índices derivados (data_indices). */
  lastDataIndicesPeriod: string | null;
  /** Total de linhas em data_indices. */
  dataIndicesCount: number;
  /** Últimos índices (para exibir na página). */
  recentDataIndices: DataIndexRow[];
};

export async function getDataDashboardSummary(): Promise<DataDashboardSummary> {
  const supabase = await getServerClient();
  const [
    clientsRes,
    clientsOmieRes,
    lastSync,
    indicatorsRes,
    erpMaxPeriod,
    bcbMaxDate,
    eventsCountRes,
    eventAggCountRes,
    recentAggregates,
    dataIndicesMaxPeriod,
    dataIndicesCountRes,
    recentDataIndices,
  ] = await Promise.all([
    supabase.from('clients').select('id', { count: 'exact', head: true }),
    supabase.from('clients').select('id', { count: 'exact', head: true }).not('omie_codigo', 'is', null),
    getLastErpSync(),
    supabase.from('indicators').select('id', { count: 'exact', head: true }),
    supabase.from('erp_revenue_snapshot').select('period').order('period', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('bcb_rates_snapshot').select('ref_date').order('ref_date', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('module_events').select('id', { count: 'exact', head: true }),
    supabase.from('event_aggregates').select('id', { count: 'exact', head: true }),
    getEventAggregates({ limit: 20 }),
    supabase.from('data_indices').select('period').order('period', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('data_indices').select('id', { count: 'exact', head: true }),
    getDataIndices({ limit: 15 }),
  ]);
  return {
    clientsTotal: clientsRes.count ?? 0,
    clientsWithOmie: clientsOmieRes.count ?? 0,
    lastSync: lastSync ?? null,
    indicatorsCount: indicatorsRes.count ?? 0,
    lastErpRevenuePeriod: erpMaxPeriod?.data?.period ?? null,
    lastBcbRatesDate: bcbMaxDate?.data?.ref_date ?? null,
    eventsTotal: eventsCountRes.count ?? 0,
    eventAggregatesCount: eventAggCountRes.count ?? 0,
    recentEventAggregates: recentAggregates ?? [],
    lastDataIndicesPeriod: dataIndicesMaxPeriod?.data?.period ?? null,
    dataIndicesCount: dataIndicesCountRes.count ?? 0,
    recentDataIndices: recentDataIndices ?? [],
  };
}

// === Contas a receber (Omie) — para reconciliação MRR ===

/**
 * Retorna faturamento Omie por codigo_cliente_omie no período (datas em DD/MM/YYYY).
 * FIN consome para comparar com MRR (getReconciliationAlerts).
 */
export async function getOmieContasReceber(periodo: {
  dataInicio: string;
  dataFim: string;
}): Promise<Record<string, number>> {
  const { dataInicio, dataFim } = periodo;
  const agg: Record<string, number> = {};
  let page = 1;
  const perPage = 100;
  let hasMore = true;

  while (hasMore) {
    const res = await listarContasReceber({
      filtrar_por_data_de: dataInicio,
      filtrar_por_data_ate: dataFim,
      pagina: page,
      registros_por_pagina: perPage,
    });
    const list = res.conta_receber_cadastro ?? res.lista_contas_receber ?? [];
    for (const item of list) {
      const codigo = (item.codigo_cliente_fornecedor ?? item.codigo_cliente_omie)?.toString();
      if (!codigo) continue;
      const valor = Number(item.valor_documento ?? item.valor ?? 0);
      agg[codigo] = (agg[codigo] ?? 0) + valor;
    }
    const totalPages = res.total_de_paginas ?? 1;
    hasMore = list.length >= perPage && page < totalPages;
    page++;
  }
  return agg;
}

// === Snapshot de faturamento Omie (persistência para avaliações) ===

/** period: YYYY-MM-DD (primeiro dia do mês). Retorna faturamento por omie_codigo a partir da base. */
export async function getOmieRevenueFromSnapshot(period: string): Promise<Record<string, number> | null> {
  const supabase = await getServerClient();
  const { data, error } = await supabase
    .from('erp_revenue_snapshot')
    .select('omie_codigo, valor')
    .eq('period', period);
  if (error || !data?.length) return null;
  const agg: Record<string, number> = {};
  for (const row of data) {
    const cod = row.omie_codigo ?? '';
    if (!cod) continue;
    agg[cod] = Number(row.valor ?? 0);
  }
  return Object.keys(agg).length ? agg : null;
}

export type SyncOmieRevenueSnapshotResult = { success?: boolean; recordCount?: number; error?: string };

/**
 * Sincroniza snapshot de faturamento Omie para um mês. period: YYYY-MM-01.
 * Chama API Omie para o mês e faz upsert em erp_revenue_snapshot.
 */
export async function syncOmieRevenueSnapshot(period: string): Promise<SyncOmieRevenueSnapshotResult> {
  const match = /^(\d{4})-(\d{2})-01$/.exec(period);
  if (!match) return { error: 'period deve ser YYYY-MM-01.' };

  const [, y, m] = match;
  const dataInicio = `01/${m}/${y}`;
  const lastDay = new Date(Number(y), Number(m), 0).getDate();
  const dataFim = `${String(lastDay).padStart(2, '0')}/${m}/${y}`;

  let faturamento: Record<string, number>;
  try {
    faturamento = await getOmieContasReceber({ dataInicio, dataFim });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro ao buscar Omie.';
    return { error: msg };
  }

  const supabase = await getServerClient();
  const periodDate = `${y}-${m}-01`;
  const rows = Object.entries(faturamento).map(([omie_codigo, valor]) => ({
    period: periodDate,
    omie_codigo,
    valor,
  }));
  const { error } = await supabase
    .from('erp_revenue_snapshot')
    .upsert(rows, { onConflict: 'period,omie_codigo' });
  if (error) return { error: error.message };
  revalidatePath('/app/data');
  revalidatePath('/app/fin/alertas');
  revalidatePath('/app/fin/relatorios');
  revalidatePath('/app/growth');
  return { success: true, recordCount: Object.keys(faturamento).length };
}

/**
 * Retorna faturamento Omie por codigo_cliente_omie no período.
 * Se o período for um único mês e existir snapshot, usa a base; senão chama a API.
 * Consumidores: getReconciliationAlerts, getOmieRevenueReport, getCfoDashboardData, getGrowthDashboardData.
 */
export async function getOmieFaturamentoForPeriod(periodo: {
  dataInicio: string;
  dataFim: string;
}): Promise<Record<string, number>> {
  const { dataInicio, dataFim } = periodo;
  const parseDdMmYyyy = (s: string) => {
    const [dd, mm, yyyy] = s.split('/').map(Number);
    return { dd, mm, yyyy };
  };
  const start = parseDdMmYyyy(dataInicio);
  const end = parseDdMmYyyy(dataFim);
  const isSingleMonth = start.mm === end.mm && start.yyyy === end.yyyy;
  if (!isSingleMonth) return getOmieContasReceber(periodo);

  const period = `${start.yyyy}-${String(start.mm).padStart(2, '0')}-01`;
  const fromSnapshot = await getOmieRevenueFromSnapshot(period);
  if (fromSnapshot != null) return fromSnapshot;
  return getOmieContasReceber(periodo);
}

// === Índices BCB (dólar PTAX, IPCA, IGPM) — precificação e reajuste ===

const BCB_PTAX_BASE = 'https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata';
const BCB_SGS_BASE = 'https://api.bcb.gov.br/dados/serie';
// SGS: 433 = IPCA (variação mensal %), 189 = IGP-M (variação mensal %)
const SGS_IPCA = 433;
const SGS_IGPM = 189;

const RATE_TYPE_DOLLAR = 'dollar_ptax';
const RATE_TYPE_IPCA = 'ipca';
const RATE_TYPE_IGPM = 'igpm';

export type DollarRateResult = {
  buy: number;
  sell: number;
  date: string;
  dataHoraCotacao: string;
} | null;

/** Lê da base um snapshot BCB. refDate: YYYY-MM-DD. */
async function getBcbRateFromSnapshot(
  rateType: string,
  refDate: string
): Promise<{ value_buy?: number; value_sell?: number; value?: number } | null> {
  const supabase = await getServerClient();
  const { data } = await supabase
    .from('bcb_rates_snapshot')
    .select('value_buy, value_sell, value')
    .eq('rate_type', rateType)
    .eq('ref_date', refDate)
    .maybeSingle();
  return data ?? null;
}

/** Persiste um registro em bcb_rates_snapshot (upsert). */
async function persistBcbRate(
  rateType: string,
  refDate: string,
  opts: { value_buy?: number; value_sell?: number; value?: number }
): Promise<void> {
  const supabase = await getServerClient();
  await supabase.from('bcb_rates_snapshot').upsert(
    {
      rate_type: rateType,
      ref_date: refDate,
      value_buy: opts.value_buy ?? null,
      value_sell: opts.value_sell ?? null,
      value: opts.value ?? null,
    },
    { onConflict: 'rate_type,ref_date' }
  );
}

/** Busca cotação dólar PTAX apenas na API BCB (sem DB). */
async function fetchDollarFromBcb(date: string): Promise<DollarRateResult> {
  const [yyyy, mm, dd] = date.slice(0, 10).split('-');
  const dataCotacao = `${dd}-${mm}-${yyyy}`;
  const url = `${BCB_PTAX_BASE}/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='${dataCotacao}'&$format=json`;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const json = (await res.json()) as { value?: { cotacaoCompra: number; cotacaoVenda: number; dataHoraCotacao: string }[] };
    const value = json.value?.[0];
    if (!value) return null;
    return {
      buy: value.cotacaoCompra,
      sell: value.cotacaoVenda,
      date,
      dataHoraCotacao: value.dataHoraCotacao,
    };
  } catch {
    return null;
  }
}

/**
 * Retorna cotação do dólar (PTAX) para uma data. Formato data: YYYY-MM-DD (default: hoje).
 * Lê primeiro do snapshot; se não houver, busca na API BCB e persiste.
 */
export async function getDollarRate(date?: string): Promise<DollarRateResult> {
  const d = date ? new Date(date + 'T12:00:00Z') : new Date();
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const refDate = `${yyyy}-${mm}-${dd}`;

  const fromSnapshot = await getBcbRateFromSnapshot(RATE_TYPE_DOLLAR, refDate);
  if (fromSnapshot != null && fromSnapshot.value_buy != null && fromSnapshot.value_sell != null) {
    return {
      buy: Number(fromSnapshot.value_buy),
      sell: Number(fromSnapshot.value_sell),
      date: refDate,
      dataHoraCotacao: '',
    };
  }
  const fromApi = await fetchDollarFromBcb(refDate);
  if (fromApi) await persistBcbRate(RATE_TYPE_DOLLAR, refDate, { value_buy: fromApi.buy, value_sell: fromApi.sell });
  return fromApi;
}

type SgsEntry = { data: string; valor: string };

/**
 * Busca valor mensal de uma série SGS do BCB para um mês de referência.
 * date: YYYY-MM-DD ou YYYY-MM (usa o mês); se omitido, usa último valor disponível.
 * Retorna o valor em percentual (ex.: 0.33 = 0,33%).
 */
async function getSgsRate(serie: number, date?: string): Promise<{ value: number; date: string } | null> {
  const cacheOpt = { next: { revalidate: 3600 } } as const; // 1h
  try {
    if (date) {
      const [y, m] = date.slice(0, 7).split('-');
      const dataInicial = `01/${m!.padStart(2, '0')}/${y}`;
      const lastDay = new Date(Number(y), Number(m), 0).getDate();
      const dataFinal = `${String(lastDay).padStart(2, '0')}/${m}/${y}`;
      const url = `${BCB_SGS_BASE}/bcdata.sgs.${serie}/dados?formato=json&dataInicial=${dataInicial}&dataFinal=${dataFinal}`;
      const res = await fetch(url, cacheOpt);
      const arr = (await res.json()) as SgsEntry[];
      const entry = arr?.[0];
      if (!entry) return null;
      const val = Number(entry.valor.replace(',', '.'));
      if (Number.isNaN(val)) return null;
      const [dd, mm, yyyy] = entry.data.split('/');
      return { value: val, date: `${yyyy}-${mm}-${dd}` };
    }
    const url = `${BCB_SGS_BASE}/bcdata.sgs.${serie}/dados/ultimos/1?formato=json`;
    const res = await fetch(url, cacheOpt);
    const arr = (await res.json()) as SgsEntry[];
    const entry = arr?.[0];
    if (!entry) return null;
    const val = Number(entry.valor.replace(',', '.'));
    if (Number.isNaN(val)) return null;
    const [dd, mm, yyyy] = entry.data.split('/');
    return { value: val, date: `${yyyy}-${mm}-${dd}` };
  } catch {
    return null;
  }
}

/** Normaliza data para primeiro dia do mês YYYY-MM-01. */
function firstDayOfMonth(dateStr: string): string {
  const [y, m] = dateStr.slice(0, 7).split('-');
  return `${y}-${m}-01`;
}

/**
 * Retorna variação mensal do IPCA (%). date: YYYY-MM-DD ou YYYY-MM; omitido = último mês disponível.
 * Lê primeiro do snapshot; se não houver, busca na API BCB e persiste.
 */
export async function getIpcaRate(date?: string): Promise<{ value: number; date: string } | null> {
  if (date) {
    const refDate = firstDayOfMonth(date);
    const fromSnapshot = await getBcbRateFromSnapshot(RATE_TYPE_IPCA, refDate);
    if (fromSnapshot != null && fromSnapshot.value != null) {
      return { value: Number(fromSnapshot.value), date: refDate };
    }
  }
  const fromApi = await getSgsRate(SGS_IPCA, date);
  if (fromApi) {
    const refDate = firstDayOfMonth(fromApi.date);
    await persistBcbRate(RATE_TYPE_IPCA, refDate, { value: fromApi.value });
  }
  return fromApi;
}

/**
 * Retorna variação mensal do IGP-M (%). date: YYYY-MM-DD ou YYYY-MM; omitido = último mês disponível.
 * Lê primeiro do snapshot; se não houver, busca na API BCB e persiste.
 */
export async function getIgpmRate(date?: string): Promise<{ value: number; date: string } | null> {
  if (date) {
    const refDate = firstDayOfMonth(date);
    const fromSnapshot = await getBcbRateFromSnapshot(RATE_TYPE_IGPM, refDate);
    if (fromSnapshot != null && fromSnapshot.value != null) {
      return { value: Number(fromSnapshot.value), date: refDate };
    }
  }
  const fromApi = await getSgsRate(SGS_IGPM, date);
  if (fromApi) {
    const refDate = firstDayOfMonth(fromApi.date);
    await persistBcbRate(RATE_TYPE_IGPM, refDate, { value: fromApi.value });
  }
  return fromApi;
}

/**
 * Retorna índices expostos por ness.DATA (dólar PTAX, IPCA, IGP-M).
 * Consumidores: FIN (reajuste, precificação), GROWTH (precificação em projetos).
 */
export async function getIndices(options?: { date?: string }): Promise<{
  dollar: DollarRateResult;
  ipca: { value: number; date: string } | null;
  igpm: { value: number; date: string } | null;
}> {
  const ref = options?.date ?? undefined;
  const [dollar, ipca, igpm] = await Promise.all([
    getDollarRate(ref),
    getIpcaRate(ref),
    getIgpmRate(ref),
  ]);
  return { dollar, ipca, igpm };
}

// === Sync BCB (persistência para avaliações) ===

export type SyncBcbRatesSnapshotResult = { success?: boolean; error?: string; saved?: number };

/**
 * Sincroniza snapshot BCB para uma data: dólar PTAX (dia), IPCA e IGP-M (mês).
 * refDate: YYYY-MM-DD (default: hoje). Persiste em bcb_rates_snapshot.
 */
export async function syncBcbRatesSnapshot(refDate?: string): Promise<SyncBcbRatesSnapshotResult> {
  const d = refDate ? new Date(refDate + 'T12:00:00Z') : new Date();
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const dateStr = `${yyyy}-${mm}-${dd}`;
  const monthStr = `${yyyy}-${mm}`;

  const [dollar, ipca, igpm] = await Promise.all([
    fetchDollarFromBcb(dateStr),
    getSgsRate(SGS_IPCA, monthStr),
    getSgsRate(SGS_IGPM, monthStr),
  ]);

  let saved = 0;
  if (dollar) {
    await persistBcbRate(RATE_TYPE_DOLLAR, dateStr, { value_buy: dollar.buy, value_sell: dollar.sell });
    saved++;
  }
  if (ipca) {
    await persistBcbRate(RATE_TYPE_IPCA, firstDayOfMonth(ipca.date), { value: ipca.value });
    saved++;
  }
  if (igpm) {
    await persistBcbRate(RATE_TYPE_IGPM, firstDayOfMonth(igpm.date), { value: igpm.value });
    saved++;
  }
  revalidatePath('/app/data');
  return { success: true, saved };
}

// === Agregação de eventos (acontecimentos) — massa para índices ===

export type EventAggregateRow = { period: string; module: string; event_type: string; count: number };

/**
 * Agrega module_events por (module, event_type) para um período (date).
 * Faz upsert em event_aggregates. Opcionalmente marca eventos como processed.
 * period: YYYY-MM-DD.
 */
export async function aggregateModuleEventsForPeriod(period: string): Promise<{
  success?: boolean;
  error?: string;
  rowsAffected?: number;
}> {
  const supabase = await getServerClient();
  const periodDate = period.slice(0, 10);
  const nextDay = new Date(periodDate + 'T12:00:00Z');
  nextDay.setUTCDate(nextDay.getUTCDate() + 1);
  const nextDayStr = nextDay.toISOString().slice(0, 10);

  const { data: events, error: fetchErr } = await supabase
    .from('module_events')
    .select('module, event_type')
    .gte('created_at', periodDate + 'T00:00:00Z')
    .lt('created_at', nextDayStr + 'T00:00:00Z');

  if (fetchErr) return { error: fetchErr.message };
  const list = events ?? [];

  const agg = new Map<string, number>();
  for (const row of list) {
    const key = `${row.module}|${row.event_type}`;
    agg.set(key, (agg.get(key) ?? 0) + 1);
  }

  const rows = Array.from(agg.entries()).map(([key, count]) => {
    const [module, event_type] = key.split('|');
    return { period: periodDate, module, event_type, count };
  });

  if (rows.length === 0) {
    return { success: true, rowsAffected: 0 };
  }

  const { error: upsertErr } = await supabase.from('event_aggregates').upsert(
    rows.map((r) => ({ period: r.period, module: r.module, event_type: r.event_type, count: r.count, updated_at: new Date().toISOString() })),
    { onConflict: 'period,module,event_type' }
  );
  if (upsertErr) return { error: upsertErr.message };

  revalidatePath('/app/data');
  return { success: true, rowsAffected: rows.length };
}

/**
 * Retorna agregações de eventos para um período (ou últimos períodos).
 */
export async function getEventAggregates(options?: { period?: string; limit?: number }): Promise<EventAggregateRow[]> {
  const supabase = await getServerClient();
  let q = supabase
    .from('event_aggregates')
    .select('period, module, event_type, count')
    .order('period', { ascending: false });
  if (options?.period) q = q.eq('period', options.period);
  if (options?.limit) q = q.limit(options.limit);
  const { data } = await q;
  return (data ?? []) as EventAggregateRow[];
}

// === Índices derivados (data_indices) — Phase 2 ===

export type DataIndexRow = { period: string; index_key: string; value: number; metadata?: Record<string, unknown> };

/**
 * Calcula e persiste índices derivados para um mês. period: YYYY-MM-01.
 * Índices: leads_mes (count inbound_leads no mês), contratos_ativos (count contracts ativos no fim do mês), mrr_total (soma MRR ativo no fim do mês).
 */
export async function computeDataIndices(period: string): Promise<{ success?: boolean; error?: string; saved?: number }> {
  const match = /^(\d{4})-(\d{2})-01$/.exec(period);
  if (!match) return { error: 'period deve ser YYYY-MM-01.' };

  const [y, m] = [match[1], match[2]];
  const periodStart = `${y}-${m}-01`;
  const lastDay = new Date(Number(y), Number(m), 0).getDate();
  const periodEnd = `${y}-${m}-${String(lastDay).padStart(2, '0')}`;

  const supabase = await getServerClient();

  const [leadsRes, contractsRes, mrrRes] = await Promise.all([
    supabase.from('inbound_leads').select('id', { count: 'exact', head: true }).gte('created_at', periodStart).lte('created_at', periodEnd + 'T23:59:59.999Z'),
    supabase.from('contracts').select('id', { count: 'exact', head: true }).lte('start_date', periodEnd).or(`end_date.is.null,end_date.gte.${periodStart}`),
    supabase.from('contracts').select('mrr').lte('start_date', periodEnd).or(`end_date.is.null,end_date.gte.${periodStart}`),
  ]);

  const leadsCount = leadsRes.count ?? 0;
  const contractsCount = contractsRes.count ?? 0;
  const mrrTotal = (mrrRes.data ?? []).reduce((sum, row) => sum + Number(row.mrr ?? 0), 0);

  const rows = [
    { period: periodStart, index_key: 'leads_mes', value: leadsCount, metadata: {} },
    { period: periodStart, index_key: 'contratos_ativos', value: contractsCount, metadata: {} },
    { period: periodStart, index_key: 'mrr_total', value: mrrTotal, metadata: {} },
  ];

  const { error } = await supabase.from('data_indices').upsert(
    rows.map((r) => ({ period: r.period, index_key: r.index_key, value: r.value, metadata: r.metadata ?? {}, updated_at: new Date().toISOString() })),
    { onConflict: 'period,index_key' }
  );
  if (error) return { error: error.message };
  revalidatePath('/app/data');
  return { success: true, saved: rows.length };
}

/**
 * Retorna índices derivados (data_indices). Filtros opcionais por período ou chave.
 */
export async function getDataIndices(options?: { period?: string; index_key?: string; limit?: number }): Promise<DataIndexRow[]> {
  const supabase = await getServerClient();
  let q = supabase.from('data_indices').select('period, index_key, value, metadata').order('period', { ascending: false });
  if (options?.period) q = q.eq('period', options.period);
  if (options?.index_key) q = q.eq('index_key', options.index_key);
  if (options?.limit) q = q.limit(options.limit);
  const { data } = await q;
  return (data ?? []) as DataIndexRow[];
}

// === Hub de Indicadores (ingestão) — OPS dashboards ===

const INDICATOR_SOURCES = ['Infra', 'Sec', 'Data', 'Custom'] as const;
export type IndicatorSource = (typeof INDICATOR_SOURCES)[number];

export type IndicatorRow = {
  id: string;
  source: string;
  contract_id: string | null;
  metric_type: string;
  value: number;
  metadata: Record<string, unknown> | null;
  period: string | null;
  created_at: string;
};

/**
 * Lista indicadores ingeridos (para OPS dashboards). Filtros opcionais.
 * Consumidor: ness.OPS em /app/ops/indicators.
 */
export async function getIndicators(options?: {
  source?: IndicatorSource;
  contract_id?: string;
  period?: string;
  limit?: number;
}): Promise<IndicatorRow[]> {
  const supabase = await getServerClient();
  let q = supabase
    .from('indicators')
    .select('id, source, contract_id, metric_type, value, metadata, period, created_at')
    .order('created_at', { ascending: false });
  if (options?.source) q = q.eq('source', options.source);
  if (options?.contract_id) q = q.eq('contract_id', options.contract_id);
  if (options?.period) q = q.eq('period', options.period);
  if (options?.limit) q = q.limit(options.limit);
  const { data } = await q;
  return (data ?? []) as IndicatorRow[];
}

const INDICATOR_INGEST_ROLES = ['admin', 'superadmin', 'ops'];

/**
 * Ingestão de indicador (uso interno, ex.: UI OPS). Para ferramentas externas use POST /api/data/indicators/ingest com API key.
 */
export async function ingestIndicator(payload: {
  source: IndicatorSource;
  contract_id?: string | null;
  metric_type: string;
  value: number;
  metadata?: Record<string, unknown> | null;
  period?: string | null;
}): Promise<{ success?: boolean; id?: string; error?: string }> {
  const supabase = await getServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Não autenticado.' };

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  const role = (profile?.role as string) ?? '';
  if (!INDICATOR_INGEST_ROLES.includes(role)) {
    return { error: 'Sem permissão. Apenas admin, ops ou superadmin.' };
  }

  if (!INDICATOR_SOURCES.includes(payload.source)) {
    return { error: `source deve ser um de: ${INDICATOR_SOURCES.join(', ')}.` };
  }

  const { data: row, error } = await supabase
    .from('indicators')
    .insert({
      source: payload.source,
      contract_id: payload.contract_id ?? null,
      metric_type: payload.metric_type,
      value: payload.value,
      metadata: payload.metadata ?? null,
      period: payload.period ?? null,
    })
    .select('id')
    .single();

  if (error) return { error: error.message };
  revalidatePath('/app/ops/indicators');
  return { success: true, id: row?.id };
}
