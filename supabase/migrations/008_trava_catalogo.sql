-- Trava de Catálogo: serviço ativo exige playbook vinculado
-- Garante integridade no banco (além da validação em admin-services.ts)

-- 1. Limpar playbook_id inválidos (órfãos) antes de criar FK
UPDATE public.services_catalog sc
SET playbook_id = NULL
WHERE sc.playbook_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM public.playbooks p WHERE p.id = sc.playbook_id);

-- 2. Desativar serviços ativos sem playbook (dados inconsistentes)
UPDATE public.services_catalog
SET is_active = false
WHERE is_active = true AND playbook_id IS NULL;

-- 3. FK: playbook_id referencia playbooks (permite NULL)
ALTER TABLE public.services_catalog
  DROP CONSTRAINT IF EXISTS services_catalog_playbook_id_fkey;
ALTER TABLE public.services_catalog
  ADD CONSTRAINT services_catalog_playbook_id_fkey
  FOREIGN KEY (playbook_id) REFERENCES public.playbooks(id) ON DELETE SET NULL;

-- 4. CHECK: serviço ativo DEVE ter playbook
ALTER TABLE public.services_catalog
  DROP CONSTRAINT IF EXISTS services_catalog_trava_playbook;
ALTER TABLE public.services_catalog
  ADD CONSTRAINT services_catalog_trava_playbook
  CHECK (NOT is_active OR playbook_id IS NOT NULL);

COMMENT ON CONSTRAINT services_catalog_trava_playbook ON public.services_catalog
  IS 'A Trava: serviço só pode estar ativo (vendável) se tiver playbook vinculado.';
