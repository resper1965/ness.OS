import { getIndicators } from '@/app/actions/data';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PageCard } from '@/components/shared/page-card';
import { DataTable } from '@/components/shared/data-table';

type IndicatorRow = {
  id: string;
  source: string;
  metric_type: string;
  value: number;
  period: string | null;
  created_at: string;
};

export default async function IndicatorsPage() {
  const indicators = (await getIndicators({ limit: 100 })) as IndicatorRow[];

  return (
    <PageContent>
      <AppPageHeader
        title="Hub de Indicadores"
        subtitle="Métricas ingeridas de fontes externas (Infra, Sec, Data, Custom). Dados via POST /api/data/indicators/ingest com API key."
      />
      <PageCard title="Indicadores recentes">
        <DataTable<IndicatorRow>
          data={indicators}
          keyExtractor={(row) => row.id}
          emptyMessage="Nenhum indicador ingerido"
          emptyDescription="Configure INGEST_INDICATORS_API_KEY e envie métricas via POST /api/data/indicators/ingest. Source: Infra | Sec | Data | Custom; metric_type e value."
          columns={[
            { key: 'source', header: 'Fonte' },
            { key: 'metric_type', header: 'Tipo' },
            {
              key: 'value',
              header: 'Valor',
              render: (row) => Number(row.value).toLocaleString('pt-BR'),
            },
            {
              key: 'period',
              header: 'Período',
              render: (row) => <span className="text-slate-400">{row.period ?? '—'}</span>,
            },
            {
              key: 'created_at',
              header: 'Data ingestão',
              render: (row) => (
                <span className="text-slate-400">
                  {new Date(row.created_at).toLocaleString('pt-BR')}
                </span>
              ),
            },
          ]}
        />
      </PageCard>
    </PageContent>
  );
}
