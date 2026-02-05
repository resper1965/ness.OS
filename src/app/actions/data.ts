'use server';

import { getServerClient } from '@/lib/supabase/queries/base';
import { revalidatePath } from 'next/cache';
import { listarClientes, listarContasReceber } from '@/lib/omie/client';

/**
 * ness.DATA — Coletas de dados de fontes externas (Omie, BCB, indicadores, etc.).
 * Módulos de negócio (FIN, OPS, GROWTH, PEOPLE) consomem via estas actions; não chamam APIs externas diretamente.
 */

const ERP_SYNC_ALLOWED_ROLES = ['admin', 'superadmin', 'cfo', 'fin'];
const ERP_SYNC_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutos

// === ERP SYNC (Omie) ===

export type ErpSyncResult = { success?: boolean; error?: string; logId?: string };

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

// === Índices BCB (dólar PTAX, IPCA, IGPM) — precificação e reajuste ===

const BCB_PTAX_BASE = 'https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata';
const BCB_SGS_BASE = 'https://api.bcb.gov.br/dados/serie';
// SGS: 433 = IPCA (variação mensal %), 189 = IGP-M (variação mensal %)
const SGS_IPCA = 433;
const SGS_IGPM = 189;

export type DollarRateResult = {
  buy: number;
  sell: number;
  date: string;
  dataHoraCotacao: string;
} | null;

/**
 * Retorna cotação do dólar (PTAX) para uma data. Formato data: YYYY-MM-DD (default: hoje).
 * Fonte: BCB PTAX. Usado por precificação (ness.GROWTH/FIN).
 */
export async function getDollarRate(date?: string): Promise<DollarRateResult> {
  const d = date ? new Date(date + 'T12:00:00Z') : new Date();
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const yyyy = d.getUTCFullYear();
  const dataCotacao = `${dd}-${mm}-${yyyy}`;

  const url = `${BCB_PTAX_BASE}/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='${dataCotacao}'&$format=json`;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } }); // cache 1h
    const json = (await res.json()) as { value?: { cotacaoCompra: number; cotacaoVenda: number; dataHoraCotacao: string }[] };
    const value = json.value?.[0];
    if (!value) return null;
    return {
      buy: value.cotacaoCompra,
      sell: value.cotacaoVenda,
      date: `${yyyy}-${mm}-${dd}`,
      dataHoraCotacao: value.dataHoraCotacao,
    };
  } catch {
    return null;
  }
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

/**
 * Retorna variação mensal do IPCA (%). date: YYYY-MM-DD ou YYYY-MM; omitido = último mês disponível.
 * Fonte: BCB SGS 433. FIN usa no Ciclo de Vida (reajuste).
 */
export async function getIpcaRate(date?: string): Promise<{ value: number; date: string } | null> {
  return getSgsRate(SGS_IPCA, date);
}

/**
 * Retorna variação mensal do IGP-M (%). date: YYYY-MM-DD ou YYYY-MM; omitido = último mês disponível.
 * Fonte: BCB SGS 189. FIN usa no Ciclo de Vida (reajuste).
 */
export async function getIgpmRate(date?: string): Promise<{ value: number; date: string } | null> {
  return getSgsRate(SGS_IGPM, date);
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
