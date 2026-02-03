---
status: ready
generated: 2026-02-02
planSlug: fluxos-integracao-ia-automacao
phases:
  - phase-0
  - phase-1
  - phase-2
  - phase-3
  - phase-4
constrains:
  - "Escopo: apenas módulos ness.OS (GROWTH, OPS, FIN, PEOPLE, JUR, GOV)"
  - "Produtos e serviços da NESS não são objeto deste plano"
  - "Manter stack: Next.js, Supabase, Vercel AI SDK"
---

# Fluxos: Integração entre Módulos → Automação por IA

> Plano para implementar **dentro do ness.OS** fluxos de integração entre os módulos (GROWTH, OPS, FIN, PEOPLE, JUR, GOV) e automação por agentes de IA — usando apenas dados e entidades do ness.OS.

**Trigger:** "fluxos integração IA ness.OS", "automação módulos", "workflows entre módulos"

**Escopo:** Apenas os **módulos da ness.OS**. Produtos e serviços da NESS não são objeto destas interações.

---

## Visão Geral

O plano cobre fluxos **entre os módulos do ness.OS** e automação por IA usando dados já existentes na plataforma.

```
[Módulo A] → [Evento] → [Orquestrador] → [Agente IA] → [Módulo B]
  GROWTH       lead.created    Workflow     Propostas       GROWTH
  OPS          playbook.saved  Engine       RAG             OPS
  FIN          contract.created             Resumo          FIN
```

---

## Estado Atual (ness.OS)

| Componente | Status | Observação |
|------------|--------|------------|
| **Integração entre módulos** | Parcial | Trava playbook_id (OPS↔GROWTH); contratos↔métricas (FIN↔OPS) |
| **Eventos internos** | ❌ | Sem pub/sub ou triggers entre módulos |
| **Workflows** | ❌ | Fluxos manuais apenas |
| **Agentes IA** | ✅ | RAG Playbooks, Propostas (cliente+serviço), Case→Post |
| **Embeddings** | ✅ | pgvector, document_embeddings |

---

## Fase 0 — Eventos Internos e Orquestração

**Objetivo:** Criar a base para fluxos entre módulos — eventos e motor de workflows.

### Passo 0.1 — Tabela de Eventos Internos
**O que:** Schema para registrar eventos que módulos emitem (ex.: lead.created, case.saved, contract.created).
**Por quê:** Permite que um módulo reaja a ações de outro sem acoplamento direto.
**Entregas:**
- Migration: `module_events` (id, module, event_type, entity_id, payload_json, created_at)
- Lib `emitModuleEvent(module, eventType, entityId, payload)` — grava em `module_events`
- Chamar `emitModuleEvent` em Server Actions relevantes (ex.: ao criar lead, ao salvar case)

### Passo 0.2 — Motor de Workflows (eventos internos)
**O que:** Engine de workflows que reage a eventos de `module_events`.
**Por quê:** Orquestrar fluxos entre módulos (ex.: lead criado → qualificar com IA → atualizar lead).
**Entregas:**
- Tabela `workflows` (id, name, trigger_module, trigger_event, steps_json, is_active)
- Tabela `workflow_runs` (id, workflow_id, trigger_payload, status, started_at, ended_at)
- Lib `src/lib/workflows/engine.ts`: `runWorkflow(workflowId, eventPayload)`
- Steps: `db_query`, `ai_agent`, `condition`, `delay` — sem `http_request` ou webhooks externos

### Passo 0.3 — Disparo de Workflows por Evento
**O que:** Ao gravar evento em `module_events`, buscar workflows com trigger correspondente e executar.
**Por quê:** Automação reativa a ações internas do ness.OS.
**Entregas:**
- Função `processModuleEvent(module, eventType, payload)` — busca workflows, chama `runWorkflow`
- Chamar após `emitModuleEvent` (ou via cron que processa `module_events` com `processed=false`)

---

## Fase 1 — Fluxos entre Módulos (sem IA)

**Objetivo:** Integração explícita entre módulos usando dados do ness.OS.

### Passo 1.1 — Fluxo GROWTH ↔ OPS (já parcial)
**O que:** Garantir que serviços (GROWTH) usem playbooks (OPS); casos e posts referenciem playbooks quando relevante.
**Por quê:** Trava de catálogo já existe; ampliar visibilidade cruzada.
**Entregas:**
- Documentar fluxo: `services_catalog.playbook_id` → playbooks; Propostas usam playbook no Agente
- (Opcional) Em `Case→Post`, incluir referência a playbook relacionado no contexto da IA

### Passo 1.2 — Fluxo FIN ↔ OPS
**O que:** Contratos (FIN) alimentam métricas (OPS); performance_metrics usa contract_id.
**Por quê:** Já existe FK; garantir que métricas exibam dados de contratos.
**Entregas:**
- Revisar `performance_metrics` e view `rentabilidade` — garantir que contratos inativos não quebrem
- (Opcional) Evento `contract.created` → notificar OPS para configurar métricas

### Passo 1.3 — Fluxo PEOPLE ↔ OPS
**O que:** Gaps de treinamento (PEOPLE) referenciam playbooks (OPS).
**Por quê:** Já existe `training_gaps.playbook_id`; vincular gap a procedimento.
**Entregas:**
- Garantir que tela de Gaps permita selecionar playbook violado
- Evento `gap.created` → (opcional) sugerir playbook via IA em fluxo posterior

---

## Fase 2 — Fluxos Automatizados por IA

**Objetivo:** Inserir agentes de IA nos fluxos entre módulos.

### Passo 2.1 — Step `ai_agent` no Motor
**O que:** Novo tipo de step que chama um agente IA e usa o retorno no fluxo.
**Por quê:** Workflows podem usar IA para decisão ou geração.
**Entregas:**
- Step `ai_agent`: config { agent: 'qualify_lead'|'generate_proposal'|'generate_post'|'suggest_playbook', context_keys }
- Lib `src/lib/ai/agents.ts`: funções por agente (reutilizar lógica existente de ai.ts)
- Input: payload do workflow (lead, case, contract). Output: JSON para próximo step

### Passo 2.2 — Fluxo: Lead → Qualificação (GROWTH)
**O que:** Ao criar lead (site ou manual), IA qualifica e atualiza score/segmento.
**Por quê:** Automatizar triagem de leads dentro do ness.OS.
**Entregas:**
- Agente `qualifyLead(lead)` → { score: number, segment: string, suggested_action: string }
- Campo `lead_score`, `lead_segment` em `inbound_leads` (migration)
- Workflow: trigger `growth.lead.created` → `ai_agent:qualify_lead` → `db_query` (update inbound_leads)

### Passo 2.3 — Fluxo: Case → Post (GROWTH) — já existe
**O que:** Botão "Transformar em Post" chama Agente de Conteúdo.
**Por quê:** Já implementado; garantir que seja acionável por workflow (opcional).
**Entregas:**
- (Opcional) Expor `generatePostFromCase` como step `ai_agent:generate_post`
- Workflow: trigger `growth.case.saved` → `condition` (tem raw_data) → `ai_agent:generate_post` → `human_review` → criar post

### Passo 2.4 — Fluxo: Cliente + Serviço → Proposta (GROWTH)
**O que:** Agente de Propostas já gera minuta; integrar em workflow.
**Por quê:** Acionar geração automática quando lead qualificado vira oportunidade.
**Entregas:**
- Expor `generateProposalWithAI` como step `ai_agent:generate_proposal`
- Workflow: trigger `growth.lead.qualified` (ou manual) → `ai_agent:generate_proposal` → `human_review` → criar proposta

### Passo 2.5 — Human-in-the-Loop (HITL)
**O que:** Step que pausa o workflow e espera aprovação humana.
**Por quê:** Decisões críticas exigem supervisão.
**Entregas:**
- Step `human_review`: cria registro em `workflow_pending_approvals`
- Página `/app/ops/workflows/pendentes` — lista de aprovações pendentes
- Action `approveWorkflowStep` / `rejectWorkflowStep`

---

## Fase 3 — Evolução dos Agentes

**Objetivo:** Novos agentes e melhorias usando dados dos módulos.

### Passo 3.1 — Agente: Sugerir Playbook para Gap (PEOPLE ↔ OPS)
**O que:** Ao criar gap, IA sugere playbook relacionado com base em descrição.
**Por quê:** Vincular gap a procedimento sem busca manual.
**Entregas:**
- `suggestPlaybookForGap(gapDescription)` → { playbook_id: uuid, confidence: number }
- Usar RAG em playbooks (títulos, conteúdo) para matching
- Workflow: trigger `people.gap.created` → `ai_agent:suggest_playbook` → `human_review` → atualizar training_gaps

### Passo 3.2 — Agente: Resumo de Contrato (FIN)
**O que:** IA gera resumo executivo de contrato para dashboards.
**Por quê:** Facilitar visão gerencial sem ler contrato inteiro.
**Entregas:**
- `generateContractSummary(contractId)` → { summary: string, key_terms: string[] }
- Campo `summary_ai` em `contracts` (opcional) ou tabela separada
- Acionável manualmente ou via workflow `fin.contract.created`

### Passo 3.3 — Feedback Loop para IA
**O que:** Registrar quando humano corrige sugestão da IA.
**Por quê:** Melhorar agentes ao longo do tempo.
**Entregas:**
- Tabela `ai_feedback` (id, agent, input_hash, output_original, output_corrected, created_at)
- Em HITL: quando operador altera e aprova, gravar em `ai_feedback`

---

## Fase 4 — Interface e Monitoramento

**Objetivo:** Interface para configurar workflows e monitorar execuções.

### Passo 4.1 — Páginas de Workflows (ness.OPS)
**O que:** CRUD de workflows em `/app/ops/workflows`.
**Por quê:** Operação configurar fluxos entre módulos sem código.
**Entregas:**
- Página `/app/ops/workflows` — lista de workflows
- Página `/app/ops/workflows/novo` — form: nome, trigger (módulo + evento), steps (JSON ou UI simples)
- Validação de steps com schema Zod

### Passo 4.2 — Dashboard de Execuções
**O que:** Métricas de workflow_runs por dia, taxa de sucesso, latência.
**Por quê:** Identificar falhas e gargalos.
**Entregas:**
- Página `/app/ops/workflows/dashboard` — gráficos básicos
- Lista de runs recentes com status e erro (se houver)

### Passo 4.3 — Logs e Auditoria
**O que:** Rastrear execuções de workflows.
**Por quê:** Debugging e compliance.
**Entregas:**
- `workflow_runs` com output de cada step, erros, trace_id
- Política de retenção documentada

---

## Resumo das Fases

| Fase | Foco | Principais Entregas |
|------|------|---------------------|
| **0** | Eventos e motor | module_events, workflows, engine, disparo por evento |
| **1** | Fluxos entre módulos | GROWTH↔OPS, FIN↔OPS, PEOPLE↔OPS (sem IA) |
| **2** | IA nos fluxos | Step ai_agent, Lead qualificação, Case→Post, Proposta, HITL |
| **3** | Novos agentes | Sugerir playbook para gap, Resumo contrato, ai_feedback |
| **4** | Interface | Páginas workflows, dashboard, logs |

---

## Escopo Excluído

- **Integrações externas:** ERP, CRM, ITSM, webhooks de sistemas fora do ness.OS
- **Produtos e serviços NESS:** n.flow, n.faturasONS, n.autoops, etc.
- **Site público:** Páginas do site (solucoes, blog, etc.) não são objeto dos fluxos — apenas os módulos da aplicação interna

---

## Referências

- [ness-os-sistema-nervoso.md](./ness-os-sistema-nervoso.md) — Ciclo de valor OPS→GROWTH→FIN→PEOPLE
- [ness-ops-engenharia-processos.md](./ness-ops-engenharia-processos.md) — OPS e RAG
- [ness-growth-inteligencia-comercial.md](./ness-growth-inteligencia-comercial.md) — Propostas e conteúdo
