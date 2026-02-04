# Fluxo Timer → OPS → FIN (rentabilidade)

Fluxo de dados do Timer (ness.OPS) até a Rentabilidade (ness.FIN).

## Visão geral

1. **Timer** — Colaborador registra sessões em `/app/ops/timer` (cliente → contrato → playbook, Iniciar/Parar). Dados vão para `time_entries`.
2. **Agregação** — Job (cron ou manual) soma `time_entries` por `contract_id` + mês e atualiza `performance_metrics.hours_worked`.
3. **Métricas** — Em `/app/ops/metricas` é possível editar manualmente horas, custo hora e custo cloud; o botão "Sincronizar horas do timer" preenche `hours_worked` a partir do timer.
4. **Rentabilidade** — A view `contract_rentability` usa `performance_metrics` (hours_worked × hourly_rate + cost_input) para calcular margem por contrato; exibida em `/app/fin/rentabilidade`.

## Componentes

| Etapa | Onde | O quê |
|-------|------|--------|
| Registro | `/app/ops/timer` | TimerUI: start/stop; `time_entries` (user_id, contract_id, started_at, ended_at, duration_minutes). |
| Sincronização | `/app/ops/metricas` (botão) ou cron | `sync_performance_metrics_from_time_entries()` (Postgres); upsert em `performance_metrics` (contract_id, month, hours_worked). |
| API cron | `POST /api/cron/sync-performance-metrics` | Chamada com CRON_SECRET; usa service role. Ver [CRON-SYNC-PERFORMANCE-METRICS.md](./CRON-SYNC-PERFORMANCE-METRICS.md). |
| Rentabilidade | `/app/fin/rentabilidade` | View `contract_rentability`: MRR − (hours_worked × hourly_rate + cost_input). |

## Referências

- [.context/plans/mobile-timesheet-timer.md](../.context/plans/mobile-timesheet-timer.md)
- [CRON-SYNC-PERFORMANCE-METRICS.md](./CRON-SYNC-PERFORMANCE-METRICS.md)
- Migrations: `030_time_entries_timesheet.sql`, `031_time_entries_aggregation_view.sql`, `032_sync_performance_metrics_from_timer.sql`
