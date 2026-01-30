# Playbooks AI (AI-context)

**Roles para a IA que desenvolve o repositório** — architect, backend, feature-developer, etc.

⚠️ **Não confundir com os agentes da aplicação.** Os **agentes da aplicação** são os 10 agentes de negócio do ness.OS (Vendas, Precificação, Marketing, Homogeneização, Mapeamento, Rentabilidade, Ciclo de Vida, Análise Contratual, Compliance, Correlação de Treinamento), especificados em **`docs/agents/agents-specification.md`** e implementados como Edge Functions. Estes playbooks guiam a IA no desenvolvimento do código; não são parte do produto. Ver [docs/context-separation.md](../../docs/context-separation.md).

## Playbooks disponíveis

- [Architect Specialist](./architect-specialist.md) — arquitetura e padrões
- [Backend Specialist](./backend-specialist.md) — backend, APIs, Supabase
- [Database Specialist](./database-specialist.md) — schemas, migrations, RAG
- [Feature Developer](./feature-developer.md) — novas funcionalidades
- [Code Reviewer](./code-reviewer.md), [Bug Fixer](./bug-fixer.md), [Test Writer](./test-writer.md), [Documentation Writer](./documentation-writer.md)
- [DevOps](./devops-specialist.md), [Frontend](./frontend-specialist.md), [Security Auditor](./security-auditor.md), etc.

## Uso

1. Escolher o playbook que combina com a tarefa.
2. Consultar **docs/agents/agents-specification.md** quando for implementar ou alterar **agentes da aplicação**.
3. Manter nomenclatura: **agentes da aplicação** = produto; **Playbooks AI** = estes papéis em `.context/agents/`.

## Referências

- [Documentação](../../docs/), [AGENTS.md](../../AGENTS.md), [Separação agentes vs Playbooks](../../docs/context-separation.md)
