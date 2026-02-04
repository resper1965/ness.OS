-- Fluxos integração IA/automação (Fase 0): eventos internos entre módulos
-- Permite que um módulo reaja a ações de outro sem acoplamento direto.

CREATE TABLE IF NOT EXISTS public.module_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module text NOT NULL,
  event_type text NOT NULL,
  entity_id uuid,
  payload_json jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  processed boolean DEFAULT false
);

COMMENT ON TABLE public.module_events IS 'Eventos emitidos pelos módulos (growth, ops, fin, people, jur, gov) para orquestração e workflows';
COMMENT ON COLUMN public.module_events.module IS 'Módulo emissor: growth, ops, fin, people, jur, gov';
COMMENT ON COLUMN public.module_events.event_type IS 'Tipo do evento, ex: lead.created, case.saved, contract.created';
COMMENT ON COLUMN public.module_events.processed IS 'Marcado true quando workflow engine processou o evento';

ALTER TABLE public.module_events ENABLE ROW LEVEL SECURITY;

-- Inserção: Server Actions autenticadas podem emitir eventos
CREATE POLICY "module_events_insert_authenticated"
  ON public.module_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Leitura/atualização: apenas para processamento (admin/ops ou service)
CREATE POLICY "module_events_select_authenticated"
  ON public.module_events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "module_events_update_authenticated"
  ON public.module_events FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_module_events_trigger
  ON public.module_events (module, event_type)
  WHERE processed = false;

CREATE INDEX IF NOT EXISTS idx_module_events_created
  ON public.module_events (created_at DESC);
