-- Agregação time_entries por contrato + mês (fase 2 timer).
-- Com RLS em time_entries, cada usuário vê apenas seus próprios totais ao consultar a view.

create or replace view public.v_time_entries_by_contract_month as
select
  te.contract_id,
  c.client_id,
  cl.name as client_name,
  (date_trunc('month', te.started_at))::date as month,
  sum(te.duration_minutes) as total_minutes,
  round((sum(te.duration_minutes) / 60)::numeric, 2) as total_hours
from public.time_entries te
join public.contracts c on c.id = te.contract_id
join public.clients cl on cl.id = c.client_id
where te.ended_at is not null
group by te.contract_id, c.client_id, cl.name, date_trunc('month', te.started_at);

comment on view public.v_time_entries_by_contract_month is 'Horas do timer por contrato e mês. RLS de time_entries aplica-se: usuário vê só seus totais.';
