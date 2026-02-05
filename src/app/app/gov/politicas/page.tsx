import Link from 'next/link';
import { getServerClient } from '@/lib/supabase/queries/base';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PageCard } from '@/components/shared/page-card';
import { DataTable } from '@/components/shared/data-table';
import { PrimaryButton } from '@/components/shared/primary-button';

type PolicyRow = {
  id: string;
  title: string;
  slug: string | null;
  created_at: string;
  policy_versions: { version: number }[] | null;
};

export default async function GovPoliticasPage() {
  const supabase = await getServerClient();
  const { data: policies } = await supabase
    .from('policies')
    .select(`
      id,
      title,
      slug,
      created_at,
      policy_versions(version)
    `)
    .order('created_at', { ascending: false });

  const rows = (policies ?? []) as PolicyRow[];

  return (
    <PageContent>
      <AppPageHeader
        title="Políticas"
        subtitle="Normas internas com versionamento e rastreabilidade de aceite."
        actions={<PrimaryButton href="/app/gov/politicas/novo">Nova política</PrimaryButton>}
      />
      <PageCard title="Políticas">
        <DataTable<PolicyRow>
          data={rows}
          keyExtractor={(row) => row.id}
          emptyMessage="Nenhuma política cadastrada"
          emptyDescription="Normas internas com versionamento e rastreabilidade de aceite."
          emptyAction={<PrimaryButton href="/app/gov/politicas/novo">Nova política</PrimaryButton>}
          columns={[
            { key: 'title', header: 'Título' },
            {
              key: 'slug',
              header: 'Slug',
              render: (row) => <span className="text-slate-400">{row.slug ?? '-'}</span>,
            },
            {
              key: 'versions',
              header: 'Versões',
              render: (row) => (
                <span className="text-slate-400">
                  {(row.policy_versions ?? []).length}
                </span>
              ),
            },
            {
              key: 'created_at',
              header: 'Data',
              render: (row) => (
                <span className="text-slate-400">
                  {new Date(row.created_at).toLocaleDateString('pt-BR')}
                </span>
              ),
            },
          ]}
          actions={(row) => (
            <Link href={`/app/gov/politicas/${row.id}`} className="text-ness hover:underline">
              Editar
            </Link>
          )}
        />
      </PageCard>
    </PageContent>
  );
}
