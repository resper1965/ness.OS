-- Classificação de entregas: serviço | produto | vertical
-- Serviços: n.secops, n.infraops, n.devarch, n.autoops, n.cirt, DPOaaS
-- Produtos: n.privacy, n.faturasONS, n.flow, n.discovery
-- Verticais: forense.io, trustness.

ALTER TABLE public.services_catalog
  ADD COLUMN IF NOT EXISTS delivery_type text DEFAULT 'service'
  CHECK (delivery_type IN ('service', 'product', 'vertical'));

COMMENT ON COLUMN public.services_catalog.delivery_type IS 'Classificação da entrega: service (operações), product (SaaS/plataforma), vertical (negócio especializado)';

-- Classificar por slug existente
UPDATE public.services_catalog SET delivery_type = 'service'
  WHERE slug IN ('nsecops', 'ninfraops', 'ndevarch', 'nautoops', 'ncirt', 'trustness-dpo');

UPDATE public.services_catalog SET delivery_type = 'product'
  WHERE slug IN ('nprivacy', 'nfaturasons', 'nflow', 'ndiscovery');

UPDATE public.services_catalog SET delivery_type = 'vertical'
  WHERE slug IN ('forense', 'trustness');
