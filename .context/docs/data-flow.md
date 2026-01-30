---
type: doc
name: data-flow
description: Data models, APIs, pipelines, and external sources
category: architecture
generated: 2026-01-29
status: filled
scaffoldVersion: "2.0.0"
---

# Fluxo de dados do ness.OS

## Fluxos principais

### 1. OPS → FIN → GROWTH (precificação)

- **OPS:** horas, licenças, cloud por contrato → **FIN:** custo real, overhead → **GROWTH:** preço sugerido, margem.
- Dados: recursos consumidos (diário/mensal), custo por contrato (sob demanda).
- **Hoje:** FIN implementado (Omie sync → fin.*); **Auth/RBAC** (`AuthContext`, `profiles`, `user_permissions`, RPC `get_my_permissions`; `middleware` protege rotas); **frontend** em `src/app/` (auth/login, admin/users; dashboard, fin/*, ops/*, growth, jur, gov, people) usa `src/lib/supabase/client.ts` e `server.ts`; **dashboard** consome dados reais via `useDashboardKPIs`, `useFluxoCaixa`, `useRentabilidade`, `useAlertas`; demais páginas fin usam `src/hooks/use-fin.ts`; `src/components/auth/guards` protege por role. OPS/GROWTH schemas dependem de migrations futuras.

### 2. OPS → PEOPLE (aprendizado)

- Erros operacionais → classificação → **PEOPLE** (correlação colaborador) → treinamento recomendado → feedback para OPS.

### 3. OPS → GROWTH (marketing)

- Casos de sucesso → KB Comercial → Agente Marketing → posts (LinkedIn, etc.) e monitoramento de engajamento.

### 4. FIN → alertas (ciclo de vida)

- Vigências, índices → Agente Ciclo de Vida → alertas (renovação 90/60/30d, reajuste, inadimplência) → e-mail, dashboard, webhooks.

### 5. JUR ↔ contratos

- Novo contrato (PDF/DOCX) → **ness.JUR** → análise NLP → parecer, riscos (SLA, multas, LGPD, rescisão, PI).

### 6. GOV → colaboradores

- Políticas/NDA → **ness.GOV** → distribuição → aceites com registro (data, IP, versão, assinatura).

## Tabelas principais

- **fin (implementado):** clientes, contratos, categorias, receitas, despesas, rentabilidade, alertas, configuracoes, sync_log. Views: vw_rentabilidade_cliente, vw_contratos_vencendo, vw_fluxo_caixa. Ordem em [001_schema_fin.sql](../../src/database/001_schema_fin.sql).
- **RBAC (implementado):** `profiles`, `user_permissions`, `audit_log`; roles: superadmin, adm-area, user-area; RPC `get_my_permissions`. Ver [001_rbac_schema.sql](../../supabase/migrations/001_rbac_schema.sql) e [DATABASE_SCHEMA](../../docs/DATABASE_SCHEMA.md).
- **ops, growth, jur, gov, people, kb (planejados):** recursos_consumidos, erros_operacionais; propostas, casos_sucesso; analises; aceites; avaliacoes; documentos (RAG). Definidos em [conceptual-model](../../docs/data-model/conceptual-model.md) e [plan-ajuste-schema](../../docs/plan-ajuste-schema-ao-projeto.md); migrations futuras.

## Site Institucional → ness.OS

Integração completa: site como apps/site no projeto ness.OS (monorepo). Páginas públicas imutáveis; admin em apps/admin. Recursos do admin agregados por módulo: **people.*** (vagas), **growth.*** (blog, knowledge, IA, branding, media), **ops.*** (processes, ncirt). ness.com.br publica apps/site; app.ness.com.br publica apps/admin. Dados em Supabase único; RLS garante anon read. Ver [plan-integracao-nessos-site-institucional](../../docs/plan-integracao-nessos-site-institucional.md).

## Integrações

- Omie (REST): financeiro, contratos, clientes.
- Clockify, GLPI, AWS/Azure/GCP, Wazuh, LinkedIn, DocuSign (conforme docs).
