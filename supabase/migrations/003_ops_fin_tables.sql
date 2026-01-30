-- ness.OPS: Playbooks
create table if not exists public.playbooks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  content_markdown text,
  created_at timestamp default now(),
  updated_at timestamp default now(),
  created_by uuid references public.profiles(id)
);

-- ness.FIN: Clientes e Contratos
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  document text,
  contact_email text,
  created_at timestamp default now()
);

create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete restrict,
  mrr numeric not null default 0,
  start_date date,
  end_date date,
  notes text,
  created_at timestamp default now()
);

-- ness.OPS / ness.FIN: Métricas de performance
create table if not exists public.performance_metrics (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid references public.contracts(id) on delete cascade,
  month date not null,
  hours_worked numeric default 0,
  sla_achieved boolean default true,
  cost_input numeric default 0,
  notes text,
  created_at timestamp default now(),
  unique(contract_id, month)
);

-- RLS
alter table public.playbooks enable row level security;
alter table public.clients enable row level security;
alter table public.contracts enable row level security;
alter table public.performance_metrics enable row level security;

create policy "playbooks_authenticated"
  on public.playbooks for all to authenticated using (true) with check (true);

create policy "clients_authenticated"
  on public.clients for all to authenticated using (true) with check (true);

create policy "contracts_authenticated"
  on public.contracts for all to authenticated using (true) with check (true);

create policy "performance_metrics_authenticated"
  on public.performance_metrics for all to authenticated using (true) with check (true);
