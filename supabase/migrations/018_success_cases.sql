-- RF.GRO.04: Casos de Sucesso

CREATE TABLE IF NOT EXISTS public.success_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  raw_data text,
  summary text,
  content_html text,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.success_cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "success_cases_select_published"
  ON public.success_cases FOR SELECT TO anon
  USING (is_published = true);

CREATE POLICY "success_cases_all_authenticated"
  ON public.success_cases FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
