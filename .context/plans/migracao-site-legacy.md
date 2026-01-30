---
status: filled
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
---

# Migração Site Legacy para ness.OS Plan

> Migração do site institucional do corp-site-ness para src/app/(site), com rotas dinâmicas, componentes reutilizáveis e integração Supabase conforme docs/PLANO-MIGRACAO-SITE-LEGACY.md

## Task Snapshot
- **Primary goal:** Migrar o site institucional do corp-site-ness para `src/app/(site)`, usando rotas dinâmicas (`solucoes/[slug]`, `blog/[slug]`, `legal/[slug]`), componentes reutilizáveis (HeroSection, FeatureGrid, CTABanner) e integração com Supabase (services_catalog, public_posts, static_pages).
- **Success signal:** Site funcional com Home, Sobre, Contato; listagens e páginas dinâmicas de soluções/blog/legais; conteúdo gerenciado via banco; build sem erros.
- **Key references:**
  - [Documentation Index](../docs/README.md)
  - [Agent Handbook](../agents/README.md)
  - [Plans Index](./README.md)

## Codebase Context
- **Total files analyzed:** 366
- **Total symbols discovered:** 348
- **Architecture layers:** Utils, Repositories, Services, Components, Models, Controllers
- **Detected patterns:** Service Layer
- **Entry points:** src/lib/supabase/server.ts, _reference/legacy_site/lib/supabase/server.ts, _reference/legacy_site/pages/index.js (+35 more)

### Key Components
**Core Classes:**
- `ApiError` — /home/resper/nessOS/ness.OS/_reference/legacy_site/lib/api/errors.js:5
- `BadRequestError` — /home/resper/nessOS/ness.OS/_reference/legacy_site/lib/api/errors.js:26
- `UnauthorizedError` — /home/resper/nessOS/ness.OS/_reference/legacy_site/lib/api/errors.js:32
- `ForbiddenError` — /home/resper/nessOS/ness.OS/_reference/legacy_site/lib/api/errors.js:38
- `NotFoundError` — /home/resper/nessOS/ness.OS/_reference/legacy_site/lib/api/errors.js:44

**Key Interfaces:**
- `ButtonProps` — /home/resper/nessOS/ness.OS/_reference/legacy_site/components/ui/button.tsx:48
- `BadgeProps` — /home/resper/nessOS/ness.OS/_reference/legacy_site/components/ui/badge.tsx:26
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
| Architect Specialist | Define schema extensões, rotas dinâmicas e padrões de componentes. | [Architect Specialist](../agents/architect-specialist.md) | Design overall system architecture and patterns |
| Frontend Specialist | Implementa componentes site (HeroSection, FeatureGrid, CTABanner) e páginas. | [Frontend Specialist](../agents/frontend-specialist.md) | Design and implement user interfaces |
| Documentation Writer | Atualiza architecture.md, PLANO-MIGRACAO. | [Documentation Writer](../agents/documentation-writer.md) | Create clear, comprehensive documentation |

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
| Schema services_catalog insuficiente | Low | High | Adicionar content_json (jsonb) conforme PLANO-MIGRACAO | Architect |
| Conteúdo em locales (i18n) | Medium | Medium | Script de extração pt/en → SQL INSERT | Documentation |

### Dependencies
- **Internal:** Supabase (services_catalog, public_posts); ness.OS layout (site)
- **External:** Nenhuma
- **Technical:** Next.js 14 App Router, Tailwind, Supabase client

### Assumptions
- services_catalog e public_posts já existem; extensão content_json será aplicada
- Conteúdo legacy em public/locales será extraído e migrado

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
1. Arquitect: Revisar docs/PLANO-MIGRACAO-SITE-LEGACY.md; validar schema (content_json, static_pages); definir estrutura de rotas.
2. Documentation: Vincular plano ao workflow; registrar decisões.

**Commit Checkpoint**
- After completing this phase, capture the agreed context and create a commit (for example, `git commit -m "chore(plan): complete phase 1 discovery"`).

### Phase 2 — Implementation & Iteration
**Steps**
1. Frontend: Criar componentes HeroSection, FeatureGrid, UseCasesGrid, MetricsGrid, ProcessSteps, CTABanner, ProseContent em src/components/site/.
2. Frontend: Implementar solucoes/[slug]/page.tsx usando template de serviço; blog/[slug]; legal/[slug].
3. Architect: Aplicar migrations SQL (content_json, static_pages).
4. Reference: docs/PLANO-MIGRACAO-SITE-LEGACY.md, docs/ARQUITETURA-TECNICA-NESSOS.md.

**Commit Checkpoint**
- Summarize progress, update cross-links, and create a commit documenting the outcomes of this phase (for example, `git commit -m "chore(plan): complete phase 2 implementation"`).

### Phase 3 — Validation & Handoff
**Steps**
1. Build: npm run build sem erros.
2. Smoke: Home, /solucoes, /solucoes/nsecops, /blog, /contato respondem.
3. Documentation: Atualizar architecture.md com rotas e componentes.

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
