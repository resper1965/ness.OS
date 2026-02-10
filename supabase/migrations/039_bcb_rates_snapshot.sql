-- Snapshot de cotações BCB (PTAX) e índices (IPCA, IGP-M) para reajuste e precificação.
-- Plano: docs/PLANO-GESTAO-DADOS-PERSISTENCIA.md (Fase 2)

CREATE TABLE IF NOT EXISTS public.bcb_rates_snapshot (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rate_type text NOT NULL,
  ref_date date NOT NULL,
  value_buy numeric,
  value_sell numeric,
  value numeric,
  created_at timestamptz DEFAULT now(),
  UNIQUE(rate_type, ref_date)
);

CREATE INDEX IF NOT EXISTS idx_bcb_rates_ref_date
  ON public.bcb_rates_snapshot(ref_date);

CREATE INDEX IF NOT EXISTS idx_bcb_rates_type
  ON public.bcb_rates_snapshot(rate_type);

COMMENT ON TABLE public.bcb_rates_snapshot IS 'Snapshot de cotações BCB (PTAX) e índices (IPCA, IGP-M) para reajuste e precificação; alimenta relatórios FIN.';

ALTER TABLE public.bcb_rates_snapshot ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bcb_rates_snapshot_authenticated_read"
  ON public.bcb_rates_snapshot FOR SELECT TO authenticated USING (true);

CREATE POLICY "bcb_rates_snapshot_service_all"
  ON public.bcb_rates_snapshot FOR ALL TO authenticated USING (true) WITH CHECK (true);
