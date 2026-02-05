import { getGrowthDashboardData } from '@/app/actions/growth';
import { PageContent } from '@/components/shared/page-content';
import { GrowthDashboardHeader } from '@/components/growth/growth-dashboard-header';
import { GrowthDashboardCards } from '@/components/growth/growth-dashboard-cards';
import { LeadBySourceCard } from '@/components/growth/lead-by-source-card';
import { SalesPipelineCard } from '@/components/growth/sales-pipeline-card';
import { RecentLeadsCard } from '@/components/growth/recent-leads-card';

/**
 * Dashboard Comercial (ness.GROWTH) — visão C-level comercial e marketing.
 * Índices baseados em dados Omie (clientes, faturamento) e growth (leads, funil, origem).
 * Layout inspirado no CRM do clone: KPI cards, leads por origem, funil, tabela de leads.
 */
export default async function GrowthDashboardPage() {
  const data = await getGrowthDashboardData();

  return (
    <PageContent>
      <GrowthDashboardHeader />

      <div className="space-y-6">
        <GrowthDashboardCards data={data} />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <LeadBySourceCard items={data.leadsBySource} total={data.leadsTotal} />
          <SalesPipelineCard stages={data.pipelineStages} />
          <div className="md:col-span-2 xl:col-span-3">
            <RecentLeadsCard recentLeads={data.recentLeads} />
          </div>
        </div>
      </div>
    </PageContent>
  );
}
