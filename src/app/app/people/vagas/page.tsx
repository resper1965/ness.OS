import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { JobForm } from '@/components/people/job-form';
import { DataTable } from '@/components/shared/data-table';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { StatusBadge } from '@/components/shared/status-badge';

type Job = { id: string; title: string; department: string | null; is_open: boolean };

export default async function VagasPage() {
  const supabase = await createClient();
  const { data: jobs } = await supabase
    .from('public_jobs')
    .select('id, title, department, is_open')
    .order('created_at', { ascending: false });

  return (
    <PageContent>
      <AppPageHeader
        title="Vagas"
        subtitle="Vagas abertas aparecem em /carreiras. Candidaturas vão para Candidatos."
      />
      <JobForm />
      <div>
        <DataTable<Job>
          data={jobs ?? []}
          keyExtractor={(j) => j.id}
          emptyMessage="Nenhuma vaga cadastrada."
          columns={[
            { key: 'title', header: 'Título' },
            { key: 'department', header: 'Departamento', render: (j) => j.department ?? '-' },
            {
              key: 'is_open',
              header: 'Status',
              render: (j) => <StatusBadge status={j.is_open ? 'aberta' : 'fechada'} />,
            },
          ]}
          actions={(j) => (
            <Link href={`/app/people/vagas/${j.id}`} className="text-ness hover:underline">
              Editar
            </Link>
          )}
        />
      </div>
    </PageContent>
  );
}
