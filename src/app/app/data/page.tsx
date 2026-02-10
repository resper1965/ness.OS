import Link from 'next/link';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { NessBrand } from '@/components/shared/ness-brand';
import { ErpSyncButton } from '@/components/fin/erp-sync-button';
import { getDataDashboardSummary } from '@/app/actions/data';
import { Database, BarChart3, RefreshCw, Users, FileText, Calendar, TrendingUp, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function DataPage() {
  const summary = await getDataDashboardSummary();

  return (
    <PageContent>
      <AppPageHeader
        title={<NessBrand suffix="DATA" />}
        subtitle="Camada de dados: ingestão ERP, indicadores, snapshots e acontecimentos."
      />

      {/* Resumo dos dados persistidos */}
      <Card>
        <CardHeader>
          <CardTitle>Dados persistidos na base</CardTitle>
          <CardDescription>
            Tabelas alimentadas pelo sync ERP (Omie), snapshots (faturamento, BCB) e agregação de eventos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-800/30 p-4">
              <Users className="h-8 w-8 shrink-0 text-ness" aria-hidden />
              <div>
                <p className="text-2xl font-semibold text-white">{summary.clientsTotal}</p>
                <p className="text-sm text-slate-400">Total de clientes</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-800/30 p-4">
              <FileText className="h-8 w-8 shrink-0 text-ness" aria-hidden />
              <div>
                <p className="text-2xl font-semibold text-white">{summary.clientsWithOmie}</p>
                <p className="text-sm text-slate-400">Clientes com Omie (sync)</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-800/30 p-4">
              <BarChart3 className="h-8 w-8 shrink-0 text-ness" aria-hidden />
              <div>
                <p className="text-2xl font-semibold text-white">{summary.indicatorsCount}</p>
                <p className="text-sm text-slate-400">Indicadores ingeridos</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-800/30 p-4">
              <RefreshCw className="h-8 w-8 shrink-0 text-ness" aria-hidden />
              <div>
                <p className="text-sm font-medium text-white">
                  {summary.lastSync?.status === 'success'
                    ? `${summary.lastSync.record_count ?? 0} registros`
                    : summary.lastSync?.status ?? '—'}
                </p>
                <p className="text-sm text-slate-400">Último sync ERP</p>
              </div>
            </div>
          </div>
          {/* Snapshots e acontecimentos */}
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-800/30 p-4">
              <Calendar className="h-8 w-8 shrink-0 text-ness" aria-hidden />
              <div>
                <p className="text-lg font-semibold text-white">
                  {summary.lastErpRevenuePeriod ?? '—'}
                </p>
                <p className="text-sm text-slate-400">Último snapshot faturamento (mês)</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-800/30 p-4">
              <TrendingUp className="h-8 w-8 shrink-0 text-ness" aria-hidden />
              <div>
                <p className="text-lg font-semibold text-white">
                  {summary.lastBcbRatesDate ?? '—'}
                </p>
                <p className="text-sm text-slate-400">Último snapshot BCB (dólar/índices)</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-800/30 p-4">
              <Activity className="h-8 w-8 shrink-0 text-ness" aria-hidden />
              <div>
                <p className="text-2xl font-semibold text-white">{summary.eventsTotal}</p>
                <p className="text-sm text-slate-400">Eventos (module_events)</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-800/30 p-4">
              <Activity className="h-8 w-8 shrink-0 text-ness" aria-hidden />
              <div>
                <p className="text-2xl font-semibold text-white">{summary.eventAggregatesCount}</p>
                <p className="text-sm text-slate-400">Acontecimentos agregados</p>
              </div>
            </div>
          </div>
          {/* Índices derivados (Phase 2) */}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-800/30 p-4">
              <BarChart3 className="h-8 w-8 shrink-0 text-ness" aria-hidden />
              <div>
                <p className="text-lg font-semibold text-white">{summary.lastDataIndicesPeriod ?? '—'}</p>
                <p className="text-sm text-slate-400">Último período índices derivados</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-800/30 p-4">
              <BarChart3 className="h-8 w-8 shrink-0 text-ness" aria-hidden />
              <div>
                <p className="text-2xl font-semibold text-white">{summary.dataIndicesCount}</p>
                <p className="text-sm text-slate-400">Registros em data_indices</p>
              </div>
            </div>
          </div>
          {summary.recentDataIndices.length > 0 && (
            <div className="mt-4">
              <h3 className="mb-2 text-sm font-medium text-slate-300">Índices derivados (leads_mes, contratos_ativos, mrr_total)</h3>
              <ul className="max-h-32 overflow-y-auto rounded border border-slate-700 bg-slate-800/30 p-2 text-sm">
                {summary.recentDataIndices.map((row, i) => (
                  <li key={`${row.period}-${row.index_key}-${i}`} className="flex justify-between gap-2 py-1 text-slate-400">
                    <span>{row.period}</span>
                    <span>{row.index_key}</span>
                    <span className="font-medium text-white">{Number(row.value).toLocaleString('pt-BR')}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {summary.recentEventAggregates.length > 0 && (
            <div className="mt-4">
              <h3 className="mb-2 text-sm font-medium text-slate-300">Últimos acontecimentos (por período)</h3>
              <ul className="max-h-40 overflow-y-auto rounded border border-slate-700 bg-slate-800/30 p-2 text-sm">
                {summary.recentEventAggregates.map((row, i) => (
                  <li key={`${row.period}-${row.module}-${row.event_type}-${i}`} className="flex justify-between gap-2 py-1 text-slate-400">
                    <span>{row.period}</span>
                    <span>{row.module}.{row.event_type}</span>
                    <span className="font-medium text-white">{row.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="mt-4 text-xs text-slate-500">
            Clientes vindos do Omie ficam em <code className="rounded bg-slate-700 px-1">clients</code> (campos name, document, contact_email, omie_codigo).
            Snapshots: <code className="rounded bg-slate-700 px-1">erp_revenue_snapshot</code>, <code className="rounded bg-slate-700 px-1">bcb_rates_snapshot</code>.
            Acontecimentos: <code className="rounded bg-slate-700 px-1">event_aggregates</code>. Índices derivados: <code className="rounded bg-slate-700 px-1">data_indices</code> (leads_mes, contratos_ativos, mrr_total). Ver{' '}
            <Link href="/app/fin/contratos" className="text-ness hover:underline">
              ness.FIN → Contratos
            </Link>{' '}
            para listar clientes e contratos.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/app/ops/indicators"
          className="flex items-start gap-3 rounded-lg border border-slate-700 p-4 hover:bg-slate-800/50 hover:border-ness/50"
        >
          <BarChart3 className="h-5 w-5 shrink-0 text-ness" aria-hidden />
          <div>
            <h2 className="mb-1 font-semibold text-white">Indicadores</h2>
            <p className="text-sm text-slate-400">
              Métricas ingeridas via API (Infra, Sec, Data, Custom). Hub centralizado.
            </p>
          </div>
        </Link>
        <div className="flex items-start gap-3 rounded-lg border border-slate-700 p-4">
          <RefreshCw className="h-5 w-5 shrink-0 text-ness" aria-hidden />
          <div className="flex-1">
            <h2 className="mb-1 font-semibold text-white">Sync ERP (Omie)</h2>
            <p className="mb-3 text-sm text-slate-400">
              Sincronização de clientes (ListarClientes). Persistido em <code className="rounded bg-slate-700 px-1">clients</code>. Log em <code className="rounded bg-slate-700 px-1">erp_sync_log</code>.
            </p>
            <ErpSyncButton lastSync={summary.lastSync} />
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-4">
        <div className="flex items-center gap-2 text-slate-400">
          <Database className="h-4 w-4 shrink-0" aria-hidden />
          <span className="text-sm">
            ness.DATA é a camada única que colhe e normaliza dados de fontes externas (Omie primeiro).
            Os módulos FIN, OPS, GROWTH e PEOPLE consomem via actions; não integram diretamente com o ERP.
            Dicionário de dados ERP: <code className="rounded bg-slate-700 px-1">docs/DATA-ERP-DICIONARIO.md</code>.
          </span>
        </div>
      </div>
    </PageContent>
  );
}
