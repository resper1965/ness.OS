import { getFrameworks, getChecksByFramework } from '@/app/actions/jur';
import { getServerClient } from '@/lib/supabase/queries/base';
import { ComplianceCheckForm } from '@/components/jur/compliance-check-form';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PageCard } from '@/components/shared/page-card';
import { DataTable } from '@/components/shared/data-table';

type CheckRow = {
  id: string;
  process_ref: string;
  status: string;
  notes: string | null;
  created_at?: string;
};

export default async function JurConformidadePage() {
  const frameworks = await getFrameworks();
  const supabase = await getServerClient();
  const { data: playbooks } = await supabase
    .from('playbooks')
    .select('id, title, slug')
    .order('title');

  return (
    <PageContent>
      <AppPageHeader
        title="Conformidade"
        subtitle="Verificação de aderência à LGPD, Marco Civil e leis trabalhistas. Vincule processos (playbooks) a cada framework."
      />
      <PageCard title="Novo check de conformidade" className="mb-6">
        <ComplianceCheckForm
          frameworks={frameworks}
          playbooks={playbooks ?? []}
        />
      </PageCard>

      {frameworks.map((fw) => (
        <FrameworkChecks key={fw.id} frameworkId={fw.id} name={fw.name} />
      ))}
    </PageContent>
  );
}

async function FrameworkChecks({ frameworkId, name }: { frameworkId: string; name: string }) {
  const checks = (await getChecksByFramework(frameworkId)) as CheckRow[];

  return (
    <PageCard title={name}>
      <DataTable<CheckRow>
        data={checks}
        keyExtractor={(row) => row.id}
        emptyMessage="Nenhum check registrado."
        columns={[
          { key: 'process_ref', header: 'Processo' },
          {
            key: 'status',
            header: 'Status',
            render: (row) => (
              <span
                className={
                  row.status === 'ok'
                    ? 'text-green-400'
                    : row.status === 'gap'
                      ? 'text-amber-400'
                      : 'text-slate-400'
                }
              >
                {row.status === 'ok' ? 'OK' : row.status === 'gap' ? 'Gap' : 'Pendente'}
              </span>
            ),
          },
          {
            key: 'notes',
            header: 'Notas',
            render: (row) => <span className="text-slate-400">{row.notes ?? '-'}</span>,
          },
        ]}
      />
    </PageCard>
  );
}
