import { getServerClient } from '@/lib/supabase/queries/base';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PageCard } from '@/components/shared/page-card';
import { DataTable } from '@/components/shared/data-table';

type JobAppRow = {
  id: string;
  candidate_name: string;
  candidate_email: string;
  created_at: string;
  public_jobs: { title?: string } | { title?: string }[] | null;
};

function jobTitle(row: JobAppRow): string {
  const j = row.public_jobs;
  if (!j) return '-';
  const t = Array.isArray(j) ? j[0] : j;
  return (t as { title?: string })?.title ?? '-';
}

export default async function CandidatosPage() {
  const supabase = await getServerClient();
  const { data: apps } = await supabase
    .from('job_applications')
    .select('id, candidate_name, candidate_email, created_at, public_jobs(title)')
    .order('created_at', { ascending: false });

  const rows = (apps ?? []) as JobAppRow[];

  return (
    <PageContent>
      <AppPageHeader
        title="Candidatos"
        subtitle="Candidaturas das vagas publicadas em /carreiras."
      />
      <PageCard title="Candidatos">
        <DataTable<JobAppRow>
          data={rows}
          keyExtractor={(row) => row.id}
          emptyMessage="Nenhuma candidatura"
          emptyDescription="Candidaturas aparecem aqui quando alguém se inscreve em uma vaga em /carreiras. Publique vagas abertas em Vagas para receber candidatos."
          columns={[
            { key: 'candidate_name', header: 'Nome' },
            {
              key: 'candidate_email',
              header: 'E-mail',
              render: (row) => <span className="text-slate-400">{row.candidate_email}</span>,
            },
            {
              key: 'vaga',
              header: 'Vaga',
              render: (row) => <span className="text-slate-400">{jobTitle(row)}</span>,
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
        />
      </PageCard>
    </PageContent>
  );
}
