-- ness.PEOPLE: Avaliação 360º

CREATE TABLE IF NOT EXISTS public.feedback_360 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  rater_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  criteria text,
  score int,
  comment text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.feedback_360 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "feedback_360_authenticated" ON public.feedback_360 FOR ALL TO authenticated USING (true) WITH CHECK (true);
