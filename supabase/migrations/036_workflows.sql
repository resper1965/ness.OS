-- Fluxos integração IA/automação (Fase 0): motor de workflows
-- Workflows reagem a eventos de module_events (trigger_module + trigger_event).

CREATE TABLE IF NOT EXISTS public.workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  trigger_module text NOT NULL,
  trigger_event text NOT NULL,
  steps_json jsonb NOT NULL DEFAULT '[]',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.workflows IS 'Definição de workflows: trigger (módulo+evento) e steps (db_query, ai_agent, condition, delay)';
COMMENT ON COLUMN public.workflows.steps_json IS 'Array de steps: { type, config } — type in (db_query, ai_agent, condition, delay)';

CREATE TABLE IF NOT EXISTS public.workflow_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id uuid NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  trigger_payload jsonb DEFAULT '{}',
  status text NOT NULL DEFAULT 'pending',
  started_at timestamptz,
  ended_at timestamptz,
  error_message text,
  created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.workflow_runs IS 'Execuções de workflows; status: pending, running, completed, failed';
COMMENT ON COLUMN public.workflow_runs.trigger_payload IS 'Payload do evento que disparou o run';

ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workflows_select_authenticated"
  ON public.workflows FOR SELECT TO authenticated USING (true);
CREATE POLICY "workflows_insert_authenticated"
  ON public.workflows FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "workflows_update_authenticated"
  ON public.workflows FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "workflow_runs_select_authenticated"
  ON public.workflow_runs FOR SELECT TO authenticated USING (true);
CREATE POLICY "workflow_runs_insert_authenticated"
  ON public.workflow_runs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "workflow_runs_update_authenticated"
  ON public.workflow_runs FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_workflows_trigger
  ON public.workflows (trigger_module, trigger_event)
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_workflow_runs_workflow
  ON public.workflow_runs (workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_created
  ON public.workflow_runs (created_at DESC);
