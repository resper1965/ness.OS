-- ness.JUR: Estrutura inicial

DO $$ BEGIN
  ALTER TYPE user_role ADD VALUE 'legal';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.legal_docs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  doc_type text,
  content_text text,
  storage_path text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.contract_risk_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legal_doc_id uuid REFERENCES public.legal_docs(id) ON DELETE CASCADE,
  clause_type text,
  excerpt text,
  severity text,
  suggestion text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.compliance_frameworks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.compliance_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  framework_id uuid REFERENCES public.compliance_frameworks(id),
  process_ref text,
  status text,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.legal_docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_risk_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_frameworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "legal_docs_authenticated" ON public.legal_docs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "contract_risk_analysis_authenticated" ON public.contract_risk_analysis FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "compliance_frameworks_authenticated" ON public.compliance_frameworks FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "compliance_checks_authenticated" ON public.compliance_checks FOR ALL TO authenticated USING (true) WITH CHECK (true);
