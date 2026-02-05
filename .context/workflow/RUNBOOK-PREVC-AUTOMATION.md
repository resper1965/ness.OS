# Runbook: Automação PREVC até o fim (ai-context)

> Automação para percorrer **todas as etapas, épicos e fases PREVC** (P→R→E→V→C) até o final, sem deixar nada para trás, usando as ferramentas **ai-context** (MCP: workflow-status, workflow-advance, plan, workflow-manage).

**Uso:** O agente (IA) segue este runbook e invoca as ferramentas MCP do servidor `user-ai-context` em sequência.

**Estado e checklist:** Antes de cada rodada, execute `npm run workflow:status` (ou `node scripts/workflow-automation-run.js`) para obter a fase atual, as próximas ações MCP e o checklist das 10 etapas (nada para trás).

---

## 1. Fluxo geral

```
[workflow-status] → Fase atual?
  → P: Executar checklist Fase P → [workflow-advance](outputs: phase-p)
  → R: Revisão/aprovar → [workflow-advance] ou [workflow-manage](approvePlan)
  → E: Para cada etapa não concluída: executar → marcar evidência → [workflow-advance](outputs) quando lote concluído
  → V: Validar (build, testes, checklist) → [workflow-advance](outputs: phase-v-evidence)
  → C: Conclusão (atualizar pendencias, marcar workflow concluído) → [workflow-advance](outputs: conclusão)
  → Repetir até isComplete === true
```

---

## 2. Início (se workflow ainda não inicializado)

1. **workflow-init** (MCP)
   - `name`: `"workflow-unico-etapas-abertas-nessos"`
   - `scale`: `"LARGE"`
   - `require_plan`: `true`
   - `require_approval`: `true` (ou `false` para autônomo)

2. **plan** (MCP) — vincular plano
   - `action`: `"link"`
   - `planSlug`: `"workflow-unico-etapas-abertas-nessos"`

3. **workflow-manage** (opcional — modo autônomo)
   - `action`: `"setAutonomous"`
   - `enabled`: `true`
   - `reason`: `"Runbook PREVC automation"`

---

## 3. Loop principal (até fase C concluída)

### Passo A — Obter estado

- **workflow-status** (MCP) — sem parâmetros.
- Interpretar: `currentPhase`, `phases`, `isComplete`, `linkedPlans`, `gates`.

### Passo B — Executar a fase atual

#### Se fase = **P** (Planejamento)

- Garantir artefato: `.context/workflow/artifacts/workflow-unico-phase-p-etapas.md`
- Conteúdo: lista consolidada de etapas (1–10) com plano, DoD e evidência (conforme plano workflow-unico-etapas-abertas-nessos).
- **workflow-advance**
  - `outputs`: `["artifacts/workflow-unico-phase-p-etapas.md"]`
  - `force`: `true` se gate bloquear e modo autônomo

#### Se fase = **R** (Revisão)

- Revisar ordem e escopo em `workflow-unico-phase-p-etapas.md`; confirmar que nenhuma etapa crítica falta.
- Se exigir aprovação: **workflow-manage**
  - `action`: `"approvePlan"`
  - `planSlug`: `"workflow-unico-etapas-abertas-nessos"`
  - `approver`: `"solo-dev"` (ou outro role)
  - `notes`: opcional
- **workflow-advance**
  - `outputs`: `[]` ou artefato de revisão
  - `force`: `true` se autônomo

#### Se fase = **E** (Execução)

- Ler `.context/workflow/artifacts/workflow-unico-phase-v-evidence.md` para saber quais etapas já estão em "Etapas executadas" e quais estão em "Etapas na fila".
- Para **cada etapa na fila** (ex.: 9, 10 se 1–8 já concluídas):
  - Executar a etapa conforme plano (reducao-complexidade-codebase, planos por módulo).
  - Atualizar `workflow-unico-phase-v-evidence.md`: mover a etapa de "fila" para "executadas" com evidência.
  - (Opcional) **plan** — `action`: `"updateStep"` ou `"updatePhase"` para o plano vinculado à etapa.
- Quando um lote de etapas for concluído (ou todas as 10), **workflow-advance**
  - `outputs`: `["artifacts/workflow-unico-phase-v-evidence.md"]`
  - `force`: conforme necessidade

#### Se fase = **V** (Verificação)

- Executar: `npm run build` e `npm run validate:ux` (ou equivalente); garantir verde.
- Atualizar `workflow-unico-phase-v-evidence.md` com DoD Fase V (build, testes, checklist).
- **workflow-advance**
  - `outputs`: `["artifacts/workflow-unico-phase-v-evidence.md"]`
  - `force`: conforme necessidade

#### Se fase = **C** (Conclusão)

- Atualizar `pendencias-abertas-nessos.md`: mover itens 1–10 (ou os concluídos) para "Concluído".
- Atualizar `plans.json` (ou equivalente): marcar workflow como concluído se aplicável.
- **workflow-advance**
  - `outputs`: `["artifacts/workflow-unico-phase-v-evidence.md", "plans/pendencias-abertas-nessos.md"]` (paths relativos ao workflow)
  - `force`: `true` para fechar

### Passo C — Repetir

- Chamar **workflow-status** novamente.
- Se `isComplete === true` → fim.
- Senão → voltar ao Passo B com a nova `currentPhase`.

---

## 4. Checklist de etapas (Fase E)

| # | Etapa | Plano | Evidência esperada |
|---|--------|--------|--------------------|
| 1 | Ajuste UX/UI Fase 5 | ajuste-ux-ui-nessos | VALIDACAO-MANUAL, validate:ux |
| 2 | Theme-customizer Fase 3 | bundui-theme-customizer-nessos | DESIGN-TOKENS.md, plano filled |
| 3 | Mobile Timesheet PWA | mobile-timesheet-timer | manifest, docs/PWA-STATUS.md |
| 4 | Bundui Breadcrumb | bundui-layout-components-nessos | Decisão registrada (artefato) |
| 5 | Bundui ui-primitivos | bundui-ui-primitivos-nessos | src/components/ui/*, README |
| 6 | Fluxo explicativo inputs | fluxo-explicativo-inputs | plano filled; help/placeholder em forms |
| 7 | Fluxos integração IA/automação | fluxos-integracao-ia-automacao | module_events, workflows, engine, evidência |
| 8 | Migração corp site / site legacy | migracao-corp-site-ness, migracao-site-legacy | Rotas, seed, MAPEAMENTO, decisão |
| 9 | Redução complexidade codebase | reducao-complexidade-codebase | Itens priorizados do plano |
| 10 | Planos por módulo | ness-fin, ness-gov, ness-growth, etc. | Conforme prioridade |

Nenhuma etapa deve ficar para trás: todas devem constar em "Etapas executadas" em `workflow-unico-phase-v-evidence.md` (com status Concluído ou Parcial documentado) antes de avançar para V e C.

---

## 5. Referências

- Plano do workflow: [workflow-unico-etapas-abertas-nessos](../plans/workflow-unico-etapas-abertas-nessos.md)
- Evidência atual: [workflow-unico-phase-v-evidence.md](artifacts/workflow-unico-phase-v-evidence.md)
- Lista de etapas (Fase P): [workflow-unico-phase-p-etapas.md](artifacts/workflow-unico-phase-p-etapas.md)
- Script de estado: `scripts/workflow-automation-run.js`
- MCP ai-context: ferramentas `workflow-status`, `workflow-advance`, `workflow-manage`, `plan`, `workflow-init`
