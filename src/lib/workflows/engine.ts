/**
 * Motor de workflows — executa steps em resposta a eventos (module_events).
 * Steps: db_query, ai_agent, condition, delay, human_review (sem http_request/webhooks externos).
 * @see .context/plans/fluxos-integracao-ia-automacao.md
 */

import { createClient } from '@/lib/supabase/server';
import { getSystemPrompt, getContextPrompt, type AgentKey } from '@/lib/ai/prompts';
import { callGemini } from '@/lib/ai/gemini';

export type StepType = 'db_query' | 'ai_agent' | 'condition' | 'delay' | 'human_review';
export type WorkflowStep = { type: StepType; config?: Record<string, unknown> };
export type WorkflowRunStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface RunWorkflowResult {
  ok: boolean;
  runId?: string;
  status?: WorkflowRunStatus;
  error?: string;
}

/**
 * Executa um workflow a partir do payload do evento.
 * Cria registro em workflow_runs, processa steps em ordem e atualiza status.
 */
export async function runWorkflow(
  workflowId: string,
  eventPayload: Record<string, unknown>
): Promise<RunWorkflowResult> {
  const supabase = await createClient();

  const { data: workflow, error: wfError } = await supabase
    .from('workflows')
    .select('id, name, steps_json')
    .eq('id', workflowId)
    .eq('is_active', true)
    .single();

  if (wfError || !workflow) {
    const msg = wfError?.message ?? 'Workflow não encontrado ou inativo.';
    return { ok: false, error: msg };
  }

  const steps = (workflow.steps_json as WorkflowStep[]) ?? [];
  if (!Array.isArray(steps) || steps.length === 0) {
    return { ok: true, runId: undefined, status: 'completed' };
  }

  const { data: run, error: runInsertError } = await supabase
    .from('workflow_runs')
    .insert({
      workflow_id: workflowId,
      trigger_payload: eventPayload,
      status: 'running',
      started_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (runInsertError || !run) {
    return { ok: false, error: runInsertError?.message ?? 'Falha ao criar workflow run.' };
  }

  let context: Record<string, unknown> = { ...eventPayload };
  let runStatus: WorkflowRunStatus = 'completed';
  let errorMessage: string | null = null;

  try {
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const result = await executeStep(step, i, context, run.id, supabase);
      context = { ...context, ...result.contextUpdate };
      if (result.stop) {
        if (result.awaitingApproval) runStatus = 'running';
        break;
      }
      if (result.error) {
        errorMessage = result.error;
        runStatus = 'failed';
        break;
      }
    }
  } catch (err) {
    runStatus = 'failed';
    errorMessage = err instanceof Error ? err.message : String(err);
  }

  await supabase
    .from('workflow_runs')
    .update({
      status: runStatus,
      ended_at: new Date().toISOString(),
      error_message: errorMessage,
    })
    .eq('id', run.id);

  return {
    ok: runStatus === 'completed',
    runId: run.id,
    status: runStatus,
    error: errorMessage ?? undefined,
  };
}

async function executeStep(
  step: WorkflowStep,
  stepIndex: number,
  context: Record<string, unknown>,
  runId: string,
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<{ contextUpdate?: Record<string, unknown>; stop?: boolean; awaitingApproval?: boolean; error?: string }> {
  switch (step.type) {
    case 'db_query':
      // Fase 0: stub; Fase 2+ pode executar update/insert via config
      return {};
    case 'condition': {
      const key = step.config?.key as string | undefined;
      const expr = step.config?.expr as string | undefined;
      if (key !== undefined && context[key] === undefined) return { stop: true };
      if (expr !== undefined && !evaluateSimpleExpr(expr, context)) return { stop: true };
      return {};
    }
    case 'delay':
      return {};
    case 'ai_agent': {
      const agent = step.config?.agent as AgentKey | undefined;
      if (!agent) return { error: 'Step ai_agent exige config.agent (rex.fin, rex.ops, rex.growth, etc.).' };
      const action = (step.config?.action as string) ?? '';
      const outputKey = (step.config?.outputKey as string) ?? 'ai_result';
      const systemPrompt = getSystemPrompt(agent);
      const contextPrompt = getContextPrompt(agent, action, context);
      const userMessage = contextPrompt || JSON.stringify(context);
      const { text, error: geminiError } = await callGemini(userMessage, { systemInstruction: systemPrompt });
      if (geminiError) return { error: geminiError };
      return { contextUpdate: { [outputKey]: text ?? '' } };
    }
    case 'human_review': {
      // HITL: insere aprovação pendente e para o fluxo até resolução
      const payload = (step.config?.payload as Record<string, unknown>) ?? context;
      const { error: insErr } = await supabase.from('workflow_pending_approvals').insert({
        workflow_run_id: runId,
        step_index: stepIndex,
        payload,
        status: 'pending',
      });
      if (insErr) return { error: insErr.message };
      return { stop: true, awaitingApproval: true };
    }
    default:
      return {};
  }
}

function evaluateSimpleExpr(expr: string, context: Record<string, unknown>): boolean {
  try {
    // Apenas checagens simples; não eval() arbitrário
    if (expr.startsWith('context.') && expr.includes('===')) {
      const [path, val] = expr.split('===').map((s) => s.trim());
      const key = path.replace('context.', '');
      return context[key] === (val === 'true' ? true : val === 'false' ? false : val);
    }
    return true;
  } catch {
    return false;
  }
}
