# Plano: Persistência de dados — massa para índices e acontecimentos

**Código do plano:** `DATA-MASSA` | **Commits:** `data-massa:`

## Objetivo

Ampliar a persistência na ness.OS para ter **massa de dados** que permita:

1. **Gerar índices** — agregar eventos e snapshots por período para relatórios e KPIs.
2. **Acompanhar acontecimentos** — contagem de eventos por módulo e tipo (ex.: leads criados, contratos assinados) por dia/mês.

## Fonte de verdade (ai-context)

Plano detalhado em:

- **`.context/plans/persistencia-massa-indices-acontecimentos.md`**

## O que foi implementado (Phase 1)

| Entregável | Descrição |
|------------|-----------|
| **Tabela `event_aggregates`** | Contagem por (period, module, event_type). Migration `040_event_aggregates.sql`. |
| **Action `aggregateModuleEventsForPeriod(period)`** | Agrega `module_events` do dia em `event_aggregates` (upsert). |
| **Action `getEventAggregates(options?)`** | Retorna agregações para um período ou últimas N. |
| **Cron `POST /api/cron/aggregate-events`** | Agrega eventos do dia anterior. Exige CRON_SECRET. Ex.: `0 3 * * *` (diário 03:00). |
| **getDataDashboardSummary** | Estendido com: lastErpRevenuePeriod, lastBcbRatesDate, eventsTotal, eventAggregatesCount, recentEventAggregates. |
| **Página ness.DATA** | Exibe último snapshot faturamento, último snapshot BCB, total de eventos, acontecimentos agregados e lista dos últimos acontecimentos por período. |

## Tabelas envolvidas

| Tabela | Descrição |
|--------|-----------|
| **module_events** | Eventos emitidos pelos módulos (já existia). |
| **event_aggregates** | Contagem por (period, module, event_type). Nova. |
| **erp_revenue_snapshot** | Snapshot mensal faturamento Omie (já existia). |
| **bcb_rates_snapshot** | Cotações/índices BCB (já existia). |

## Eventos emitidos (massa para acontecimentos)

| Módulo | Evento | Quando |
|--------|--------|--------|
| growth | lead.created | Criação de lead (inbound_leads). |
| growth | case.created | Criação de caso de sucesso (success_cases). |
| growth | case.updated | Atualização de caso de sucesso. |
| fin | contract.created | Criação de contrato (contracts). |
| ops | playbook.created | Criação de playbook (playbooks). |
| people | job.created | Criação de vaga (public_jobs). |
| people | job_application.created | Candidatura (job_applications). |

O cron `POST /api/cron/aggregate-events` agrega esses eventos por dia em `event_aggregates`. Em produção (Vercel), configure `CRON_SECRET` e use o `vercel.json` com os crons (aggregate-events 03:00, compute-data-indices dia 1 às 04:00, sync-bcb-rates 06:00, sync-omie-revenue dia 1 às 02:00, sync-performance-metrics 02:00).

## Phase 2 — Índices derivados (implementado)

| Entregável | Descrição |
|------------|-----------|
| **Tabela `data_indices`** | (period, index_key, value, metadata). Migration `041_data_indices.sql`. |
| **Action `computeDataIndices(period)`** | Calcula leads_mes, contratos_ativos, mrr_total para o mês e faz upsert em data_indices. |
| **Action `getDataIndices(options?)`** | Retorna índices por período ou chave. |
| **Cron `POST /api/cron/compute-data-indices`** | Dia 1 do mês às 04:00; calcula índices do mês anterior. |
| **getDataDashboardSummary** | Inclui lastDataIndicesPeriod, dataIndicesCount, recentDataIndices. |
| **Página ness.DATA** | Exibe último período de índices, total de registros e lista dos últimos índices (period, index_key, value). |

## Próximos passos (Phase 2 — opcional)

- Tabela `data_indices` (period, index_key, value) para índices derivados (ex.: leads_mes, mrr_total).
- Expandir emissão de eventos em outros módulos (FIN, OPS, PEOPLE) para aumentar a massa de acontecimentos.
- Política de retenção (ex.: event_aggregates últimos 24 meses) e job de limpeza.

## Referências

- [Plano ai-context](.context/plans/persistencia-massa-indices-acontecimentos.md)
- [Plano gestão de dados](PLANO-GESTAO-DADOS-PERSISTENCIA.md)
- [Dicionário ERP](DATA-ERP-DICIONARIO.md)
- Actions: `src/app/actions/data.ts` — `aggregateModuleEventsForPeriod`, `getEventAggregates`, `getDataDashboardSummary`
