import { createClient } from '@/lib/supabase/server';
import { LeadKanban } from '@/components/growth/lead-kanban';

const COLUMNS = [
  { key: 'new', label: 'Novo' },
  { key: 'contacted', label: 'Em Análise' },
  { key: 'qualified', label: 'Qualificado' },
  { key: 'discarded', label: 'Descartado' },
] as const;

export default async function GrowthLeadsPage() {
  const supabase = await createClient();
  const { data: leads } = await supabase
    .from('inbound_leads')
    .select('id, name, email, company, message, status, created_at, origin_url')
    .order('created_at', { ascending: false });

  const byStatus = COLUMNS.reduce(
    (acc, col) => {
      acc[col.key] = (leads ?? []).filter((l) => (l.status || 'new') === col.key);
      return acc;
    },
    {} as Record<string, typeof leads extends (infer T)[] | null ? T[] : never[]>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Leads (CRM)</h1>
      <LeadKanban columns={COLUMNS} leadsByStatus={byStatus} />
    </div>
  );
}
