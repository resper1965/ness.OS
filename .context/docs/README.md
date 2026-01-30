# Documentation Index

Welcome to the repository knowledge base. Start with the project overview, then dive into specific guides as needed.

## Core Guides
- [Project Overview](./project-overview.md)
- [Architecture Notes](./architecture.md)
- [Development Workflow](./development-workflow.md)
- [Testing Strategy](./testing-strategy.md)
- [Glossary & Domain Concepts](./glossary.md)
- [Data Flow & Integrations](./data-flow.md)
- [Security & Compliance Notes](./security.md)
- [Tooling & Productivity Guide](./tooling.md)

## Conventions
- [Separação: Agentes da aplicação vs Playbooks AI](../../docs/context-separation.md) — não misturar os 10 agentes do produto com os roles em `.context/agents/`.
- [Plano: Ajuste dos schemas ao projeto](../../docs/plan-ajuste-schema-ao-projeto.md) — estado atual (`fin` em `001`) vs planejado (ops, growth, jur, gov, people, kb); migrations futuras; alinhamento com AI-context.
- [Plano: Novos passos GitHub e integração](../../docs/plan-github-novos-passos-integracao.md) — frontend Next.js (`src/app`, `src/components`, `src/lib`), integração com planos e AI-context.

## Repository Snapshot
- `ARCHITECTURE.md/`
- `docs/` — Living documentation produced by this tool.
- `README.md/`

## Document Map
| Guide | File | Primary Inputs |
| --- | --- | --- |
| Project Overview | `project-overview.md` | Roadmap, README, stakeholder notes |
| Architecture Notes | `architecture.md` | ADRs, service boundaries, dependency graphs |
| Development Workflow | `development-workflow.md` | Branching rules, CI config, contributing guide |
| Testing Strategy | `testing-strategy.md` | Test configs, CI gates, known flaky suites |
| Glossary & Domain Concepts | `glossary.md` | Business terminology, user personas, domain rules |
| Data Flow & Integrations | `data-flow.md` | System diagrams, integration specs, queue topics |
| Security & Compliance Notes | `security.md` | Auth model, secrets management, compliance requirements |
| Tooling & Productivity Guide | `tooling.md` | CLI scripts, IDE configs, automation workflows |
