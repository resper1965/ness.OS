# ness.OS

> Sistema Operacional de Gestão Empresarial Inteligente

**ness.OS** é uma plataforma de gestão empresarial baseada em agentes de IA interconectados, desenvolvida pela [ness.](https://ness.com.br) para transformar dados operacionais em decisões estratégicas.

---

## 🎯 Visão

Quebrar os silos organizacionais através de agentes inteligentes que compartilham bases de conhecimento, transformando a empresa de uma estrutura reativa para uma organização guiada por dados e IA.

## 🏗️ Arquitetura

O ness.OS é composto por **6 módulos** e **10 agentes de IA** que operam sobre **6 bases de conhecimento** interconectadas.

```
┌─────────────────────────────────────────────────────────────────┐
│                          ness.OS                                │
├─────────────┬─────────────┬─────────────┬─────────────┬─────────┤
│ ness.GROWTH │  ness.OPS   │  ness.FIN   │  ness.JUR   │ness.GOV │
│  (Comercial)│ (Operações) │ (Financeiro)│  (Jurídico) │(Govern.)│
├─────────────┴─────────────┴─────────────┴─────────────┴─────────┤
│                        ness.PEOPLE                              │
│                    (Gestão de Talentos)                         │
└─────────────────────────────────────────────────────────────────┘
```

## 📦 Módulos

| Módulo | Foco | Agentes |
|--------|------|---------|
| [ness.GROWTH](docs/modules/growth.md) | Inteligência Comercial e Marketing | 3 |
| [ness.OPS](docs/modules/ops.md) | Gestão do Conhecimento e Operação | 2 |
| [ness.FIN](docs/modules/fin.md) | CFO Digital e Gestão de Contratos | 2 |
| [ness.JUR](docs/modules/jur.md) | Blindagem e Conformidade Legal | 1 |
| [ness.GOV](docs/modules/gov.md) | Governança Corporativa Interna | 1 |
| [ness.PEOPLE](docs/modules/people.md) | Gestão de Talentos | 1 |

## 📚 Documentação

- [Visão Geral da Arquitetura](docs/architecture/overview.md)
- [Diagramas](docs/architecture/diagrams.md)
- [Fluxo de Dados](docs/architecture/data-flow.md)
- [Especificação dos Agentes](docs/agents/agents-specification.md)
- [Modelo de Dados Conceitual](docs/data-model/conceptual-model.md)

## 🔄 Fluxo Principal de Dados

```
ness.OPS (recursos/horas) ──► ness.FIN (custo real) ──► ness.GROWTH (precificação)
       │
       ▼
ness.PEOPLE (gaps de treinamento)
```

## 🛠️ Stack Tecnológica

- **Hospedagem:** VPS própria
- **Desenvolvimento:** IA Coder
- **Agentes:** Arquitetura multi-agente com bases de conhecimento RAG
- **Integrações:** APIs REST (ERP, Redes Sociais, etc.)

## 📄 Licença

Proprietário - © 2025 ness. Cybersecurity

---

*"Invisíveis quando tudo funciona. Presentes quando mais importa."*
