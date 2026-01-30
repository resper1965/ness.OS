# PRD Global: ness.OS + ness.WEB

| Metadado | Detalhe |
|----------|---------|
| **Produto** | Ecossistema NESS (OS Interno + Site Público) |
| **Versão** | 1.0 (MVP Integrado) |
| **Stack** | Next.js App Router (Front + API), Supabase (DB, Auth, Storage) |
| **Hospedagem** | Vercel (Serverless) |
| **Objetivo** | Criar uma plataforma única onde a operação interna alimenta automaticamente o site público, e o site público gera dados para o comercial interno. |

---

## 1. Visão de Arquitetura (Monorepo)

O projeto será uma única base de código Next.js, separada por **Rotas de Grupo**:

- **Rota Pública (site):** Acessível a qualquer visitante (www.ness.com.br). Otimizada para SEO (Static/ISR). Consome dados "publicados" do banco.
- **Rota Privada (app):** Acessível apenas via Login (app.ness.com.br). É o ness.OS. Renderizada via Client Components (CSR) para interatividade.

---

## 2. Permissões e Segurança (Supabase RLS)

A segurança é definida no nível do Banco de Dados (Postgres Row Level Security).

| Role | Acesso |
|------|--------|
| **Public (Anon)** | Pode ler Blog/Vagas ativos. Pode inserir em Leads. |
| **Admin / C-Level** | Acesso total (Leitura/Escrita). |
| **Sales** | Gerencia Leads, Catálogo e Publicações do Blog. |
| **Ops Lead** | Gerencia Playbooks e Métricas. |
| **Fin/Legal** | Gerencia Contratos e Documentos. |
| **Employee** | Visualiza Playbooks e Gaps de Treinamento. |

---

## 3. Requisitos Funcionais: O Site Público (ness.WEB)

O site funciona como "consumidor" dos dados gerados internamente.

### 3.1 Blog e Casos de Sucesso (CMS Headless)

| ID | Requisito |
|----|-----------|
| RF.WEB.01 | Listagem de artigos na rota `/blog` |
| RF.WEB.02 | Página de detalhe do artigo `/blog/[slug]` |

**Fonte de Dados:** Tabela `public_posts` (filtrando por `is_published = true`).

### 3.2 Carreiras (ATS Headless)

| ID | Requisito |
|----|-----------|
| RF.WEB.03 | Listagem de vagas abertas na rota `/carreiras` |
| RF.WEB.04 | Formulário de aplicação simples (Nome, Email, Link LinkedIn/CV) |

**Fonte de Dados:** Lê de `public_jobs` e Grava em `job_applications`.

### 3.3 Conversão (Leads)

| ID | Requisito |
|----|-----------|
| RF.WEB.05 | Formulário de contato em `/contato` e rodapés |

**Ação:** Grava na tabela `inbound_leads` e dispara notificação (opcional).

---

## 4. Requisitos Funcionais: O Sistema Interno (ness.OS)

### 4.1 Módulo ness.GROWTH (Comercial, Mkt & CMS)

**Gestão de Conteúdo (CMS):**

| ID | Requisito |
|----|-----------|
| RF.GRO.01 | Editor: Interface para escrever artigos (Markdown), upload de capa e definição de SEO (slug/meta-description) |
| RF.GRO.02 | Publicação: Botão Toggle "Publicar no Site". Ao ativar, o conteúdo aparece na rota pública imediatamente (via Supabase Realtime ou Revalidation) |

**Gestão de Leads (CRM de Entrada):**

| ID | Requisito |
|----|-----------|
| RF.GRO.03 | Kanban: Visualização dos leads capturados no site. Colunas: Novo, Em Análise, Qualificado, Descartado |

**Catálogo de Serviços (A Trava):**

| ID | Requisito |
|----|-----------|
| RF.GRO.04 | Cadastro de serviços vendáveis. Só permite salvar se vinculado a um `playbook_id` válido |

### 4.2 Módulo ness.OPS (Operação & Padrões)

| ID | Requisito |
|----|-----------|
| RF.OPS.01 | Playbooks: Gestão completa de manuais (Criar/Editar) |
| RF.OPS.02 | Upload de assets técnicos para bucket `os-assets` |
| RF.OPS.03 | Métricas: Formulário de input mensal de performance por contrato (Horas/SLA) |

### 4.3 Módulo ness.PEOPLE (RH & Vagas)

| ID | Requisito |
|----|-----------|
| RF.PEO.01 | Gestão de Vagas: Criar/Editar vaga (Título, Descrição, Departamento, Status Aberto/Fechado). Se Status = Fechado, a vaga some do site |
| RF.PEO.02 | Candidatos: Lista de pessoas que se aplicaram pelo site |
| RF.PEO.03 | Gestão de Gaps: Registro de falhas operacionais vinculadas a colaboradores para treinamento |

### 4.4 Módulo ness.FIN (Financeiro)

| ID | Requisito |
|----|-----------|
| RF.FIN.01 | Cadastro de Contratos (MRR, Datas) |
| RF.FIN.02 | Dashboard de Rentabilidade (View SQL: Receita - Custos Inputados) |

---

## 5. Estrutura de Dados (Schema Supabase)

### Conteúdo Público (Site consome)

```sql
table public_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  content_markdown text,
  seo_description text,
  cover_image text,
  is_published boolean default false,
  created_at timestamp default now()
);

table public_jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description_html text,
  department text,
  is_open boolean default true
);
```

### Entrada de Dados (Site escreve)

```sql
table inbound_leads (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  message text,
  status text default 'new', -- new, contacted, lost, won
  created_at timestamp default now()
);

table job_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public_jobs(id),
  candidate_name text,
  candidate_email text,
  linkedin_url text,
  created_at timestamp default now()
);
```

### Dados Internos (Apenas OS acessa)

- `playbooks` — Estrutura padrão
- `clients`
- `contracts`
- `operational_metrics`

### Regras RLS

| Tabela | Anon (Visitante) | Authenticated |
|--------|------------------|---------------|
| `public_posts` | Read WHERE is_published = true | All |
| `public_jobs` | Read WHERE is_open = true | All |
| `inbound_leads` | Insert | Select, Update |
| `job_applications` | Insert | Select, Update |

---

## 6. Stack Tecnológica & Bibliotecas

| Categoria | Tecnologia |
|-----------|------------|
| Framework | Next.js 14+ (App Router) |
| UI Kit | shadcn/ui (Radix + Tailwind) |
| Editor de Texto | TipTap ou MDXEditor |
| Formulários | React Hook Form + Zod |
| Renderização de PDF | @react-pdf/renderer |
| Ícones | Lucide React |

---

## 7. Roadmap de Desenvolvimento Unificado

### Sprint 1: Setup & Public Face (Valor Rápido)

- Configurar Next.js + Supabase
- Criar tabelas: `public_posts`, `public_jobs`, `inbound_leads`
- Site Institucional: Home, Sobre
- Página de Contato (gravando no banco)

### Sprint 2: O Motor de Conteúdo (Growth/CMS)

- Login em `/app/login`
- ness.GROWTH > Editor de Posts
- Blog do site conectado aos posts
- Kanban de Leads

### Sprint 3: Operação e Vendas (Core)

- ness.OPS > Playbooks
- ness.GROWTH > Catálogo de Serviços (com trava)
- ness.GROWTH > Propostas PDF

### Sprint 4: Pessoas e Financeiro

- ness.PEOPLE > Gestão de Vagas (conectar com `/carreiras`)
- ness.FIN > Contratos e Rentabilidade

---

## 8. Definição de Pronto (DoD) Fase 1

O sistema está pronto quando:

- [ ] Visitante anônimo lê um post no blog e envia formulário de contato
- [ ] Formulário de contato aparece no Kanban do time de vendas logado
- [ ] RH publica vaga no painel e ela aparece no site em tempo real
- [ ] Time financeiro vê contratos com prejuízo baseado nos inputs da operação
