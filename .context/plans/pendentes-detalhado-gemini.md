---
status: ready
planSlug: pendentes-detalhado-gemini
generated: 2026-02-04
llm_agent: Gemini
agents:
  - type: "feature-developer"
    role: "Implementar itens de backlog (link menu, step ai_agent, TooltipProvider, EntityForm)"
  - type: "frontend-specialist"
    role: "UI: link Workflows no menu, TooltipProvider, migração forms para EntityForm"
  - type: "backend-specialist"
    role: "Step ai_agent com Gemini API, prompts.ts, índices/views rentabilidade"
  - type: "test-writer"
    role: "Garantir npm run build e npm test verdes"
  - type: "documentation-writer"
    role: "Atualizar docs (PLANOS-POR-MODULO, VALIDACAO-MANUAL)"
docs:
  - "project-overview.md"
  - "architecture.md"
  - "docs/PLANOS-POR-MODULO-PROXIMOS-PASSOS.md"
  - "docs/agents/agents-specification.md"
phases:
  - id: "phase-p0"
    name: "Estabilidade (build/test verdes)"
    prevc: "P"
  - id: "phase-p1-p2"
    name: "Implementação por prioridade (P1–P2)"
    prevc: "E"
  - id: "phase-p3"
    name: "UI/UX e validação manual"
    prevc: "V"
---

# Pendências ness.OS — planejamento detalhado (agente Gemini)

> Lista detalhada do que falta ser feito, priorizada por P0–P3 e por módulo, para execução com **agente LLM Gemini** via ai-context/workflows.

**Trigger:** "o que falta", "pendências detalhadas", "planejamento ai-context gemini"

**LLM da aplicação:** Os agentes da aplicação (rex.fin, rex.ops, rex.growth, etc.) usam **Gemini** como modelo; integrar em `src/lib/ai/` e no step `ai_agent` do engine de workflows.

---

## Task Snapshot

- **Primary goal:** Fechar todas as pendências listadas abaixo, na ordem P0 → P1 → P2 → P3, com agente Gemini onde houver chamada a LLM.
- **Success signal:** `npm run build` e `npm test` verdes; itens P0–P3 executados e documentados; step `ai_agent` chamando Gemini com `prompts.ts`.
- **Key references:**
  - [PLANOS-POR-MODULO-PROXIMOS-PASSOS.md](../../docs/PLANOS-POR-MODULO-PROXIMOS-PASSOS.md)
  - [fluxos-integracao-ia-automacao.md](./fluxos-integracao-ia-automacao.md)
  - [agents-specification.md](../../docs/agents/agents-specification.md) (quando existir)
  - [Plans Index](./README.md)

---

## Inventário detalhado — o que falta

### P0 — Estabilidade (fazer primeiro)

| # | Item | Detalhe | Responsável | Evidência |
|---|------|---------|-------------|------------|
| P0.1 | Build verde | Executar `npm run build` na raiz do ness.OS e corrigir erros de compilação/import. | test-writer / feature-developer | Build passa sem erro. |
| P0.2 | Testes verdes | Executar `npm test` (se existir); garantir que não há regressão. | test-writer | Test suite verde ou ausência de testes documentada. |

---

### P1 — ness.OPS (Workflows e navegação)

| # | Item | Detalhe | Responsável | Evidência |
|---|------|---------|-------------|------------|
| P1.1 | Link Workflows no menu | Adicionar entrada "Workflows" no menu/sidebar do app (ness.OPS), apontando para `/app/ops/workflows`. Local: layout ou nav-config do app. | frontend-specialist | Clique no menu leva à página de workflows. |
| P1.2 | (Opcional) Tela de resolução HITL | Página ou modal para listar aprovações pendentes (`workflow_pending_approvals` com status pending) e permitir aprovar/rejeitar com payload (resolution_payload). Atualizar registro e, se desejado, retomar o run. | feature-developer | Fluxo human_review pode ser resolvido pela UI. |

---

### P2 — Fluxos IA e agente Gemini

| # | Item | Detalhe | Responsável | Evidência |
|---|------|---------|-------------|------------|
| P2.1 | Integração Gemini no step `ai_agent` | Em `src/lib/workflows/engine.ts`, no case `ai_agent`: obter prompt de `getSystemPrompt(agent)` e `getContextPrompt(agent, action, context)` de `src/lib/ai/prompts.ts`; chamar API **Gemini** com esse prompt e contexto; gravar resultado em `context` para próximos steps. Configurar API key (env) e cliente Gemini. | backend-specialist | Step ai_agent executa e preenche context com resposta do Gemini. |
| P2.2 | Preencher `prompts.ts` | Substituir placeholders em `src/lib/ai/prompts.ts` por prompts reais por agente (rex.fin, rex.ops, rex.growth, etc.) conforme especificação dos agentes da aplicação. | backend-specialist / documentation-writer | getSystemPrompt e getContextPrompt retornam texto útil por agente. |
| P2.3 | ness.FIN — Índices/views rentabilidade | Revisar migrações 005, 017, 026 (rentabilidade); criar ou ajustar migração se faltar índice/view para consultas de rentabilidade. | backend-specialist | Queries de rentabilidade performáticas quando necessário. |
| P2.4 | ness.FIN — Alertas ciclo de vida | Implementar alertas de ciclo de vida de contratos (ex.: renovação, vencimento) usando dados já existentes (contracts, renewal_date, etc.); exibir em ness.FIN ou dashboard. | feature-developer | Alertas visíveis onde definido (ex.: /app/fin/alertas ou similar). |

---

### P3 — UI/UX e validação

| # | Item | Detalhe | Responsável | Evidência |
|---|------|---------|-------------|------------|
| P3.1 | TooltipProvider | Envolver a árvore do app (ou rotas que usam Tooltip) com `TooltipProvider` de `src/components/ui/tooltip.tsx`. Ex.: no layout do app em `src/app/app/layout.tsx`. | frontend-specialist | Tooltips funcionam em páginas que usam o componente Tooltip. |
| P3.2 | Migração gradual para EntityForm | Identificar formulários de entidade (ContractForm, JobForm, etc.) e, onde fizer sentido, passar a usar `EntityForm` (title, loading, onSubmit) de `src/components/shared/entity-form.tsx`. Fazer de forma incremental. | frontend-specialist / refactoring-specialist | Ao menos um form migrado e documentado como padrão. |
| P3.3 | ness.PEOPLE / JUR / GOV | Em forms novos, adotar EntityForm; em fluxos que exigem aceite humano, usar workflow com step human_review. | feature-developer | Decisão documentada; um exemplo de uso de EntityForm ou human_review nesses módulos. |
| P3.4 | Validação manual e Lighthouse | Executar checklist de docs/VALIDACAO-MANUAL.md e FASE-5-VALIDACAO-UX.md (Lighthouse, responsivo, acessibilidade). Preencher status no doc. | test-writer / documentation-writer | VALIDACAO-MANUAL atualizado com resultado da execução. |
| P3.5 | Validar getDollarRate em precificação | Garantir que a tela de precificação (ou proposta/contrato) usa `getDollarRate()` ou `getIndices()` e validar em tela. | feature-developer | Integração dólar verificada e documentada se necessário. |

---

## Resumo por módulo

| Módulo | Itens pendentes |
|--------|------------------|
| **ness.OPS** | P1.1 Link Workflows no menu; P1.2 (opcional) tela resolução HITL. |
| **ness.FIN** | P2.3 Índices/views rentabilidade; P2.4 Alertas ciclo de vida. |
| **ness.GROWTH** | P2.2 Prompts reais em prompts.ts; step ai_agent (P2.1) beneficia propostas/casos. |
| **ness.PEOPLE / JUR / GOV** | P3.2–P3.3 EntityForm e human_review onde aplicável. |
| **Cross-cutting** | P0 build/test; P2.1 Gemini no ai_agent; P3.1 TooltipProvider; P3.4–P3.5 validação manual. |

---

## Agent Lineup

| Agent | Role in this plan | First responsibility focus |
|-------|-------------------|-----------------------------|
| Feature Developer | Implementar link menu, tela HITL (opcional), alertas ciclo de vida, uso de EntityForm. | Link /app/ops/workflows no menu; tela aprovar/rejeitar. |
| Frontend Specialist | TooltipProvider, migração forms para EntityForm, ajustes de UI. | TooltipProvider no layout; um form com EntityForm. |
| Backend Specialist | Step ai_agent com Gemini, prompts.ts, índices/views rentabilidade. | Chamada Gemini em engine.ts; prompts reais em prompts.ts. |
| Test Writer | Build e testes verdes; validação manual conforme docs. | npm run build e npm test verdes; checklist VALIDACAO-MANUAL. |
| Documentation Writer | Atualizar PLANOS-POR-MODULO, VALIDACAO-MANUAL, decisões EntityForm/HITL. | Docs refletem estado após execução. |

---

## Working Phases (PREVC)

### Phase P0 — Estabilidade (Prevc: P)

**Objetivo:** Garantir que o projeto compila e os testes passam.

**Passos:**
1. Rodar `npm run build` na raiz do repo ness.OS; listar erros se houver.
2. Corrigir erros de import/TypeScript até build verde.
3. Rodar `npm test` (se existir); corrigir falhas ou documentar ausência de testes.
4. Registrar resultado em doc (ex.: PLANOS-POR-MODULO ou README).

**Commit checkpoint:** `chore(plan): P0 build and test green — pendentes-detalhado-gemini`

---

### Phase P1–P2 — Implementação (Prevc: E)

**Objetivo:** Implementar itens P1 e P2 na ordem sugerida.

**Passos:**
1. **P1.1** Adicionar link "Workflows" no menu do app para `/app/ops/workflows`.
2. **P2.1** Integrar cliente Gemini em `src/lib/ai/` (ex.: `gemini.ts` ou uso de SDK); no engine, case `ai_agent`, chamar Gemini com prompt de `prompts.ts` e gravar resultado no context.
3. **P2.2** Preencher `src/lib/ai/prompts.ts` com prompts por agente (rex.fin, rex.ops, rex.growth).
4. **P2.3** Revisar 005/017/026; criar migração de índices/views rentabilidade se necessário.
5. **P2.4** Implementar alertas de ciclo de vida (contratos) e exibir no módulo FIN.
6. **P1.2** (Opcional) Tela de resolução de aprovações HITL.

**Commit checkpoint:** `feat(plan): P1–P2 workflows menu, Gemini ai_agent, prompts, rentabilidade, alertas — pendentes-detalhado-gemini`

---

### Phase P3 — UI/UX e validação (Prevc: V)

**Objetivo:** TooltipProvider, EntityForm, validação manual.

**Passos:**
1. **P3.1** Envolver app com `TooltipProvider` no layout apropriado.
2. **P3.2** Migrar ao menos um formulário para EntityForm e documentar padrão.
3. **P3.3** Documentar uso de EntityForm e human_review para PEOPLE/JUR/GOV.
4. **P3.4** Executar VALIDACAO-MANUAL e FASE-5-VALIDACAO-UX; preencher status.
5. **P3.5** Validar getDollarRate/getIndices na tela de precificação.

**Commit checkpoint:** `chore(plan): P3 TooltipProvider, EntityForm, validation manual — pendentes-detalhado-gemini`

---

## Dependencies e riscos

- **Technical:** API key do Gemini em variável de ambiente (ex.: `GEMINI_API_KEY`); não commitar.
- **Internal:** step `ai_agent` depende de `prompts.ts` preenchido; P2.2 pode ser feito em paralelo ou antes de P2.1.
- **Risco:** Gemini API indisponível ou limite de cota — mitigar com fallback ou mensagem clara na UI.

---

## Referências

- [PLANOS-POR-MODULO-PROXIMOS-PASSOS.md](../../docs/PLANOS-POR-MODULO-PROXIMOS-PASSOS.md)
- [fluxos-integracao-ia-automacao.md](./fluxos-integracao-ia-automacao.md)
- [Documentation Index](../docs/README.md) | [Agent Handbook](../agents/README.md) | [Plans Index](./README.md)
