# Arquitetura Técnica: ness.OS

**Stack:** Supabase + Vercel | Next.js App Router | TypeScript

---

## 1. Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| **Frontend & API** | Next.js (App Router) na Vercel |
| **Database & Auth** | PostgreSQL + Supabase Authentication |
| **Armazenamento** | Supabase Storage |
| **Linguagem** | TypeScript (obrigatório) |
| **UI** | Tailwind CSS + shadcn/ui |

**Layout do app:** Sidebar fixa + header da página fixo (não some ao rolar). Ver [LAYOUT-APP-HEADERS.md](./LAYOUT-APP-HEADERS.md) e [DESIGN-TOKENS.md](./DESIGN-TOKENS.md).

---

## 2. Estrutura do Banco de Dados (Supabase PostgreSQL)

### Tabela: `profiles` (Extensão do Auth)

Vincula dados de negócio ao usuário logado.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid, PK | Link com auth.users |
| full_name | text | |
| role | enum | admin, sales, ops_lead, cfo, legal, employee |
| avatar_url | text | |

### Tabela: `services_catalog` (Cofre do ness.GROWTH)

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid, PK | |
| name | text | |
| description | text | |
| base_price | numeric | |
| is_active | boolean | |
| playbook_id | uuid, FK → playbooks.id | **Trava:** só ativa se tiver playbook |

### Tabela: `playbooks` (Verdade do ness.OPS)

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid, PK | |
| title | text | |
| content_markdown | text | Conteúdo do manual |
| last_reviewed_at | timestamp | Para alertas de validade |
| version | int | |

### Tabela: `clients` (CRM Leve)

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid, PK | |
| company_name | text | |
| current_nps | int | Se < 7, trava upsell no frontend |
| status | enum | active, churned, prospect |

### Tabela: `contracts` (Coração do ness.FIN)

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid, PK | |
| client_id | uuid, FK | |
| mrr_value | numeric | Receita Recorrente |
| start_date | date | |
| renewal_date | date | Gatilho para alertas |
| readjustment_index | enum | IPCA, IGPM |

### Tabela: `performance_metrics` (Input Manual do ness.OPS)

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid, PK | |
| contract_id | uuid, FK | |
| month_year | date | Referência (ex: 01/2026) |
| hours_consumed | numeric | Recurso humano |
| cloud_cost | numeric | Custo AWS/Azure |
| sla_breached | boolean | Sinalizador de falha |

### Tabela: `training_gaps` (ness.PEOPLE)

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid, PK | |
| employee_id | uuid, FK | |
| detected_by | uuid, FK → profiles.id | Quem auditou |
| playbook_reference | uuid, FK | Qual processo falhou |
| status | enum | pending, trained |

---

## 3. Lógica de Segurança (Supabase RLS)

**Regra geral:** Ninguém acessa nada sem estar logado.

| Módulo | Regra RLS |
|--------|-----------|
| **ness.FIN** | Apenas `admin` e `cfo` podem SELECT em `contracts` e métricas financeiras |
| **ness.JUR** | Apenas `legal` e `admin` podem ver `legal_docs` |
| **ness.PEOPLE** | `employee` só vê seus próprios `training_gaps`; `ops_lead` vê gaps do time |
| **ness.GROWTH** | `sales` e `admin` gerencia catálogo e leads |
| **ness.OPS** | `ops_lead` e `admin` gerencia playbooks e métricas |

---

## 4. Implementação por Módulo

### ness.OPS (Editor & Wiki)

| Aspecto | Implementação |
|---------|---------------|
| **Editor** | react-markdown ou TipTap; salva em `playbooks.content_markdown` |
| **Uploads** | Imagens → bucket `public-assets` no Supabase Storage |

### ness.FIN (Cálculo e Alertas)

| Aspecto | Implementação |
|---------|---------------|
| **Rentabilidade** | Postgres View: `(contracts.mrr_value - performance_metrics.costs)`. Frontend só consulta a view. |
| **Alertas de Vencimento** | Edge Function + pg_cron: todo dia 08:00, verificar `renewal_date = hoje + 30d`, enviar email (Resend/SendGrid) |

### ness.JUR (Gestão de Documentos)

| Aspecto | Implementação |
|---------|---------------|
| **Armazenamento** | Bucket `legal-contracts` no Supabase Storage (privado) |
| **Download** | Signed URL gerada pelo backend; RLS verifica permissão antes de expor |

### ness.GROWTH (Propostas)

| Aspecto | Implementação |
|---------|---------------|
| **PDF** | @react-pdf/renderer no Next.js |
| **Lógica** | Frontend puxa cliente + serviço (catálogo) e renderiza PDF no navegador para download (sem servidor) |

---

## 5. Buckets Supabase Storage

| Bucket | Uso | Acesso |
|--------|-----|--------|
| public-assets | Imagens de playbooks | Público (leitura) |
| legal-contracts | Documentos jurídicos | Privado (Signed URL) |

---

## 6. Fluxo de Dados Resumido

```
Auth (Supabase) → profiles (role)
                        ↓
         ┌──────────────┼──────────────┐
         ↓              ↓              ↓
    ness.FIN      ness.OPS      ness.GROWTH
    contracts     playbooks     services_catalog
    performance_  public-assets inbound_leads
    metrics
         ↓              ↓              ↓
    ness.PEOPLE   training_gaps  Propostas PDF
    (employee)
```
