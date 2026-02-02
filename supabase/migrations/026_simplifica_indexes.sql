-- SIMPLIFICA: Índices para queries frequentes (Fase 5)
-- Melhora performance de listagens e filtros

CREATE INDEX IF NOT EXISTS idx_inbound_leads_status ON inbound_leads(status);
CREATE INDEX IF NOT EXISTS idx_inbound_leads_created ON inbound_leads(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_public_posts_published ON public_posts(is_published) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_public_posts_slug ON public_posts(slug);

CREATE INDEX IF NOT EXISTS idx_public_jobs_open ON public_jobs(is_open) WHERE is_open = true;

CREATE INDEX IF NOT EXISTS idx_contracts_renewal ON contracts(renewal_date);
CREATE INDEX IF NOT EXISTS idx_contracts_client ON contracts(client_id);
