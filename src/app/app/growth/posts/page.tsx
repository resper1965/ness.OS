import Link from 'next/link';
import { getServerClient } from '@/lib/supabase/queries/base';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PageCard } from '@/components/shared/page-card';
import { DataTable } from '@/components/shared/data-table';
import { PrimaryButton } from '@/components/shared/primary-button';

type PostRow = {
  id: string;
  slug: string;
  title: string;
  is_published: boolean | null;
  published_at: string | null;
  created_at: string;
};

export default async function GrowthPostsPage() {
  const supabase = await getServerClient();
  const { data: posts } = await supabase
    .from('public_posts')
    .select('id, slug, title, is_published, published_at, created_at')
    .order('created_at', { ascending: false });

  const rows = (posts ?? []) as PostRow[];

  return (
    <PageContent>
      <AppPageHeader
        title="Posts do Blog"
        subtitle="Artigos publicados em /blog. Ative &quot;Publicar no Site&quot; para exibir."
        actions={<PrimaryButton href="/app/growth/posts/novo">Novo post</PrimaryButton>}
      />
      <PageCard title="Posts do Blog">
        <DataTable<PostRow>
          data={rows}
          keyExtractor={(row) => row.id}
          emptyMessage="Nenhum post cadastrado"
          emptyDescription="Crie o primeiro para publicar no blog do site. Ative &quot;Publicar no Site&quot; para exibir em /blog."
          emptyAction={<PrimaryButton href="/app/growth/posts/novo">Novo post</PrimaryButton>}
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
              key: 'date',
              header: 'Data',
              render: (row) => (
                <span className="text-slate-400">
                  {row.published_at
                    ? new Date(row.published_at).toLocaleDateString('pt-BR')
                    : new Date(row.created_at).toLocaleDateString('pt-BR')}
                </span>
              ),
            },
          ]}
          actions={(row) => (
            <Link href={`/app/growth/posts/${row.id}`} className="text-ness hover:underline">
              Editar
            </Link>
          )}
        />
      </PageCard>
    </PageContent>
  );
}
