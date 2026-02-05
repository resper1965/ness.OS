import { getServerClient } from '@/lib/supabase/queries/base';
import { AppPageHeader } from '@/components/shared/app-page-header';
import { PageContent } from '@/components/shared/page-content';
import { PageCard } from '@/components/shared/page-card';
import { DataTable } from '@/components/shared/data-table';
import { WorkflowApprovalActions } from '@/components/ops/workflow-approval-actions';

type PendingRow = {
  id: string;
  workflow_run_id: string;
  step_index: number;
  status: string;
  created_at: string;
};

type WorkflowRow = {
  id: string;
  name: string;
  trigger_module: string;
  trigger_event: string;
  is_active: boolean;
  updated_at: string;
};

export default async function WorkflowsPage() {
  const supabase = await getServerClient();
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

  const pendingRows = (pending ?? []) as PendingRow[];
  const workflowRows = (workflows ?? []) as WorkflowRow[];

  return (
    <PageContent>
      <AppPageHeader
        title="Workflows"
        subtitle="Fluxos de automação e IA (ness.OPS). Steps: db_query, ai_agent, condition, delay, human_review (HITL)."
      />
      {pendingRows.length > 0 && (
        <PageCard title="Aprovações pendentes (HITL)" className="mb-6">
          <DataTable<PendingRow>
            data={pendingRows}
            keyExtractor={(row) => row.id}
            columns={[
              {
                key: 'workflow_run_id',
                header: 'Run',
                render: (row) => (
                  <span className="font-mono text-slate-400">
                    {String(row.workflow_run_id).slice(0, 8)}…
                  </span>
                ),
              },
              {
                key: 'step_index',
                header: 'Step',
                render: (row) => <span className="text-slate-400">{row.step_index}</span>,
              },
              {
                key: 'created_at',
                header: 'Criado',
                render: (row) => (
                  <span className="text-slate-400">
                    {new Date(row.created_at).toLocaleString('pt-BR')}
                  </span>
                ),
              },
            ]}
            actions={(row) => <WorkflowApprovalActions approvalId={row.id} />}
          />
        </PageCard>
      )}
      <PageCard title="Workflows cadastrados">
        <DataTable<WorkflowRow>
          data={workflowRows}
          keyExtractor={(row) => row.id}
          emptyMessage="Nenhum workflow cadastrado"
          emptyDescription="Workflows são definidos via banco (tabela workflows) e reagem a eventos de module_events. Steps: db_query, ai_agent, condition, delay, human_review (HITL)."
          columns={[
            { key: 'name', header: 'Nome' },
            {
              key: 'trigger',
              header: 'Trigger (módulo / evento)',
              render: (row) => (
                <span className="text-slate-400">
                  {row.trigger_module} / {row.trigger_event}
                </span>
              ),
            },
            {
              key: 'is_active',
              header: 'Ativo',
              render: (row) => (
                <span className="text-slate-400">{row.is_active ? 'Sim' : 'Não'}</span>
              ),
            },
            {
              key: 'updated_at',
              header: 'Atualizado',
              render: (row) => (
                <span className="text-slate-400">
                  {new Date(row.updated_at).toLocaleDateString('pt-BR')}
                </span>
              ),
            },
          ]}
        />
      </PageCard>
    </PageContent>
  );
}
