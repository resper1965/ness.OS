import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { JobForm } from '@/components/people/job-form';
import { DataTable } from '@/components/shared/data-table';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PageCard } from '@/components/shared/page-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { VagasContractFilter } from '@/components/people/vagas-contract-filter';

type Job = { id: string; title: string; department: string | null; is_open: boolean; contract_id?: string | null };

export default async function VagasPage({
  searchParams,
}: {
  searchParams: Promise<{ contract_id?: string }>;
}) {
  const supabase = await createClient();
  const { contract_id: contractId } = await searchParams;

  let jobsQuery = supabase
    .from('public_jobs')
    .select('id, title, department, is_open, contract_id')
    .order('created_at', { ascending: false });
  if (contractId) jobsQuery = jobsQuery.eq('contract_id', contractId);

  const [jobsRes, contractsRes] = await Promise.all([
    jobsQuery,
    supabase.from('contracts').select('id, clients(name)').order('created_at', { ascending: false }),
  ]);

  const jobs = jobsRes.data ?? [];
  const contracts = contractsRes.data ?? [];

  return (
    <PageContent>
      <AppPageHeader
        title="Vagas"
        subtitle="Vagas abertas aparecem em /carreiras. Candidaturas vão para Candidatos. Filtre por contrato (ATS)."
      />
      <JobForm contracts={contracts} />
      <PageCard title="Vagas">
        <div className="px-5 py-3 border-b border-slate-700/50 flex flex-wrap items-center gap-2">
          <VagasContractFilter contracts={contracts} currentContractId={contractId} />
        </div>
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
      </PageCard>
    </PageContent>
  );
}
