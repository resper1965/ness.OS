-- Seed playbooks para services_catalog (obrigatório antes de 002)
-- Executar primeiro: services_catalog exige playbook_id quando is_active=true

INSERT INTO public.playbooks (title, slug) VALUES
  ('n.secops', 'nsecops'),
  ('n.infraops', 'ninfraops'),
  ('n.devarch', 'ndevarch'),
  ('n.autoops', 'nautoops'),
  ('n.cirt', 'ncirt'),
  ('n.privacy', 'nprivacy'),
  ('n.faturasONS', 'nfaturasons'),
  ('n.flow', 'nflow'),
  ('forense.io', 'forense'),
  ('trustness.', 'trustness'),
  ('DPOaaS.online', 'trustness-dpo')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;
