---
status: filled
generated: 2026-02-06
planSlug: composicao-servicos-produtos-tasks-playbooks
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

# Composição Serviços/Produtos — Task → Playbook → Service Action → Service

> Definir e implementar o modelo de composição alinhado à **ITIL v4**: **Task** (menor unidade), **Playbook** (conjunto de tasks/SOP), **Service Action** (unidade de entrega/job), **Service** (produto vendável). As unidades operacionais (Task, Playbook e Service Action) devem ter métrica de consumo — temporal ou valor.

**Trigger:** "composição serviços", "tasks playbooks service actions", "métricas de consumo", "job"

---

## Modelo de composição

| Nível | Entidade           | Definição                                                    | Métrica                                   |
| ----- | ------------------ | ------------------------------------------------------------ | ----------------------------------------- |
| 1     | **Task**           | Menor unidade. Tarefa atômica técnica.                       | **Temporal** (min) **ou** **Valor** (R$). |
| 2     | **Playbook**       | **SOP**. Conjunto ordenado de tasks (o "Como").              | Soma das tasks ou estimativa manual.      |
| 3     | **Service Action** | **Job**. Conjunto de playbooks (a "Entrega").                | Estimativa para a entrega de valor.       |
| 4     | **Service**        | **Service Offering**. Produto vendável (`services_catalog`). | `base_price` ou soma das ações.           |

**Regra:** Task, Playbook e Service Action **devem** ter ao menos uma métrica de consumo para permitir planejamento, precificação e acompanhamento (OPS/FIN).

---

## Estado atual do codebase

- **services_catalog** — Serviços (name, slug, base_price, technical_scope, marketing_pitch, etc.). Ligação a playbooks via **services_playbooks** (N:N, sort_order). Migrations: 001_initial_schema, 028_services_playbooks_many.
- **playbooks** — Título, slug, content_markdown, tags, last_reviewed_at. **Sem** entidade Task; conteúdo é markdown livre. **Sem** campos de métrica de consumo (estimativa de tempo ou valor). Migrations: 003_ops_fin_tables, 013_playbooks_metadata.
- **time_entries** — Registro de tempo por usuário/contrato/**playbook** (started_at, ended_at, duration_minutes). Tempo hoje é apenas no nível playbook, não por task. Migration: 030_time_entries_timesheet.
- **performance_metrics** — Por contrato/mês: hours_worked, hourly_rate, cost_input. Migration: 003_ops_fin_tables, 032_sync_performance_metrics_from_timer.

---

## Task Snapshot

- **Primary goal:** Ter modelo de dados e regras de negócio claras para composição Serviço → Playbook → Task, com métricas de consumo (temporal ou valor) em Task e Playbook, alinhado a OPS (timer, playbooks) e FIN (precificação, custo).
- **Success signal:** (1) Tabela `tasks` (ou equivalente) com vínculo a playbook e campos de métrica; (2) Playbooks com campos de métrica (estimativa tempo/valor); (3) Doc e glossary atualizados; (4) Opcional: time_entries podendo referenciar task_id.
- **Key references:**
  - [Documentation Index](../docs/README.md)
  - [Agent Handbook](../agents/README.md)
  - [Plans Index](./README.md)
  - [ness.OPS Engenharia Processos](./ness-ops-engenharia-processos.md)
  - Migrations: 003_ops_fin_tables, 028_services_playbooks_many, 030_time_entries_timesheet

## Codebase Context

- **Codebase analysis:** services_catalog (001, 002, 028), playbooks (003, 013), services_playbooks (028), time_entries (030), performance_metrics (003, 032). Não existe tabela `tasks` nem campos de consumo em playbooks.

## Agent Lineup

| Agent                  | Role in this plan                          | Playbook                                                      | First responsibility focus                                 |
| ---------------------- | ------------------------------------------ | ------------------------------------------------------------- | ---------------------------------------------------------- |
| Code Reviewer          | TODO: Describe why this agent is involved. | [Code Reviewer](../agents/code-reviewer.md)                   | Review code changes for quality, style, and best practices |
| Bug Fixer              | TODO: Describe why this agent is involved. | [Bug Fixer](../agents/bug-fixer.md)                           | Analyze bug reports and error messages                     |
| Feature Developer      | TODO: Describe why this agent is involved. | [Feature Developer](../agents/feature-developer.md)           | Implement new features according to specifications         |
| Refactoring Specialist | TODO: Describe why this agent is involved. | [Refactoring Specialist](../agents/refactoring-specialist.md) | Identify code smells and improvement opportunities         |
| Test Writer            | TODO: Describe why this agent is involved. | [Test Writer](../agents/test-writer.md)                       | Write comprehensive unit and integration tests             |
| Documentation Writer   | TODO: Describe why this agent is involved. | [Documentation Writer](../agents/documentation-writer.md)     | Create clear, comprehensive documentation                  |
| Performance Optimizer  | TODO: Describe why this agent is involved. | [Performance Optimizer](../agents/performance-optimizer.md)   | Identify performance bottlenecks                           |
| Security Auditor       | TODO: Describe why this agent is involved. | [Security Auditor](../agents/security-auditor.md)             | Identify security vulnerabilities                          |
| Frontend Specialist    | TODO: Describe why this agent is involved. | [Frontend Specialist](../agents/frontend-specialist.md)       | Design and implement user interfaces                       |
| Architect Specialist   | TODO: Describe why this agent is involved. | [Architect Specialist](../agents/architect-specialist.md)     | Design overall system architecture and patterns            |
| Devops Specialist      | TODO: Describe why this agent is involved. | [Devops Specialist](../agents/devops-specialist.md)           | Design and maintain CI/CD pipelines                        |

## Documentation Touchpoints

| Guide                        | File                                                       | Primary Inputs                                          |
| ---------------------------- | ---------------------------------------------------------- | ------------------------------------------------------- |
| Project Overview             | [project-overview.md](../docs/project-overview.md)         | Roadmap, README, stakeholder notes                      |
| Architecture Notes           | [architecture.md](../docs/architecture.md)                 | ADRs, service boundaries, dependency graphs             |
| Development Workflow         | [development-workflow.md](../docs/development-workflow.md) | Branching rules, CI config, contributing guide          |
| Testing Strategy             | [testing-strategy.md](../docs/testing-strategy.md)         | Test configs, CI gates, known flaky suites              |
| Glossary & Domain Concepts   | [glossary.md](../docs/glossary.md)                         | Business terminology, user personas, domain rules       |
| Security & Compliance Notes  | [security.md](../docs/security.md)                         | Auth model, secrets management, compliance requirements |
| Tooling & Productivity Guide | [tooling.md](../docs/tooling.md)                           | CLI scripts, IDE configs, automation workflows          |

## Risk Assessment

Identify potential blockers, dependencies, and mitigation strategies before beginning work.

### Identified Risks

| Risk                              | Probability | Impact | Mitigation Strategy                            | Owner      |
| --------------------------------- | ----------- | ------ | ---------------------------------------------- | ---------- |
| TODO: Dependency on external team | Medium      | High   | Early coordination meeting, clear requirements | TODO: Name |
| TODO: Insufficient test coverage  | Low         | Medium | Allocate time for test writing in Phase 2      | TODO: Name |

### Dependencies

- **Internal:** ness.OPS (playbooks, time_entries), ness.FIN (performance_metrics, contracts), ness.GROWTH (services_catalog, propostas). Manter compatibilidade com services_playbooks e time_entries existentes.
- **External:** Nenhum.
- **Technical:** Supabase (novas migrations), RLS para `tasks`.

### Assumptions

- Task é sempre filha de um playbook; playbook pode ter zero ou N tasks. Serviço continua sendo conjunto de playbooks (services_playbooks).
- Métrica de consumo: cada task e cada playbook têm **pelo menos uma** de: (a) temporal — ex. `estimated_duration_minutes`; (b) valor — ex. `estimated_value` (numeric, R$). Permitir ambas.
- time_entries pode continuar apenas com playbook_id (fase 1) ou ganhar task_id opcional (fase 2) para granularidade.

## Resource Estimation

### Time Allocation

| Phase                    | Estimated Effort          | Calendar Time   | Team Size  |
| ------------------------ | ------------------------- | --------------- | ---------- |
| Phase 1 - Discovery      | TODO: e.g., 2 person-days | 3-5 days        | 1-2 people |
| Phase 2 - Implementation | TODO: e.g., 5 person-days | 1-2 weeks       | 2-3 people |
| Phase 3 - Validation     | TODO: e.g., 2 person-days | 3-5 days        | 1-2 people |
| **Total**                | **TODO: total**           | **TODO: total** | **-**      |

### Required Skills

- TODO: List required expertise (e.g., "React experience", "Database optimization", "Infrastructure knowledge")
- TODO: Identify skill gaps and training needs

### Resource Availability

- **Available:** TODO: List team members and their availability
- **Blocked:** TODO: Note any team members with conflicting priorities
- **Escalation:** TODO: Name of person to contact if resources are insufficient

## Especificação de schema (resumo)

- **tasks** (nova tabela): id, playbook_id (FK playbooks), title, slug (único por playbook), sort_order, description opcional. **Métrica de consumo (ao menos uma):** estimated_duration_minutes (numeric) e/ou estimated_value (numeric, R$).
- **playbooks** (alterar): adicionar **métrica de consumo:** estimated_duration_minutes e/ou estimated_value (numeric). Podem ser preenchidos manualmente ou derivados (soma das tasks) em app/relatório.
- **playbook_tasks** (opcional): se task puder ser reutilizada em vários playbooks, usar tabela de junção playbook_id + task_id + sort_order; senão, task pertence a um único playbook (playbook_id em tasks).
- **time_entries** (futuro): opcional task_id (FK tasks) para registrar tempo por task; hoje mantém apenas playbook_id.

Doc detalhado: **docs/COMPOSICAO-SERVICOS-PRODUTOS.md** (criar na Phase 1).

---

## Working Phases

### Phase 1 — Discovery & Alignment

**Steps**

1. Documentar modelo de composição e regras de métrica em **docs/COMPOSICAO-SERVICOS-PRODUTOS.md** (Task → Playbook → Service; obrigatoriedade de métrica em Task e Playbook).
2. Decidir: task pertence a um único playbook (coluna playbook_id em tasks) ou many-to-many (playbook_tasks). Recomendação: 1 playbook → N tasks (coluna playbook_id).
3. Alinhar com glossary e PLANO-NESS-OPS-ENGENHARIA-PROCESSOS (playbooks, timer).

**Commit Checkpoint**

- `chore(plan): composição serviços — phase 1 discovery e doc COMPOSICAO-SERVICOS-PRODUTOS.md`

### Phase 2 — Implementation & Iteration

**Steps**

1. Migration: criar tabela `tasks` (playbook_id, title, slug, sort_order, estimated_duration_minutes, estimated_value); RLS authenticated.
2. Migration: alterar `playbooks` — adicionar estimated_duration_minutes e estimated_value (numeric, nullable).
3. Actions: CRUD tasks em `src/app/actions/ops.ts` (ou data.ts conforme convenção); listar tasks por playbook_id; validar “ao menos uma métrica” em insert/update.
4. UI (ness.OPS): tela/aba de tasks por playbook (lista, criar, editar, ordenar); exibir e editar métricas de consumo no playbook.
5. Opcional: time_entries.task_id (FK tasks, nullable) e ajustar Timer para permitir associar entrada a uma task.

**Commit Checkpoint**

- `feat(ops): tasks e métricas de consumo em playbooks — composição Serviço/Playbook/Task`

### Phase 3 — Validation & Handoff

**Steps**

1. Validar: criar playbook com estimated_duration_minutes; criar tasks com estimated_value; listar serviço → playbooks → tasks.
2. Atualizar glossary (Task, métrica de consumo); atualizar LAYOUT-APP-HEADERS ou NAV se nova rota; registrar em pendencias-abertas se aplicável.

**Commit Checkpoint**

- `chore(plan): composição serviços — phase 3 validation e docs`

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
