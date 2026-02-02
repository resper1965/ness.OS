-- ness.GROWTH: Upsell Alerts

CREATE TABLE IF NOT EXISTS public.upsell_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id uuid REFERENCES public.contracts(id) ON DELETE CASCADE,
  alert_type text,
  message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.upsell_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "upsell_alerts_authenticated" ON public.upsell_alerts FOR ALL TO authenticated USING (true) WITH CHECK (true);
