-- ness.PEOPLE: Vagas públicas
create table if not exists public.public_jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description_html text,
  department text,
  is_open boolean default true,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- ness.PEOPLE: Candidaturas
create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.public_jobs(id) on delete cascade,
  candidate_name text not null,
  candidate_email text not null,
  linkedin_url text,
  cv_url text,
  message text,
  created_at timestamp default now()
);

-- ness.PEOPLE: Gaps de treinamento
create table if not exists public.training_gaps (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid references public.profiles(id) on delete cascade,
  description text not null,
  severity text default 'medium',
  resolved_at timestamp,
  created_at timestamp default now()
);

-- RLS
alter table public.public_jobs enable row level security;
alter table public.job_applications enable row level security;
alter table public.training_gaps enable row level security;

-- Público: ler vagas abertas
create policy "public_jobs_read_open"
  on public.public_jobs for select using (is_open = true);

-- Público: inserir candidatura
create policy "job_applications_insert_anon"
  on public.job_applications for insert to anon with check (true);

-- Autenticado: gestão completa
create policy "public_jobs_authenticated"
  on public.public_jobs for all to authenticated using (true) with check (true);

create policy "job_applications_authenticated"
  on public.job_applications for all to authenticated using (true) with check (true);

create policy "training_gaps_authenticated"
  on public.training_gaps for all to authenticated using (true) with check (true);
