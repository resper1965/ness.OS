import Link from 'next/link';
import { getServerClient } from '@/lib/supabase/queries/base';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PageCard } from '@/components/shared/page-card';
import { DataTable } from '@/components/shared/data-table';
import { PrimaryButton } from '@/components/shared/primary-button';
import { ServiceActionRow } from '@/app/actions/ops';

export default async function ServiceActionsPage() {
  const supabase = await getServerClient();
  const { data: actions } = await supabase
    .from('service_actions')
    .select('*')
    .order('updated_at', { ascending: false });

  const rows = (actions ?? []) as ServiceActionRow[];

  return (
    <PageContent>
      <AppPageHeader
        title="Service Actions (Jobs)"
        subtitle="Unidades de entrega que orquestram Playbooks e definem custos/prazos."
        actions={<PrimaryButton href="/app/ops/service-actions/novo">Nova Action</PrimaryButton>}
      />
      <PageCard title="Actions Cadastradas">
        <DataTable<ServiceActionRow>
          data={rows}
          keyExtractor={(row) => row.id}
          emptyMessage="Nenhuma Service Action cadastrada"
          emptyDescription="As Actions são a ponte entre o catálogo de vendas (Growth) e os manuais técnicos (OPS)."
          columns={[
            { key: 'title', header: 'Título' },
            {
              key: 'complexity_factor',
              header: 'Complexidade',
              render: (row) => <span className="text-slate-400 font-mono">{row.complexity_factor}x</span>,
            },
            {
              key: 'estimated_duration_total',
              header: 'Duração (Total)',
              render: (row) => <span className="text-slate-400">{row.estimated_duration_total} min</span>,
            },
            {
              key: 'estimated_cost_total',
              header: 'Custo (Base)',
              render: (row) => (
                <span className="text-slate-400">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(row.estimated_cost_total)}
                </span>
              ),
            },
          ]}
          actions={(row) => (
            <Link href={`/app/ops/service-actions/${row.id}`} className="text-ness hover:underline">
              Gerenciar
            </Link>
          )}
        />
      </PageCard>
    </PageContent>
  );
}
