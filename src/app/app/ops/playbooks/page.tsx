import Link from 'next/link';
import { getServerClient } from '@/lib/supabase/queries/base';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PageCard } from '@/components/shared/page-card';
import { DataTable } from '@/components/shared/data-table';
import { PrimaryButton } from '@/components/shared/primary-button';

type PlaybookRow = {
  id: string;
  title: string;
  slug: string;
  updated_at: string;
};

export default async function PlaybooksPage() {
  const supabase = await getServerClient();
  const { data: playbooks } = await supabase
    .from('playbooks')
    .select('id, title, slug, updated_at')
    .order('updated_at', { ascending: false });

  const rows = (playbooks ?? []) as PlaybookRow[];

  return (
    <PageContent>
      <AppPageHeader
        title="Playbooks"
        subtitle="Manuais técnicos que definem &quot;como fazemos&quot;. Todo serviço vendido deve ter um playbook vinculado."
        actions={<PrimaryButton href="/app/ops/playbooks/novo">Novo playbook</PrimaryButton>}
      />
      <PageCard title="Playbooks">
        <DataTable<PlaybookRow>
          data={rows}
          keyExtractor={(row) => row.id}
          emptyMessage="Nenhum playbook cadastrado"
          emptyDescription="Crie o primeiro para documentar procedimentos e habilitar o Knowledge Bot. Todo serviço vendido deve ter um playbook vinculado."
          emptyAction={<PrimaryButton href="/app/ops/playbooks/novo">Novo playbook</PrimaryButton>}
          columns={[
            { key: 'title', header: 'Título' },
            {
              key: 'slug',
              header: 'Slug',
              render: (row) => <span className="text-slate-400">{row.slug}</span>,
            },
            {
              key: 'updated_at',
              header: 'Atualizado',
              render: (row) => (
                <span className="text-slate-400">
                  {new Date(row.updated_at).toLocaleDateString('pt-BR')}
                </span>
              ),
            },
          ]}
          actions={(row) => (
            <Link href={`/app/ops/playbooks/${row.id}`} className="text-ness hover:underline">
              Editar
            </Link>
          )}
        />
      </PageCard>
    </PageContent>
  );
}
