import { createClient } from '@/lib/supabase/server';
import { LeadKanban } from '@/components/growth/lead-kanban';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PageCard } from '@/components/shared/page-card';

const COLUMNS = [
  { key: 'new', label: 'Novo', help: 'Lead recém-chegado. Aguardando primeiro contato.' },
  { key: 'qualified', label: 'Qualificado', help: 'Lead com potencial. Avaliado e qualificado.' },
  { key: 'proposal', label: 'Proposta', help: 'Proposta enviada. Aguardando resposta.' },
  { key: 'won', label: 'Ganho', help: 'Negócio fechado.' },
  { key: 'lost', label: 'Perdido', help: 'Fora do perfil, sem resposta ou não avançou.' },
] as const;

export default async function GrowthLeadsPage() {
  const supabase = await createClient();
  const { data: leads } = await supabase
    .from('inbound_leads')
    .select('id, name, email, company, message, status, created_at, origin_url')
    .order('created_at', { ascending: false });

  const byStatus = COLUMNS.reduce(
    (acc, col) => {
      acc[col.key] = (leads ?? []).filter((l) => (l.status || 'new') === col.key);
      return acc;
    },
    {} as Record<string, typeof leads extends (infer T)[] | null ? T[] : never[]>
  );

  return (
    <PageContent>
      <AppPageHeader
        title="Leads (CRM)"
        subtitle="Leads capturados no formulário de contato. Arraste os cards para alterar o status."
      />
      <PageCard>
        <LeadKanban columns={COLUMNS} leadsByStatus={byStatus} />
      </PageCard>
    </PageContent>
  );
}
