import { createClient } from '@/lib/supabase/server';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PageCard } from '@/components/shared/page-card';
import { WorkflowApprovalActions } from '@/components/ops/workflow-approval-actions';

export default async function WorkflowsPage() {
  const supabase = await createClient();
  const { data: workflows } = await supabase
    .from('workflows')
    .select('id, name, trigger_module, trigger_event, is_active, updated_at')
    .order('updated_at', { ascending: false });

  const { data: pending } = await supabase
    .from('workflow_pending_approvals')
    .select('id, workflow_run_id, step_index, status, created_at')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <PageContent>
      <AppPageHeader
        title="Workflows"
        subtitle="Fluxos de automação e IA (ness.OPS). Steps: db_query, ai_agent, condition, delay, human_review (HITL)."
      />
      {pending && pending.length > 0 && (
        <PageCard title="Aprovações pendentes (HITL)" className="mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/50 text-slate-300">
                <tr className="h-[52px]">
                  <th className="px-5 py-4 font-medium">Run</th>
                  <th className="px-5 py-4 font-medium">Step</th>
                  <th className="px-5 py-4 font-medium">Criado</th>
                  <th className="px-5 py-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {pending.map((p) => (
                  <tr key={p.id} className="text-slate-300 hover:bg-slate-800/30">
                    <td className="px-5 py-4 font-mono text-slate-400">{String(p.workflow_run_id).slice(0, 8)}…</td>
                    <td className="px-5 py-4 text-slate-400">{p.step_index}</td>
                    <td className="px-5 py-4 text-slate-400">{new Date(p.created_at).toLocaleString('pt-BR')}</td>
                    <td className="px-5 py-4">
                      <WorkflowApprovalActions approvalId={p.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PageCard>
      )}
      <PageCard title="Workflows cadastrados">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/50 text-slate-300">
              <tr className="h-[52px]">
                <th className="px-5 py-4 font-medium">Nome</th>
                <th className="px-5 py-4 font-medium">Trigger (módulo / evento)</th>
                <th className="px-5 py-4 font-medium">Ativo</th>
                <th className="px-5 py-4 font-medium">Atualizado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {(workflows ?? []).map((w) => (
                <tr key={w.id} className="text-slate-300 hover:bg-slate-800/30">
                  <td className="px-5 py-4">{w.name}</td>
                  <td className="px-5 py-4 text-slate-400">{w.trigger_module} / {w.trigger_event}</td>
                  <td className="px-5 py-4 text-slate-400">{w.is_active ? 'Sim' : 'Não'}</td>
                  <td className="px-5 py-4 text-slate-400">{new Date(w.updated_at).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!workflows || workflows.length === 0) && (
            <div className="px-5 py-16 text-center">
              <p className="text-slate-400">Nenhum workflow cadastrado.</p>
              <p className="mt-3 text-sm text-slate-500">Workflows são definidos via banco (tabela workflows) e reagem a eventos de module_events.</p>
            </div>
          )}
        </div>
      </PageCard>
    </PageContent>
  );
}
