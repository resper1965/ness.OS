-- Fluxos IA Fase 1–4: aprovações pendentes (HITL — human in the loop).
-- Step human_review insere aqui; interface workflows consulta para listar pendências.

CREATE TABLE IF NOT EXISTS public.workflow_pending_approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_run_id uuid NOT NULL REFERENCES public.workflow_runs(id) ON DELETE CASCADE,
  step_index int NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'pending',
  resolved_at timestamptz,
  resolved_by uuid REFERENCES auth.users(id),
  resolution_payload jsonb,
  created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.workflow_pending_approvals IS 'Aprovações pendentes (HITL) do step human_review nos workflows';
COMMENT ON COLUMN public.workflow_pending_approvals.status IS 'pending, approved, rejected';
COMMENT ON COLUMN public.workflow_pending_approvals.resolution_payload IS 'Dados enviados pelo usuário ao aprovar/rejeitar';

CREATE INDEX IF NOT EXISTS idx_workflow_pending_approvals_run
  ON public.workflow_pending_approvals (workflow_run_id);
CREATE INDEX IF NOT EXISTS idx_workflow_pending_approvals_status
  ON public.workflow_pending_approvals (status)
  WHERE status = 'pending';

ALTER TABLE public.workflow_pending_approvals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workflow_pending_approvals_select_authenticated"
  ON public.workflow_pending_approvals FOR SELECT TO authenticated USING (true);
CREATE POLICY "workflow_pending_approvals_insert_authenticated"
  ON public.workflow_pending_approvals FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "workflow_pending_approvals_update_authenticated"
  ON public.workflow_pending_approvals FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
