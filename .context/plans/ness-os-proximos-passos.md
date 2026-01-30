---
status: filled
progress: 100
planVinculado: docs/PLANO-COMPLETO-NESSOS-SITE.md
generated: 2026-01-30
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
lastUpdated: "2026-01-30T18:45:00.246Z"
---

# Próximos Passos ness.OS Plan

> Deploy, migrations, migração de conteúdo do site legacy e melhorias pós-MVP

## Task Snapshot
- **Primary goal:** Colocar o ness.OS + ness.WEB em produção, executar migrations pendentes, migrar conteúdo do site legacy e evoluir o MVP.
- **Success signal:** Deploy Vercel funcional; migrations 003-006 aplicadas; bucket os-assets criado; conteúdo legacy (privacidade, termos, soluções) no banco; site 100% operacional.
- **Key references:**
  - [Documentation Index](../docs/README.md)
  - [Agent Handbook](../agents/README.md)
  - [Plans Index](./README.md)

## Codebase Context
- **Estado atual:** MVP completo — 26 rotas, módulos Growth/OPS/People/FIN, Auth, blog, carreiras, leads, contratos, rentabilidade, playbooks, métricas, vagas, gaps, assets, propostas PDF.
- **Pendências:** Deploy Vercel; migrations 003-006 no Supabase; bucket os-assets; migração locales → SQL; seed static_pages.

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

## Próximos Passos (Roadmap)

| # | Tarefa | Responsável | Prioridade |
|---|--------|-------------|------------|
| 1 | Executar migrations 003, 004, 005, 006 no Supabase SQL Editor | DevOps/Architect | P0 |
| 2 | Criar bucket `os-assets` no Supabase Dashboard (Storage) | DevOps | P0 |
| 3 | Configurar variáveis no Vercel e fazer deploy | DevOps | P0 |
| 4 | Migrar conteúdo de locales (pt/en) para static_pages e services_catalog | Documentation/Feature | P1 |
| 5 | Seed inicial: privacidade, termos em static_pages | Feature | P1 |
| 6 | Adicionar testes (Jest/Vitest) para Server Actions críticas | Test Writer | P2 |
| 7 | Editor rich (TipTap/MDXEditor) para posts e playbooks | Frontend | P2 |
| 8 | Integração Omie ERP (credenciais já fornecidas) | Backend | P3 |

## Working Phases
### Phase 1 — Discovery & Alignment
**Steps**
1. Validar que todas as migrations (003-006) estão corretas e aplicar no Supabase.
2. Confirmar credenciais Vercel e Supabase para deploy.

**Commit Checkpoint**
- After completing this phase, capture the agreed context and create a commit (for example, `git commit -m "chore(plan): complete phase 1 discovery"`).

### Phase 2 — Implementation & Iteration
**Steps**
1. [x] Deploy Vercel; verificar build e variáveis; testar fluxo completo (login, leads, vagas). *(completed: 2026-01-30T18:45:00.246Z)*
2. Extrair conteúdo de `_reference/legacy_site/public/locales` e gerar SQL INSERT para static_pages e services_catalog.

**Commit Checkpoint**
- Summarize progress, update cross-links, and create a commit documenting the outcomes of this phase (for example, `git commit -m "chore(plan): complete phase 2 implementation"`).

### Phase 3 — Validation & Handoff
**Steps**
1. Smoke test: visitante envia contato; lead no Kanban; vaga publicada aparece em /carreiras; rentabilidade visível.
2. Atualizar docs/DEPLOY.md e SETUP-INICIAL.md com evidências.

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

## Execution History

> Last updated: 2026-01-30T18:45:00.246Z | Progress: 100%

### phase-2 [DONE]
- Started: 2026-01-30T18:45:00.246Z
- Completed: 2026-01-30T18:45:00.246Z

- [x] Step 1: Step 1 *(2026-01-30T18:45:00.246Z)*
  - Output: supabase/seed/001_static_pages_legal.sql
  - Notes: Seed privacidade e termos criado


## Evidence & Follow-up

List artifacts to collect (logs, PR links, test runs, design notes). Record follow-up actions or owners.
