-- Migration 043: Service Action Hierarchy & Metrics
-- Estende o modelo Task → Playbook para Task → Playbook → Service Action → Service

-- 1. Tabela Service Actions (Jobs)
CREATE TABLE IF NOT EXISTS public.service_actions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    slug text NOT NULL UNIQUE,
    description text,
    complexity_factor numeric NOT NULL DEFAULT 1.0,
    estimated_duration_total numeric DEFAULT 0,
    estimated_cost_total numeric DEFAULT 0,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.service_actions IS 'Service Actions (Jobs): Conjunto de playbooks que representa uma entrega de valor.';

-- 2. Tabela de junção Service Actions ↔ Playbooks
CREATE TABLE IF NOT EXISTS public.service_action_playbooks (
    service_action_id uuid NOT NULL REFERENCES public.service_actions(id) ON DELETE CASCADE,
    playbook_id uuid NOT NULL REFERENCES public.playbooks(id) ON DELETE CASCADE,
    sort_order int NOT NULL DEFAULT 0,
    PRIMARY KEY (service_action_id, playbook_id)
);

CREATE INDEX IF NOT EXISTS idx_sa_playbooks_sa ON public.service_action_playbooks(service_action_id);

-- 3. Tabela de junção Services ↔ Service Actions
CREATE TABLE IF NOT EXISTS public.services_service_actions (
    service_id uuid NOT NULL REFERENCES public.services_catalog(id) ON DELETE CASCADE,
    service_action_id uuid NOT NULL REFERENCES public.service_actions(id) ON DELETE CASCADE,
    sort_order int NOT NULL DEFAULT 0,
    PRIMARY KEY (service_id, service_action_id)
);

-- 4. Funções de Recálculo Automático (Agregação Bottom-Up)

-- Função para atualizar métricas do Playbook baseando-se nas Tasks
CREATE OR REPLACE FUNCTION public.fn_sync_playbook_metrics()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.playbooks
    SET 
        estimated_duration_minutes = COALESCE((SELECT SUM(estimated_duration_minutes) FROM public.tasks WHERE playbook_id = NEW.playbook_id), 0),
        estimated_value = COALESCE((SELECT SUM(estimated_value) FROM public.tasks WHERE playbook_id = NEW.playbook_id), 0)
    WHERE id = NEW.playbook_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar métricas da Service Action baseando-se nos Playbooks
CREATE OR REPLACE FUNCTION public.fn_sync_service_action_metrics()
RETURNS TRIGGER AS $$
DECLARE
    sa_id uuid;
BEGIN
    -- Determina qual SA precisa de atualização
    IF TG_OP = 'DELETE' THEN
        sa_id := OLD.service_action_id;
    ELSE
        sa_id := NEW.service_action_id;
    END IF;

    UPDATE public.service_actions
    SET 
        estimated_duration_total = (
            SELECT SUM(p.estimated_duration_minutes) 
            FROM public.playbooks p
            JOIN public.service_action_playbooks sap ON sap.playbook_id = p.id
            WHERE sap.service_action_id = sa_id
        ),
        estimated_cost_total = (
            SELECT SUM(p.estimated_value) 
            FROM public.playbooks p
            JOIN public.service_action_playbooks sap ON sap.playbook_id = p.id
            WHERE sap.service_action_id = sa_id
        )
    WHERE id = sa_id;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 5. Triggers
DROP TRIGGER IF EXISTS trg_sync_playbook_metrics ON public.tasks;
CREATE TRIGGER trg_sync_playbook_metrics
AFTER INSERT OR UPDATE OR DELETE ON public.tasks
FOR EACH ROW EXECUTE FUNCTION public.fn_sync_playbook_metrics();

DROP TRIGGER IF EXISTS trg_sync_sa_metrics ON public.service_action_playbooks;
CREATE TRIGGER trg_sync_sa_metrics
AFTER INSERT OR UPDATE OR DELETE ON public.service_action_playbooks
FOR EACH ROW EXECUTE FUNCTION public.fn_sync_service_action_metrics();

-- 6. RLS
ALTER TABLE public.service_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_action_playbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services_service_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sa_authenticated_all" ON public.service_actions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "sa_playbooks_authenticated_all" ON public.service_action_playbooks FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "services_sa_authenticated_all" ON public.services_service_actions FOR ALL TO authenticated USING (true) WITH CHECK (true);
