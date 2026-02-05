# Fase P — Workflow único: lista consolidada de etapas em aberto

Workflow: **workflow-unico-etapas-abertas-nessos**. Plano: [workflow-unico-etapas-abertas-nessos](../plans/workflow-unico-etapas-abertas-nessos.md).

---

## 1. Escopo

Todas as etapas em aberto (pendencias prioridade média + Bundui/theme + fila) consolidadas em uma única lista ordenada para execução fase a fase.

---

## 2. Lista consolidada (ordem de execução)

| # | Etapa | Plano | DoD | Evidência |
|---|--------|--------|-----|-----------|
| 1 | Ajuste UX/UI — Fase 5 (Lighthouse e teste manual) | ajuste-ux-ui-nessos | Lighthouse ≥90 (Accessibility, Best Practices); teste manual skip link, tab, zoom 200%; VALIDACAO-MANUAL atualizado. | docs/FASE-5-VALIDACAO-UX.md, VALIDACAO-MANUAL.md |
| 2 | Theme-customizer — Fase 3 (docs e validação) | bundui-theme-customizer-nessos | DESIGN-TOKENS.md: seção "Tema (light/dark)"; VALIDACAO-MANUAL: alternar tema, persistência; plano filled. | DESIGN-TOKENS.md, plano status |
| 3 | Mobile Timesheet — PWA opcional | mobile-timesheet-timer | PWA instalável (manifest, sw) ou doc decisão "adiar PWA". | manifest, sw ou doc |
| 4 | Bundui layout — Breadcrumb no header (opcional) | bundui-layout-components-nessos | ui/breadcrumb no AppHeader com links ou manter texto; decisão registrada. | app-header.tsx ou artefato |
| 5 | Bundui ui-primitivos — Fase E (Sheet, Input, Label, Dialog, Table…) | bundui-ui-primitivos-nessos | Implementar em src/components/ui/ (resper1965/clone); README ui/ atualizado; build verde. | src/components/ui/*, README |
| 6 | Fluxo explicativo inputs | fluxo-explicativo-inputs | Conforme escopo do plano. | plano + código |
| 7 | Fluxos integração IA/automação | fluxos-integracao-ia-automacao | Eventos, motor de workflows ou milestone do plano. | plano + evidência |
| 8 | Migração corp site / site legacy | migracao-corp-site-ness, migracao-site-legacy | Conforme escopo de cada plano. | planos |
| 9 | Redução complexidade codebase | reducao-complexidade-codebase | Itens priorizados do plano. | plano + PRs |
| 10 | Planos por módulo (ness-fin, ness-gov, ness-growth, etc.) | Planos em .context/plans/ | Conforme prioridade; sub-etapas ou workflows separados. | planos |

---

## 3. Decisões

| Decisão | Justificativa |
|---------|----------------|
| Etapas 1–2 primeiro | UX/UI Fase 5 e theme docs fecham validação e documentação antes de novas features. |
| Etapa 3 (PWA) opcional | Job performance_metrics já existe; PWA pode ser adiado com doc de decisão. |
| Etapa 4 (Breadcrumb) opcional | Melhoria de navegação; não bloqueia. |
| Etapa 5 (ui-primitivos) antes da fila | Base de componentes beneficia forms e tabelas em outros planos. |
| Etapas 6–10 na fila | Execução após 1–5 ou em paralelo conforme capacidade. |

---

## 4. DoD Fase P

- [x] Lista consolidada de etapas em aberto (10 itens)
- [x] Ordem de execução definida
- [x] Plano e artefato vinculados ao workflow

**Próximo:** Fase R (Revisão) — aprovar ordem e escopo; em seguida Fase E (executar etapa a etapa).

---

## Progresso (execução 2026-02)

| # | Etapa | Status |
|---|--------|--------|
| 1 | Ajuste UX/UI Fase 5 | Concluído |
| 2 | Theme-customizer Fase 3 | Concluído |
| 3 | Mobile Timesheet PWA | Concluído (doc PWA-STATUS) |
| 4 | Bundui Breadcrumb | Concluído (decisão: manter texto) |
| 5 | Bundui ui-primitivos | Parcial (Sheet, Input, Label) |
| 6 | Fluxo explicativo inputs | Concluído (plano filled; help/placeholder em forms) |
| 7–10 | Fila | Pendente — ver workflow-unico-phase-v-evidence.md |
