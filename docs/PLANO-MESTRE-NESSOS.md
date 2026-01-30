# Plano Mestre — ness.OS

> Documento consolidado que reúne todas as decisões, planos iniciais e estratégias do projeto ness.OS.

**Última atualização:** 2025-01-29

---

## 1. Visão Executiva

### 1.1 O que é o ness.OS

Sistema de gestão empresarial inteligente da **ness.** (34 anos em cybersecurity), centralizando operações, finanças, comercial, jurídico, governança e pessoas em uma plataforma unificada com IA.

### 1.2 Objetivo estratégico

- **Produto:** ness.OS — plataforma única de gestão
- **Empresa:** ness. — marca com ponto (`ness.`)
- **Integração:** Site institucional (corp-site-ness) absorvido pelo ness.OS; painel administrativo único; deploy unificado
- **Sucesso:** Projeto funcional com módulos ness.FIN, ness.OPS, ness.GROWTH, ness.JUR, ness.GOV, ness.PEOPLE; site em ness.com.br; admin em app.ness.com.br

---

## 2. Decisões Estratégicas Consolidadas

### 2.1 Integração com Site Institucional

| Decisão | Detalhe |
|---------|---------|
| **Centralização** | Todo admin do site migra para ness.OS; site torna-se consumidor read-only |
| **Estrutura** | Monorepo Turborepo: `apps/site` (páginas públicas imutáveis) + `apps/admin` (ness.OS) |
| **Supabase único** | jagerqrvcdraxkuqkrip (ness.OS); migrar dados do site dcigykpfdehqbtbaxzak |
| **Deploy** | ness.com.br → apps/site; app.ness.com.br → apps/admin |
| **Páginas imutáveis** | Copiar corp-site-ness sem refatorar; preservar Pages Router, theme, componentes |
| **Corp-site-ness** | Repositório arquivado após migração completa |

### 2.2 Distribuição de Recursos por Módulo

| Módulo | Recursos do site | Rotas | Schema |
|--------|------------------|-------|--------|
| **ness.PEOPLE** | Vagas, templates, candidaturas, stakeholders | `/people/jobs` | `people.*` |
| **ness.GROWTH** | Blog, knowledge, verticals, products, markets, branding, media, analytics, IA | `/growth/*` | `growth.*` |
| **ness.OPS** | Processes (process-areas, extract, approve), ncirt | `/ops/processes`, `/ops/ncirt` | `ops.*` |
| **Admin** | Users, approvals | `/admin/users` | `public.*` |

### 2.3 IA e Geração de Conteúdo

- **Centralização:** Todo uso de IA e geração de conteúdo é feito pelo ness.OS (ness.GROWTH)
- **Gestão de vagas:** ness.PEOPLE (recrutamento = talentos)
- **Branding:** ness.GROWTH (manual de marca, assets, identidade visual)
- **Chatbot:** API/Edge Function do ness.OS; site consome

### 2.4 Branding ness.

| Regra | Aplicação |
|-------|-----------|
| Empresa | `ness.` (com ponto) |
| Produto | `ness.OS` |
| Módulos | `ness.FIN`, `ness.OPS`, `ness.GROWTH`, `ness.JUR`, `ness.GOV`, `ness.PEOPLE` |
| Agentes UI | ness.Advisor, ness.Proposal, ness.Legal, ness.Mentor |
| Agentes código | `rex.fin`, `rex.ops`, `rex.growth` |
| Domínios | app.ness.com.br, ness.com.br |
| Cor primária | `#00ade8` (ness-cyan) |
| Fonte | Montserrat |

### 2.5 Stack e Infraestrutura

- **Frontend:** Next.js 14, TypeScript, Radix UI, Tailwind
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Realtime, Edge Functions)
- **Deploy:** Vercel (região gru1)
- **Integrações:** Omie ERP (implementado), Clockify, GLPI, AWS/GCP (planejados)
- **IA:** Claude API, pgvector (planejado)

---

## 3. Arquitetura Unificada

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                         ness.OS — Projeto único (monorepo)                            │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  apps/site/                         apps/admin/                                       │
│  ├── pages/ (imutáveis)             ├── src/app/                                      │
│  │   blog, jobs, services,          │   dashboard, fin, ops, growth,                  │
│  │   contact, about...              │   jur, gov, people, admin/users                 │
│  ├── components/, lib/, theme/      └── (ness.OS)                                     │
│  └── api/ (blog, jobs, contact, chatbot)                                              │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  Supabase (jagerqrvcdraxkuqkrip)                                                     │
│  Schemas: fin | public (RBAC) | growth | people | ops | jur | gov | kb                │
└─────────────────────────────────────────────────────────────────────────────────────┘
         │                                    │
         ▼                                    ▼
   ness.com.br                          app.ness.com.br
   (Site público)                       (Painel admin)
```

### 3.1 Módulos e Agentes IA

| Módulo | Descrição | Agente | Escopo expandido (site) |
|--------|-----------|--------|--------------------------|
| **FIN** | Gestão Financeira | rex.fin | — |
| **OPS** | Operações e Recursos | rex.ops | processes, ncirt |
| **GROWTH** | Comercial e Marketing | rex.growth | blog, knowledge, IA, branding, media, analytics |
| **JUR** | Jurídico e Contratos | rex.jur | — |
| **GOV** | Governança e Compliance | rex.gov | — |
| **PEOPLE** | RH e Talentos | rex.people | vagas, candidaturas |
| **KB** | Knowledge Base | rex.kb | RAG, chatbot |
| **MASTER** | Orquestrador | rex.master | — |

---

## 4. Roadmap Unificado

### 4.1 Visão geral das fases

| Fase | Duração | Foco | Entregáveis |
|------|---------|------|-------------|
| **0** | 1 sem | Fundação | Infraestrutura, CI/CD, Auth, RBAC |
| **1** | 4 sem | ness.FIN | Dashboard, Omie, contratos, rentabilidade, alertas |
| **2** | 4 sem | ness.OPS | Dashboards, timesheet, recursos, GLPI, custos cloud |
| **3** | 3 sem | ness.GROWTH | Pipeline, propostas, CRM + épicos integração site |
| **4** | 3 sem | ness.JUR + ness.GOV | Contratos jurídicos, compliance, documentos |
| **5** | 3 sem | ness.PEOPLE | Colaboradores, avaliações, treinamentos, **vagas (P.1)** |
| **6** | 2 sem | Agentes IA | rex.fin, rex.ops, rex.growth, rex.master |
| **7** | 2 sem | Polish | Mobile, performance, testes |
| **M0–M5** | ~7 sem | Integração site | Monorepo, migração dados, épicos G.1–G.7, O.1 |

**Total estimado:** ~22 semanas (desenvolvimento base) + 7 semanas (integração site) = **~29 semanas**

### 4.2 Sobreposição integração site

A integração do site (fases M0–M5) pode ser executada **em paralelo ou após** as fases 2–3, utilizando os épicos P.1, G.1–G.7 e O.1. O roadmap sugere:

- **M0–M1:** Após Fase 2 (OPS) — monorepo e migração de dados
- **M2–M3:** Durante/além Fase 3–5 — épicos de conteúdo e vagas
- **M4–M5:** Antes ou durante Fase 7 — deploy integrado, validação

---

## 5. Épicos Consolidados

### 5.1 Desenvolvimento base (DEVELOPMENT_PLAN)

| Fase | Épicos | Status |
|------|--------|--------|
| 0 | 0.1 Infraestrutura, 0.2 Auth/RBAC | Parcial (Supabase, Vercel, login, RBAC) |
| 1 | 1.1–1.5 Dashboard, Omie, Contratos, Rentabilidade, Alertas | Parcial (1.1, 1.2) |
| 2 | 2.1–2.6 OPS completo | Pendente |
| 3 | 3.1–3.3 Pipeline, Propostas, CRM | Pendente |
| 4 | 4.1–4.3 JUR, GOV | Pendente |
| 5 | 5.1–5.3 Colaboradores, Avaliações, Treinamentos | Pendente |
| 6 | 6.1–6.5 Agentes rex.* | Pendente |
| 7 | 7.1–7.3 Mobile, Performance, Testes | Pendente |

### 5.2 Épicos da integração site

| Épico | Módulo | Duração | Entregáveis |
|-------|--------|---------|-------------|
| **P.1** | ness.PEOPLE | 4 dias | Vagas, templates, candidaturas, `/people/jobs` |
| **G.1** | ness.GROWTH | 5 dias | CMS Blog (posts, categorias, traduções, TipTap) |
| **G.2** | ness.GROWTH | 4 dias | Base de Conhecimento (ingestão, embeddings, RAG) |
| **G.3** | ness.GROWTH | 3 dias | Serviços e Verticais |
| **G.4** | ness.GROWTH | 3 dias | Produtos e Mercados |
| **G.5** | ness.GROWTH | 3 dias | Branding (manual, assets, identidade) |
| **G.6** | ness.GROWTH | 5 dias | IA e Geração de Conteúdo (ai-gateway, generate-*, chatbot) |
| **G.7** | ness.GROWTH | 2 dias | Media e Analytics |
| **O.1** | ness.OPS | 3 dias | Processes, NCIRT (`/ops/processes`, `/ops/ncirt`) |

### 5.3 Migração site (M0–M5)

| Fase | Descrição | Duração |
|------|-----------|---------|
| M0 | Setup monorepo Turborepo | 1 sem |
| M1 | Copiar site, migrar schema e dados | 1 sem |
| M2 | P.1, G.1–G.4 | 3 sem |
| M3 | G.5–G.7, O.1 | 2 sem |
| M4 | Deploy integrado | 1 sem |
| M5 | Testes, documentação, arquivar corp-site-ness | 1 sem |

---

## 6. Schemas e Dados

### 6.1 Implementado

- **fin:** clientes, contratos, receitas, despesas, rentabilidade, alertas, sync_log
- **public:** profiles, user_permissions, audit_log (RBAC)
- **Supabase:** jagerqrvcdraxkuqkrip

### 6.2 Planejados (migrations)

| Schema | Tabelas principais | Observação |
|--------|--------------------|------------|
| ops | recursos_consumidos, erros_operacionais | + processes, ncirt (integração site) |
| growth | propostas, casos_sucesso | + blog, knowledge, products, markets, brand (integração site) |
| people | avaliacoes | + job_openings, job_applications (integração site) |
| jur | analises | |
| gov | politicas, aceites | |
| kb | documentos (vector) | RAG, embeddings |

---

## 7. Planos Vinculados

| Plano | Caminho | Foco |
|-------|---------|------|
| **Desenvolvimento** | [DEVELOPMENT_PLAN](DEVELOPMENT_PLAN.md) | 30 épicos, user stories, critérios de aceite |
| **Implementação** | [plan-implementacao-epicos-ai-context](plan-implementacao-epicos-ai-context.md) | Mapeamento épicos ↔ Playbooks AI, workflow |
| **Integração site** | [plan-integracao-nessos-site-institucional](plan-integracao-nessos-site-institucional.md) | Admin→módulos, migração, preservação visual |
| **Schema** | [plan-ajuste-schema-ao-projeto](plan-ajuste-schema-ao-projeto.md) | Migrations ops, growth, jur, gov, people, kb |
| **Branding** | [plan-ness-branding-ai-context](plan-ness-branding-ai-context.md) | Convenções ness., AI-context, Cursor rules |
| **GitHub** | [plan-github-integracao-ai-context](plan-github-integracao-ai-context.md) | Pull → planos → .context |
| **Deploy** | [plan-deploy-vercel-etapa1](plan-deploy-vercel-etapa1.md) | Vercel, env vars, domínios |
| **Workflow mestre** | [.context/plans/ness-os-desenvolvimento](../.context/plans/ness-os-desenvolvimento.md) | Consolidado PREVC, task snapshot |

### 7.1 Referências técnicas

- [DATABASE_SCHEMA](DATABASE_SCHEMA.md) — Modelo completo
- [ARCHITECTURE](ARCHITECTURE.md) — Visão em camadas
- [docs/modules/](modules/) — Especificação por módulo (fin, ops, growth, jur, gov, people)
- [docs/agents/agents-specification](agents/agents-specification.md) — Agentes rex.*
- [setup-mcp-supabase](setup-mcp-supabase.md) — Configuração Supabase MCP

---

## 8. Workflow e AI-Context

### 8.1 Playbooks AI

| Playbook | Responsabilidade |
|----------|------------------|
| architect-specialist | Decisões de arquitetura, padrões cross-cutting |
| database-specialist | Schemas, migrations, RLS, pgvector |
| backend-specialist | Edge Functions, APIs, integrações |
| frontend-specialist | UI, páginas, componentes |
| feature-developer | Implementar features, orquestrar backend+frontend |
| devops-specialist | CI/CD, Vercel, Supabase, domínios |
| security-auditor | Auth, RBAC, RLS, compliance |
| documentation-writer | Atualizar docs após cada fase |

### 8.2 AI-Context (.context/)

- **docs/:** architecture, data-flow, project-overview, ness-branding, glossary, development-workflow, tooling, security
- **agents/:** Playbooks por especialidade
- **plans/:** ness-os-desenvolvimento (vinculado ao workflow PREVC)

### 8.3 Fluxo por épico

1. **Início:** Architect (se mudança estrutural); consultar DEVELOPMENT_PLAN e agents-specification
2. **Durante:** Lead usa playbook; auxiliares sob demanda; Conventional Commits
3. **Fim:** Marcar tasks; validar critérios; code-review; atualizar docs
4. **Fim de fase:** context getMap + buildSemantic; atualizar plan-github-novos-passos

---

## 9. Checklist Mestre

### 9.1 Infraestrutura

- [ ] Supabase configurado (jagerqrvcdraxkuqkrip)
- [ ] Vercel linkado (ness-os), env vars (Supabase, Omie)
- [ ] Domínios: app.ness.com.br, ness.com.br
- [ ] Monorepo Turborepo (quando iniciar integração site)

### 9.2 Desenvolvimento base

- [ ] Fase 0 completa (Auth, RBAC, domínio)
- [ ] Fase 1 completa (FIN)
- [ ] Fases 2–7 conforme DEVELOPMENT_PLAN

### 9.3 Integração site

- [ ] M0: Monorepo, apps/site, apps/admin
- [ ] M1: Migração dados, RLS
- [ ] M2–M3: Épicos P.1, G.1–G.7, O.1
- [ ] M4: Deploy ness.com.br + app.ness.com.br
- [ ] M5: Arquivar corp-site-ness

### 9.4 Documentação

- [ ] ARCHITECTURE.md atualizado
- [ ] DATABASE_SCHEMA.md com schemas growth, people
- [ ] .context/docs e agents alinhados
- [ ] Planos vinculados no workflow mestre

---

## 10. Glossário Rápido

| Termo | Significado |
|-------|-------------|
| ness. | Empresa (marca com ponto) |
| ness.OS | Produto / plataforma de gestão |
| ness.FIN, ness.OPS, etc. | Módulos do sistema |
| rex.* | Agentes IA (código interno) |
| ness.Advisor, ness.Proposal | Agentes na UI |
| apps/site | Site institucional (corp-site-ness migrado) |
| apps/admin | ness.OS (painel de gestão) |

---

*Este plano mestre é a referência única para alinhamento estratégico. Planos detalhados permanecem em seus arquivos específicos.*
