---
type: doc
name: glossary
description: Project terminology, type definitions, domain entities, and business rules
category: glossary
generated: 2026-01-30
status: filled
scaffoldVersion: "2.0.0"
---

# Glossário ness.OS

## Conceitos centrais

| Termo | Definição |
|-------|-----------|
| **ness.OS** | Plataforma central de gestão e inteligência corporativa da NESS. Atua como Sistema Nervoso Digital. |
| **ness.WEB** | Site institucional público — blog, soluções, carreiras, contato. Consome dados publicados pelo ness.OS. |
| **Sistema Nervoso Digital** | Metáfora: o ness.OS integra operação, finanças, jurídico, pessoas e comercial em um ecossistema auditável. |
| **Orquestrador de Negócios** | Transição de prestadora de serviços (esforço) para orquestradora (conhecimento padronizado, rentabilidade real). |

## Módulos

| Módulo | Foco |
|--------|------|
| **ness.DATA** | Camada de dados — ingestão e exposição de dados de fontes externas (Omie primeiro). Sync centralizado; consultas para FIN, OPS, GROWTH, PEOPLE. |
| **ness.GROWTH** | Inteligência comercial, marketing, DXP — Smart Proposals, Motor de Conteúdo, Chatbot RAG, Branding |
| **ness.OPS** | Gestão do conhecimento e operação — Engenharia de Processos (Playbooks), Ingestão de Indicadores, Mapeamento de Recursos |
| **ness.FIN** | CFO Digital — rentabilidade real, ciclo de vida de contratos, custos (consome dados ERP via ness.DATA) |
| **ness.JUR** | Jurídico e compliance — análise de contratos, conformidade legal (LGPD, Marco Civil) |
| **ness.GOV** | Governança corporativa — políticas internas, rastreabilidade de aceite |
| **ness.PEOPLE** | Talentos e ATS — recrutamento integrado, avaliação 360º, treinamento orientado por gaps |

## Termos técnicos

| Termo | Definição |
|-------|-----------|
| **Task** | Menor unidade de composição. Tarefa atômica dentro de um playbook. Deve ter ao menos uma **métrica de consumo**: temporal (estimated_duration_minutes) ou valor (estimated_value em R$). |
| **Playbook** | Conjunto ordenado de tasks; manual de procedimentos. Vinculado a serviços via services_playbooks (N:N). Deve ter ao menos uma métrica de consumo (temporal ou valor). |
| **Métrica de consumo** | Temporal (tempo estimado em minutos) ou valor (R$). Obrigatória em Task e Playbook para planejamento e precificação (OPS/FIN). |
| **Base de Conhecimento de Sucesso** | Contratos e escopos históricos validados; usados para gerar propostas via IA. |
| **RAG** | Retrieval-Augmented Generation — chatbot que consulta documentação real (playbooks, portfólio) sem alucinações. |
| **Trava de Catálogo** | Serviço ativo exige playbook associado; GROWTH vende apenas o que OPS documentou. |
| **AppPageHeader** | Header fixo da página no app (/app/*): título, subtítulo, ações; 64px; position: fixed, não some ao rolar. |
| **Layout do app** | Sidebar (ness.OS) 224px + área principal; header da página fixo; docs: LAYOUT-APP-HEADERS.md. |
