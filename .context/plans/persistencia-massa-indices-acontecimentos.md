---
status: filled
generated: 2026-02-06
planVinculado: docs/PLANO-PERSISTENCIA-MASSA-INDICES-ACONTECIMENTOS.md
docs:
  - "project-overview.md"
  - "PLANO-GESTAO-DADOS-PERSISTENCIA.md"
  - "DATA-ERP-DICIONARIO.md"
phases:
  - id: "phase-1"
    name: "Agregação de eventos e visibilidade dos snapshots"
    prevc: "P"
  - id: "phase-2"
    name: "Índices derivados e documentação"
    prevc: "E"
---

# Persistência de dados — massa para índices e acompanhamento de acontecimentos

> Ampliar persistência na ness.OS para ter **massa de dados** que permita **gerar índices** e **acompanhar acontecimentos**: agregação de eventos (module_events), visibilidade dos snapshots e estado de sync, e base para índices derivados.

**Código do plano:** `DATA-MASSA` | **Commits:** `data-massa:`

## Objetivos

| # | Objetivo | Entregável |
|---|----------|------------|
| 1 | **Acompanhar acontecimentos** | Tabela `event_aggregates` (período, módulo, tipo_evento, contagem); cron que agrega `module_events` por dia; consultas para dashboards e tendências. |
| 2 | **Visibilidade da massa de dados** | Resumo na página ness.DATA: últimos períodos de cada snapshot (faturamento Omie, BCB), total de eventos, contagem de agregações; `getDataDashboardSummary` estendido. |
| 3 | **Base para índices derivados** | Estrutura opcional `data_indices` (período, chave, valor) ou uso de `event_aggregates` + `indicators` + snapshots existentes para calcular índices (ex.: leads/mês, MRR tendência). |

## Uso do ai-context

- **Este plano:** `.context/plans/persistencia-massa-indices-acontecimentos.md` — fonte de verdade.
- **Execução:** `workflow-init` (ex.: "persistencia-massa") e `workflow-advance` entre fases; opcionalmente `plan` (updateStep).
- **Documentação:** Atualizar `.context/docs/project-overview.md` e `docs/DATA-ERP-DICIONARIO.md` (ou novo doc `docs/PLANO-PERSISTENCIA-MASSA-INDICES-ACONTECIMENTOS.md`).

## Estado atual (codebase)

- **module_events:** tabela existente (module, event_type, entity_id, payload_json, created_at, processed). Apenas `lead.created` emitido hoje (growth).
- **Snapshots:** `erp_revenue_snapshot` (period, omie_codigo, valor), `bcb_rates_snapshot` (rate_type, ref_date, value*). Crons: sync-omie-revenue, sync-bcb-rates.
- **getDataDashboardSummary:** retorna clientsTotal, clientsWithOmie, lastSync, indicatorsCount — **não** retorna últimos períodos dos snapshots nem contagem de eventos.
- **Página ness.DATA:** exibe resumo de clientes, indicadores, último sync ERP; **não** exibe estado dos snapshots (último mês faturamento, última data BCB) nem acontecimentos/eventos.

## Fases

### Phase 1 — Agregação de eventos e visibilidade dos snapshots

1. **Migration `event_aggregates`:** tabela (period date, module text, event_type text, count int, UNIQUE(period, module, event_type)). Índices por period e (module, event_type). RLS para authenticated.
2. **Action `aggregateModuleEventsForPeriod(period)`:** agrupa module_events por (module, event_type) onde date(created_at) = period, faz upsert em event_aggregates, opcionalmente marca eventos como processados (processed=true) para esse período.
3. **Cron `POST /api/cron/aggregate-events`:** chama aggregateModuleEventsForPeriod para ontem (e opcionalmente para períodos atrasados). CRON_SECRET.
4. **getDataDashboardSummary:** estender para incluir: lastErpRevenuePeriod (max period de erp_revenue_snapshot), lastBcbRatesDate (max ref_date de bcb_rates_snapshot), eventsTotal (count de module_events), eventAggregatesCount (count de event_aggregates) ou últimos agregados.
5. **Página ness.DATA:** exibir cards/seção com: último snapshot faturamento (mês), último snapshot BCB (data), total de eventos, e link ou tabela resumida de acontecimentos (event_aggregates por período).

### Phase 2 — Índices derivados e documentação

1. **Índices derivados (opcional):** tabela `data_indices` (period date, index_key text, value numeric, metadata jsonb, UNIQUE(period, index_key)) para armazenar índices calculados (ex.: leads_mes, contratos_ativos, mrr_total). Action e cron que calculam a partir de inbound_leads, contracts, erp_revenue_snapshot — ou deixar para fase posterior e apenas documentar.
2. **Documentação:** criar `docs/PLANO-PERSISTENCIA-MASSA-INDICES-ACONTECIMENTOS.md` com resumo do plano e referência a este arquivo; atualizar `docs/DATA-ERP-DICIONARIO.md` com event_aggregates e data_indices (se implementado); atualizar project-overview com "Massa de dados e acontecimentos".

## Dicionário (novas tabelas)

| Tabela | Descrição | Chave natural | Uso |
|--------|-----------|----------------|-----|
| **event_aggregates** | Contagem de eventos por período, módulo e tipo | (period, module, event_type) | Dashboards de acontecimentos, tendências, índices derivados. |
| **data_indices** (opcional) | Índices calculados por período (ex.: leads_mes, mrr_total) | (period, index_key) | Relatórios e KPIs agregados. |

## Riscos e rollback

- **Risco:** agregação diária de muitos eventos pode ser pesada. **Mitigação:** processar por período único (ex.: ontem); índice em module_events (created_at, processed).
- **Rollback Phase 1:** remover cron e action de agregação; drop event_aggregates; reverter getDataDashboardSummary e página data.

## Referências

- `docs/PLANO-GESTAO-DADOS-PERSISTENCIA.md`, `docs/DATA-ERP-DICIONARIO.md`
- `src/app/actions/data.ts`, `src/lib/events/emit.ts`, `supabase/migrations/035_module_events.sql`
