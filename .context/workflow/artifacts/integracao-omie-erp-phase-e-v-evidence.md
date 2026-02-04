# Integração Omie ERP — Evidência Phase E + V

**Workflow:** integracao-omie-erp  
**Data:** 2026-02-03

---

## Phase E — Entregas

| Item | Artefato | Status |
|------|----------|--------|
| Migration | `supabase/migrations/029_erp_sync_omie.sql` | OK — erp_sync_log + clients.omie_codigo (unique index) |
| Cliente Omie | `src/lib/omie/client.ts` | OK — omiePost, listarClientes, listarContasReceber (stub payload) |
| Sync | `src/app/actions/data.ts` — syncOmieErp(), getLastErpSync(), getOmieContasReceber() | OK — ness.DATA; role admin/superadmin/cfo/fin; erp_sync_log; rate limit 5 min; upsert clients |
| UI | `src/components/fin/erp-sync-button.tsx` + /app/fin/contratos | OK — botão "Sincronizar ERP (Omie)", última sync, status, record_count, error_message |
| Reconciliação | getReconciliationAlerts() em fin.ts; /app/fin/alertas | OK — FIN consome getOmieContasReceber via DATA; alertas MRR vs Omie na página Alertas |

---

## Phase V — Validação

| Critério | Resultado |
|----------|-----------|
| Build | `npm run build` — OK (Next.js 14.2.18) |
| Lint | Sem erros nos arquivos alterados |
| Segurança | Credenciais apenas em env; sync protegido por role; erp_sync_log RLS; error_message truncado 500 chars |
| Documentação | .env.example já prevê OMIE_APP_KEY/SECRET; plano e design em .context/ |

---

## Pendências (pós-MVP)

1. Validar payload exato da API Omie (ListarContasReceber: data_inclusao_* vs data_inicial/data_final) em https://app.omie.com.br/developer/
2. ~~Integrar listarContasReceber e getReconciliationAlerts()~~ — feito: getOmieContasReceber em DATA; alertas em /app/fin/alertas
3. ~~Exibir alertas de divergência na UI~~ — feito: seção Reconciliação MRR vs Omie em /app/fin/alertas
4. ~~Rate limit na action de sync~~ — feito: 5 min em syncOmieErp() (data.ts)
