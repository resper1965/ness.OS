---
status: in_progress
planSlug: workflow-unico-etapas-abertas-nessos
generated: 2026-02
type: workflow
trigger: "workflow único", "todas as etapas em aberto", "checklist pendências", "etapas abertas"
constrains:
  - "Uma única execução de workflow (P→R→E→V→C) com lista linear de etapas"
  - "Cada etapa referencia um plano existente; conclusão atualiza o plano e este workflow"
  - "Respeitar ordem de dependência (ex.: docs antes de validação)"
docs:
  - "project-overview.md"
  - "development-workflow.md"
plans:
  - "pendencias-abertas-nessos.md"
  - "ajuste-ux-ui-nessos.md"
  - "mobile-timesheet-timer.md"
  - "bundui-theme-customizer-nessos.md"
  - "bundui-layout-components-nessos.md"
  - "bundui-ui-primitivos-nessos.md"
---

# Workflow único — Todas as etapas em aberto (ness.OS)

> Um único workflow ai-context que consolida **todas as etapas em aberto** em uma lista ordenada. Execução fase a fase (P→R→E→V→C); em E, cada item da lista é uma etapa com DoD e plano vinculado.

**Trigger:** "workflow único", "todas as etapas em aberto", "checklist pendências"

**Fonte:** [pendencias-abertas-nessos](./pendencias-abertas-nessos.md) + planos Bundui/theme e fila.

---

## Objetivo

- Oferecer **um único ponto de entrada** para "o que está em aberto": uma lista linear de etapas com plano, DoD e artefato de evidência.
- Permitir execução via ai-context: **workflow-init** com este plano; **Fase P** gera a lista consolidada; **Fase E** avança etapa a etapa; **Fase V/C** valida e marca conclusão.

---

## Fases do workflow (PREVC)

| Fase | Nome | Entregável |
|------|------|------------|
| **P** | Planejamento | Lista consolidada de etapas em aberto (ordem, plano, DoD) → artefato `workflow-unico-phase-p-etapas.md`. |
| **R** | Revisão | Aprovação da ordem e escopo; nenhuma etapa crítica faltando. |
| **E** | Execução | Executar cada etapa na ordem; ao concluir uma, marcar no artefato e (opcional) atualizar plano vinculado. |
| **V** | Verificação | Validar entregas (build, testes, checklist manual conforme etapa). |
| **C** | Conclusão | Marcar workflow concluído; atualizar pendencias-abertas-nessos com itens fechados. |

---

## Lista consolidada de etapas em aberto (Fase E)

Ordem de execução sugerida. Cada linha é uma **etapa** com plano, DoD e evidência.

| # | Etapa | Plano | DoD | Evidência |
|---|--------|--------|-----|-----------|
| 1 | **Ajuste UX/UI — Fase 5** (Lighthouse e teste manual) | [ajuste-ux-ui-nessos](./ajuste-ux-ui-nessos.md) | Lighthouse ≥90 (Accessibility, Best Practices) nas URLs do checklist; teste manual (skip link, tab, zoom 200%); doc VALIDACAO-MANUAL atualizado. | docs/FASE-5-VALIDACAO-UX.md, VALIDACAO-MANUAL.md |
| 2 | **Theme-customizer — Fase 3** (docs e validação) | [bundui-theme-customizer-nessos](./bundui-theme-customizer-nessos.md) | DESIGN-TOKENS.md: seção "Tema (light/dark)"; VALIDACAO-MANUAL: alternar tema, persistência; plano marcado filled. | DESIGN-TOKENS.md, plano status |
| 3 | **Mobile Timesheet — PWA opcional** | [mobile-timesheet-timer](./mobile-timesheet-timer.md) | PWA instalável (manifest, service worker) ou doc de decisão "adiar PWA"; job performance_metrics já existe. | manifest, sw ou doc decisão |
| 4 | **Bundui layout — Breadcrumb no header** (opcional) | [bundui-layout-components-nessos](./bundui-layout-components-nessos.md) | ui/breadcrumb no AppHeader com links por segmento (Módulo / Página) ou manter texto atual; decisão registrada. | app-header.tsx ou artefato decisão |
| 5 | **Bundui ui-primitivos — Fase E** (Sheet, Input, Label, Dialog, Table…) | [bundui-ui-primitivos-nessos](./bundui-ui-primitivos-nessos.md) | Implementar em src/components/ui/ na ordem do artefato (resper1965/clone); README ui/ atualizado; build verde. | src/components/ui/*, README |
| 6 | **Fluxo explicativo inputs** | [fluxo-explicativo-inputs](./fluxo-explicativo-inputs.md) | Conforme escopo do plano (formulários com explicação contextual). | plano + código |
| 7 | **Fluxos integração IA/automação** | [fluxos-integracao-ia-automacao](./fluxos-integracao-ia-automacao.md) | Eventos, motor de workflows ou milestone definido no plano. | plano + evidência |
| 8 | **Migração corp site / site legacy** | [migracao-corp-site-ness](./migracao-corp-site-ness.md), [migracao-site-legacy](./migracao-site-legacy.md) | Conforme escopo de cada plano. | planos |
| 9 | **Redução complexidade codebase** | [reducao-complexidade-codebase](./reducao-complexidade-codebase.md) | Itens priorizados do plano (contracts-table, contract-form, etc.). | plano + PRs |
| 10 | **Planos por módulo** (ness-fin, ness-gov, ness-growth, ness-jur, ness-ops, ness-people) | Planos em .context/plans/ | Conforme prioridade; cada módulo pode ser uma sub-etapa ou workflow separado. | planos |

**Nota:** Etapas 1–5 são as que estão **em aberto prioridade média** ou **próximas** (pendencias + Bundui/theme). Etapas 6–10 são **fila**; podem ser executadas em paralelo ou após 1–5.

---

## Como usar (ai-context)

1. **Inicializar workflow:** `workflow-init` com `name: "workflow-unico-etapas-abertas-nessos"`, `require_plan: true`, plano = este arquivo.
2. **Vincular plano:** `plan({ action: "link", planSlug: "workflow-unico-etapas-abertas-nessos" })`.
3. **Fase P:** Gerar/atualizar `.context/workflow/artifacts/workflow-unico-phase-p-etapas.md` com a lista acima (ou refinada).
4. **Fase R:** Revisar ordem e escopo; aprovar.
5. **Fase E:** Para cada etapa 1..N: executar → marcar concluída no artefato → (opcional) atualizar plano vinculado e pendencias-abertas-nessos.
6. **Fase V:** Validar build, testes, checklist manual conforme etapas concluídas.
7. **Fase C:** Marcar workflow concluído; atualizar pendencias-abertas-nessos (itens concluídos movidos para "Concluído").

**Automação completa (P→R→E→V→C, sem deixar nada para trás):** Ver [RUNBOOK-PREVC-AUTOMATION.md](../workflow/RUNBOOK-PREVC-AUTOMATION.md). Executar `npm run workflow:status` para estado atual e checklist antes de cada rodada.

---

## Referências

- [pendencias-abertas-nessos](./pendencias-abertas-nessos.md) — inventário de pendências
- [.context/workflow/artifacts/workflow-unico-phase-p-etapas.md](../workflow/artifacts/workflow-unico-phase-p-etapas.md) — lista consolidada (output Fase P)
- [development-workflow.md](../docs/development-workflow.md) — regras de branching e CI
