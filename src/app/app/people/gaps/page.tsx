import { createClient } from '@/lib/supabase/server';
import { GapForm } from '@/components/people/gap-form';
import { EntityForm } from '@/components/shared/entity-form';
import { DataTable } from '@/components/shared/data-table';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PageCard } from '@/components/shared/page-card';
import { StatusBadge } from '@/components/shared/status-badge';

type Gap = {
  id: string;
  description: string;
  severity: string;
  resolved_at: string | null;
  profiles: { full_name?: string } | { full_name?: string }[] | null;
};

export default async function GapsPage() {
  const supabase = await createClient();
  const { data: gaps } = await supabase
    .from('training_gaps')
    .select('id, description, severity, resolved_at, profiles(full_name)')
    .order('created_at', { ascending: false });
  const { data: profiles } = await supabase.from('profiles').select('id, full_name');
  const { data: playbooks } = await supabase.from('playbooks').select('id, title').order('title');

  return (
    <PageContent>
      <AppPageHeader
        title="Gaps de Treinamento"
        subtitle="Registro de lacunas de conhecimento. Vincule a playbooks para treinamento."
      />
      <EntityForm title="Novo gap de treinamento">
        <GapForm profiles={profiles ?? []} playbooks={playbooks ?? []} />
      </EntityForm>
      <PageCard title="Gaps de Treinamento">
        <DataTable<Gap>
          data={(gaps ?? []) as Gap[]}
          keyExtractor={(g) => g.id}
          emptyMessage="Nenhum gap registrado."
          columns={[
            { key: 'description', header: 'Descrição' },
            { key: 'severity', header: 'Severidade' },
            {
              key: 'profiles',
              header: 'Colaborador',
              render: (g) => {
                const p = g.profiles;
                const name = Array.isArray(p) ? p[0]?.full_name : (p as { full_name?: string })?.full_name;
                return name ?? '-';
              },
            },
            {
              key: 'resolved_at',
              header: 'Status',
              render: (g) => <StatusBadge status={g.resolved_at ? 'resolvido' : 'pendente'} />,
            },
          ]}
        />
      </PageCard>
    </PageContent>
  );
}
