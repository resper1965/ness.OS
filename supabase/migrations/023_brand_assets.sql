-- ness.GROWTH: Brand Guardian

CREATE TABLE IF NOT EXISTS public.brand_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  asset_type text,
  url text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.brand_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "brand_assets_authenticated" ON public.brand_assets FOR ALL TO authenticated USING (true) WITH CHECK (true);
