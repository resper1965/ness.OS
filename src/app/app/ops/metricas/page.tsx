import { createClient } from '@/lib/supabase/server';
import { MetricasForm } from '@/components/ops/metricas-form';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';

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
      />
      <MetricasForm contracts={contracts ?? []} recentMetrics={metrics ?? []} />
    </PageContent>
  );
}
