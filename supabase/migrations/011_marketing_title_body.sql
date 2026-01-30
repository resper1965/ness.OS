-- RF.GRO.01: marketing_title e marketing_body para /solucoes/[slug]

ALTER TABLE public.services_catalog
  ADD COLUMN IF NOT EXISTS marketing_title text,
  ADD COLUMN IF NOT EXISTS marketing_body text;

COMMENT ON COLUMN public.services_catalog.marketing_title IS 'Título de marketing para a página do serviço. Se vazio, usa name.';
COMMENT ON COLUMN public.services_catalog.marketing_body IS 'Corpo/conteúdo da página /solucoes/[slug]. Markdown ou HTML.';
