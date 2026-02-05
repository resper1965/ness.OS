# Fase V — Workflow único: evidência de execução

Workflow: **workflow-unico-etapas-abertas-nessos**. Plano: [workflow-unico-etapas-abertas-nessos](../plans/workflow-unico-etapas-abertas-nessos.md).

---

## Etapas executadas (1–8)

| # | Etapa | Status | Evidência |
|---|--------|--------|-----------|
| 1 | Ajuste UX/UI — Fase 5 | Concluído | VALIDACAO-MANUAL atualizado (item 8 tema); validate:ux passou (lint + build). Lighthouse e teste manual: executar localmente conforme FASE-5-VALIDACAO-UX.md. |
| 2 | Theme-customizer — Fase 3 | Concluído | DESIGN-TOKENS.md: seção "Tema (light/dark)"; VALIDACAO-MANUAL: tema; plano bundui-theme-customizer-nessos status filled. |
| 3 | Mobile Timesheet — PWA | Concluído | Manifest já existe (src/app/manifest.ts); docs/PWA-STATUS.md: decisão adiar service worker/offline. |
| 4 | Bundui layout — Breadcrumb | Concluído (decisão) | workflow-unico-etapa4-breadcrumb-decisao.md: manter texto atual; não adotar ui/breadcrumb com links nesta rodada. |
| 5 | Bundui ui-primitivos — Fase E | Parcial | Sheet, Input, Label implementados em src/components/ui/ (resper1965/clone adaptado); README ui/ atualizado. Table, Dialog, Select, etc. na fila. Build verde. |
| 6 | Fluxo explicativo inputs | Concluído | Plano fluxo-explicativo-inputs status filled, Phase 4 DONE. InputField com helper/placeholder; contract-form, client-form e demais forms já seguem o padrão (label + help + placeholder). |
| 7 | Fluxos integração IA/automação | Concluído (Fase 0) | Migrations 035_module_events, 036_workflows. Libs: src/lib/events/emit.ts, process.ts; src/lib/workflows/engine.ts. submitLead emite growth.lead.created e chama processModuleEvent. Steps: db_query, condition, delay (stubs); ai_agent na Fase 2. |
| 8 | Migração corp site / site legacy | Concluído | Rotas (site), componentes site, seed 002_corp_site_content.sql, MAPEAMENTO-CORP-SITE.md e PLANO-MIGRACAO-SITE-LEGACY.md já existem. workflow-unico-etapa8-migracao-decisao.md: clone _reference opcional para regenerar seed. |

---

## Etapas na fila (9–10)

| # | Etapa | Plano | Ação |
|---|--------|--------|------|
| 9 | Redução complexidade codebase | reducao-complexidade-codebase | Itens priorizados do plano. |
| 10 | Planos por módulo | ness-fin, ness-gov, ness-growth, etc. | Conforme prioridade; sub-etapas ou workflows separados. |

---

## DoD Fase V

- [x] Etapas 1–8 com evidência (docs, código, decisões).
- [x] Etapas 9–10 registradas na fila com referência aos planos.
- [x] Build verde; validate:ux passou.

**Próximo:** Etapa 9 (redução complexidade codebase) ou Etapa 10 (planos por módulo) ou Fase C — marcar workflow concluído; atualizar pendencias-abertas-nessos.
