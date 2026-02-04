-- CEP — Conexão ERP (Omie): log de sincronização e coluna omie_codigo em clients

-- clients: código do cliente no Omie para matching
ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS omie_codigo text;

CREATE UNIQUE INDEX IF NOT EXISTS clients_omie_codigo_key
  ON public.clients (omie_codigo) WHERE omie_codigo IS NOT NULL;

COMMENT ON COLUMN public.clients.omie_codigo IS 'Código do cliente no Omie ERP; usado no sync e na reconciliação';

-- erp_sync_log: auditoria de sync com Omie
CREATE TABLE IF NOT EXISTS public.erp_sync_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  status text NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'success', 'error')),
  record_count int,
  error_message text,
  created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.erp_sync_log IS 'Log de sincronização com ERP (Omie). CEP — ness.FIN';

ALTER TABLE public.erp_sync_log ENABLE ROW LEVEL SECURITY;

-- Apenas usuários autenticados podem ler; escrita feita pelo processo de sync (server)
CREATE POLICY "erp_sync_log_authenticated_read"
  ON public.erp_sync_log FOR SELECT TO authenticated USING (true);

CREATE POLICY "erp_sync_log_service_insert"
  ON public.erp_sync_log FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "erp_sync_log_service_update"
  ON public.erp_sync_log FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
