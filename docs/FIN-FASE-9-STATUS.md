# ness.FIN — FASE 9 (Status)

> Checklist da FASE 9 do plano de execução final. Ref: [PLANO-EXECUCAO-FASE-5-FINAL.md](PLANO-EXECUCAO-FASE-5-FINAL.md).

## PASSO 9.1 — Alertas de Renovação

- **Página:** `/app/fin/alertas` — listagem de contratos com **renewal_date** nos próximos 30 dias (hoje ≤ renewal_date ≤ hoje + 30).
- **Bloco:** PageCard "Renovação (próximos 30 dias)" — Cliente, MRR, Data de renovação.
- **Dados:** Query em `contracts` com `renewal_date` não nulo, entre today e today+30, ordenado por renewal_date.
- **Opcional (futuro):** Edge Function ou API route agendada (cron) para enviar notificação ou registrar em tabela `notifications` quando renewal_date ≤ hoje + 30. Hoje a listagem é on-demand na página.

## PASSO 9.2 — Integração Omie (estrutura)

- **Tabela de log:** `erp_sync_log` (migration `029_erp_sync_omie.sql`) — id, started_at, finished_at, status (running/success/error), record_count, error_message. Equivalente ao "omie_sync_log" do plano.
- **Sync:** Server Action `syncOmieErp()` em `src/app/actions/data.ts` — sincroniza clientes Omie com `clients` (upsert por omie_codigo). Botão "Sincronizar ERP" na página `/app/fin/contratos` (ErpSyncButton) dispara a ação.
- **Variáveis:** `OMIE_APP_KEY` e `OMIE_APP_SECRET` em `.env.local` (ou secrets do Supabase). Documentadas em `.env.example`.
- **Cliente API:** `src/lib/omie/client.ts` — listar clientes, listar contas a receber (reconciliação MRR vs faturamento).

## Página Alertas — Conteúdo atual

- **Reconciliação MRR vs Omie:** PageCard com clientes com divergência acima da tolerância (5% do MRR ou R$ 50), período mês corrente. Action `getReconciliationAlerts()` em `fin.ts`.
