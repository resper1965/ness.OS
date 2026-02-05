import Link from 'next/link';
import { getServerClient } from '@/lib/supabase/queries/base';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PageCard } from '@/components/shared/page-card';
import { DataTable } from '@/components/shared/data-table';
import { PrimaryButton } from '@/components/shared/primary-button';

type CaseRow = {
  id: string;
  slug: string;
  title: string;
  is_published: boolean | null;
  created_at: string;
};

export default async function GrowthCasosPage() {
  const supabase = await getServerClient();
  const { data: cases } = await supabase
    .from('success_cases')
    .select('id, slug, title, is_published, created_at')
    .order('created_at', { ascending: false });

  const rows = (cases ?? []) as CaseRow[];

  return (
    <PageContent>
      <AppPageHeader
        title="Casos de Sucesso"
        subtitle="Casos publicados em /casos. Ative &quot;Publicar no Site&quot; para exibir."
        actions={<PrimaryButton href="/app/growth/casos/novo">Novo caso</PrimaryButton>}
      />
      <PageCard title="Casos de Sucesso">
        <DataTable<CaseRow>
          data={rows}
          keyExtractor={(row) => row.id}
          emptyMessage="Nenhum caso de sucesso"
          emptyDescription="Crie o primeiro para publicar em /casos. Ative &quot;Publicar no Site&quot; para exibir. Casos de sucesso fortalecem a presença da marca."
          emptyAction={<PrimaryButton href="/app/growth/casos/novo">Novo caso</PrimaryButton>}
          columns={[
            { key: 'title', header: 'Título' },
            {
              key: 'slug',
              header: 'Slug',
              render: (row) => <span className="text-slate-400">{row.slug}</span>,
            },
            {
              key: 'status',
              header: 'Status',
              render: (row) => (
                <span
                  className={
                    row.is_published
                      ? 'rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-400'
                      : 'rounded-full bg-slate-600/50 px-2 py-0.5 text-xs text-slate-400'
                  }
                >
                  {row.is_published ? 'Publicado' : 'Rascunho'}
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
            <Link href={`/app/growth/casos/${row.id}`} className="text-ness hover:underline">
              Editar
            </Link>
          )}
        />
      </PageCard>
    </PageContent>
  );
}
