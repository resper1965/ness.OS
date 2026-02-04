-- Mobile Timesheet — Timer: registros de tempo por colaborador (ness.OPS / MR)
-- Plano: .context/plans/mobile-timesheet-timer.md

create table if not exists public.time_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  contract_id uuid not null references public.contracts(id) on delete restrict,
  playbook_id uuid references public.playbooks(id) on delete set null,
  started_at timestamptz not null,
  ended_at timestamptz,
  duration_minutes numeric generated always as (
    case when ended_at is not null then round((extract(epoch from (ended_at - started_at)) / 60)::numeric, 2) else null end
  ) stored,
  notes text,
  created_at timestamptz default now()
);

comment on table public.time_entries is 'Timesheet timer: sessões de tempo por colaborador (cliente/contrato/playbook). Alimenta MR (OPS) e rentabilidade (FIN).';

create index if not exists idx_time_entries_user_started on public.time_entries (user_id, started_at desc);
create index if not exists idx_time_entries_contract_started on public.time_entries (contract_id, started_at);

alter table public.time_entries enable row level security;

-- SELECT: usuário vê apenas seus próprios registros
create policy "time_entries_select_own"
  on public.time_entries for select to authenticated
  using (user_id = auth.uid());

-- INSERT: apenas com user_id = auth.uid()
create policy "time_entries_insert_own"
  on public.time_entries for insert to authenticated
  with check (user_id = auth.uid());

-- UPDATE: apenas próprio registro (para parar timer ou corrigir)
create policy "time_entries_update_own"
  on public.time_entries for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- DELETE: apenas próprio registro
create policy "time_entries_delete_own"
  on public.time_entries for delete to authenticated
  using (user_id = auth.uid());
