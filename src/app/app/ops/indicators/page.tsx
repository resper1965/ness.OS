import { BarChart3 } from 'lucide-react';
import { getIndicators } from '@/app/actions/data';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PageCard } from '@/components/shared/page-card';
import { EmptyState } from '@/components/shared/empty-state';

export default async function IndicatorsPage() {
  const indicators = await getIndicators({ limit: 100 });

  return (
    <PageContent>
      <AppPageHeader
        title="Hub de Indicadores"
        subtitle="Métricas ingeridas de fontes externas (Infra, Sec, Data, Custom). Dados via POST /api/data/indicators/ingest com API key."
      />
      <PageCard title="Indicadores recentes">
        {indicators.length === 0 ? (
          <EmptyState
            icon={BarChart3}
            title="Nenhum indicador ingerido"
            message="Configure INGEST_INDICATORS_API_KEY e envie métricas via POST /api/data/indicators/ingest."
            description="Source: Infra | Sec | Data | Custom; metric_type e value."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-800/50 text-slate-300">
                <tr className="h-[52px]">
                  <th className="px-5 py-4 font-medium text-left">Fonte</th>
                  <th className="px-5 py-4 font-medium text-left">Tipo</th>
                  <th className="px-5 py-4 font-medium text-left">Valor</th>
                  <th className="px-5 py-4 font-medium text-left">Período</th>
                  <th className="px-5 py-4 font-medium text-left">Data ingestão</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700 text-slate-400">
                {indicators.map((i) => (
                  <tr key={i.id}>
                    <td className="px-5 py-4">{i.source}</td>
                    <td className="px-5 py-4">{i.metric_type}</td>
                    <td className="px-5 py-4">{Number(i.value).toLocaleString('pt-BR')}</td>
                    <td className="px-5 py-4">{i.period ?? '—'}</td>
                    <td className="px-5 py-4">{new Date(i.created_at).toLocaleString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PageCard>
    </PageContent>
  );
}
