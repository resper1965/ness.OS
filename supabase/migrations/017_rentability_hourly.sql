-- RF.FIN.02: hourly_rate e view de rentabilidade com fórmula correta

ALTER TABLE public.performance_metrics
  ADD COLUMN IF NOT EXISTS hourly_rate numeric DEFAULT 0;

COMMENT ON COLUMN public.performance_metrics.hourly_rate IS 'Custo por hora (R$) para cálculo: Horas × Custo Hora + Custo Infra';

-- Recriar view: Margem = MRR - (Horas × Custo Hora + Custo Infra)
DROP VIEW IF EXISTS public.contract_rentability;

CREATE VIEW public.contract_rentability AS
SELECT
  c.id AS contract_id,
  cl.name AS client_name,
  c.mrr AS revenue,
  COALESCE(SUM(
    (COALESCE(pm.hours_worked, 0) * COALESCE(pm.hourly_rate, 0)) + COALESCE(pm.cost_input, 0)
  ), 0) AS total_cost,
  c.mrr - COALESCE(SUM(
    (COALESCE(pm.hours_worked, 0) * COALESCE(pm.hourly_rate, 0)) + COALESCE(pm.cost_input, 0)
  ), 0) AS rentability
FROM public.contracts c
JOIN public.clients cl ON cl.id = c.client_id
LEFT JOIN public.performance_metrics pm ON pm.contract_id = c.id
GROUP BY c.id, cl.name, c.mrr;
