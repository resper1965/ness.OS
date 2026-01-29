# ness.OS

**Sistema de gestão empresarial inteligente para empresas de serviços**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

---

## 🎯 Visão Geral

O ness.OS é uma plataforma modular que integra gestão financeira, operacional, comercial, jurídica, governança e pessoas em um único sistema, potencializado por agentes de IA especializados.

### Módulos

| Módulo | Descrição | Status |
|--------|-----------|--------|
| **FIN** | Contratos, receitas, despesas, rentabilidade | ✅ MVP |
| **OPS** | Horas, recursos, SLA, monitoramento | 🔨 Planejado |
| **GROWTH** | Propostas, precificação, pipeline | 🔨 Planejado |
| **JUR** | Contratos, compliance, análise jurídica | 🔨 Planejado |
| **GOV** | Políticas, auditorias, documentação | 🔨 Planejado |
| **PEOPLE** | PDI, OKRs, performance, 1:1s | 🔨 Planejado |

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com)
- Credenciais do [Omie ERP](https://developer.omie.com.br/)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/resper1965/ness.OS.git
cd ness.OS

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
```

Edite `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
```

### Setup do Banco de Dados

1. Acesse o Supabase Dashboard → SQL Editor
2. Execute o arquivo `src/database/001_schema_fin.sql`
3. Configure os secrets (Settings → Edge Functions):
   - `OMIE_APP_KEY`
   - `OMIE_APP_SECRET`

### Deploy da Edge Function

```bash
# Instale o Supabase CLI
npm install -g supabase

# Login
supabase login

# Deploy
supabase functions deploy sync-omie --project-ref SEU_PROJECT_REF
```

### Rodar localmente

```bash
npm run dev
```

Acesse: http://localhost:3000

---

## 📁 Estrutura do Projeto

```
ness.OS/
├── src/
│   ├── app/                    # Páginas (Next.js App Router)
│   │   ├── dashboard/          # Dashboard principal
│   │   ├── fin/                # Módulo Financeiro
│   │   │   ├── contratos/
│   │   │   ├── rentabilidade/
│   │   │   └── alertas/
│   │   ├── ops/                # Módulo Operações
│   │   ├── growth/             # Módulo Comercial
│   │   ├── jur/                # Módulo Jurídico
│   │   ├── gov/                # Módulo Governança
│   │   └── people/             # Módulo Pessoas
│   ├── components/
│   │   ├── layout/             # Sidebar, Header
│   │   ├── ui/                 # Card, Badge, etc
│   │   └── modules/            # KPI Card, etc
│   ├── hooks/                  # React hooks (useContratos, etc)
│   ├── lib/                    # Supabase client, utils
│   └── types/                  # TypeScript types
├── docs/                       # Documentação
│   ├── architecture/
│   ├── modules/
│   ├── agents/
│   └── integrations/
└── src/
    ├── database/               # SQL schemas
    └── supabase/
        └── functions/          # Edge Functions
```

---

## 🔗 Integrações

### Implementadas
- **Omie ERP** - Sync de clientes, contratos, receitas, despesas

### Planejadas
- Clockify/Toggl (timesheet)
- GLPI (chamados)
- AWS/Azure/GCP (billing)
- Wazuh/Zabbix (monitoramento)
- LinkedIn API, Google Analytics

---

## 🤖 Agentes IA (Roadmap)

| Agente | Função |
|--------|--------|
| ness.Advisor | Assistente conversacional com RAG |
| ness.Analyst | Dashboard e insights financeiros |
| ness.Pricing | Cálculo de preço/hora |
| ness.Proposal | Geração de propostas |
| ness.Legal | Análise de contratos |
| ness.Mentor | PDI e treinamentos |

---

## 📊 Stack Tecnológica

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **IA/RAG**: pgvector, Claude API
- **Deploy**: Vercel
- **Integrações**: Edge Functions (Deno)

---

## 🔒 Segurança

- Autenticação via Supabase Auth
- Row Level Security (RLS) em todas as tabelas
- Secrets em variáveis de ambiente
- Audit log de operações críticas

---

## 📈 Roadmap

- [x] Documentação de arquitetura
- [x] Schema do módulo FIN
- [x] Edge Function sync Omie
- [x] Frontend MVP (Dashboard, Contratos, Rentabilidade, Alertas)
- [ ] Integração real com Supabase
- [ ] Deploy no Vercel
- [ ] Módulo OPS
- [ ] Agentes IA

---

## 🤝 Contribuição

Este é um projeto interno da [ness.](https://ness.com.br).

---

## 📄 Licença

Proprietário - ness. Cybersecurity

---

**ness.** - *Invisíveis quando tudo funciona. Presentes quando mais importa.*
