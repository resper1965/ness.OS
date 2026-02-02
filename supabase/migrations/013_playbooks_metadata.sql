-- RF.OPS.01: tags e last_reviewed_at em playbooks

ALTER TABLE public.playbooks
  ADD COLUMN IF NOT EXISTS tags jsonb DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS last_reviewed_at date;

COMMENT ON COLUMN public.playbooks.tags IS 'Tags para categorização (ex: deploy, backup, secops)';
COMMENT ON COLUMN public.playbooks.last_reviewed_at IS 'Data da última revisão do manual';
