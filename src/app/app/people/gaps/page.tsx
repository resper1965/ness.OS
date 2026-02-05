import Link from 'next/link';
import { Target } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { GapForm } from '@/components/people/gap-form';
import { EntityForm } from '@/components/shared/entity-form';
import { DataTable } from '@/components/shared/data-table';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PageCard } from '@/components/shared/page-card';
import { EmptyState } from '@/components/shared/empty-state';
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
      <div id="entity-form">
        <EntityForm title="Novo gap de treinamento">
          <GapForm profiles={profiles ?? []} playbooks={playbooks ?? []} />
        </EntityForm>
      </div>
      <PageCard title="Gaps de Treinamento">
        {(!gaps || gaps.length === 0) ? (
          <EmptyState
            icon={Target}
            title="Nenhum gap cadastrado"
            message="Registro de lacunas de conhecimento. Use o formulário acima para criar um gap e vincule a playbooks para treinamento."
            description="Gaps ajudam a priorizar capacitação por colaborador."
            action={
              <Link href="#entity-form" className="text-ness hover:underline font-medium">
                Criar gap →
              </Link>
            }
          />
        ) : (
          <DataTable<Gap>
            data={gaps as Gap[]}
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
        )}
      </PageCard>
    </PageContent>
  );
}
