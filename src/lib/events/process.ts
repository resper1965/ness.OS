/**
 * Processamento de eventos internos: busca workflows com trigger correspondente e executa.
 * Chamado após emitir evento (ou via cron que processa module_events com processed=false).
 * @see .context/plans/fluxos-integracao-ia-automacao.md
 */

import { createClient } from '@/lib/supabase/server';
import { runWorkflow } from '@/lib/workflows/engine';
import type { ModuleName } from './emit';

export interface ProcessModuleEventResult {
  ok: boolean;
  runsStarted: number;
  errors: string[];
}

/**
 * Busca workflows com trigger (module, eventType) ativos e executa cada um com o payload.
 */
export async function processModuleEvent(
  module: ModuleName,
  eventType: string,
  payload: Record<string, unknown>
): Promise<ProcessModuleEventResult> {
  const supabase = await createClient();

  const { data: workflows, error: fetchError } = await supabase
    .from('workflows')
    .select('id')
    .eq('trigger_module', module)
    .eq('trigger_event', eventType)
    .eq('is_active', true);

  if (fetchError) {
    return { ok: false, runsStarted: 0, errors: [fetchError.message] };
  }

  const list = workflows ?? [];
  const errors: string[] = [];
  let runsStarted = 0;

  for (const wf of list) {
    const result = await runWorkflow(wf.id, payload);
    if (result.runId) runsStarted += 1;
    if (result.error) errors.push(result.error);
  }

  return {
    ok: errors.length === 0,
    runsStarted,
    errors,
  };
}
