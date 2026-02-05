'use client';

import { useCallback, useEffect, useState } from 'react';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PageCard } from '@/components/shared/page-card';
import { DataTable } from '@/components/shared/data-table';
import { exportToCsv } from '@/lib/csv-export';
import {
  getMrrReport,
  getRentabilityReport,
  getReconciliationReport,
  getLifecycleReport,
  getOmieRevenueReport,
  type MrrReportRow,
  type RentabilityReportRow,
  type ReconciliationAlert,
  type LifecycleReportRow,
  type OmieRevenueReportRow,
} from '@/app/actions/fin';

type ReportType = 'mrr' | 'rentabilidade' | 'reconciliacao' | 'ciclo' | 'omie';

const REPORT_LABELS: Record<ReportType, string> = {
  mrr: 'MRR por cliente',
  rentabilidade: 'Rentabilidade',
  reconciliacao: 'Reconciliação MRR vs Omie',
  ciclo: 'Ciclo de vida (renovações/vencimentos)',
  omie: 'Faturamento Omie',
};

function formatDateBr(iso: string | null): string {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('pt-BR');
}

function toDdMmYyyy(iso: string): string {
  const d = new Date(iso + 'T12:00:00');
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export default function FinRelatoriosPage() {
  const [reportType, setReportType] = useState<ReportType>('mrr');
  const [fromDate, setFromDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [toDate, setToDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 90);
    return d.toISOString().slice(0, 10);
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mrrData, setMrrData] = useState<MrrReportRow[]>([]);
  const [rentData, setRentData] = useState<RentabilityReportRow[]>([]);
  const [reconData, setReconData] = useState<ReconciliationAlert[]>([]);
  const [cicloData, setCicloData] = useState<LifecycleReportRow[]>([]);
  const [omieData, setOmieData] = useState<{ rows: OmieRevenueReportRow[]; total: number }>({ rows: [], total: 0 });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      switch (reportType) {
        case 'mrr':
          setMrrData(await getMrrReport());
          break;
        case 'rentabilidade':
          setRentData(await getRentabilityReport());
          break;
        case 'reconciliacao':
          setReconData(await getReconciliationReport());
          break;
        case 'ciclo':
          setCicloData(await getLifecycleReport({ fromDate, toDate }));
          break;
        case 'omie':
          setOmieData(
            await getOmieRevenueReport({
              dataInicio: toDdMmYyyy(fromDate),
              dataFim: toDdMmYyyy(toDate),
            })
          );
          break;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar relatório.');
    } finally {
      setLoading(false);
    }
  }, [reportType, fromDate, toDate]);

  useEffect(() => {
    load();
  }, [load]);

  const handleExportCsv = useCallback(() => {
    const base = `ness.FIN-relatorio-${reportType}`;
    switch (reportType) {
      case 'mrr':
        exportToCsv(
          mrrData,
          [
            { key: 'client_name', header: 'Cliente' },
            { key: 'mrr', header: 'MRR' },
            { key: 'contract_count', header: 'Contratos' },
          ],
          `${base}.csv`
        );
        break;
      case 'rentabilidade':
        exportToCsv(
          rentData,
          [
            { key: 'client_name', header: 'Cliente' },
            { key: 'revenue', header: 'Receita (MRR)' },
            { key: 'total_cost', header: 'Custo' },
            { key: 'rentability', header: 'Rentabilidade' },
          ],
          `${base}.csv`
        );
        break;
      case 'reconciliacao':
        exportToCsv(
          reconData,
          [
            { key: 'client_name', header: 'Cliente' },
            { key: 'mrr', header: 'MRR' },
            { key: 'faturamento_omie', header: 'Faturamento Omie' },
            { key: 'divergencia', header: 'Divergência' },
          ],
          `${base}.csv`
        );
        break;
      case 'ciclo':
        exportToCsv(
          cicloData,
          [
            { key: 'client_name', header: 'Cliente' },
            { key: 'mrr', header: 'MRR' },
            { key: 'renewal_date', header: 'Renovação' },
            { key: 'end_date', header: 'Vencimento' },
            { key: 'adjustment_index', header: 'Índice reajuste' },
          ],
          `${base}.csv`
        );
        break;
      case 'omie':
        exportToCsv(
          omieData.rows,
          [
            { key: 'client_name', header: 'Cliente' },
            { key: 'omie_codigo', header: 'Código Omie' },
            { key: 'valor', header: 'Valor' },
          ],
          `${base}.csv`
        );
        break;
    }
  }, [reportType, mrrData, rentData, reconData, cicloData, omieData.rows]);

  const showDates = reportType === 'ciclo' || reportType === 'omie';

  return (
    <PageContent>
      <AppPageHeader
        title="Relatórios"
        subtitle="MRR, rentabilidade, reconciliação, ciclo de vida e faturamento Omie. Exporte em CSV."
      />

      <PageCard title="Relatório">
        <div className="space-y-4 p-5">
          <div className="flex flex-wrap items-center gap-4">
            <label className="text-sm font-medium text-slate-300">
              Tipo
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as ReportType)}
                className="ml-2 rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-slate-200 focus:border-ness focus:outline-none focus:ring-1 focus:ring-ness"
              >
                {(Object.keys(REPORT_LABELS) as ReportType[]).map((k) => (
                  <option key={k} value={k}>
                    {REPORT_LABELS[k]}
                  </option>
                ))}
              </select>
            </label>
            {showDates && (
              <>
                <label className="text-sm text-slate-400">
                  De
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="ml-2 rounded border border-slate-600 bg-slate-800 px-2 py-1.5 text-slate-200"
                  />
                </label>
                <label className="text-sm text-slate-400">
                  Até
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="ml-2 rounded border border-slate-600 bg-slate-800 px-2 py-1.5 text-slate-200"
                  />
                </label>
              </>
            )}
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={
                loading ||
                (reportType === 'mrr' && !mrrData.length) ||
                (reportType === 'rentabilidade' && !rentData.length) ||
                (reportType === 'reconciliacao' && !reconData.length) ||
                (reportType === 'ciclo' && !cicloData.length) ||
                (reportType === 'omie' && !omieData.rows.length)
              }
              className="rounded-md bg-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-600 disabled:opacity-50"
            >
              Exportar CSV
            </button>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {loading && <p className="text-sm text-slate-400">Carregando…</p>}
        </div>
      </PageCard>

      {!loading && (
        <PageCard>
          {reportType === 'mrr' && (
            <DataTable<MrrReportRow>
              data={mrrData}
              keyExtractor={(r) => r.client_id}
              emptyMessage="Nenhum dado de MRR"
              emptyDescription="Cadastre contratos em Contratos."
              columns={[
                { key: 'client_name', header: 'Cliente' },
                {
                  key: 'mrr',
                  header: 'MRR',
                  render: (r) => `R$ ${Number(r.mrr).toLocaleString('pt-BR')}`,
                },
                { key: 'contract_count', header: 'Contratos' },
              ]}
            />
          )}
          {reportType === 'rentabilidade' && (
            <DataTable<RentabilityReportRow>
              data={rentData}
              keyExtractor={(r) => r.contract_id}
              emptyMessage="Nenhum dado de rentabilidade"
              emptyDescription="Cadastre contratos e métricas em ness.OPS → Métricas."
              columns={[
                { key: 'client_name', header: 'Cliente' },
                {
                  key: 'revenue',
                  header: 'Receita (MRR)',
                  render: (r) => `R$ ${Number(r.revenue).toLocaleString('pt-BR')}`,
                },
                {
                  key: 'total_cost',
                  header: 'Custo',
                  render: (r) => `R$ ${Number(r.total_cost).toLocaleString('pt-BR')}`,
                },
                {
                  key: 'rentability',
                  header: 'Rentabilidade',
                  render: (r) => (
                    <span className={Number(r.rentability) >= 0 ? 'text-green-400' : 'text-red-400'}>
                      R$ {Number(r.rentability).toLocaleString('pt-BR')}
                    </span>
                  ),
                },
              ]}
            />
          )}
          {reportType === 'reconciliacao' && (
            <DataTable<ReconciliationAlert>
              data={reconData}
              keyExtractor={(r) => r.client_id}
              emptyMessage="Nenhum alerta de reconciliação"
              emptyDescription="MRR e faturamento Omie dentro da tolerância ou Omie indisponível. Período: mês corrente."
              columns={[
                { key: 'client_name', header: 'Cliente' },
                {
                  key: 'mrr',
                  header: 'MRR',
                  render: (r) => `R$ ${r.mrr.toLocaleString('pt-BR')}`,
                },
                {
                  key: 'faturamento_omie',
                  header: 'Faturamento Omie',
                  render: (r) => `R$ ${r.faturamento_omie.toLocaleString('pt-BR')}`,
                },
                {
                  key: 'divergencia',
                  header: 'Divergência',
                  render: (r) => <span className="text-amber-400">R$ {r.divergencia.toLocaleString('pt-BR')}</span>,
                },
              ]}
            />
          )}
          {reportType === 'ciclo' && (
            <DataTable<LifecycleReportRow>
              data={cicloData}
              keyExtractor={(r) => r.contract_id}
              emptyMessage="Nenhum contrato no período"
              emptyDescription="Ajuste as datas De/Até."
              columns={[
                { key: 'client_name', header: 'Cliente' },
                {
                  key: 'mrr',
                  header: 'MRR',
                  render: (r) => `R$ ${Number(r.mrr).toLocaleString('pt-BR')}`,
                },
                {
                  key: 'renewal_date',
                  header: 'Renovação',
                  render: (r) => formatDateBr(r.renewal_date),
                },
                {
                  key: 'end_date',
                  header: 'Vencimento',
                  render: (r) => formatDateBr(r.end_date),
                },
                { key: 'adjustment_index', header: 'Índice reajuste' },
              ]}
            />
          )}
          {reportType === 'omie' && (
            <>
              {omieData.rows.length > 0 && (
                <p className="px-5 py-2 text-sm text-slate-400">
                  Total no período: <strong className="text-slate-200">R$ {omieData.total.toLocaleString('pt-BR')}</strong>
                </p>
              )}
              <DataTable<OmieRevenueReportRow>
                data={omieData.rows}
                keyExtractor={(r) => r.omie_codigo}
                emptyMessage="Nenhum faturamento no período"
                emptyDescription="Verifique as datas (DD/MM/YYYY no Omie) ou se a API Omie está disponível."
                columns={[
                  { key: 'client_name', header: 'Cliente' },
                  { key: 'omie_codigo', header: 'Código Omie' },
                  {
                    key: 'valor',
                    header: 'Valor',
                    render: (r) => `R$ ${Number(r.valor).toLocaleString('pt-BR')}`,
                  },
                ]}
              />
            </>
          )}
        </PageCard>
      )}

      {reportType === 'reconciliacao' && !loading && (
        <p className="text-xs text-slate-500">
          Reconciliação usa o mês corrente. Tolerância: 5% do MRR ou R$ 50.
        </p>
      )}
    </PageContent>
  );
}
