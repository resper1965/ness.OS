-- Snapshot mensal de faturamento Omie por cliente (persistência para avaliações).
-- Alimenta reconciliação MRR, relatório Omie, Visão CFO e Dashboard GROWTH sem chamar API sob demanda.
-- Plano: docs/PLANO-GESTAO-DADOS-PERSISTENCIA.md (Fase 1)

CREATE TABLE IF NOT EXISTS public.erp_revenue_snapshot (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period date NOT NULL,
  omie_codigo text NOT NULL,
  valor numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(period, omie_codigo)
);

CREATE INDEX IF NOT EXISTS idx_erp_revenue_snapshot_period
  ON public.erp_revenue_snapshot(period);

CREATE INDEX IF NOT EXISTS idx_erp_revenue_snapshot_omie
  ON public.erp_revenue_snapshot(omie_codigo);

COMMENT ON TABLE public.erp_revenue_snapshot IS 'Snapshot mensal de faturamento Omie por cliente; alimenta reconciliação e relatórios sem chamar API sob demanda.';

ALTER TABLE public.erp_revenue_snapshot ENABLE ROW LEVEL SECURITY;

CREATE POLICY "erp_revenue_snapshot_authenticated_read"
  ON public.erp_revenue_snapshot FOR SELECT TO authenticated USING (true);

CREATE POLICY "erp_revenue_snapshot_service_all"
  ON public.erp_revenue_snapshot FOR ALL TO authenticated USING (true) WITH CHECK (true);
