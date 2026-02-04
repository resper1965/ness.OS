-- Popula services_playbooks (N:N) a partir do mapeamento slug serviço = slug playbook
-- PRÉ-REQUISITO: 000_playbooks_seed.sql, 002_corp_site_content.sql

INSERT INTO public.services_playbooks (service_id, playbook_id, sort_order)
SELECT sc.id, p.id, 0
FROM public.services_catalog sc
JOIN public.playbooks p ON p.slug = sc.slug
ON CONFLICT (service_id, playbook_id) DO NOTHING;
