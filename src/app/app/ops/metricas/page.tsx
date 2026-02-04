import { createClient } from '@/lib/supabase/server';
import { MetricasForm } from '@/components/ops/metricas-form';
import { SyncTimerMetricsButton } from '@/components/ops/sync-timer-metrics-button';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PageCard } from '@/components/shared/page-card';

export default async function MetricasPage() {
  const supabase = await createClient();
  const { data: contracts } = await supabase.from('contracts').select('id, mrr, client_id, clients(name)').order('client_id');
  const { data: metrics } = await supabase
    .from('performance_metrics')
    .select('*')
    .order('month', { ascending: false })
    .limit(50);

  return (
    <PageContent>
      <AppPageHeader
        title="Métricas de Performance"
        subtitle="Horas trabalhadas, custo cloud e SLA por contrato/mês. Alimenta o cálculo de rentabilidade."
        actions={<SyncTimerMetricsButton />}
      />
      <PageCard>
        <MetricasForm contracts={contracts ?? []} recentMetrics={metrics ?? []} />
      </PageCard>
    </PageContent>
  );
}
