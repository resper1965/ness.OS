---
type: doc
name: glossary
description: Terms and concepts used in the project
category: reference
generated: 2026-01-29
status: filled
scaffoldVersion: "2.0.0"
---

# Glossário ness.OS

| Termo | Significado |
|-------|-------------|
| **ness.OS** | Sistema operacional de gestão empresarial baseado em agentes da aplicação |
| **Agentes da aplicação** | Os 10 agentes de negócio do produto (Vendas, Precificação, Marketing, Homogeneização, Mapeamento, Rentabilidade, Ciclo de Vida, Análise Contratual, Compliance, Correlação de Treinamento). Especificados em `docs/agents/agents-specification.md`. **Não confundir com** Playbooks AI. |
| **Playbooks AI** | Roles em `.context/agents/` para a IA que desenvolve o projeto (architect, backend, feature-developer, etc.). **Não são** os agentes da aplicação. |
| **ness.** | Empresa; sempre com ponto: "ness. Cybersecurity" |
| **ness.OS** | Produto; plataforma de gestão empresarial |
| **ness.GROWTH** | Módulo comercial e marketing (propostas, precificação, conteúdo) |
| **ness.OPS** | Módulo de operações (homogeneização, mapeamento de recursos) |
| **ness.FIN** | Módulo financeiro (rentabilidade, ciclo de vida, contratos) |
| **ness.JUR** | Módulo jurídico (análise contratual, riscos) |
| **ness.GOV** | Módulo de governança (compliance, aceites) |
| **ness.PEOPLE** | Módulo de talentos (treinamento, correlação com erros) |
| **Schema fin** | Implementado em `src/database/001_schema_fin.sql`. Tabelas fin.* usadas por sync-omie e pelo resto do ness.FIN. |
| **Schemas ops, growth, jur, gov, people, kb** | Planejados; migrations `002`–`007`. Ver `docs/plan-ajuste-schema-ao-projeto.md`. |
| **use-fin** | Hook `src/hooks/use-fin.ts`; `useContratos`, `useRentabilidade`, `useAlertas`, etc.; queries Supabase para `fin.*`. |
| **KB** | Knowledge Base; base de conhecimento com embeddings (RAG); schema `kb`, tabela `documentos` (planejada). |
| **RAG** | Retrieval-Augmented Generation; busca vetorial + LLM |
| **pgvector** | Extensão Postgres para vetores (embeddings) |
| **ness.Advisor, ness.Proposal, ness.Legal, ness.Mentor** | Nomes de agentes na UI; usar ness. prefix em texto para usuário |
| **rex.*** | Nomes internos dos agentes conversacionais (código, prompts, Edge Functions); ex: rex.fin, rex.ops |
| **Edge Functions** | Funções serverless Deno no Supabase; implementam os **agentes da aplicação** e webhooks |
| **RLS** | Row Level Security; autorização por linha no Postgres |
| **Overhead** | Percentual de custo indireto aplicado sobre receita |
