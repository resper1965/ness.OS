-- Hub de Indicadores (ness.DATA) — ingestão de métricas de ferramentas externas (Infra, Sec, Data, Custom).
-- Plano: .context/plans/ness-data-modulo-dados.md; PLANO-NESS-OPS-ENGENHARIA-PROCESSOS.md (HI).
-- OPS consome para dashboards em /app/ops/indicators.

create table if not exists public.indicators (
  id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('Infra', 'Sec', 'Data', 'Custom')),
  contract_id uuid references public.contracts(id) on delete set null,
  metric_type text not null,
  value numeric not null,
  metadata jsonb,
  period date,
  created_at timestamptz default now()
);

comment on table public.indicators is 'Indicadores ingeridos de fontes externas (Infra, Sec, Data, Custom). ness.DATA recebe via API; OPS consome para dashboards.';
comment on column public.indicators.source is 'Fonte: Infra | Sec | Data | Custom';
comment on column public.indicators.metric_type is 'Tipo da métrica (ex.: uptime, incidents_count, sla_pct)';
comment on column public.indicators.period is 'Período de referência (ex.: mês YYYY-MM-01).';

create index if not exists idx_indicators_source_period on public.indicators (source, period);
create index if not exists idx_indicators_contract_period on public.indicators (contract_id, period) where contract_id is not null;

alter table public.indicators enable row level security;

-- SELECT: apenas roles que podem ver OPS (admin, superadmin, ops)
create policy "indicators_select_ops_roles"
  on public.indicators for select to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'superadmin', 'ops')
    )
  );

-- INSERT: via service role (API de ingestão) ou roles ops/admin (Server Action)
create policy "indicators_insert_ops_roles"
  on public.indicators for insert to authenticated
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'superadmin', 'ops')
    )
  );
