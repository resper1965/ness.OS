-- Job: agregar time_entries por contract_id + mês e atualizar performance_metrics.hours_worked.
-- Plano: .context/plans/mobile-timesheet-timer.md (fase 2).
-- Chamado por cron (API /api/cron/sync-performance-metrics) com service role.

create or replace function public.sync_performance_metrics_from_time_entries()
returns table(contract_id uuid, month date, hours_worked numeric)
language sql
security definer
set search_path = public
as $$
  with agg as (
    select
      te.contract_id,
      (date_trunc('month', te.started_at))::date as month,
      round((sum(te.duration_minutes) / 60)::numeric, 2) as total_hours
    from public.time_entries te
    where te.ended_at is not null
      and te.duration_minutes is not null
    group by te.contract_id, date_trunc('month', te.started_at)
  )
  insert into public.performance_metrics (contract_id, month, hours_worked)
  select agg.contract_id, agg.month, agg.total_hours
  from agg
  on conflict (contract_id, month)
  do update set hours_worked = excluded.hours_worked
  returning performance_metrics.contract_id, performance_metrics.month, performance_metrics.hours_worked;
$$;

comment on function public.sync_performance_metrics_from_time_entries() is
  'Agrega time_entries por contrato e mês e atualiza performance_metrics.hours_worked. Chamado por job/cron.';
