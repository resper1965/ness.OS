# ARCHITECTURE.md

> Arquitetura Técnica do ness.OS

## Resumo Executivo

O **ness.OS** é uma plataforma de gestão empresarial inteligente composta por 6 módulos, 10 agentes de IA e bases de conhecimento interconectadas, construída sobre **Supabase** como backend principal.

---

## Stack Tecnológica

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                        │
│                         Next.js 14 + shadcn/ui                              │
│                              (Vercel)                                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SUPABASE                                        │
├──────────┬──────────┬──────────┬──────────┬──────────┬──────────────────────┤
│   Auth   │ Postgres │ pgvector │ Storage  │ Realtime │   Edge Functions     │
│   SSO    │  + RLS   │   RAG    │  Docs    │ Alertas  │   Agentes IA         │
└──────────┴──────────┴──────────┴──────────┴──────────┴──────────────────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              ▼                     ▼                     ▼
        ┌──────────┐          ┌──────────┐          ┌──────────┐
        │   Omie   │          │  Claude  │          │  Cloud   │
        │   ERP    │          │  OpenAI  │          │  APIs    │
        └──────────┘          └──────────┘          └──────────┘
```

---

## Componentes

| Camada | Tecnologia | Função |
|--------|------------|--------|
| Frontend | Next.js 14 + TypeScript | Interface do usuário |
| UI | shadcn/ui + Tailwind | Componentes |
| Auth | Supabase Auth | SSO, RBAC, MFA |
| Database | PostgreSQL | Dados relacionais |
| Vector DB | pgvector | Embeddings para RAG |
| Storage | Supabase Storage | PDFs, contratos |
| Realtime | Supabase Realtime | Notificações |
| Functions | Edge Functions (Deno) | Agentes, webhooks |
| Cron | pg_cron | Jobs agendados |
| LLM | Claude API | Inteligência dos agentes |
| Deploy | Vercel | CI/CD |

---

## Módulos do Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                          ness.OS                                │
├─────────────┬─────────────┬─────────────┬─────────────┬─────────┤
│ ness.GROWTH │  ness.OPS   │  ness.FIN   │  ness.JUR   │ness.GOV │
│  3 agentes  │  2 agentes  │  2 agentes  │  1 agente   │1 agente │
├─────────────┴─────────────┴─────────────┴─────────────┴─────────┤
│                        ness.PEOPLE                              │
│                         1 agente                                │
└─────────────────────────────────────────────────────────────────┘
```

| Módulo | Função | Agentes |
|--------|--------|---------|
| **GROWTH** | Comercial e Marketing | Vendas, Precificação, Marketing |
| **OPS** | Operações | Homogeneização, Mapeamento |
| **FIN** | CFO Digital | Rentabilidade, Ciclo de Vida |
| **JUR** | Jurídico | Análise Contratual |
| **GOV** | Governança | Compliance |
| **PEOPLE** | Talentos | Correlação Treinamento |

---

## Banco de Dados

### Schemas

```sql
CREATE SCHEMA fin;     -- Financeiro
CREATE SCHEMA ops;     -- Operações
CREATE SCHEMA growth;  -- Comercial
CREATE SCHEMA jur;     -- Jurídico
CREATE SCHEMA gov;     -- Governança
CREATE SCHEMA people;  -- Pessoas
CREATE SCHEMA kb;      -- Knowledge Base (RAG)
```

### Principais Tabelas

| Schema | Tabela | Descrição |
|--------|--------|-----------|
| fin | contratos | Contratos vigentes |
| fin | receitas | Contas a receber |
| fin | despesas | Contas a pagar |
| fin | rentabilidade | Margem por contrato |
| ops | recursos_consumidos | Horas, licenças, cloud |
| ops | erros_operacionais | Falhas para treinamento |
| growth | propostas | Propostas comerciais |
| growth | casos_sucesso | Cases para marketing |
| jur | analises | Pareceres jurídicos |
| gov | aceites | Aceites de políticas |
| people | avaliacoes | Avaliações 360º |
| kb | documentos | Embeddings para RAG |

---

## Fluxo de Dados Principal

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  Omie   │────►│ ness.FIN│────►│ ness.   │────►│ Proposta│
│  ERP    │     │ (custos)│     │ GROWTH  │     │ Gerada  │
└─────────┘     └─────────┘     └─────────┘     └─────────┘
                     ▲
┌─────────┐          │
│ ness.OPS│──────────┘
│(recursos)
└─────────┘
```

**Fluxos críticos:**
1. OPS → FIN → GROWTH (precificação baseada em custo real)
2. OPS → PEOPLE (erros → treinamento)
3. OPS → GROWTH (cases → marketing)

---

## Integrações

| Sistema | Protocolo | Dados |
|---------|-----------|-------|
| **Omie ERP** | REST/JSON | Financeiro, Contratos, Clientes |
| Clockify | REST | Timesheet |
| GLPI | REST | Chamados, Inventário |
| AWS/Azure/GCP | REST | Custos de cloud |
| Wazuh | REST | Alertas de segurança |
| LinkedIn | REST | Métricas de engajamento |
| DocuSign | REST | Assinaturas |

---

## Segurança

| Camada | Implementação |
|--------|---------------|
| Autenticação | Supabase Auth (SSO Google/Microsoft) |
| Autorização | Row Level Security (RLS) |
| Criptografia | TLS em trânsito, AES em repouso |
| Audit | Logs de todas as operações |
| Secrets | Supabase Vault |

---

## Custos Estimados

| Serviço | Plano | Custo/mês |
|---------|-------|-----------|
| Supabase | Pro | $25 |
| Vercel | Pro | $20 |
| Claude API | Pay-as-you-go | ~$50 |
| **Total MVP** | | **~$95/mês** |

---

## Documentação Detalhada

- [Visão Geral](docs/architecture/overview.md)
- [Diagramas](docs/architecture/diagrams.md)
- [Fluxo de Dados](docs/architecture/data-flow.md)
- [Inputs e Fontes](docs/architecture/inputs-sources.md)
- [Stack Supabase](docs/architecture/tech-stack-supabase.md)
- [Integração Omie](docs/integrations/omie-erp.md)
- [Especificação dos Agentes](docs/agents/agents-specification.md)
- [Modelo de Dados](docs/data-model/conceptual-model.md)

---

## Roadmap de Implementação

| Fase | Escopo | Prazo |
|------|--------|-------|
| **1** | Infraestrutura + ness.FIN (Omie sync) | 4 semanas |
| **2** | ness.OPS + integração FIN | 4 semanas |
| **3** | ness.GROWTH (propostas, precificação) | 4 semanas |
| **4** | ness.JUR + ness.GOV | 4 semanas |
| **5** | ness.PEOPLE + refinamentos | 4 semanas |

---

*Última atualização: Janeiro/2025*
