---
status: ready
generated: 2026-02-03
planSlug: integracao-omie-erp
planVinculado: docs/PLANO-NESS-FIN-CFO-DIGITAL.md
constrains:
  - "Stack: Next.js, Supabase, Server Actions ou Edge Functions"
  - "Credenciais Omie apenas server-side (OMIE_APP_KEY, OMIE_APP_SECRET)"
  - "Não expor chaves no frontend; sync disparado por usuário autorizado ou cron"
agents:
  - type: "architect-specialist"
    role: "Definir padrão de integração REST, mapeamento Omie ↔ ness.OS"
  - type: "feature-developer"
    role: "Implementar sync, erp_sync_log, reconciliação MRR"
  - type: "security-auditor"
    role: "Revisar uso de secrets e acesso à API Omie"
  - type: "documentation-writer"
    role: "Documentar endpoints usados, fluxo de sync e troubleshooting"
docs:
  - "project-overview.md"
  - "architecture.md"
  - "glossary.md"
  - "security.md"
phases:
  - id: "phase-1"
    name: "Discovery & Alignment"
    prevc: "P"
  - id: "phase-2"
    name: "Implementation & Iteration"
    prevc: "E"
  - id: "phase-3"
    name: "Validation & Handoff"
    prevc: "V"
---

# Integração Omie ERP — ness.FIN (CEP)

> Planejar e implementar integração com Omie ERP: sync clientes, contratos e contas a receber; reconciliar MRR com faturamento; mapear despesas por contrato. Usar OMIE_APP_KEY e OMIE_APP_SECRET.

**Documento de negócio:** [docs/PLANO-NESS-FIN-CFO-DIGITAL.md](../../docs/PLANO-NESS-FIN-CFO-DIGITAL.md) — pilar **CEP (Conexão ERP)**.

**Trigger:** "integração Omie", "sync ERP", "conexão Omie", "reconciliar faturamento"

---

## Task Snapshot

- **Primary goal:** Receita e despesa em tempo real a partir do Omie; sync de clientes e contas a receber; reconciliação MRR interno vs. faturamento Omie; alerta de divergência.
- **Success signal:** Botão "Sincronizar ERP" funcional; tabela `erp_sync_log` com last_sync e status; comparação MRR vs. faturamento Omie com alerta de divergência; documentação dos endpoints e fluxo.
- **Key references:**
  - [Documentation Index](../docs/README.md)
  - [PLANO-NESS-FIN-CFO-DIGITAL](../../docs/PLANO-NESS-FIN-CFO-DIGITAL.md)
  - [Plans Index](./README.md)

---

## Codebase Context

- **Tabelas ness.FIN:** `contracts` (client_id, mrr, start_date, renewal_date, adjustment_index), `clients`; `performance_metrics` para custos.
- **Env:** `.env.example` já prevê `OMIE_APP_KEY` e `OMIE_APP_SECRET` (Edge Functions ou .env.local); nunca expor no frontend.
- **Rotas previstas:** `POST /api/fin/erp/sync` para disparar sync (docs/PLANO-NESS-FIN-CFO-DIGITAL.md).
- **Stack:** Next.js 14 App Router, Supabase, Server Actions em `app/actions/fin.ts`; integração Omie via REST (server-side apenas).

---

## API Omie (referência)

- **Base URL:** `https://app.omie.com.br/api/v1`
- **Autenticação:** app_key + app_secret no body (JSON); não OAuth.
- **Clientes:** `geral/clientes` — ListarClientes, ConsultarCliente, IncluirCliente, AlterarCliente.
- **Contas a receber:** `financas/contareceber/` — listar/consultar lançamentos; conciliação.
- **Documentação:** https://app.omie.com.br/developer/ — confirmar payloads e limites de taxa antes da implementação.

---

## Agent Lineup

| Agent | Role in this plan |
|-------|-------------------|
| Architect Specialist | Padrão de integração REST; mapeamento Omie clientes/codigo → clients.id; regras de reconciliação |
| Feature Developer | Sync (Server Action ou Edge Function), tabela erp_sync_log, UI "Sincronizar ERP", comparação MRR vs. faturamento |
| Security Auditor | Revisar armazenamento e uso de OMIE_APP_KEY/OMIE_APP_SECRET; não logar dados sensíveis |
| Documentation Writer | Endpoints usados, fluxo de sync, erros comuns e troubleshooting |

---

## Risk Assessment

### Identified Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| API Omie indisponível ou alteração de contrato | Medium | High | Documentar versão/contrato usado; retry e log de falhas |
| Credenciais vazadas | Low | Critical | Secrets apenas em env server/Edge; Security Auditor revisa |
| Volume de dados (timeout sync) | Medium | Medium | Sync incremental ou paginação; erp_sync_log com record_count e status |

### Dependencies

- **Internal:** ness.FIN — tabelas `clients`, `contracts` estáveis; RF.FIN.01 (renewal_date, adjustment_index) desejável antes de reconciliar ciclo de vida.
- **External:** Conta Omie com API habilitada; OMIE_APP_KEY e OMIE_APP_SECRET válidos.
- **Technical:** HTTPS para Omie; Node fetch ou lib HTTP no server (Next.js/Supabase).

### Assumptions

- API Omie aceita JSON com app_key e app_secret no body por request.
- ListarClientes e listar contas a receber permitem paginação ou filtro por período para não sobrecarregar.
- Mapeamento cliente Omie ↔ `clients.id` será por código externo (campo em clients) ou por CNPJ/razão social; decisão na Phase 1.

---

## Resource Estimation

| Phase | Estimated Effort | Calendar Time |
|-------|------------------|---------------|
| Phase 1 - Discovery | 1–2 person-days | 2–4 days |
| Phase 2 - Implementation | 4–6 person-days | 1–2 weeks |
| Phase 3 - Validation | 1–2 person-days | 2–4 days |
| **Total** | **6–10 person-days** | **~2–3 weeks** |

### Required Skills

- Integração REST (server-side); leitura da documentação Omie; SQL (migrations Supabase); opcional: Edge Functions Supabase.

---

## Working Phases

### Phase 1 — Discovery & Alignment (P)

**Objetivo:** Alinhar escopo da API Omie com o modelo ness.FIN e definir mapeamento.

**Steps**

1. **Confirmar credenciais e escopo** — Validar OMIE_APP_KEY e OMIE_APP_SECRET; listar endpoints que serão usados na primeira entrega: ListarClientes, listar contas a receber (e filtros/período).
2. **Mapeamento de dados** — Definir: Omie cliente (codigo_cliente / CNPJ) → `clients` (campo `omie_codigo` ou similar); contas a receber → como agregar faturamento por cliente/contrato para comparação com `contracts.mrr`.
3. **Regras de reconciliação** — Definir tolerância de divergência MRR vs. faturamento Omie (ex.: % ou valor fixo); quando disparar alerta na UI.
4. **Documentar decisões** — Atualizar este plano com: endpoints escolhidos, formato de mapeamento, e link para doc oficial Omie usada.

**Commit Checkpoint:** `chore(plan): phase 1 discovery integracao-omie-erp`

---

### Phase 2 — Implementation & Iteration (E)

**Objetivo:** Implementar sync, log e UI mínima; depois reconciliação MRR.

**Steps**

1. **Migration `erp_sync_log`** — Campos: id, started_at, finished_at, status (running|success|error), record_count (opcional), error_message (opcional), created_at. RLS: apenas roles autorizados (admin/cfo).
2. **Cliente HTTP Omie** — Módulo server-only (ex.: `lib/omie/client.ts` ou em `app/actions`) que recebe app_key/app_secret de env, monta body JSON e chama endpoints Omie; tratar erros e timeouts.
3. **Sync clientes** — Ação que chama ListarClientes (ou paginado), normaliza dados e upsert em `clients` (criar ou atualizar por codigo_cliente/CNPJ); registrar em `erp_sync_log`.
4. **Sync contas a receber** — Listar lançamentos por período; decidir se persiste em tabela auxiliar (ex.: `erp_receivables`) ou só agrega em memória para reconciliação; registrar sync em `erp_sync_log`.
5. **Rota ou Server Action de sync** — `POST /api/fin/erp/sync` ou Server Action `syncOmieErp()` protegida por role; chama sync clientes + contas a receber e atualiza `erp_sync_log`.
6. **UI ness.FIN** — Em /app/fin/contratos ou /app/fin/rentabilidade: botão "Sincronizar ERP", status da última sync (última data, status success/error), mensagem de erro se falhou.
7. **Reconciliação MRR** — Job ou ação que compara `contracts.mrr` (por cliente) com faturamento Omie (agregado das contas a receber do período); exibir alerta ou coluna "Divergência" quando fora da tolerância.

**Commit Checkpoint:** `fin-cfo: phase 2 implementation integracao Omie (sync + erp_sync_log + UI)`

---

### Phase 3 — Validation & Handoff (V)

**Objetivo:** Garantir que sync e reconciliação funcionam em ambiente controlado e documentação está útil.

**Steps**

1. **Teste manual** — Com credenciais de sandbox/teste: disparar sync; verificar erp_sync_log e dados em clients; validar comparação MRR vs. faturamento.
2. **Documentação** — Atualizar docs: quais endpoints Omie são usados; variáveis de ambiente; fluxo de sync; erros comuns (ex.: 401, timeout) e como resolver.
3. **Segurança** — Confirmar que OMIE_APP_KEY e OMIE_APP_SECRET não aparecem em logs nem no frontend; revisão Security Auditor se necessário.
4. **Evidência** — Registrar no plano: link para PR(s), trecho de doc atualizado, e decisão de mapeamento (Phase 1).

**Commit Checkpoint:** `chore(plan): phase 3 validation integracao-omie-erp`

---

## Rollback Plan

### Rollback Triggers

- Erros críticos na API Omie que corrompem dados em `clients`; vazamento de credenciais; indisponibilidade prolongada do Omie sem fallback.

### Rollback Procedures

- **Phase 2:** Desabilitar rota/action de sync; reverter migration apenas se não houver dados importantes em `erp_sync_log` (ou manter tabela para auditoria). Reverter commits da feature.
- **Phase 3:** Mesmo que Phase 2; remover botão "Sincronizar ERP" e esconder coluna de divergência até nova versão.

### Post-Rollback

- Documentar motivo; notificar; agendar revisão antes de retentar (ex.: mudança de escopo ou de provedor).

---

## Phase 1 — Decisões registradas (P)

- **Mapeamento:** `clients` ganha coluna `omie_codigo` (text, unique); matching por `document` (CNPJ) na primeira sync; depois por `omie_codigo`.
- **Endpoints:** ListarClientes (`geral/clientes`), listar contas a receber (`financas/contareceber/`) com filtro de período.
- **Reconciliação:** Tolerância 5% do MRR ou R$ 50 (o que for maior); período = mês corrente; alerta na UI quando divergência > tolerância.
- **Artefato:** [.context/workflow/artifacts/integracao-omie-erp-phase-p-design.md](../workflow/artifacts/integracao-omie-erp-phase-p-design.md)

---

## Evidence & Follow-up

- Link para PR(s) da integração Omie.
- Trecho ou link para doc atualizado (endpoints, env, fluxo de sync).
- Decisão de mapeamento Omie ↔ clients (Phase 1) registrada neste plano ou em comentário no código.
