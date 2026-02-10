---
status: ready
planSlug: pendencias-abertas-nessos
generated: 2026-02-04
agents:
  - type: "code-reviewer"
    role: "Review code changes for quality, style, and best practices"
  - type: "bug-fixer"
    role: "Analyze bug reports and error messages"
  - type: "feature-developer"
    role: "Implement new features according to specifications"
  - type: "refactoring-specialist"
    role: "Identify code smells and improvement opportunities"
  - type: "test-writer"
    role: "Write comprehensive unit and integration tests"
  - type: "documentation-writer"
    role: "Create clear, comprehensive documentation"
  - type: "performance-optimizer"
    role: "Identify performance bottlenecks"
  - type: "security-auditor"
    role: "Identify security vulnerabilities"
  - type: "frontend-specialist"
    role: "Design and implement user interfaces"
  - type: "architect-specialist"
    role: "Design overall system architecture and patterns"
  - type: "devops-specialist"
    role: "Design and maintain CI/CD pipelines"
docs:
  - "project-overview.md"
  - "architecture.md"
  - "development-workflow.md"
  - "testing-strategy.md"
  - "glossary.md"
  - "security.md"
  - "tooling.md"
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

# Pendências abertas ness.OS — resumo consolidado

> Resumo de todos os itens em aberto para priorização e execução via ai-context/workflows. Atualizado após conclusão da adaptação de layout (Fase C), incorporação do dólar em ness.DATA, workflow único (etapas 1–8) e Ciclo 2 (etapas 9–10). Itens concluídos constam em **Concluído nesta rodada** e **Concluído (Fases 5–10)**.

**Trigger:** "pendências abertas", "o que falta", "resumo do que está em aberto"

**Workflow único:** Para executar todas as etapas em aberto em um único fluxo (P→R→E→V→C), usar o plano [workflow-unico-etapas-abertas-nessos](./workflow-unico-etapas-abertas-nessos.md) e o artefato [workflow-unico-phase-p-etapas.md](../workflow/artifacts/workflow-unico-phase-p-etapas.md) (lista consolidada).

---

## Inventário de pendências (resumo executivo)

### Concluído nesta rodada
| Item | Plano | Status |
|------|--------|--------|
| Composição Serviços/Produtos (Task → Playbook → Service) | [composicao-servicos-produtos-tasks-playbooks](./composicao-servicos-produtos-tasks-playbooks.md) | **Implementado:** tabela `tasks`, métricas em playbooks (estimated_duration_minutes, estimated_value); CRUD tasks em ops.ts; UI tasks por playbook em /app/ops/playbooks/[id]; doc COMPOSICAO-SERVICOS-PRODUTOS.md; glossary atualizado. |
| Adaptação layout Bundui / clone | [adaptacao-layout-bundui-nessos](./adaptacao-layout-bundui-nessos.md) | **Fase C concluída:** docs LAYOUT-APP-HEADERS, DESIGN-TOKENS e project-overview atualizados. **Layout clone:** header (SiteHeader) e sidebar (LayoutAppSidebar) com Search ⌘K, Notificações, NavMain, NavUser, LayoutLogo; componentes em `src/components/layout/`; dados de nav-config e auth. Doc LAYOUT-APP-HEADERS atualizado (52px, estrutura atual). |
| ness.DATA — dólar (PTAX) | [ness-data-modulo-dados](./ness-data-modulo-dados.md) | **Implementado:** `getDollarRate(date?)` e `getIndices(options?)` em `actions/data.ts`; BCB PTAX; FIN/GROWTH usam para precificação. |
| ness.DATA — IPCA/IGPM (reajuste) | [ness-data-modulo-dados](./ness-data-modulo-dados.md) | **Implementado:** `getIpcaRate(date?)`, `getIgpmRate(date?)` e `getIndices()` retornam `ipca`/`igpm` (BCB SGS 433/189, variação mensal %); FIN usa no Ciclo de Vida. |
| ness.DATA — ingestão indicadores | [ness-data-modulo-dados](./ness-data-modulo-dados.md) | **Implementado:** tabela `indicators`, POST `/api/data/indicators/ingest` (API key), `getIndicators()`/`ingestIndicator()` em data.ts, página `/app/ops/indicators`. Doc: API-INGESTAO-INDICADORES.md. |
| Integração Omie — ListarContasReceber | [integracao-omie-erp](./integracao-omie-erp.md) | **Validado:** parâmetros `filtrar_por_data_de` e `filtrar_por_data_ate` (dd/mm/yyyy); resposta `conta_receber_cadastro`; `getOmieContasReceber(periodo)` em data.ts usa payload correto. Doc: INTEGRACAO-OMIE-CONTAS-RECEBER.md. |
| Página explicacao ness.OS | [pagina-explicacao-nessos-completa](./pagina-explicacao-nessos-completa.md) | **Fases 1 e 2 concluídas:** spec em docs/PLANO-PAGINA-EXPLICACAO-NESSOS.md; página em src/app/(site)/nessos/page.tsx (rota /nessos); link no header e footer. Fase 3: manutenção/sync com ai-context. |
| Theme-customizer Fase 3 | [bundui-theme-customizer-nessos](./bundui-theme-customizer-nessos.md) | **Concluído:** DESIGN-TOKENS.md seção "Tema (light/dark)"; VALIDACAO-MANUAL item tema; next-themes + ThemeToggle no AppHeader; plano status filled. |
| Bundui Breadcrumb (opcional) | [bundui-layout-components-nessos](./bundui-layout-components-nessos.md) | **Decisão:** manter texto atual no AppHeader; ver workflow-unico-etapa4-breadcrumb-decisao.md. |
| Bundui ui-primitivos (parcial) | [bundui-ui-primitivos-nessos](./bundui-ui-primitivos-nessos.md) | **Sheet, Input, Label** em src/components/ui/; README ui/ atualizado. Table, Dialog, Select etc. na fila. |
| Workflow único — Etapas 1–8 | [workflow-unico-etapas-abertas-nessos](./workflow-unico-etapas-abertas-nessos.md) | **Fase C concluída:** Etapas 1–8 executadas e com evidência em workflow-unico-phase-v-evidence.md. |
| Ciclo 2 — Etapas 9–10 | [workflow-ciclo-2-etapas-9-10-nessos] | **PREVC concluído:** Etapa 9 — docs/AUDITORIA-SIMPLIFICA.md (Fase 1 auditoria). Etapa 10 — planos por módulo documentados. Evidência: workflow-ciclo-2-phase-e-evidence.md. |

### Em aberto — prioridade alta
| Item | Plano | Pendência |
|------|--------|-----------|
| (Nenhum no momento) | — | Próximos itens em prioridade média ou na fila. |

### Em aberto — prioridade média
| Item | Plano | Pendência |
|------|--------|-----------|
| Mobile Timesheet | [mobile-timesheet-timer](./mobile-timesheet-timer.md) | **PWA:** Manifest existe; service worker/offline adiado (docs/PWA-STATUS.md). Job performance_metrics e doc já implementados. |
| Ajuste UX/UI | [ajuste-ux-ui-nessos](./ajuste-ux-ui-nessos.md) | **Fase 5:** VALIDACAO-MANUAL atualizado (tema); validate:ux passou. Lighthouse e teste manual: executar localmente conforme FASE-5-VALIDACAO-UX.md. |

### Concluído (Fases 5–10 / Execução fase 5 final)
- **Execução fase 5 final** ([PLANO-EXECUCAO-FASE-5-FINAL](../../docs/PLANO-EXECUCAO-FASE-5-FINAL.md)): Fases 5 (Qualidade), 6 (GOV), 7 (JUR), 8 (GROWTH), 9 (FIN), 10 (PEOPLE) implementadas. Docs: QUALIDADE-FASE-5, RATE-LIMIT-CHATBOT, GOV-FASE-6-STATUS, JUR-FASE-7-STATUS, GROWTH-FASE-8-STATUS, FIN-FASE-9-STATUS, PEOPLE-FASE-10-STATUS.
- **Agrupar atividades por área:** nav-config com áreas, sidebar com subgrupos, docs/NAV-AREAS.md. **Agrupar menu header:** já concluído (layout 64px, header fixo).

### Em aberto — planos na fila (não iniciados)
- [Execução autônoma pendências](./execucao-autonoma-pendencias.md) (Fases 0–4 já concluídas; 5–10 concluídas via plano acima)
- [Fluxo explicativo inputs](./fluxo-explicativo-inputs.md), [Fluxos integração IA/automação](./fluxos-integracao-ia-automacao.md) — **concluídos no workflow único (etapas 6–7).**
- [Migração corp site ness](./migracao-corp-site-ness.md), [Migração site legacy](./migracao-site-legacy.md) — **concluída no workflow único (etapa 8).**
- [Redução complexidade codebase](./reducao-complexidade-codebase.md) — **Ciclo 2:** Fase 1 auditoria concluída (docs/AUDITORIA-SIMPLIFICA.md). Fases 2–6 na fila.
- Planos por módulo (ness-fin-cfo-digital, ness-gov, ness-growth, ness-jur, ness-ops, ness-people) — **Ciclo 2:** status/milestone documentado; próximos passos conforme prioridade.

### Verificação manual recomendada
- Layout: teste responsivo (drawer &lt;768px) e acessibilidade (foco, contraste) em dispositivo real.
- ness.DATA dólar: usar `getDollarRate()` ou `getIndices()` em uma tela de precificação (ex.: proposta ou contrato) para validar integração.

---

## Task Snapshot
- **Primary goal:** Manter visão única das pendências abertas e priorizar execução via workflows/agentes.
- **Success signal:** Este plano é o ponto de entrada para "o que está em aberto"; itens são resolvidos nos planos específicos e refletidos aqui.
- **Key references:** [Plans Index](./README.md), [Documentation Index](../docs/README.md), [Agent Handbook](../agents/README.md).

## Agent Lineup
| Agent | Role in this plan | Playbook | First responsibility focus |
| --- | --- | --- | --- |
| Code Reviewer | TODO: Describe why this agent is involved. | [Code Reviewer](../agents/code-reviewer.md) | Review code changes for quality, style, and best practices |
| Bug Fixer | TODO: Describe why this agent is involved. | [Bug Fixer](../agents/bug-fixer.md) | Analyze bug reports and error messages |
| Feature Developer | TODO: Describe why this agent is involved. | [Feature Developer](../agents/feature-developer.md) | Implement new features according to specifications |
| Refactoring Specialist | TODO: Describe why this agent is involved. | [Refactoring Specialist](../agents/refactoring-specialist.md) | Identify code smells and improvement opportunities |
| Test Writer | TODO: Describe why this agent is involved. | [Test Writer](../agents/test-writer.md) | Write comprehensive unit and integration tests |
| Documentation Writer | TODO: Describe why this agent is involved. | [Documentation Writer](../agents/documentation-writer.md) | Create clear, comprehensive documentation |
| Performance Optimizer | TODO: Describe why this agent is involved. | [Performance Optimizer](../agents/performance-optimizer.md) | Identify performance bottlenecks |
| Security Auditor | TODO: Describe why this agent is involved. | [Security Auditor](../agents/security-auditor.md) | Identify security vulnerabilities |
| Frontend Specialist | TODO: Describe why this agent is involved. | [Frontend Specialist](../agents/frontend-specialist.md) | Design and implement user interfaces |
| Architect Specialist | TODO: Describe why this agent is involved. | [Architect Specialist](../agents/architect-specialist.md) | Design overall system architecture and patterns |
| Devops Specialist | TODO: Describe why this agent is involved. | [Devops Specialist](../agents/devops-specialist.md) | Design and maintain CI/CD pipelines |

## Documentation Touchpoints
| Guide | File | Primary Inputs |
| --- | --- | --- |
| Project Overview | [project-overview.md](../docs/project-overview.md) | Roadmap, README, stakeholder notes |
| Architecture Notes | [architecture.md](../docs/architecture.md) | ADRs, service boundaries, dependency graphs |
| Development Workflow | [development-workflow.md](../docs/development-workflow.md) | Branching rules, CI config, contributing guide |
| Testing Strategy | [testing-strategy.md](../docs/testing-strategy.md) | Test configs, CI gates, known flaky suites |
| Glossary & Domain Concepts | [glossary.md](../docs/glossary.md) | Business terminology, user personas, domain rules |
| Security & Compliance Notes | [security.md](../docs/security.md) | Auth model, secrets management, compliance requirements |
| Tooling & Productivity Guide | [tooling.md](../docs/tooling.md) | CLI scripts, IDE configs, automation workflows |

## Risk Assessment
Identify potential blockers, dependencies, and mitigation strategies before beginning work.

### Identified Risks
| Risk | Probability | Impact | Mitigation Strategy | Owner |
| --- | --- | --- | --- | --- |
| TODO: Dependency on external team | Medium | High | Early coordination meeting, clear requirements | TODO: Name |
| TODO: Insufficient test coverage | Low | Medium | Allocate time for test writing in Phase 2 | TODO: Name |

### Dependencies
- **Internal:** TODO: List dependencies on other teams, services, or infrastructure
- **External:** TODO: List dependencies on third-party services, vendors, or partners
- **Technical:** TODO: List technical prerequisites or required upgrades

### Assumptions
- TODO: Document key assumptions being made (e.g., "Assume current API schema remains stable")
- TODO: Note what happens if assumptions prove false

## Resource Estimation

### Time Allocation
| Phase | Estimated Effort | Calendar Time | Team Size |
| --- | --- | --- | --- |
| Phase 1 - Discovery | TODO: e.g., 2 person-days | 3-5 days | 1-2 people |
| Phase 2 - Implementation | TODO: e.g., 5 person-days | 1-2 weeks | 2-3 people |
| Phase 3 - Validation | TODO: e.g., 2 person-days | 3-5 days | 1-2 people |
| **Total** | **TODO: total** | **TODO: total** | **-** |

### Required Skills
- TODO: List required expertise (e.g., "React experience", "Database optimization", "Infrastructure knowledge")
- TODO: Identify skill gaps and training needs

### Resource Availability
- **Available:** TODO: List team members and their availability
- **Blocked:** TODO: Note any team members with conflicting priorities
- **Escalation:** TODO: Name of person to contact if resources are insufficient

## Working Phases
### Phase 1 — Discovery & Alignment
**Steps**
1. TODO: Outline discovery tasks and assign the accountable owner.
2. TODO: Capture open questions that require clarification.

**Commit Checkpoint**
- After completing this phase, capture the agreed context and create a commit (for example, `git commit -m "chore(plan): complete phase 1 discovery"`).

### Phase 2 — Implementation & Iteration
**Steps**
1. TODO: Note build tasks, pairing expectations, and review cadence.
2. TODO: Reference docs or playbooks to keep changes aligned.

**Commit Checkpoint**
- Summarize progress, update cross-links, and create a commit documenting the outcomes of this phase (for example, `git commit -m "chore(plan): complete phase 2 implementation"`).

### Phase 3 — Validation & Handoff
**Steps**
1. TODO: Detail testing, verification, and documentation updates.
2. TODO: Document evidence the team must capture for maintainers.

**Commit Checkpoint**
- Record the validation evidence and create a commit signalling the handoff completion (for example, `git commit -m "chore(plan): complete phase 3 validation"`).

## Rollback Plan
Document how to revert changes if issues arise during or after implementation.

### Rollback Triggers
When to initiate rollback:
- Critical bugs affecting core functionality
- Performance degradation beyond acceptable thresholds
- Data integrity issues detected
- Security vulnerabilities introduced
- User-facing errors exceeding alert thresholds

### Rollback Procedures
#### Phase 1 Rollback
- Action: Discard discovery branch, restore previous documentation state
- Data Impact: None (no production changes)
- Estimated Time: < 1 hour

#### Phase 2 Rollback
- Action: TODO: Revert commits, restore database to pre-migration snapshot
- Data Impact: TODO: Describe any data loss or consistency concerns
- Estimated Time: TODO: e.g., 2-4 hours

#### Phase 3 Rollback
- Action: TODO: Full deployment rollback, restore previous version
- Data Impact: TODO: Document data synchronization requirements
- Estimated Time: TODO: e.g., 1-2 hours

### Post-Rollback Actions
1. Document reason for rollback in incident report
2. Notify stakeholders of rollback and impact
3. Schedule post-mortem to analyze failure
4. Update plan with lessons learned before retry

## Evidence & Follow-up

List artifacts to collect (logs, PR links, test runs, design notes). Record follow-up actions or owners.
