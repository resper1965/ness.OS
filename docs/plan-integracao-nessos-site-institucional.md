# Plano: Integrar ness.OS ao Site Institucional

## Objetivo

**Centralizar toda a capacidade administrativa** do site institucional (corp-site-ness) no ness.OS, tornando o site um **consumidor read-only** de conteúdo. O ness.OS passa a ser o **único painel de gestão** da NESS, com sinergia natural entre necessidades de marketing, conteúdo e operações.

**Princípios:**
1. Integrar **sem perder as características visuais atuais** do site (ver §11).
2. **Páginas existentes permanecem imutáveis** — copiadas tal qual para dentro do projeto ness.OS.
3. **As páginas passam a fazer parte deste projeto** — ness.OS é o repositório único.
4. **Futuro:** O site será publicado pelo ness.OS; corp-site-ness será descontinuado.
5. **Integração completa** — um projeto, um Supabase, deploy unificado.
6. **IA e geração de conteúdo** — todo uso de IA e geração de conteúdo é feito pelo ness.OS (ness.GROWTH). **Gestão de vagas** é feita pelo ness.PEOPLE. O site apenas consome e exibe.
7. **Branding** — manual de marca, assets e identidade visual integram ao ness.GROWTH.

---

## 1. Visão Conceitual

### Estado atual

```
┌─────────────────────────────────────┐     ┌─────────────────────────────────────┐
│  corp-site-ness (Site Institucional) │     │           ness.OS                   │
├─────────────────────────────────────┤     ├─────────────────────────────────────┤
│  • Conteúdo público (blog, jobs...)  │     │  • Dashboard financeiro             │
│  • Admin blog, jobs, KB, users       │     │  • Admin usuários (RBAC)            │
│  • Chatbot, analytics                │     │  • FIN, OPS (estrutura)             │
│  • Supabase dcigykpfdehqbtbaxzak     │     │  • Supabase jagerqrvcdraxkuqkrip    │
└─────────────────────────────────────┘     └─────────────────────────────────────┘
         Dois sistemas isolados
```

### Estado desejado — Integração completa

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                    ness.OS — Projeto único (repositório único)                        │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  Estrutura monorepo (Turborepo):                                                     │
│                                                                                      │
│  apps/site/                    apps/admin/                                           │
│  ├── pages/ (imutáveis)        ├── src/app/                                          │
│  │   ├── index.js              │   ├── dashboard, fin, ops, growth, etc.            │
│  │   ├── blog.js, blog/[slug]  │   └── auth, admin/users                            │
│  │   ├── jobs, services...     └── (ness.OS atual)                                   │
│  │   └── contact, about...                                                           │
│  ├── components/ (preservados)                                                       │
│  ├── lib/ (blogAPI, jobsAPI...)                                                      │
│  └── theme/ (theme.json, DESIGN_SYSTEM)                                              │
│                                                                                      │
│  Supabase único (jagerqrvcdraxkuqkrip) | Dados migrados do site                      │
└─────────────────────────────────────────────────────────────────────────────────────┘
                    │
    ┌───────────────┴───────────────┐
    ▼                               ▼
ness.com.br                 app.ness.com.br
(Site público)              (Painel admin)
Publicado pelo ness.OS      Publicado pelo ness.OS
apps/site                   apps/admin

Futuro: corp-site-ness (repo) → arquivado
```

---

## 2. Estrutura do Projeto — Páginas como Parte do ness.OS

### 2.1 Regra: páginas imutáveis

As páginas públicas existentes do corp-site-ness são **copiadas para o ness.OS** sem alteração de código. Imutáveis = sem refatoração, sem migração de framework (Pages Router permanece), sem mudança de componentes ou estilos.

### 2.2 Opção de estrutura: monorepo Turborepo

```
ness.OS/
├── apps/
│   ├── site/                 # Site institucional (ex corp-site-ness, só público)
│   │   ├── pages/            # Copiado de corp-site-ness (imutável)
│   │   │   ├── index.js
│   │   │   ├── blog.js, blog/[slug].js
│   │   │   ├── jobs.js, jobs/[slug]/
│   │   │   ├── services.js, verticals.js, products.js
│   │   │   ├── contact.js, about.js
│   │   │   ├── api/          # Apenas APIs públicas (blog, jobs, contact, chatbot)
│   │   │   └── ...
│   │   ├── components/
│   │   ├── lib/
│   │   ├── theme/
│   │   ├── public/
│   │   └── package.json
│   │
│   └── admin/                # ness.OS (atual src/ movido)
│       ├── src/app/
│       └── ...
├── packages/
│   └── shared/               # Supabase client, tipos, utils comuns
├── package.json              # Workspace root
└── turbo.json
```

### 2.3 Alternativa: pasta única com route groups

Se preferir evitar Turborepo, o Next.js pode hospedar ambos em um único app com route groups:
- `src/app/(admin)/` — dashboard, fin, ops, growth (App Router)
- `src/app/(site)/` — converter páginas do site para App Router (mais trabalho; quebra imutabilidade)

**Recomendação:** Turborepo mantém imutabilidade — apps/site preserva Pages Router do corp-site-ness intacto.

### 2.4 Deploy

- **ness.com.br** → Vercel project apontando para `apps/site`
- **app.ness.com.br** → Vercel project apontando para `apps/admin`
- Ou: um único deploy com rewrites por domínio (Vercel multi-domain)

---

## 3. Princípios Arquiteturais

### 3.1 Separação de responsabilidades

| Camada | Responsável | Responsabilidade |
|--------|-------------|------------------|
| **ness.OS** | Único admin | CRUD de todo conteúdo, usuários, configurações; **todo uso de IA**; **geração de conteúdo** (blog, etc.); **gestão de vagas** (ness.PEOPLE); **branding** (ness.GROWTH) |
| **Site** | Consumidor | Leitura via Supabase (anon), exibição pública. Chatbot consome API do ness.OS ou Edge Function. |
| **Supabase** | Backend único | PostgreSQL, Auth, Storage, RLS por schema/tabela |

### 3.2 Supabase único

- **Projeto principal:** jagerqrvcdraxkuqkrip (ness.OS)
- **Migração:** Dados do site (dcigykpfdehqbtbaxzak) → jagerqrvcdraxkuqkrip
- **Schemas sugeridos:**
  - `fin` — Financeiro (existente)
  - `public` — Auth, profiles, user_permissions, audit (RBAC existente)
  - `growth` — Conteúdo: blog, knowledge, services, verticals, products, markets, branding, media
  - `people` — Vagas: job_openings, job_applications, job_templates (recrutamento)

### 3.3 Auth unificado

- **auth.users** único — usuários do ness.OS = usuários do site (admin)
- **profiles** — Perfis com role, module_permissions (compatível com site)
- Site não autentica usuários externos; chatbot pode usar anon ou API key

---

## 3. Mapeamento: Admin do Site → Módulos ness.OS

**Regra:** Cada recurso do painel administrativo do site é agregado ao **módulo ness.OS que melhor representa o domínio** — vagas em ness.PEOPLE, conteúdo em ness.GROWTH, ncirt em ness.OPS, etc.

### 3.1 Matriz Admin → Módulo

| Área admin site | Rota destino ness.OS | Módulo | Justificativa |
|-----------------|----------------------|--------|---------------|
| `/admin/jobs` | `/people/jobs` | **ness.PEOPLE** | Recrutamento = talentos |
| `/admin/jobs/templates` | `/people/jobs/templates` | ness.PEOPLE | Templates de vagas |
| `/admin/jobs/[id]/applications` | `/people/jobs/[id]/applications` | ness.PEOPLE | Candidaturas, stakeholders, comentários |
| `/admin/blog` | `/growth/blog` | ness.GROWTH | Conteúdo de marketing |
| `/admin/blog/categories` | `/growth/blog/categories` | ness.GROWTH | Categorização |
| `/admin/knowledge` | `/growth/knowledge` | ness.GROWTH | Base de conhecimento (RAG) |
| `/admin/knowledge/ingest` | `/growth/knowledge/ingest` | ness.GROWTH | Ingestão de documentos |
| `/admin/verticals` | `/growth/verticals` | ness.GROWTH | Verticais de mercado |
| `/admin/products` | `/growth/products` | ness.GROWTH | Catálogo de produtos |
| `/admin/markets` | `/growth/markets` | ness.GROWTH | Mercados |
| `/admin/brand-manual`, `/admin/branding` | `/growth/brand` | ness.GROWTH | Identidade visual |
| `/admin/media` | `/growth/media` | ness.GROWTH | Assets e mídia |
| `/admin/analytics` | `/growth/analytics` | ness.GROWTH | Métricas do site |
| `/admin/ai-gateway` | `/growth/ia` | ness.GROWTH | Configuração IA |
| `/api/ai/*`, `/api/chatbot` | APIs/Edge Functions ness.OS | ness.GROWTH | Geração de conteúdo, RAG |
| `/admin/processes` | `/ops/processes` | ness.OPS | Engenharia de processos |
| `/admin/ncirt` | `/ops/ncirt` | ness.OPS | Resposta a incidentes |
| `/admin/users`, `/admin/users/approvals` | `/admin/users` | Admin | Já existe no ness.OS |
| `/admin/dashboard` | Dashboard principal | — | Existente |
| `/admin/auth/*` | — | — | Removido; usar auth ness.OS |

### 3.2 Por módulo — Recursos agregados

| Módulo | Recursos do site agregados |
|--------|----------------------------|
| **ness.PEOPLE** | Vagas (job_openings), templates, candidaturas, stakeholders, comentários |
| **ness.GROWTH** | Blog, knowledge, verticals, products, markets, branding, media, analytics, IA (ai-gateway, generate-*, chatbot) |
| **ness.OPS** | Processes (process-areas, extract, approve, refine), ncirt |
| **Admin** | Users, approvals (existente) |

### 3.3 Sinergia por módulo

**ness.PEOPLE** ([docs/modules/people.md](modules/people.md)):
- Foco em talentos, avaliações 360º, treinamentos, PDI
- **Novo:** Recrutamento — vagas, candidaturas, pipeline de talentos (site institucional como canal de divulgação)

**ness.GROWTH** ([docs/modules/growth.md](modules/growth.md)):
- Marketing de conteúdo, geração de artigos, IA
- **Novo:** CMS blog, knowledge, verticals, produtos, mercados, branding, media, analytics, ai-gateway

**ness.OPS** ([docs/modules/ops.md](modules/ops.md)):
- Engenharia de processos, mapeamento de recursos
- **Novo:** Processes (admin do site), ncirt (resposta a emergências)

---

## 4. Arquitetura de Dados (Schema)

### 4.1 Opção A: Schema `growth` no Supabase do ness.OS

```
growth.blog_posts
growth.blog_categories
growth.blog_category_translations
people.job_openings
people.job_opening_translations
people.job_departments
people.job_applications
growth.services
growth.service_translations
growth.verticals
growth.vertical_translations
growth.knowledge_base
growth.document_embeddings
growth.products
growth.markets
...
```

**Prós:** Isolamento claro; RLS por schema.  
**Contras:** Migração de ~70 tabelas; refactor de queries no site.

### 4.2 Opção B: Manter `public` com prefixo de domínio

```
public.site_blog_posts
public.site_services
...
public.fin_* (ou manter fin schema separado)
```

**Prós:** Menos alteração no site (apenas troca de URL/keys).  
**Contras:** Nomenclatura menos limpa.

### 4.3 Recomendação

- **Fase 1:** Migrar tabelas do site para o Supabase do ness.OS no schema `public`, com convenção `site_*` ou sem prefixo se não conflitar com `profiles`, `user_permissions`, etc.
- **Fase 2 (opcional):** Criar schema `growth` e mover tabelas de conteúdo para lá, com views/materialized views para compatibilidade.
- **RLS:** Políticas por tabela — `anon` para leitura pública (blog, jobs, services); `authenticated` + role para escrita (admin no ness.OS).

---

## 6. Conteúdo do Site (apps/site) — Imutável

### 6.1 O que permanece (páginas públicas)

| Funcionalidade | Descrição |
|----------------|-----------|
| Páginas públicas | Home, Sobre, Serviços, Verticais, Blog, Vagas, Contato |
| Blog (leitura) | Listagem, post por slug, categorias — via `blogAPI` |
| Jobs (leitura) | Listagem, vaga por slug — via `jobsAPI` |
| Serviços (leitura) | Listagem, serviço por slug — via `servicesAPI` |
| Verticais (leitura) | Listagem, vertical por slug — via `verticalsAPI` |
| Contato | Formulário → `contact_submissions` (insert anon permitido) |
| Newsletter | Inscrição → `newsletter_subscriptions` |
| Chatbot | RAG em knowledge_base + blog — **chama API/Edge Function do ness.OS** (gestão de IA centralizada) |
| SEO | `seo_metadata` |
| i18n | PT, EN, ES |
| Analytics | Google Analytics, Vercel Analytics |

### 6.2 O que é removido (não copiado)

- Toda a pasta `/pages/admin/*`
- Rotas `/api/admin/*` (ou redirecionam para ness.OS)
- Páginas de login/signup do site — redirect para `app.ness.com.br/auth/login`
- Hooks `useAuth`, `usePermissions` no contexto do site (ou delegam a ness.OS se SSO)

### 6.3 Consumo de dados

O site passa a usar **apenas**:
- `NEXT_PUBLIC_SUPABASE_URL` = URL do Supabase do ness.OS
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon key do ness.OS
- Queries read-only (select) nas tabelas de conteúdo
- RLS garante que `anon` só lê o que é público (status published, etc.)

---

## 7. Novos Épicos no ness.OS (por módulo)

### ness.PEOPLE

#### Epic P.1: Gestão de Vagas (ex-admin jobs)
**Duração:** 4 dias  
**Entregáveis:** CRUD job_openings, templates, candidaturas, stakeholders, comentários. Rota `/people/jobs`. Schema `people` (job_openings consumido pelo site).

### ness.GROWTH

#### Epic G.1: CMS Blog (ex-admin blog do site)
**Duração:** 5 dias  
**Entregáveis:** CRUD blog_posts, categorias, traduções, editor TipTap, agendamento, preview

#### Epic G.2: Base de Conhecimento (ex-admin knowledge)
**Duração:** 4 dias  
**Entregáveis:** Ingestão PDF/DOCX/TXT/MD, extração texto, embeddings pgvector, categorização

#### Epic G.3: Serviços e Verticais (ex-admin services/verticals)
**Duração:** 3 dias  
**Entregáveis:** CRUD services, verticals, use_cases, resources, traduções

#### Epic G.4: Produtos e Mercados
**Duração:** 3 dias  
**Entregáveis:** CRUD products, markets, verticais de mercado

#### Epic G.5: Branding (integrado ao ness.GROWTH)
**Duração:** 3 dias  
**Entregáveis:** Manual de marca, brand_assets, brand_downloads, configurações de identidade; integração com theme/theme.json; gestão de identidade visual

#### Epic G.6: IA e Geração de Conteúdo
**Duração:** 5 dias  
**Entregáveis:** ai-gateway (config, logs, stats); generate-post, generate-job, generate-image, improve-content; chatbot (RAG); Edge Functions ou APIs para LLM (Groq/OpenAI)

#### Epic G.7: Media e Analytics do Site
**Duração:** 2 dias  
**Entregáveis:** Upload Storage; dashboard analytics (site_interactions, analytics_events), integração GA

### ness.OPS

#### Epic O.1: Processes e NCIRT (ex-admin processes, ncirt)
**Duração:** 3 dias  
**Entregáveis:** Rotas `/ops/processes`, `/ops/ncirt`; migração de process-areas, extract, approve, refine; ncirt emergencies, settings

---

## 8. Estratégia de Migração

### 8.1 Fases

| Fase | Descrição | Duração |
|------|-----------|---------|
| **M0** | Planejamento + setup monorepo (Turborepo, apps/site, apps/admin) | 1 semana |
| **M1** | Copiar site para apps/site; migrar schema e dados → Supabase ness.OS | 1 semana |
| **M2** | Implementar P.1 (vagas), G.1–G.4 (blog, KB, services, produtos) | 3 semanas |
| **M3** | Implementar G.5–G.7 (branding, IA, media, analytics), O.1 (processes, ncirt) | 2 semanas |
| **M4** | Deploy integrado; validar ness.com.br e app.ness.com.br | 1 semana |
| **M5** | Testes E2E, documentação, arquivar corp-site-ness | 1 semana |

### 8.2 Ordem de execução sugerida

1. **M0** — Configurar monorepo Turborepo (apps/site, apps/admin, packages/shared).
2. **M1.1** — Copiar páginas públicas do corp-site-ness para `apps/site/` (imutáveis).
3. **M1.2** — Criar migrations no ness.OS com estrutura das tabelas do site; migrar dados.
4. **M1.3** — Configurar RLS; alterar env de `apps/site` para Supabase ness.OS.
5. **M2** — Desenvolver admin no ness.OS (`apps/admin`) sob `/people/*`, `/growth/*`, `/ops/*`.
6. **M3** — Deploy: ness.com.br → apps/site; app.ness.com.br → apps/admin.
7. **M4** — Validar site e admin; arquivar corp-site-ness.

### 8.3 Riscos e mitigação

| Risco | Mitigação |
|-------|-----------|
| Perda de dados | Backup completo antes da migração; ambiente de staging |
| Downtime do site | Migrar em janela de baixo tráfego; feature flag para troca de Supabase |
| Incompatibilidade de schema | Mapear diferenças (blog_post_translations vs estrutura atual); migrations incrementais |
| Chatbot quebra | Manter document_embeddings e knowledge_base; testar RAG no novo contexto |
| Auth de usuários admin | Migrar auth.users do site para ness.OS ou re-convidar |

---

## 9. Sinergia e AI-Context

### 9.1 Playbooks AI envolvidos

| Playbook | Papel na integração |
|----------|---------------------|
| **architect-specialist** | Decisões de schema, RLS, convenções growth vs fin |
| **database-specialist** | Migrations, mapeamento tabelas site → ness.OS |
| **backend-specialist** | Edge Functions (chatbot, IA), APIs de geração de conteúdo, ingestão |
| **frontend-specialist** | Páginas /people/jobs, /growth/*, /ops/*; simplificação do site |
| **feature-developer** | Implementar épicos P.1, G.1–G.7, O.1 |
| **devops-specialist** | CI/CD, env vars, domínios (ness.com.br vs app.ness.com.br) |
| **documentation-writer** | Atualizar ARCHITECTURE, DATABASE_SCHEMA, planos |

### 9.2 Atualizações no AI-Context

- **`.context/docs/architecture.md`** — Adicionar diagrama site ↔ ness.OS, schema growth.
- **`.context/docs/data-flow.md`** — Fluxo: ness.OS (admin) → Supabase → site (leitura).
- **`.context/docs/project-overview.md`** — Mencionar integração com site institucional.
- **`.context/agents/frontend-specialist.md`** — Responsabilidades em /growth/blog, jobs, etc.
- **`.context/agents/feature-developer.md`** — Padrões para migrar features do site.
- **`docs/plan-implementacao-epicos-ai-context.md`** — Incluir P.1, G.1–G.7, O.1.
- **`docs/modules/people.md`** — Expandir com recrutamento (vagas).
- **`docs/modules/growth.md`** — Expandir com CMS, KB, produtos (sem vagas).

### 9.3 Preservação visual (AI-context)

Ao implementar a integração, **não alterar** as características visuais do site:
- Manter theme, tailwind.config, animações, Framer Motion do corp-site-ness
- Integração = troca de Supabase + remoção de /admin; **não** refatorar componentes visuais do site
- Ver §11 (Preservação das Características Visuais)

### 9.4 Benefícios da sinergia

- **Um único código base** para admin — menos duplicação.
- **Dados unificados** — blog e cases alimentam o Agente de Marketing (rex.growth).
- **RBAC único** — permissions em um só lugar.
- **Deploy simplificado** — site e ness.OS compartilham Supabase; menos configuração.
- **AI-context alinhado** — playbooks sabem que growth = conteúdo + comercial.

---

## 10. Checklist de Execução

### Pré-requisitos
- [ ] Definir Supabase final (jagerqrvcdraxkuqkrip)
- [ ] Backup completo do Supabase do site
- [ ] Ambiente de staging para testes
- [ ] Domínios: ness.com.br (site), app.ness.com.br (ness.OS)

### Monorepo e inclusão do site
- [ ] Configurar Turborepo (package.json workspaces, turbo.json)
- [ ] Criar apps/site com estrutura do corp-site-ness (páginas públicas apenas)
- [ ] Copiar pages/, components/, lib/, theme/, public/ (imutáveis)
- [ ] Criar apps/admin (mover src/ atual do ness.OS)
- [ ] Criar packages/shared (Supabase client, tipos)

### Migração de dados
- [ ] Exportar schema e dados do site (dcigykpfdehqbtbaxzak)
- [ ] Criar migrations no ness.OS para tabelas do site
- [ ] Importar dados
- [ ] Configurar RLS
- [ ] Validar integridade

### ness.OS (admin) — por módulo
- [ ] Epic P.1: Gestão de Vagas (ness.PEOPLE)
- [ ] Epic G.1–G.7: Blog, KB, serviços, produtos, branding, IA, media/analytics (ness.GROWTH)
- [ ] Epic O.1: Processes e NCIRT (ness.OPS)

### Site (apps/site)
- [ ] Configurar env NEXT_PUBLIC_SUPABASE_* para Supabase ness.OS
- [ ] Garantir que /admin não existe (não copiado)
- [ ] Testar blog, jobs, services, verticais, contato, chatbot
- [ ] Deploy ness.com.br → apps/site
- [ ] Arquivar repositório corp-site-ness

### Documentação
- [ ] Atualizar ARCHITECTURE.md
- [ ] Atualizar DATABASE_SCHEMA.md
- [ ] Atualizar .context/docs e agents
- [ ] Vincular este plano ao workflow PREVC

---

## 11. Preservação das Características Visuais do Site

### 11.1 Princípio

**O ness.OS integra o site existente sem perder as características visuais atuais.** O site institucional possui identidade visual consolidada (Design System NESS) que deve ser preservada na integração.

### 11.2 Inventário de características a preservar

| Categoria | Característica | Fonte (corp-site-ness) |
|-----------|----------------|------------------------|
| **Tipografia** | Montserrat (font-weight 400, 500, 600, 700) | tailwind, theme/theme.json |
| **Cor primária** | #00ade8 (primary 500) | Paleta completa 50–900 |
| **Cor secundária** | #008bb8 | Hover, gradientes |
| **Background** | Dark slate (#0f172a, #1e293b, #1a1f28) | theme.json, globals |
| **Animações** | fadeInUp, slideDown, float, scrollBounce, scaleIn | tailwind.config keyframes |
| **Efeitos** | Glass (blur, border), gradientes | theme.json effects |
| **Espaçamentos** | py-20/16/12, gap-4/6/8, container 1200px | DESIGN_SYSTEM.md |
| **Componentes** | Botões, cards, hero, seções | components/ |
| **Framer Motion** | Transições fluidas em páginas | pages/, components/ |
| **i18n** | PT, EN, ES | next-i18next |

### 11.3 Estratégia de preservação

**Site como apps/site no monorepo ness.OS**

- O **site** é copiado para `apps/site/` dentro do projeto ness.OS — **páginas imutáveis**.
- Mantém 100% do design atual: theme, tailwind.config, components, Framer Motion.
- Integração de **dados** (Supabase do ness.OS) — troca de env vars.
- **Não copiar** `/pages/admin/*` — admin vive em `apps/admin` (ness.OS).
- ness.com.br publica `apps/site`; app.ness.com.br publica `apps/admin`.

**Vantagens:** Um repositório; imutabilidade das páginas; integração completa.

**Tokens e design:**
- `theme/theme.json` do site permanece em `apps/site/theme/`.
- Keyframes e animações preservados no tailwind de `apps/site`.
- Framer Motion mantido nas páginas do site.

### 11.4 Alinhamento visual ness.OS ↔ Site

O ness.OS **já alinha** parcialmente ao site:

- `tailwind.config.ts`: primary #00ade8, Montserrat, ness.cyan
- [plan-ness-branding-ai-context](plan-ness-branding-ai-context.md): convenções ness.

**Gaps a preencher** (se unificar ou harmonizar):

- Paleta primary completa (50–900) — site tem; ness.OS tem apenas DEFAULT.
- Keyframes do site (fadeInUp, slideDown, float, etc.) — adicionar ao ness.OS se houver preview de conteúdo do site.
- Efeitos glass/gradient — opcional para páginas growth que espelham o site.

### 11.5 Checklist de preservação visual

- [ ] Site mantém tailwind.config.js, theme/, DESIGN_SYSTEM.md inalterados
- [ ] Site mantém Framer Motion e animações atuais
- [ ] Site mantém Montserrat e paleta primary 50–900
- [ ] Componentes do site (Header, Footer, Hero, etc.) não são refatorados na integração
- [ ] Apenas troca de env (Supabase) e remoção de /admin — sem mudança de UI
- [ ] Se preview no ness.OS: adotar tokens do theme.json do site

---

## 12. Referências

- [DEVELOPMENT_PLAN](DEVELOPMENT_PLAN.md) — Épicos originais
- [plan-implementacao-epicos-ai-context](plan-implementacao-epicos-ai-context.md) — Ordem de execução
- [modules/growth](modules/growth.md) — ness.GROWTH atual
- [DATABASE_SCHEMA](DATABASE_SCHEMA.md) — Schema fin e RBAC
- corp-site-ness: https://github.com/resper1965/corp-site-ness
- Design System site: corp-site-ness/docs/DESIGN_SYSTEM.md, theme/theme.json
- Supabase site: dcigykpfdehqbtbaxzak
- Supabase ness.OS: jagerqrvcdraxkuqkrip
