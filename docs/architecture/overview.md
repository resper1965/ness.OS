# Visão Geral da Arquitetura

## Introdução

O ness.OS é uma plataforma de gestão empresarial que utiliza Inteligência Artificial, Agentes Autônomos e Bases de Conhecimento para transformar dados brutos em decisões estratégicas. A arquitetura foi projetada para quebrar silos organizacionais, onde a base de conhecimento de um módulo torna-se input de decisão de outro.

## Princípios Arquiteturais

### 1. Agentes como Atores Ativos
A tecnologia não é um repositório passivo. Cada agente atua ativamente em padronização, auditoria e geração de valor.

### 2. Bases de Conhecimento Compartilhadas
Os módulos não operam isoladamente. O conhecimento flui entre eles:
- Uso de recursos (OPS) → Precificação (GROWTH) + Custo (FIN)
- Erros operacionais (OPS) → Treinamento (PEOPLE)
- Casos de sucesso (OPS) → Marketing (GROWTH)

### 3. Ciclo Fechado de Aprendizado
Falhas operacionais identificadas retroalimentam o sistema de desenvolvimento humano, criando um ciclo de melhoria contínua.

## Componentes Principais

### Camada de Módulos

```
┌────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                   │
│                    (Interface Unificada ness.OS)                       │
└────────────────────────────────────────────────────────────────────────┘
                                    │
┌────────────────────────────────────────────────────────────────────────┐
│                          CAMADA DE MÓDULOS                             │
├──────────────┬──────────────┬──────────────┬──────────────┬────────────┤
│ ness.GROWTH  │  ness.OPS    │  ness.FIN    │  ness.JUR    │ ness.GOV   │
│              │              │              │              │            │
│ • Vendas     │ • Processos  │ • CFO        │ • Contratos  │ • Políticas│
│ • Marketing  │ • Recursos   │ • Contratos  │ • Compliance │ • Aceites  │
│ • Propostas  │ • Manuais    │ • Custos     │              │            │
└──────────────┴──────────────┴──────────────┴──────────────┴────────────┘
                                    │
┌────────────────────────────────────────────────────────────────────────┐
│                           ness.PEOPLE                                  │
│              (Gestão de Talentos - Camada Transversal)                 │
└────────────────────────────────────────────────────────────────────────┘
```

### Camada de Agentes

| Módulo | Agente | Função |
|--------|--------|--------|
| GROWTH | Agente de Vendas | Geração de propostas técnicas baseadas em histórico |
| GROWTH | Agente de Precificação | Cálculo de preços considerando riscos e recursos |
| GROWTH | Agente de Marketing | Criação de conteúdo e monitoramento de engajamento |
| OPS | Agente de Homogeneização | Padronização de processos entre contratos |
| OPS | Agente de Mapeamento | Medição de consumo de recursos por contrato |
| FIN | Agente de Rentabilidade | Cálculo de margem líquida por cliente |
| FIN | Agente de Ciclo de Vida | Gestão de vigências, renovações e reajustes |
| JUR | Agente de Análise Contratual | Identificação de riscos jurídicos |
| GOV | Agente de Compliance | Rastreabilidade de aceites e documentação |
| PEOPLE | Agente de Correlação | Cruzamento de falhas com necessidades de treinamento |

### Camada de Bases de Conhecimento

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      BASES DE CONHECIMENTO                              │
├─────────────────┬─────────────────┬─────────────────┬───────────────────┤
│ KB_COMERCIAL    │ KB_OPERACIONAL  │ KB_FINANCEIRO   │ KB_LEGAL          │
│                 │                 │                 │                   │
│ • Contratos de  │ • Rituais       │ • Dados ERP     │ • LGPD            │
│   sucesso       │   técnicos      │ • Impostos      │ • Marco Civil     │
│ • Histórico de  │ • Manuais de    │ • Overhead      │ • CLT             │
│   propostas     │   procedimentos │ • Vigências     │ • Cláusulas       │
│ • Casos Alupar  │ • Consumo de    │                 │   padrão          │
│                 │   recursos      │                 │                   │
├─────────────────┴─────────────────┴─────────────────┴───────────────────┤
│ KB_GOVERNANCA                     │ KB_PESSOAS                          │
│                                   │                                     │
│ • Políticas internas              │ • Avaliações 360º                   │
│ • NDAs e termos                   │ • Feedback qualitativo              │
│ • Documentos de onboarding        │ • Registros de erros (via OPS)      │
└───────────────────────────────────┴─────────────────────────────────────┘
```

## Integrações Externas

### APIs de Entrada
- **ERP:** Receitas, despesas, dados contábeis
- **RH:** Dados de colaboradores, férias, admissões
- **Timesheet:** Horas trabalhadas por contrato
- **Cloud Providers:** Consumo de recursos (AWS, GCP, Azure)

### APIs de Saída
- **LinkedIn/Instagram:** Publicação de conteúdo
- **E-mail/Notificações:** Alertas de ciclo de vida
- **Dashboards:** Métricas e KPIs

## Infraestrutura

```
┌─────────────────────────────────────────────────────────────────┐
│                         VPS PRÓPRIA                             │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   API       │  │   Agentes   │  │   Vector    │             │
│  │   Gateway   │  │   Engine    │  │   Database  │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Database  │  │   LLM       │  │   File      │             │
│  │   (SQL)     │  │   Service   │  │   Storage   │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
```

## Próximos Passos

1. [Diagramas Detalhados](diagrams.md)
2. [Fluxo de Dados](data-flow.md)
3. [Especificação dos Agentes](../agents/agents-specification.md)
