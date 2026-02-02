import { createClient } from '@/lib/supabase/server';
import { GapForm } from '@/components/people/gap-form';
import { DataTable } from '@/components/shared/data-table';
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
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Gaps de Treinamento</h1>
      <GapForm profiles={profiles ?? []} playbooks={playbooks ?? []} />
      <div className="mt-8">
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
      </div>
    </div>
  );
}
