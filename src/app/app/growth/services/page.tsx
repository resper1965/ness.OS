import Link from 'next/link';
import { getServerClient } from '@/lib/supabase/queries/base';
import { ServiceForm } from '@/components/growth/service-form';
import { AIProposalButton } from '@/components/growth/ai-proposal-button';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PageCard } from '@/components/shared/page-card';
import { DataTable } from '@/components/shared/data-table';

type ServiceActionRef = { service_actions?: { title?: string } };
type ServiceRow = {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  services_service_actions: ServiceActionRef[] | null;
};

function serviceActionTitles(row: ServiceRow): string {
  const ssa = row.services_service_actions;
  if (!Array.isArray(ssa) || ssa.length === 0) return '-';
  return ssa.map((s) => s.service_actions?.title).filter(Boolean).join(', ');
}

export default async function GrowthServicesPage() {
  const supabase = await getServerClient();
  const { data: services } = await supabase
    .from('services_catalog')
    .select('id, name, slug, is_active, services_service_actions(service_actions(title))')
    .order('name');
  const { data: serviceActions } = await supabase.from('service_actions').select('id, title').order('title');

  const rows = (services ?? []) as ServiceRow[];

  return (
    <PageContent>
      <AppPageHeader
        title="Catálogo de Serviços"
        subtitle="Serviços vendáveis. Só podem ficar ativos se tiverem playbook vinculado (Trava Growth×OPS)."
      />
      <div id="service-form"><ServiceForm serviceActions={serviceActions ?? []} /></div>
      <PageCard title="Catálogo de Serviços">
        <DataTable<ServiceRow>
          data={rows}
          keyExtractor={(row) => row.id}
          emptyMessage="Nenhum serviço cadastrado"
          emptyDescription="Serviços vendáveis. Use o formulário acima para criar. Só podem ficar ativos com playbook vinculado (Trava Growth×OPS). Catálogo de serviços para propostas e vendas."
          emptyAction={
            <Link href="#service-form" className="text-ness hover:underline font-medium">
              Criar serviço →
            </Link>
          }
          columns={[
            { key: 'name', header: 'Nome' },
            {
              key: 'slug',
              header: 'Slug',
              render: (row) => <span className="text-slate-400">{row.slug}</span>,
            },
            {
              key: 'service_action',
              header: 'Service Action',
              render: (row) => <span className="text-slate-400">{serviceActionTitles(row)}</span>,
            },
            {
              key: 'is_active',
              header: 'Ativo',
              render: (row) => <span className="text-slate-400">{row.is_active ? 'Sim' : 'Não'}</span>,
            },
          ]}
          actions={(row) => (
            <div className="flex items-center gap-3">
              <AIProposalButton serviceId={row.id} serviceName={row.name} />
              <Link href={`/app/growth/services/${row.id}`} className="text-ness hover:underline text-sm font-medium">
                Editar
              </Link>
            </div>
          )}
        />
      </PageCard>
    </PageContent>
  );
}
