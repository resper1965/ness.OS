-- RF.PEO.01: playbook_id em training_gaps

ALTER TABLE public.training_gaps
  ADD COLUMN IF NOT EXISTS playbook_id uuid REFERENCES public.playbooks(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.training_gaps.playbook_id IS 'Playbook violado que originou o gap';
