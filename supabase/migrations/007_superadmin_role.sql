-- Adicionar superadmin ao enum e às policies
-- superadmin já pode existir; ignorar erro se duplicar
DO $$ BEGIN
  ALTER TYPE user_role ADD VALUE 'superadmin';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DROP POLICY IF EXISTS inbound_leads_select_sales_admin ON public.inbound_leads;
DROP POLICY IF EXISTS inbound_leads_update_sales_admin ON public.inbound_leads;

CREATE POLICY inbound_leads_select_sales_admin ON public.inbound_leads
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role IN ('admin', 'sales', 'superadmin')
  ));

CREATE POLICY inbound_leads_update_sales_admin ON public.inbound_leads
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role IN ('admin', 'sales', 'superadmin')
  ));
