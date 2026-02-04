-- Serviços com múltiplos playbooks (many-to-many)
-- Migra de playbook_id (1:1) para services_playbooks (N:N)

-- 1. Tabela de junção
CREATE TABLE IF NOT EXISTS public.services_playbooks (
  service_id uuid NOT NULL REFERENCES public.services_catalog(id) ON DELETE CASCADE,
  playbook_id uuid NOT NULL REFERENCES public.playbooks(id) ON DELETE CASCADE,
  sort_order int NOT NULL DEFAULT 0,
  PRIMARY KEY (service_id, playbook_id)
);

CREATE INDEX IF NOT EXISTS idx_services_playbooks_service ON public.services_playbooks(service_id);
CREATE INDEX IF NOT EXISTS idx_services_playbooks_playbook ON public.services_playbooks(playbook_id);

COMMENT ON TABLE public.services_playbooks IS 'Relação N:N: um serviço pode ter vários playbooks vinculados.';

-- 2. Migrar dados existentes
INSERT INTO public.services_playbooks (service_id, playbook_id, sort_order)
SELECT id, playbook_id, 0
FROM public.services_catalog
WHERE playbook_id IS NOT NULL
ON CONFLICT (service_id, playbook_id) DO NOTHING;

-- 3. Remover CHECK e coluna playbook_id
ALTER TABLE public.services_catalog DROP CONSTRAINT IF EXISTS services_catalog_trava_playbook;
ALTER TABLE public.services_catalog DROP CONSTRAINT IF EXISTS services_catalog_playbook_id_fkey;
ALTER TABLE public.services_catalog DROP COLUMN IF EXISTS playbook_id;

-- 4. View auxiliar: primeiro playbook por serviço (para compatibilidade com queries existentes)
CREATE OR REPLACE VIEW public.services_primary_playbook AS
SELECT DISTINCT ON (service_id) service_id, playbook_id
FROM public.services_playbooks
ORDER BY service_id, sort_order, playbook_id;

-- 5. RLS: mesma política que services_catalog (authenticated)
ALTER TABLE public.services_playbooks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "services_playbooks_authenticated" ON public.services_playbooks
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
