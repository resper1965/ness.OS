import Link from 'next/link';
import { getServerClient } from '@/lib/supabase/queries/base';
import { ServiceForm } from '@/components/growth/service-form';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PageCard } from '@/components/shared/page-card';
import { DataTable } from '@/components/shared/data-table';

type ServicePlaybook = { playbooks?: { title?: string } };
type ServiceRow = {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  services_playbooks: ServicePlaybook[] | null;
};

function playbookTitles(row: ServiceRow): string {
  const sp = row.services_playbooks;
  if (!Array.isArray(sp) || sp.length === 0) return '-';
  return sp.map((s) => s.playbooks?.title).filter(Boolean).join(', ');
}

export default async function GrowthServicesPage() {
  const supabase = await getServerClient();
  const { data: services } = await supabase
    .from('services_catalog')
    .select('id, name, slug, is_active, services_playbooks(playbooks(title))')
    .order('name');
  const { data: playbooks } = await supabase.from('playbooks').select('id, title').order('title');

  const rows = (services ?? []) as ServiceRow[];

  return (
    <PageContent>
      <AppPageHeader
        title="Catálogo de Serviços"
        subtitle="Serviços vendáveis. Só podem ficar ativos se tiverem playbook vinculado (Trava Growth×OPS)."
      />
      <div id="service-form"><ServiceForm playbooks={playbooks ?? []} /></div>
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
              key: 'playbook',
              header: 'Playbook',
              render: (row) => <span className="text-slate-400">{playbookTitles(row)}</span>,
            },
            {
              key: 'is_active',
              header: 'Ativo',
              render: (row) => <span className="text-slate-400">{row.is_active ? 'Sim' : 'Não'}</span>,
            },
          ]}
          actions={(row) => (
            <Link href={`/app/growth/services/${row.id}`} className="text-ness hover:underline">
              Editar
            </Link>
          )}
        />
      </PageCard>
    </PageContent>
  );
}
