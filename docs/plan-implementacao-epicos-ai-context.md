# Plano: Implementar todos os épicos (AI-context)

## Objetivo

Executar a implementação dos **30 épicos** do [DEVELOPMENT_PLAN](DEVELOPMENT_PLAN.md) em sequência por fases, usando os **Playbooks AI** (`.context/agents/`) e o **AI-context** para manter consistência e criar um projeto funcional.

**Referência:** [docs/DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md) — User Stories, Tasks e Critérios de Aceite por épico.

---

## 1. Mapeamento Epics ↔ Playbooks AI

| Playbook AI | Épicos principais | Responsabilidade |
|-------------|-------------------|------------------|
| **architect-specialist** | Todos (início de fase) | Decisões de arquitetura, padrões cross-cutting, alinhamento entre módulos |
| **database-specialist** | 0.1, 1.2, 2.1–2.6, 3.1, 4.1–4.3, 5.1, 6.1 | Schemas, migrations, RLS, pgvector |
| **backend-specialist** | 0.1, 1.2, 2.2, 2.4, 2.5, 3.3, 6.1–6.5 | Edge Functions, APIs, integrações |
| **frontend-specialist** | 0.2, 1.1, 1.3–1.5, 2.1, 2.3, 2.4, 3.1–3.2, 4.1–4.3, 5.1–5.3, 6.2–6.5 | UI, páginas, componentes |
| **feature-developer** | Todos | Implementar features conforme specs; orquestrar backend+frontend |
| **devops-specialist** | 0.1, 7.2, 7.3 | CI/CD, Vercel, Supabase, domínio, testes em pipeline |
| **security-auditor** | 0.2, 4.2 | Auth, RBAC, RLS, compliance |
| **test-writer** | 7.3 (e transversal) | Unit tests, e2e, cálculos críticos |
| **mobile-specialist** | 7.1 | Responsividade, PWA |
| **performance-optimizer** | 7.2 | Performance, cache, Lighthouse |
| **documentation-writer** | Transversal | Atualizar docs após cada fase |
| **code-reviewer** | Transversal | Revisar PRs/commits |
| **bug-fixer** | Sob demanda | Correções |

---

## 2. Ordem de execução por fase

### Fase 0 — Fundação (1 semana)

| Ordem | Epic | Lead | Playbooks auxiliares | Entregáveis |
|-------|------|------|----------------------|-------------|
| 1 | 0.1 Infraestrutura Base | devops | architect, database, backend | Supabase + schema FIN, Vercel CI/CD, env |
| 2 | 0.2 Autenticação e Autorização | frontend + security | database, backend | Login, middleware, RBAC, admin users |

**Estado atual:** 0.1 parcial (Supabase fin, Vercel, sync-omie); 0.2 parcial (login, AuthContext, guards, RBAC schema). Completar: domínio, monitoramento; OAuth Google; reset senha; convite.

---

### Fase 1 — ness.FIN (4 semanas)

| Ordem | Epic | Lead | Playbooks auxiliares | Entregáveis |
|-------|------|------|----------------------|-------------|
| 1 | 1.1 Dashboard Financeiro | frontend | database, feature | KPIs, gráficos, filtros, export PDF/Excel |
| 2 | 1.2 Integração Omie ERP | backend | database, devops | sync-omie completo, cron, webhooks, logs, botão manual |
| 3 | 1.3 Gestão de Contratos | frontend | database, backend | Detalhes, alertas, reajuste IGPM/IPCA, audit, anexos |
| 4 | 1.4 Análise de Rentabilidade | frontend + database | backend | Rentabilidade por contrato, custos, alertas margem |
| 5 | 1.5 Central de Alertas FIN | frontend | backend, database | Job alertas, filtros, resolver, email, config |

**Estado atual:** 1.1 dashboard com dados reais (use-fin); 1.2 sync-omie + botão manual no dashboard; 1.3–1.5 estrutura de páginas. AuthProvider no layout.

---

### Fase 2 — ness.OPS (4 semanas)

| Ordem | Epic | Lead | Playbooks auxiliares | Entregáveis |
|-------|------|------|----------------------|-------------|
| 1 | 2.1 Dashboard Operacional | frontend | database | Schema OPS, KPIs, gráficos, SLA |
| 2 | 2.2 Integração Timesheet | backend | database, frontend | sync-clockify, tabelas timesheet, classificação, aprovação |
| 3 | 2.3 Gestão de Recursos | frontend | database | recursos, custo/hora, alocação, bench, skills |
| 4 | 2.4 Integração GLPI | backend | database, frontend | sync-glpi, chamados, SLA, alertas |
| 5 | 2.5 Custos de Infraestrutura | backend | database, frontend | AWS/GCP, rateio, tendência, alertas budget |
| 6 | 2.6 Integração OPS → FIN | backend | database | Consolidação custos, alocação, rentabilidade real |

---

### Fase 3 — ness.GROWTH (3 semanas)

| Ordem | Epic | Lead | Playbooks auxiliares | Entregáveis |
|-------|------|------|----------------------|-------------|
| 1 | 3.1 Pipeline Comercial | frontend | database | Schema GROWTH, oportunidades, kanban, forecast |
| 2 | 3.2 Gerador de Propostas | frontend | backend | Catálogo, precificação, templates, PDF, versionamento |
| 3 | 3.3 Integração CRM | backend | database, frontend | sync-omie-crm, leads, interações, origem |

---

### Fase 4 — ness.JUR + ness.GOV (3 semanas)

| Ordem | Epic | Lead | Playbooks auxiliares | Entregáveis |
|-------|------|------|----------------------|-------------|
| 1 | 4.1 Gestão de Contratos Jurídicos | frontend | database, backend | Schema JUR, upload, alertas prazos, busca, IA cláusulas |
| 2 | 4.2 Compliance e Políticas | frontend + security | database | Schema GOV, frameworks, controles, gaps, PAM |
| 3 | 4.3 Gestão de Documentos | frontend | database, backend | Storage, versionamento, aprovação, busca, leitura obrigatória |

---

### Fase 5 — ness.PEOPLE (3 semanas)

| Ordem | Epic | Lead | Playbooks auxiliares | Entregáveis |
|-------|------|------|----------------------|-------------|
| 1 | 5.1 Cadastro de Colaboradores | frontend | database | Schema PEOPLE, CRUD, histórico, férias, headcount |
| 2 | 5.2 Avaliação de Desempenho | frontend | database | Ciclos, metas, autoavaliação, 9-box |
| 3 | 5.3 Desenvolvimento e Treinamentos | frontend | database | Treinamentos, inscrições, certificações, alertas, PDI |

---

### Fase 6 — Agentes IA rex.* (2 semanas)

| Ordem | Epic | Lead | Playbooks auxiliares | Entregáveis |
|-------|------|------|----------------------|-------------|
| 1 | 6.1 Infraestrutura de IA | backend | database | Claude API, pgvector, embeddings, conversas, tokens |
| 2 | 6.2 rex.fin | backend | frontend | Prompt, tools, chat, anomalias, previsões |
| 3 | 6.3 rex.ops | backend | frontend | Prompt, tools, alocação, alertas |
| 4 | 6.4 rex.growth | backend | frontend | Prompt, propostas IA, precificação |
| 5 | 6.5 rex.master | backend | frontend | Roteamento, briefing, priorização |

---

### Fase 7 — Polish (2 semanas)

| Ordem | Epic | Lead | Playbooks auxiliares | Entregáveis |
|-------|------|------|----------------------|-------------|
| 1 | 7.1 Mobile Responsivo | mobile | frontend | Responsividade, PWA, push |
| 2 | 7.2 Performance e Otimização | performance | frontend, backend | React Query, lazy loading, Lighthouse |
| 3 | 7.3 Testes e Qualidade | test-writer | devops | Jest, Playwright, GitHub Actions |

---

## 3. Workflow AI-context por épico

### 3.1 Início de cada épico

1. **Architect** (se mudança estrutural): validar decisões de arquitetura.
2. **Consultar** [DEVELOPMENT_PLAN](DEVELOPMENT_PLAN.md) para User Stories, Tasks e Critérios de Aceite.
3. **Consultar** [docs/agents/agents-specification](agents/agents-specification.md) se for criar/alterar **agente da aplicação** (Edge Function rex.* ou similar).
4. **workflow-init** (PREVC) para épicos não triviais.

### 3.2 Durante implementação

- **Lead** usa seu playbook; **auxiliares** sob demanda.
- Seguir convenções em [.context/docs/](.context/) (architecture, data-flow, development-workflow).
- Commits em Conventional Commits.

### 3.3 Ao concluir cada épico

1. Marcar Tasks concluídas no DEVELOPMENT_PLAN (ou checklist local).
2. Validar Critérios de Aceite.
3. **code-reviewer** (opcional): revisar antes de merge.
4. **documentation-writer**: atualizar docs afetados.

### 3.4 Ao concluir cada fase

1. **context getMap** — atualizar mapa do codebase.
2. **context buildSemantic** (documentation + compact).
3. Atualizar [plan-github-novos-passos-integracao](plan-github-novos-passos-integracao.md) com artefatos da fase.
4. Rodar [plan-github-integracao-ai-context](plan-github-integracao-ai-context.md) se houver push no GitHub.

---

## 4. Checklist de execução (por fase)

### Fase 0
- [ ] 0.1: Supabase, schema FIN, Vercel, env, domínio (P1), monitoramento (P2)
- [ ] 0.2: Login, middleware, RBAC, admin users, OAuth (P1), reset senha (P1), convite (P1)

### Fase 1
- [ ] 1.1: Dashboard com dados reais, KPIs, gráficos, filtros, export
- [ ] 1.2: sync-omie completo, cron, webhooks, logs, sync manual
- [ ] 1.3: Contratos detalhes, alertas, reajuste, audit, anexos
- [ ] 1.4: Rentabilidade, custos, alertas margem
- [ ] 1.5: Central alertas, filtros, resolver, email, config

### Fase 2
- [ ] 2.1–2.6: OPS completo (dashboards, timesheet, recursos, GLPI, custos cloud, OPS→FIN)

### Fase 3
- [ ] 3.1–3.3: GROWTH completo (pipeline, propostas, CRM)

### Fase 4
- [ ] 4.1–4.3: JUR + GOV completo

### Fase 5
- [ ] 5.1–5.3: PEOPLE completo

### Fase 6
- [ ] 6.1–6.5: IA rex.* completo

### Fase 7
- [ ] 7.1–7.3: Mobile, performance, testes

---

## 5. Dependências e pré-requisitos

- **Omie:** API Key e Secret configurados (Supabase + Vercel).
- **Supabase:** Projeto ativo; schemas `fin` e RBAC aplicados.
- **Vercel:** Projeto ness-os linkado; env vars configuradas.
- **Clockify, GLPI, AWS/GCP:** Credenciais quando iniciar Fase 2.
- **Claude API:** Key quando iniciar Fase 6.

---

## 6. Referências

- [Plano mestre (workflow)](../.context/plans/ness-os-desenvolvimento.md) — consolidado com todos os planos; vinculado ao workflow PREVC
- [DEVELOPMENT_PLAN](DEVELOPMENT_PLAN.md) — fonte de verdade dos épicos
- [DATABASE_SCHEMA](DATABASE_SCHEMA.md) — modelo completo
- [plan-ajuste-schema-ao-projeto](plan-ajuste-schema-ao-projeto.md) — migrations
- [docs/agents/agents-specification](agents/agents-specification.md) — agentes da aplicação
- [docs/context-separation](context-separation.md) — agentes vs Playbooks
- [.context/agents/](../.context/agents/) — Playbooks AI
