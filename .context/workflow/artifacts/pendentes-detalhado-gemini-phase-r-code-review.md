# Fase R — Revisão code-reviewer (plano pendentes-detalhado-gemini)

**Data:** 2026-02-04  
**Plano:** [pendentes-detalhado-gemini](../plans/pendentes-detalhado-gemini.md)  
**Entrada:** [pendentes-detalhado-gemini-phase-r-architect-review.md](./pendentes-detalhado-gemini-phase-r-architect-review.md)

---

## Revisão do código alterado

### UI primitivos (`src/components/ui/`)

| Arquivo | Qualidade | Observações |
|---------|-----------|-------------|
| **dropdown-menu.tsx** | OK | Padrão Radix + cn(); exportações completas; estilo slate/ness consistente. |
| **skeleton.tsx** | OK | Primitivo mínimo (animate-pulse, bg-slate-700/60); aria-hidden. |
| **tooltip.tsx** | OK | TooltipProvider, Root com delayDuration={200}, Content dentro de Portal; classes de animação corretas. |
| **separator.tsx** | OK | orientation horizontal/vertical; decorative=true; classes shrink-0 e bg-slate-700. |

**Estilo:** Uso consistente de `cn()`, bordas `border-slate-700`, fundos `bg-slate-800`; alinhado ao design system do projeto.

---

### Engine de workflows (`src/lib/workflows/engine.ts`)

| Aspecto | Avaliação |
|---------|------------|
| **StepType** | `human_review` adicionado ao tipo; coerente com migração 037. |
| **executeStep** | Assinatura com `stepIndex` e `runId`; case `human_review` insere em `workflow_pending_approvals` e retorna `{ stop: true, awaitingApproval: true }`. |
| **Run status** | Quando `result.awaitingApproval` o run permanece `running`; atualização de `workflow_runs` ao final correta. |
| **Erro** | Inserção em pending_approvals com `insErr` tratada; retorno de `error` para o caller. |

**Qualidade:** Código claro; sem duplicação; tipagem adequada.

---

### EntityForm (`src/components/shared/entity-form.tsx`)

| Aspecto | Avaliação |
|---------|------------|
| **API** | `EntityFormProps<T>` com title, children, className, loading, onSubmit, formProps; genérico T opcional para futura tipagem por entidade. |
| **Comportamento** | Se `onSubmit` existe, renderiza `<form>` com handleSubmit; senão apenas o body (evita form aninhado). |
| **Acessibilidade** | Estrutura semântica (form quando há submit); loading desabilita interação com opacity e pointer-events. |

**Sugestão menor:** O genérico `T` não é usado no corpo do componente; pode permanecer para compatibilidade com `EntityForm<Contract>` no futuro. OK manter.

---

### Prompts e página workflows

| Arquivo | Avaliação |
|---------|-----------|
| **src/lib/ai/prompts.ts** | Placeholders `getSystemPrompt(agent)` e `getContextPrompt(agent, action, context)`; tipo `AgentKey`; comentário indica LLM Gemini. OK para phase-4. |
| **src/app/app/ops/workflows/page.tsx** | Server Component; fetch de `workflows` e `workflow_pending_approvals` (status pending); tabelas com PageCard; empty state quando não há workflows. Estrutura alinhada a outras páginas ops (ex.: playbooks). |

---

## Revisão do plano (clareza e passos acionáveis)

| Bloco | Clareza | Passos acionáveis |
|-------|---------|-------------------|
| **P0** | Objetivo claro (build/test verdes). | Sim: rodar `npm run build` e `npm test`; corrigir erros; registrar resultado. |
| **P1** | Link no menu e tela HITL opcional bem definidos. | Sim: localizar nav/sidebar; adicionar item "Workflows" → `/app/ops/workflows`; opcionalmente tela aprovar/rejeitar. |
| **P2** | Gemini no ai_agent, prompts, índices, alertas descritos. | Sim: engine case ai_agent chamar Gemini com prompts.ts; preencher prompts; revisar 005/017/026; implementar alertas FIN. |
| **P3** | TooltipProvider, EntityForm, validação manual. | Sim: layout com TooltipProvider; migrar um form para EntityForm; executar VALIDACAO-MANUAL; validar getDollarRate. |
| **Fases PREVC** | Phase P0, P1–P2, P3 com passos numerados e commit checkpoints. | Sim: ordem de execução e evidência de conclusão claras. |

**Conclusão:** Plano claro e acionável; responsáveis e evidências definidos; handoff para security-auditor para checagem de API keys, RLS e inputs.

---

## Handoff para security-auditor

- **Artefatos:** Este documento + architect-review.
- **Escopo da auditoria sugerido:** (1) Uso de API key Gemini (env, não em código); (2) RLS nas tabelas workflows, workflow_runs, workflow_pending_approvals; (3) Inputs em formulários e payloads de workflow (sanitização/validação onde aplicável).

**Artefato:** `.context/workflow/artifacts/pendentes-detalhado-gemini-phase-r-code-review.md`
