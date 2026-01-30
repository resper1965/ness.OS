-- View de rentabilidade por contrato
create or replace view public.contract_rentability as
select
  c.id as contract_id,
  cl.name as client_name,
  c.mrr as revenue,
  coalesce(sum(pm.cost_input), 0) as total_cost,
  c.mrr - coalesce(sum(pm.cost_input), 0) as rentability
from public.contracts c
join public.clients cl on cl.id = c.client_id
left join public.performance_metrics pm on pm.contract_id = c.id
group by c.id, cl.name, c.mrr;
