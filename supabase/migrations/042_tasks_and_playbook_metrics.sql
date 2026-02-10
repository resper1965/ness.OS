-- Composição Serviços/Produtos: Task → Playbook → Service
-- Plano: .context/plans/composicao-servicos-produtos-tasks-playbooks.md
-- Doc: docs/COMPOSICAO-SERVICOS-PRODUTOS.md

-- 1. Tabela tasks (menor unidade; playbook_id → N tasks)
CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playbook_id uuid NOT NULL REFERENCES public.playbooks(id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  description text,
  estimated_duration_minutes numeric,
  estimated_value numeric,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT tasks_at_least_one_metric CHECK (
    estimated_duration_minutes IS NOT NULL OR estimated_value IS NOT NULL
  ),
  UNIQUE (playbook_id, slug)
);

COMMENT ON TABLE public.tasks IS 'Tasks: menor unidade de composição. Um playbook tem N tasks. Ao menos uma métrica de consumo (temporal ou valor) obrigatória.';
COMMENT ON COLUMN public.tasks.estimated_duration_minutes IS 'Métrica temporal: estimativa de tempo em minutos.';
COMMENT ON COLUMN public.tasks.estimated_value IS 'Métrica valor: estimativa em R$.';

CREATE INDEX IF NOT EXISTS idx_tasks_playbook_id ON public.tasks(playbook_id);
CREATE INDEX IF NOT EXISTS idx_tasks_playbook_sort ON public.tasks(playbook_id, sort_order);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tasks_authenticated"
  ON public.tasks FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- 2. Playbooks: adicionar métricas de consumo (temporal e valor)
ALTER TABLE public.playbooks
  ADD COLUMN IF NOT EXISTS estimated_duration_minutes numeric,
  ADD COLUMN IF NOT EXISTS estimated_value numeric;

COMMENT ON COLUMN public.playbooks.estimated_duration_minutes IS 'Métrica temporal: estimativa de tempo total do playbook em minutos (manual ou soma das tasks).';
COMMENT ON COLUMN public.playbooks.estimated_value IS 'Métrica valor: estimativa em R$ (manual ou soma das tasks).';
