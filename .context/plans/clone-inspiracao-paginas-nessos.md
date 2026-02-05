---
status: ready
planSlug: clone-inspiracao-paginas-nessos
generated: 2026-02-04
type: frontend
trigger: "clone inspiração", "refatorar páginas com clone", "resper1965/clone páginas"
constrains:
  - "Respeitar ness. branding (ness., ness.OS, módulos ness.X)"
  - "Manter stack: Next.js 14, React 18, Tailwind 3 — sem upgrade forçado"
  - "Zero breaking: auth Supabase, nav-config, rotas e actions intactos"
  - "Adotar padrões e blocos do clone como inspiração, não copiar código cru; adaptar para ness.OS"
docs:
  - "project-overview.md"
  - "architecture.md"
  - "DESIGN-TOKENS.md"
  - "LAYOUT-APP-HEADERS.md"
plans:
  - "bundui-layout-components-nessos.md"
  - "bundui-componentes-profundos-nessos.md"
  - "adaptacao-layout-bundui-nessos.md"
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

# Clone (resper1965/clone) como inspiração para construção e refatoração de páginas ness.OS

> Usar o repositório **[resper1965/clone](https://github.com/resper1965/clone)** (Shadcn UI Kit — Next.js 15, React 19, Tailwind 4) como **referência de padrões de UI, blocos e estrutura de páginas** para construir e refatorar as páginas existentes do ness.OS, mantendo stack Next 14/React 18/Tailwind 3 e branding ness.

**Trigger:** "clone inspiração", "refatorar páginas com clone", "resper1965/clone"

---

## Objetivo

- **Inspirar-se** em [resper1965/clone](https://github.com/resper1965/clone) para: padrões de layout de página, cards, tabelas, formulários, date/time pickers, action menus, theme customizer.
- **Mapear** componentes e blocos do clone → equivalentes ou melhorias nas páginas ness.OS (`/app/fin`, `/app/gov`, `/app/growth`, `/app/jur`, `/app/ops`, `/app/people`).
- **Refatorar** páginas existentes de forma **incremental**: adotar padrões visuais e estruturais (page shell, cards, headers) sem alterar rotas, auth ou dados.

---

## Referência — Estrutura do clone

| Clone (repo) | Conteúdo resumido |
|--------------|-------------------|
| **app/dashboard** | Rotas (auth), (guest); layout dashboard. |
| **[app/dashboard/(auth)/pages](https://github.com/resper1965/clone/tree/main/app/dashboard/(auth)/pages)** | Páginas autenticadas: empty-states, error, onboarding-flow, orders, pricing, products, profile, settings, user-profile, users. Ver tabela abaixo. |
| **components/layout** | header/ (index, theme-switch, user-menu, search, notifications), sidebar/ (app-sidebar, nav-main, nav-user), logo.tsx. |
| **components/theme-customizer** | Painel de tema (preset, radius, scale, sidebar mode). |
| **components/ui** | Primitivos shadcn (sidebar, avatar, dropdown, etc.). |
| **components** | CardActionMenus, custom-date-range-picker, date-time-picker, active-theme, icon. |

**Nota:** Clone usa Next 15, React 19, Tailwind 4. ness.OS mantém Next 14, React 18, Tailwind 3; ao inspirar-se, adaptar classes e APIs.

### Clone (auth)/pages — inventário

Referência: [resper1965/clone — app/dashboard/(auth)/pages](https://github.com/resper1965/clone/tree/main/app/dashboard/(auth)/pages)

| Página clone | Uso típico | Equivalente / inspiração ness.OS |
|--------------|------------|----------------------------------|
| **empty-states** | Estados vazios (lista sem itens) | EmptyState em shared/; listagens fin, growth, people. |
| **error** | Página de erro (404, 500) | not-found, error boundary em app. |
| **onboarding-flow** | Fluxo de onboarding | Futuro: primeiro acesso ou configuração inicial. |
| **orders** | Listagem/detalhe de pedidos | growth/propostas, fin/contratos (listagem). |
| **pricing** | Página de preços/planos | Opcional; ness.OS foco B2B. |
| **products** | Listagem/detalhe de produtos | growth/services, growth/brand (catálogo). |
| **profile** | Perfil do usuário | UserMenu dropdown; futura /app/profile. |
| **settings** | Configurações da conta/app | Futura /app/configuracoes (theme, preferências). |
| **user-profile** | Perfil de usuário (admin) | people/candidatos ou perfil em módulo PEOPLE. |
| **users** | Listagem de usuários | people/candidatos, gov/aceites (lista de usuários). |

---

## Mapeamento clone → ness.OS (páginas existentes)

| Área clone | Páginas/componentes ness.OS a inspirar ou refatorar |
|------------|-----------------------------------------------------|
| Dashboard / page shell | `/app`, `/app/fin`, `/app/gov`, etc. — PageContent, PageCard, AppPageHeader (shared/). |
| Cards, stats, action menus | Listagens e hubs: fin/contratos, growth/leads, ops/playbooks, people/vagas; cards de resumo em fin/alertas. |
| Formulários, date/time | Formulários em growth/, gov/, people/, jur/; usar padrões de label, help, placeholders do clone. |
| Theme / customizer | ThemeToggle já no header; theme-customizer do clone como referência para futura página de configurações. |

---

## Task Snapshot

- **Primary goal:** Ter um inventário clone → ness.OS e priorização de refatorações; aplicar padrões do clone em pelo menos 2–3 páginas ou fluxos (ex.: hub FIN, listagem GROWTH ou formulário PEOPLE).
- **Success signal:** Páginas refatoradas com padrões inspirados no clone (page shell, cards, headers consistentes); docs atualizados (DESIGN-TOKENS ou LAYOUT-APP-HEADERS); build e testes verdes.
- **Key references:**
  - [resper1965/clone](https://github.com/resper1965/clone)
  - [clone (auth)/pages](https://github.com/resper1965/clone/tree/main/app/dashboard/(auth)/pages) — inventário de páginas autenticadas (empty-states, error, onboarding-flow, orders, pricing, products, profile, settings, user-profile, users).
  - [Documentation Index](../docs/README.md)
  - [Plans Index](./README.md)
  - [bundui-layout-components-nessos](./bundui-layout-components-nessos.md), [bundui-componentes-profundos-nessos](./bundui-componentes-profundos-nessos.md)

## Codebase Context

- **ness.OS:** Next 14, React 18, Tailwind 3, shadcn/ui (Radix), Supabase. Área app em `src/app/app/` com layout (AppSidebar, AppHeader, UserMenu, NavUser). Componentes shared: PageContent, PageCard, AppPageHeader, EntityForm. Módulos: FIN, GOV, GROWTH, JUR, OPS, PEOPLE.
- **clone:** Next 15, React 19, Tailwind 4, Shadcn UI Kit; app/dashboard; components/layout, theme-customizer, ui; blocos reutilizáveis (CardActionMenus, date pickers).

## Agent Lineup

| Agent | Role |
|-------|------|
| **architect-specialist** | Definir mapeamento clone → ness.OS e priorização de páginas/blocos. |
| **frontend-specialist** | Implementar e refatorar páginas com padrões inspirados no clone (page shell, cards, formulários). |
| **documentation-writer** | Atualizar DESIGN-TOKENS, LAYOUT-APP-HEADERS ou doc de padrões de página. |
| **code-reviewer** | Revisar mudanças de UI e consistência com branding ness. |

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
| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| Clone usa Tailwind 4 / React 19 | Alta | Médio | Adaptar classes para Tailwind 3; não copiar código cru, apenas padrões. |
| Regressão visual em páginas refatoradas | Média | Alto | Testes manuais (VALIDACAO-MANUAL); comparar antes/depois. |
| Escopo crescente (muitas páginas) | Média | Médio | Priorizar 2–3 páginas ou um módulo por vez; registrar decisões. |

### Dependencies
- **Internal:** nav-config, RoleProvider, auth Supabase, PageContent/PageCard/EntityForm — manter intactos.
- **External:** [resper1965/clone](https://github.com/resper1965/clone) como referência (leitura; não dependência de build).
- **Technical:** Next 14, React 18, Tailwind 3; lucide-react para ícones.

### Assumptions
- Clone permanece acessível como referência; não é dependência npm.
- Rotas e contratos de dados (Supabase, actions) não mudam; apenas UI e estrutura de página.
- Branding ness. e design tokens existentes (LAYOUT-APP-HEADERS, DESIGN-TOKENS) são a base; clone inspira refinamentos.

## Resource Estimation

### Time Allocation
| Phase | Estimated Effort | Calendar Time |
|-------|------------------|---------------|
| Phase 1 - Discovery (P) | 1–2 person-days | 2–4 days |
| Phase 2 - Implementation (E) | 3–5 person-days | 1–2 weeks |
| Phase 3 - Validation (V/C) | 1 person-day | 2–3 days |
| **Total** | **5–8 person-days** | **2–3 weeks** |

### Required Skills
- React/Next.js, Tailwind, componentes shadcn/ui; leitura de repositório clone para extrair padrões.

## Working Phases

### Phase 1 — Discovery & Alignment (P)

| # | Ação | Entregável |
|---|------|------------|
| 1 | Inventariar páginas e blocos do clone (app/dashboard, components) via GitHub/README. | Lista: rotas, componentes de página, cards, tabelas, forms, date pickers. |
| 2 | Mapear cada tipo de bloco clone → páginas ness.OS (fin, gov, growth, jur, ops, people). | Tabela: bloco clone, página(s) ness.OS, decisão (adotar / adaptar / ignorar). |
| 3 | Priorizar 2–3 páginas ou um módulo para primeira leva de refatoração. | Priorização registrada (ex.: hub /app/fin, listagem growth/leads, form people/gaps). |

**DoD Fase 1:** Artefato em `.context/workflow/artifacts/` com inventário e mapeamento clone → ness.OS; priorização registrada.

**Commit Checkpoint:** `chore(plan): complete phase 1 discovery — clone inspiração inventário e mapeamento`

### Phase 2 — Implementation & Iteration (E)

| # | Ação | Entregável |
|---|------|------------|
| 1 | Refatorar ou construir páginas priorizadas usando padrões do clone (page shell, cards, headers). | Código em `src/app/app/**` e `src/components/**`; design tokens respeitados. |
| 2 | Reutilizar PageContent, PageCard, AppPageHeader; alinhar espaçamento e tipografia ao clone. | Consistência visual; sem quebra de rotas ou auth. |
| 3 | Opcional: introduzir blocos inspirados no clone (ex.: CardActionMenus, date-range) onde fizer sentido. | Componentes em shared/ ou módulo; documentados. |

**DoD Fase 2:** Pelo menos 2–3 páginas ou um módulo refatorado; build e lint verdes.

**Commit Checkpoint:** `feat(ui): refatorar páginas com inspiração clone — [módulo/páginas]`

### Phase 3 — Validation & Handoff (V / C)

| # | Ação | Entregável |
|---|------|------------|
| 1 | Teste manual: navegação, responsivo, acessibilidade (VALIDACAO-MANUAL). | Checklist passando ou pendências documentadas. |
| 2 | Atualizar DESIGN-TOKENS ou LAYOUT-APP-HEADERS com padrões adotados. | Docs atualizados. |
| 3 | Registrar no plano status (filled) e referência cruzada com bundui-* e pendencias-abertas. | Plano atualizado; entrada em pendencias-abertas se aplicável. |

**DoD Fase 3:** Verificação concluída; plano marcado como concluído ou em manutenção.

**Commit Checkpoint:** `chore(plan): complete phase 3 validation — clone inspiração`

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
- Action: Revert commits de refatoração UI; restaurar componentes/páginas anteriores.
- Data Impact: Nenhum (apenas UI).
- Estimated Time: 1–2 hours

#### Phase 3 Rollback
- Action: Reverter apenas docs se necessário; código já revertido em Phase 2.
- Data Impact: Nenhum.
- Estimated Time: < 1 hour

### Post-Rollback Actions
1. Document reason for rollback in incident report
2. Notify stakeholders of rollback and impact
3. Schedule post-mortem to analyze failure
4. Update plan with lessons learned before retry

## Evidence & Follow-up

- **Fase P:** Artefato `clone-inspiracao-phase-p-inventario.md` (inventário clone + mapeamento + priorização).
- **Fase E:** Commits de refatoração; screenshots ou descrição antes/depois (opcional).
- **Fase V/C:** Atualização em DESIGN-TOKENS ou LAYOUT-APP-HEADERS; entrada em [pendencias-abertas-nessos](./pendencias-abertas-nessos.md) se concluído.

## Uso do ai-context

- **Workflow:** `workflow-init` com name `clone-inspiracao-paginas-nessos`, scale `MEDIUM`, require_plan true.
- **Plano:** `plan({ action: "link", planSlug: "clone-inspiracao-paginas-nessos" })`.
- **Progresso:** `plan({ action: "updateStep", planSlug: "clone-inspiracao-paginas-nessos", phaseId, stepIndex, status, output?, notes? })`.
