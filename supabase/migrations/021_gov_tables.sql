-- ness.GOV: Estrutura inicial

CREATE TABLE IF NOT EXISTS public.policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.policy_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id uuid REFERENCES public.policies(id) ON DELETE CASCADE,
  content_text text NOT NULL,
  version int NOT NULL DEFAULT 1,
  effective_at date,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.policy_acceptances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_version_id uuid REFERENCES public.policy_versions(id) ON DELETE CASCADE,
  profile_id uuid REFERENCES public.profiles(id),
  accepted_at timestamptz DEFAULT now()
);

ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy_acceptances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "policies_authenticated" ON public.policies FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "policy_versions_authenticated" ON public.policy_versions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "policy_acceptances_authenticated" ON public.policy_acceptances FOR ALL TO authenticated USING (true) WITH CHECK (true);
