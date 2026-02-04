/**
 * Emissão de eventos internos entre módulos (ness.OS).
 * Usado por Server Actions para disparar fluxos e workflows.
 * @see .context/plans/fluxos-integracao-ia-automacao.md
 */

import { createClient } from '@/lib/supabase/server';

export type ModuleName = 'growth' | 'ops' | 'fin' | 'people' | 'jur' | 'gov';

/**
 * Grava um evento no banco para orquestração/workflows.
 * Chamar após operações relevantes (criar lead, salvar case, criar contrato, etc.).
 */
export async function emitModuleEvent(
  module: ModuleName,
  eventType: string,
  entityId: string | null,
  payload: Record<string, unknown> = {}
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from('module_events').insert({
    module,
    event_type: eventType,
    entity_id: entityId ?? null,
    payload_json: payload,
    processed: false,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
