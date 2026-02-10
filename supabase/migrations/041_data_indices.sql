-- Índices derivados por período (leads_mes, contratos_ativos, mrr_total, etc.).
-- Plano: .context/plans/persistencia-massa-indices-acontecimentos.md (Phase 2)

CREATE TABLE IF NOT EXISTS public.data_indices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period date NOT NULL,
  index_key text NOT NULL,
  value numeric NOT NULL DEFAULT 0,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(period, index_key)
);

CREATE INDEX IF NOT EXISTS idx_data_indices_period
  ON public.data_indices(period DESC);

CREATE INDEX IF NOT EXISTS idx_data_indices_key
  ON public.data_indices(index_key);

COMMENT ON TABLE public.data_indices IS 'Índices calculados por período (ex.: leads_mes, mrr_total) para relatórios e KPIs agregados.';

ALTER TABLE public.data_indices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "data_indices_authenticated_read"
  ON public.data_indices FOR SELECT TO authenticated USING (true);

CREATE POLICY "data_indices_service_all"
  ON public.data_indices FOR ALL TO authenticated USING (true) WITH CHECK (true);
