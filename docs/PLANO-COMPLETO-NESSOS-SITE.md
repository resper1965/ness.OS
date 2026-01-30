# Plano Completo: Criação do ness.OS com Site Institucional

**Versão:** 1.0  
**Referências:** [PRD Global](PRD-GLOBAL-NESSOS-NESSWEB.md) | [Arquitetura Técnica](ARQUITETURA-TECNICA-NESSOS.md) | [Migração Site Legacy](PLANO-MIGRACAO-SITE-LEGACY.md)

---

## 1. Visão Geral

### 1.1 Objetivo

Criar o **ecossistema ness.OS + ness.WEB** em uma única base de código Next.js App Router, onde:

- **ness.WEB (site público):** Consome dados publicados do banco; otimizado para SEO e conversão
- **ness.OS (sistema interno):** Gerencia conteúdo, leads, operação, vendas, RH e financeiro
- **Fluxo:** Operação interna → alimenta site público → site público → gera leads/dados para comercial

### 1.2 Stack

| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Supabase (PostgreSQL, Auth, Storage, Realtime) |
| Deploy | Vercel (Serverless) |
| UI | Lucide React, TipTap/MDXEditor, React Hook Form + Zod |

### 1.3 Rotas de Grupo

| Rota | Path | Acesso |
|------|------|--------|
| **Site** | `src/app/(site)/` | Público (SEO, Static/ISR) |
| **App** | `src/app/app/` | Autenticado (Dashboard ness.OS) |

---

## 2. Roadmap em Sprints

### Sprint 1: Setup & Face Pública (✅ Parcial)

| # | Tarefa | Status |
|---|--------|--------|
| 1.1 | Next.js + Supabase + Tailwind configurados | ✅ |
| 1.2 | Tabelas: profiles, services_catalog, public_posts, inbound_leads | ✅ |
| 1.3 | Layout site: Header, Footer, tema NESS (design tokens) | ✅ |
| 1.4 | Home, Sobre, Contato (formulário Server Action) | ✅ |
| 1.5 | Rotas: solucoes, solucoes/[slug] (services_catalog) | ✅ |
| 1.6 | Migração visual do site legacy (componentes, cores) | ⏳ |

### Sprint 2: Site Completo & Motor de Conteúdo

| # | Tarefa | Status |
|---|--------|--------|
| 2.1 | Componentes reutilizáveis: HeroSection, FeatureGrid, CTABanner, ProseContent | ✅ |
| 2.2 | Extender services_catalog com content_json (migration 002) | ✅ |
| 2.3 | Rotas dinâmicas: blog/[slug], legal/[slug] | ✅ |
| 2.4 | Tabela static_pages (migration 002) | ✅ |
| 2.5 | Migrar conteúdo de locales (pt/en) → SQL INSERT | ⏳ |
| 2.6 | Login em /app/login (Supabase Auth) | ✅ |
| 2.7 | ness.GROWTH: Editor de Posts (RF.GRO.01, RF.GRO.02) | ✅ |
| 2.8 | ness.GROWTH: Kanban de Leads (RF.GRO.03) | ✅ |
| 2.9 | Conectar blog do site a public_posts | ✅ |

### Sprint 3: Operação e Vendas (Core)

| # | Tarefa | Status |
|---|--------|--------|
| 3.1 | ness.OPS: Playbooks (RF.OPS.01) — CRUD, editor Markdown | ✅ |
| 3.2 | ness.OPS: Upload assets para bucket os-assets (RF.OPS.02) | ✅ |
| 3.3 | ness.OPS: Input de métricas por contrato (RF.OPS.03) | ✅ |
| 3.4 | ness.GROWTH: Catálogo de Serviços com trava playbook_id (RF.GRO.04) | ✅ |
| 3.5 | ness.GROWTH: Propostas PDF (@react-pdf/renderer) | ✅ |
| 3.6 | Tabelas: playbooks, clients, contracts, performance_metrics | ✅ |

### Sprint 4: Pessoas e Financeiro

| # | Tarefa | Status |
|---|--------|--------|
| 4.1 | Tabelas: public_jobs, job_applications, training_gaps | ✅ |
| 4.2 | ness.PEOPLE: Gestão de Vagas (RF.PEO.01) | ✅ |
| 4.3 | ness.PEOPLE: Lista de Candidatos (RF.PEO.02) | ✅ |
| 4.4 | ness.PEOPLE: Gaps de Treinamento (RF.PEO.03) | ✅ |
| 4.5 | Rota pública /carreiras + formulário de candidatura | ✅ |
| 4.6 | ness.FIN: Cadastro de Contratos (RF.FIN.01) | ✅ |
| 4.7 | ness.FIN: Dashboard Rentabilidade (RF.FIN.02) | ✅ |
| 4.8 | View SQL: rentabilidade = mrr - custos | ✅ |

---

## 3. Schema de Banco Consolidado

### 3.1 Tabelas Públicas (Site consome)

| Tabela | Uso |
|--------|-----|
| public_posts | Blog, casos de sucesso |
| public_jobs | Vagas em /carreiras |
| services_catalog | Soluções em /solucoes/[slug] |
| static_pages | Páginas legais (/privacidade, /termos) |

### 3.2 Entrada de Dados (Site escreve)

| Tabela | Uso |
|--------|-----|
| inbound_leads | Formulário de contato |
| job_applications | Candidaturas em /carreiras |

### 3.3 Dados Internos (ness.OS)

| Tabela | Módulo |
|--------|--------|
| profiles | Auth, roles |
| playbooks | ness.OPS |
| services_catalog | ness.GROWTH |
| clients, contracts | ness.FIN |
| performance_metrics | ness.OPS / ness.FIN |
| training_gaps | ness.PEOPLE |

### 3.4 Extensões Necessárias

```sql
-- services_catalog: conteúdo completo para páginas de serviço
alter table public.services_catalog add column if not exists content_json jsonb;

-- static_pages: páginas legais
create table public.static_pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  seo_description text,
  content_json jsonb not null,
  last_updated date,
  created_at timestamp default now()
);
```

---

## 4. Componentes do Site (Blocos de Lego)

| Componente | Descrição | Uso |
|------------|-----------|-----|
| HeroSection | Título, subtítulo, CTA | Serviços, Sobre |
| ContentBlock | Título + parágrafos | Por que importa |
| FeatureGrid | Grid de cards com ícone | Recursos |
| UseCasesGrid | Cards casos de uso | Serviços |
| MetricsGrid | Valores em destaque | Serviços |
| ProcessSteps | Lista numerada | Serviços |
| CTABanner | Faixa gradiente NESS | Conversão |
| ProseContent | HTML/Markdown estilizado | Blog, Legais |

---

## 5. Rotas Finais (ness.WEB + ness.OS)

### Site Público (ness.WEB)

| Rota | Página |
|------|--------|
| `/` | Home |
| `/sobre` | Sobre |
| `/contato` | Contato |
| `/solucoes` | Listagem soluções |
| `/solucoes/[slug]` | Página de solução |
| `/produtos` | Listagem produtos |
| `/produtos/[slug]` | Página de produto |
| `/blog` | Listagem posts |
| `/blog/[slug]` | Post |
| `/carreiras` | Vagas |
| `/carreiras/[slug]/candidatar` | Formulário candidatura |
| `/legal/[slug]` | Privacidade, Termos, LGPD |

### Sistema Interno (ness.OS)

| Rota | Módulo |
|------|--------|
| `/app` | Dashboard |
| `/app/login` | Login |
| `/app/growth/posts` | CMS Blog |
| `/app/growth/leads` | Kanban Leads |
| `/app/growth/services` | Catálogo Serviços |
| `/app/growth/propostas` | Propostas PDF |
| `/app/ops/playbooks` | Playbooks |
| `/app/ops/metricas` | Métricas |
| `/app/people/vagas` | Vagas |
| `/app/people/candidatos` | Candidatos |
| `/app/fin/contratos` | Contratos |
| `/app/fin/rentabilidade` | Dashboard Rentabilidade |

---

## 6. Definição de Pronto (DoD)

O MVP está pronto quando:

- [x] Visitante anônimo lê post no blog e envia contato
- [x] Contato aparece no Kanban de vendas (logado)
- [x] RH publica vaga e ela aparece em /carreiras
- [x] Financeiro vê contratos com prejuízo (baseado em inputs da operação)
- [x] Site visualmente fiel ao legacy (tema NESS)
- [x] Build `npm run build` sem erros
- [ ] Deploy na Vercel funcional

---

## 7. Documentos Vinculados

| Documento | Conteúdo |
|-----------|----------|
| [PRD-GLOBAL-NESSOS-NESSWEB.md](PRD-GLOBAL-NESSOS-NESSWEB.md) | Requisitos funcionais, schema, RLS |
| [ARQUITETURA-TECNICA-NESSOS.md](ARQUITETURA-TECNICA-NESSOS.md) | Stack, tabelas internas, RLS por módulo |
| [PLANO-MIGRACAO-SITE-LEGACY.md](PLANO-MIGRACAO-SITE-LEGACY.md) | Taxonomia, rotas dinâmicas, extração de locales |
| [SETUP-INICIAL.md](SETUP-INICIAL.md) | Estrutura de pastas, SQL, variáveis |

---

## 8. Checklist de Execução

### Fase Atual: Sprint 2

- [ ] Criar HeroSection, FeatureGrid, CTABanner
- [ ] Aplicar migration content_json em services_catalog
- [ ] Criar static_pages + migration
- [ ] Implementar solucoes/[slug] com template completo
- [ ] Implementar blog/[slug] com public_posts
- [ ] Implementar legal/[slug] com static_pages
- [ ] Configurar Supabase Auth (login)
- [ ] ness.GROWTH: Editor de Posts
- [ ] ness.GROWTH: Kanban de Leads
