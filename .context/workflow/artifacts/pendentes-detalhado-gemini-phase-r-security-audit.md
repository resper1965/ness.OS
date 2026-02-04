# Fase R — Revisão security-auditor (plano pendentes-detalhado-gemini)

**Data:** 2026-02-04  
**Entrada:** [pendentes-detalhado-gemini-phase-r-code-review.md](./pendentes-detalhado-gemini-phase-r-code-review.md)

---

## Checklist de segurança

### 1. API keys e secrets

| Item | Status | Observação |
|------|--------|------------|
| **Gemini API key** | Pendente (P2.1) | Step `ai_agent` ainda é stub; ao implementar, usar **variável de ambiente** (ex.: `GEMINI_API_KEY`) e nunca commitar. Padrão do projeto: ver `INGEST_INDICATORS_API_KEY`, `CRON_SECRET`, `OMIE_APP_KEY`/`OMIE_APP_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`. |
| **Outras env** | OK | Uso de `process.env` apenas para config (Supabase, Omie, cron, ingest); sem keys em código. |

**Recomendação:** Documentar em README ou docs que `GEMINI_API_KEY` (ou nome escolhido) deve ser configurada no ambiente de deploy.

---

### 2. RLS (Row Level Security)

| Tabela | RLS | Políticas |
|--------|-----|-----------|
| **workflows** | Habilitado (036) | SELECT, INSERT, UPDATE para `authenticated`. |
| **workflow_runs** | Habilitado (036) | SELECT, INSERT, UPDATE para `authenticated`. |
| **workflow_pending_approvals** | Habilitado (037) | SELECT, INSERT, UPDATE para `authenticated`. |

**Conclusão:** Acesso restrito a usuários autenticados; sem política pública. OK.

---

### 3. Inputs e payloads

| Fluxo | Risco | Mitigação |
|-------|--------|------------|
| **Engine runWorkflow(workflowId, eventPayload)** | Payload arbitrário em context e em `workflow_pending_approvals.payload`. | Execução server-side; Supabase client usa sessão autenticada. Ao preencher `resolution_payload` na UI (P1.2), validar/sanitizar no backend antes de UPDATE. |
| **Página /app/ops/workflows** | Apenas leitura (workflows e pending approvals). | Sem input de usuário direto para escrita nesta página; OK. |
| **EntityForm / formulários** | Formulários existentes já usam Server Actions e validação (Zod etc.). | Manter padrão ao migrar para EntityForm; não expor payload bruto sem validação. |

**Recomendação:** Na implementação da tela de resolução HITL (P1.2), usar Server Action que valide e atualize `workflow_pending_approvals` (status, resolution_payload, resolved_by) em vez de expor API genérica.

---

### 4. Resumo

- **Nenhum bloqueio de segurança** para avançar para a fase E.
- **Ao implementar P2.1 (Gemini):** Garantir API key em env; considerar rate limit e timeout na chamada ao modelo.
- **Ao implementar P1.2 (HITL):** Validar e autorizar resolução (ex.: apenas o usuário designado ou role específica) antes de UPDATE em `workflow_pending_approvals`.

**Artefato:** `.context/workflow/artifacts/pendentes-detalhado-gemini-phase-r-security-audit.md`
