import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { updateServiceAction, getServiceActions, linkPlaybookToServiceAction, updateServiceActionFromForm } from '@/app/actions/ops';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { HierarchyVisualizer, type HierarchyNode } from '@/components/ops/hierarchy-visualizer';

type Props = { params: Promise<{ id: string }> };

export default async function ServiceActionDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Fetch Service Action
  const { data: sa, error } = await supabase
    .from('service_actions')
    .select('*, service_action_playbooks(playbooks(*, tasks(*)))')
    .eq('id', id)
    .single();

  if (error || !sa) notFound();

  // 2. Build Hierarchy for Visualizer
  const rootNode: HierarchyNode = {
    id: sa.id,
    type: 'action',
    title: sa.title,
    duration: sa.estimated_duration_total,
    cost: sa.estimated_cost_total,
    children: sa.service_action_playbooks.map((sap: any) => ({
      id: sap.playbooks.id,
      type: 'playbook',
      title: sap.playbooks.title,
      duration: sap.playbooks.estimated_duration_minutes,
      cost: sap.playbooks.estimated_value,
      children: sap.playbooks.tasks.map((t: any) => ({
        id: t.id,
        type: 'task',
        title: t.title,
        duration: t.estimated_duration_minutes,
        cost: t.estimated_value,
      }))
    }))
  };

  const { data: allPlaybooks } = await supabase.from('playbooks').select('id, title').order('title');

  return (
    <PageContent>
      <AppPageHeader
        title={`Service Action: ${sa.title}`}
        actions={
          <Link href="/app/ops/service-actions" className="text-sm text-slate-400 hover:text-ness">
            ← Voltar
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        <div className="space-y-6">
          <section className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
            <h2 className="text-base font-semibold text-white mb-4">Composição do Job</h2>
            <HierarchyVisualizer root={rootNode} />
          </section>

          <section className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
            <h2 className="text-base font-semibold text-white mb-4">Vincular Playbook (SOP)</h2>
            <form 
              action={async (formData) => {
                'use server';
                await linkPlaybookToServiceAction(null, formData);
              }} 
              className="flex gap-4"
            >
              <input type="hidden" name="service_action_id" value={id} />
              <select name="playbook_id" className="flex-1 rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white focus:border-ness focus:ring-ness">
                {allPlaybooks?.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
              <button type="submit" className="rounded-md bg-ness px-4 py-2 text-sm font-medium text-white hover:bg-ness-600">
                Adicionar
              </button>
            </form>
          </section>
        </div>

        <aside>
          <section className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
            <h2 className="text-base font-semibold text-white mb-4">Metadados</h2>
            <form 
              action={async (formData) => {
                'use server';
                await updateServiceActionFromForm(null, formData);
              }} 
              className="space-y-4"
            >
              <input type="hidden" name="_id" value={id} />
               <div>
                <label className="block text-xs font-medium text-slate-400 uppercase mb-1">Título</label>
                <input name="title" defaultValue={sa.title} className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase mb-1">Fator de Complexidade</label>
                <input name="complexity_factor" type="number" step="0.1" defaultValue={sa.complexity_factor} className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white" />
                <p className="text-[10px] text-slate-500 mt-1">Multiplicador de custo/risco (ex: 1.2)</p>
              </div>
              <button type="submit" className="w-full rounded-md bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600">
                Atualizar Metadados
              </button>
            </form>
          </section>
        </aside>
      </div>
    </PageContent>
  );
}
