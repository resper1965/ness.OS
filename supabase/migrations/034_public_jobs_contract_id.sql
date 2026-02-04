-- ness.PEOPLE: ATS vinculado a contratos (FASE 10.1 — opcional)
-- Permite filtrar vagas por contrato ativo (ex.: vaga vinculada a um cliente/contrato).

ALTER TABLE public.public_jobs
  ADD COLUMN IF NOT EXISTS contract_id uuid REFERENCES public.contracts(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.public_jobs.contract_id IS 'Contrato ao qual a vaga está vinculada (opcional). Filtro em /app/people/vagas.';

CREATE INDEX IF NOT EXISTS idx_public_jobs_contract_id ON public.public_jobs(contract_id) WHERE contract_id IS NOT NULL;
