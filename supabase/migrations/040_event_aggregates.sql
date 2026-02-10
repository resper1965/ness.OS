-- Agregação de eventos (module_events) por período para índices e acompanhamento de acontecimentos.
-- Plano: .context/plans/persistencia-massa-indices-acontecimentos.md

CREATE TABLE IF NOT EXISTS public.event_aggregates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period date NOT NULL,
  module text NOT NULL,
  event_type text NOT NULL,
  count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(period, module, event_type)
);

CREATE INDEX IF NOT EXISTS idx_event_aggregates_period
  ON public.event_aggregates(period DESC);

CREATE INDEX IF NOT EXISTS idx_event_aggregates_module_type
  ON public.event_aggregates(module, event_type);

COMMENT ON TABLE public.event_aggregates IS 'Contagem de eventos (module_events) por período, módulo e tipo; alimenta dashboards de acontecimentos e índices derivados.';

ALTER TABLE public.event_aggregates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "event_aggregates_authenticated_read"
  ON public.event_aggregates FOR SELECT TO authenticated USING (true);

CREATE POLICY "event_aggregates_service_all"
  ON public.event_aggregates FOR ALL TO authenticated USING (true) WITH CHECK (true);
