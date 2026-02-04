# Cron: Sincronizar performance_metrics a partir do Timer

Job que agrega `time_entries` por `contract_id` e mês e atualiza `performance_metrics.hours_worked`. Fecha o ciclo OPS Timer → Métricas → Rentabilidade (ness.FIN).

## O que faz

1. **Função no Postgres** (`sync_performance_metrics_from_time_entries`): soma `duration_minutes` de `time_entries` (com `ended_at` preenchido) por contrato e mês; faz upsert em `performance_metrics` (contract_id, month, hours_worked). Migration: `supabase/migrations/032_sync_performance_metrics_from_timer.sql`.

2. **API de cron:** `POST /api/cron/sync-performance-metrics` — exige `Authorization: Bearer <CRON_SECRET>` ou header `x-cron-secret: <CRON_SECRET>`.

3. **Sincronização manual:** em `/app/ops/metricas`, botão "Sincronizar horas do timer" (apenas admin/ops/superadmin) chama a Server Action `syncPerformanceMetricsFromTimer()`, que executa a mesma função via RPC.

## Configuração

- **CRON_SECRET:** definir no Vercel (ou env) e usar no cron externo ou no Vercel Cron.
- **SUPABASE_SERVICE_ROLE_KEY:** obrigatório para a API de cron (cliente admin em `lib/supabase/admin.ts`). Nunca expor ao client.

## Vercel Cron (opcional)

Criar `vercel.json` na raiz:

```json
{
  "crons": [
    {
      "path": "/api/cron/sync-performance-metrics",
      "schedule": "0 2 * * *"
    }
  ]
}
```

Schedule `0 2 * * *` = todo dia às 02:00 UTC. O Vercel envia automaticamente `Authorization: Bearer <CRON_SECRET>` quando `CRON_SECRET` está configurado.

## Referências

- Plano: `.context/plans/mobile-timesheet-timer.md`
- Migrations: `030_time_entries_timesheet.sql`, `031_time_entries_aggregation_view.sql`, `032_sync_performance_metrics_from_timer.sql`
