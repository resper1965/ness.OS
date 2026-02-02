import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { JobForm } from '@/components/people/job-form';
import { DataTable } from '@/components/shared/data-table';
import { StatusBadge } from '@/components/shared/status-badge';

type Job = { id: string; title: string; department: string | null; is_open: boolean };

export default async function VagasPage() {
  const supabase = await createClient();
  const { data: jobs } = await supabase
    .from('public_jobs')
    .select('id, title, department, is_open')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Vagas</h1>
        <p className="text-slate-400 text-sm mt-1">
          Vagas abertas aparecem em /carreiras. Candidaturas vão para Candidatos.
        </p>
      </div>
      <JobForm />
      <div className="mt-8">
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
    </div>
  );
}
