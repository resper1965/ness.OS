# Fase E — Execução completa (agentes especializados)

**Data:** 2026-02-04  
**Plano:** [pendentes-detalhado-gemini](../plans/pendentes-detalhado-gemini.md)  
**Agentes:** feature-developer → backend-specialist → frontend-specialist → documentation-writer

---

## Itens executados por agente

### feature-developer

| Item | Implementação |
|------|----------------|
| **P1.2 HITL** | Server Action `resolveWorkflowApproval(approvalId, status, resolutionPayload?)` em `app/actions/ops.ts`; componente cliente `WorkflowApprovalActions` em `components/ops/workflow-approval-actions.tsx` (Aprovar/Rejeitar); página `/app/ops/workflows` com coluna "Ações" e botões por aprovação pendente. |
| **P2.4 Alertas ciclo de vida** | Card "Vencimento (próximos 30 dias)" em `/app/fin/alertas/page.tsx` usando `contracts.end_date` (já existia Renovação e Reconciliação). |
| **P3.3 doc** | Nota em `docs/PLANOS-POR-MODULO-PROXIMOS-PASSOS.md`: EntityForm + human_review em PEOPLE/JUR/GOV; exemplo Gaps e `/app/ops/workflows`. |

### backend-specialist

| Item | Implementação |
|------|----------------|
| **P2.1 Gemini ai_agent** | `src/lib/ai/gemini.ts`: cliente `callGemini(prompt, options?)` com `GEMINI_API_KEY` e fetch à API REST Gemini; em `src/lib/workflows/engine.ts` case `ai_agent`: lê `config.agent`, `config.action`, `config.outputKey`, chama `getSystemPrompt`/`getContextPrompt` e `callGemini`, grava resultado em `context[outputKey]`. |
| **P2.2 prompts.ts** | `src/lib/ai/prompts.ts`: `SYSTEM_PROMPTS` por AgentKey (rex.fin, rex.ops, rex.growth, rex.jur, rex.gov, rex.people); `getSystemPrompt(agent)` e `getContextPrompt(agent, action, context)` retornam texto útil. |
| **P2.3 Índices rentabilidade** | Revisado: view `contract_rentability` (005), índices `idx_contracts_renewal` e `idx_contracts_client` (026); nota em PLANOS-POR-MODULO de que não é necessária migração adicional. |

### frontend-specialist

| Item | Implementação |
|------|----------------|
| **P3.2 EntityForm** | Página `/app/people/gaps`: formulário de novo gap envolvido com `<EntityForm title="Novo gap de treinamento">`; GapForm continua com seu próprio `<form>` (EntityForm usado como container de layout). |

### documentation-writer

| Item | Implementação |
|------|----------------|
| **P3.4 VALIDACAO-MANUAL** | Seção "Status da execução" em `docs/VALIDACAO-MANUAL.md`: data, responsável, resultado (Aprovado/Pendências). |
| **P3.5 getDollarRate** | Nota em `docs/PLANOS-POR-MODULO-PROXIMOS-PASSOS.md`: getIndices/getDollarRate utilizados em `/app/fin/contratos`; validar em tela conforme VALIDACAO-MANUAL. |

---

## Arquivos criados/alterados

- `src/app/actions/ops.ts` — resolveWorkflowApproval
- `src/components/ops/workflow-approval-actions.tsx` — novo (client)
- `src/app/app/ops/workflows/page.tsx` — coluna Ações + WorkflowApprovalActions
- `src/app/app/fin/alertas/page.tsx` — card Vencimento (end_date)
- `src/lib/ai/gemini.ts` — novo (callGemini)
- `src/lib/ai/prompts.ts` — SYSTEM_PROMPTS e getContextPrompt preenchidos
- `src/lib/workflows/engine.ts` — case ai_agent com Gemini
- `src/app/app/people/gaps/page.tsx` — EntityForm + import
- `docs/VALIDACAO-MANUAL.md` — Status da execução
- `docs/PLANOS-POR-MODULO-PROXIMOS-PASSOS.md` — P2.3, P3.3, P3.5

---

## Verificação

- `npm run build`: OK (exit 0)
- `npm test`: 26/26 OK (exit 0)

**Artefato:** `.context/workflow/artifacts/pendentes-detalhado-gemini-phase-e-full-execution.md`
