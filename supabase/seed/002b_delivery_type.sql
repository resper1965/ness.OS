-- Classificação de entregas (executar após 002_corp_site_content.sql)
-- Serviços: n.secops, n.infraops, n.devarch, n.autoops, n.cirt, DPOaaS
-- Produtos: n.privacy, n.faturasONS, n.flow, n.discovery
-- Verticais: forense.io, trustness.

UPDATE public.services_catalog SET delivery_type = 'service'
  WHERE slug IN ('nsecops', 'ninfraops', 'ndevarch', 'nautoops', 'ncirt', 'trustness-dpo');

UPDATE public.services_catalog SET delivery_type = 'product'
  WHERE slug IN ('nprivacy', 'nfaturasons', 'nflow', 'ndiscovery');

UPDATE public.services_catalog SET delivery_type = 'vertical'
  WHERE slug IN ('forense', 'trustness');
