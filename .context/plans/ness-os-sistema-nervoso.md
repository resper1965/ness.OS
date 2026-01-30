---
status: filled
generated: 2026-01-30
planVinculado: docs/PLANO-SISTEMA-NERVOSO-NESSOS.md
agents:
  - type: "architect-specialist"
    role: "Definir schema pgvector e integrações IA"
  - type: "feature-developer"
    role: "Implementar agentes IA e RAG"
  - type: "security-auditor"
    role: "Revisar RLS e isolamento FIN/GROWTH"
phases:
  - id: "phase-1"
    name: "Discovery & Schema"
    prevc: "P"
  - id: "phase-2"
    name: "Implementação Base"
    prevc: "E"
  - id: "phase-3"
    name: "Agentes IA"
    prevc: "E"
---

# ness.OS — Sistema Nervoso Digital

> Plataforma de Gestão e Inteligência Corporativa. Orquestrador de negócios: OPS → GROWTH → FIN → PEOPLE → WEB.

## Conceito Central (The "Why")

O ness.OS não é um dashboard. É um **Orquestrador de Negócios**. A NESS migra de "Esforço" (vender horas) para "Conhecimento" (vender padrões).

### O Ciclo de Valor (Flywheel)

| Módulo | Função |
|--------|--------|
| **ness.OPS** | Define *como* fazemos (Playbooks). |
| **ness.GROWTH** | Vende *apenas* o que sabemos fazer (Catálogo travado por Playbooks). |
| **ness.FIN** | Mede se o que vendemos deu lucro real (Receita - Custo Operacional). |
| **ness.PEOPLE** | Treina o time onde a operação falhou (Gaps por auditoria). |
| **ness.WEB** | Vitrine automática do que acontece dentro do OS. |

---

## Análise de Gaps — Banco de Dados

### A) Trava de Catálogo (Growth × OPS)

**Estado atual:**
- ✅ **App:** `createService` e `updateService` exigem `playbook_id` (admin-services.ts).
- ⚠️ **DB:** `services_catalog.playbook_id` é `uuid` sem FK; `is_active` pode ser true sem playbook.
- **Gap:** Inserção direta via SQL ou bypass da Server Action ignora a trava.

**O que falta:**
1. `ALTER TABLE services_catalog ADD CONSTRAINT fk_playbook FOREIGN KEY (playbook_id) REFERENCES playbooks(id);` — só adicionar se playbook_id NOT NULL; ou criar FK opcional e reforçar em CHECK.
2. `CHECK (NOT is_active OR playbook_id IS NOT NULL)` — serviço ativo exige playbook.

**Migration:** `008_trava_catalogo.sql`

### B) Embeddings para Agentes IA

**Estado atual:**
- ❌ Extensão `pgvector` não habilitada.
- ❌ Nenhuma tabela de embeddings.

**O que falta:**
1. `CREATE EXTENSION IF NOT EXISTS vector;`
2. Tabela `document_embeddings`:

```sql
create table public.document_embeddings (
  id uuid primary key default gen_random_uuid(),
  source_type text not null,  -- 'playbook' | 'post'
  source_id uuid not null,
  content_chunk text not null,
  embedding vector(1536),     -- OpenAI ada-002; ajustar se outro modelo
  metadata jsonb default '{}',
  created_at timestamp default now()
);
create index on document_embeddings using ivfflat (embedding vector_cosine_ops);
```

**Migration:** `009_pgvector_embeddings.sql`

---

## Arquitetura Técnica

| Camada | Tecnologia |
|--------|------------|
| Repositório | Monorepo Next.js 14+ (App Router) |
| Site | `app/(site)` — consumidor de dados |
| App | `app/(app)` — gerador de dados |
| Banco | Supabase PostgreSQL |
| IA | Vercel AI SDK + pgvector (RAG) |
| UI | Tailwind CSS + shadcn/ui |

---

## Agentes de IA (Roadmap)

| Agente | Contexto | Usuário | Função |
|--------|----------|---------|--------|
| **Internal Knowledge Bot** | Playbooks | Técnico/Operacional | "Como configuro backup X?" — RAG sem alucinar |
| **Agente de Propostas** | Cliente + Playbook | Vendas | Minuta técnica e comercial |
| **Agente de Conteúdo** | Dados de projeto | Marketing | "Transformar Case em Post" |
| **Public Sales Bot** | Catálogo + Posts | Visitante | "O que a NESS faz?" + captura Lead |

---

## Working Phases

### Phase 1 — Discovery & Schema (P)

1. Aplicar migration `008_trava_catalogo.sql` — FK + CHECK.
2. Aplicar migration `009_pgvector_embeddings.sql` — extensão + tabela.
3. Validar que serviços existentes com `is_active=true` têm `playbook_id`; corrigir dados se necessário.

**Deliverables:** Schema pronto para Trava no DB e para RAG.

### Phase 2 — Implementação Base (E)

1. Revisar RLS: FIN invisível para Vendas; Vendas invisível para anon.
2. Garantir que performance_metrics exige contract_id (já existe FK).
3. Documentar fluxo de dados em `docs/INTEGRACAO-AMBIENTES-E-IA.md`.

### Phase 3 — Agentes IA (E)

1. Instalar `ai` (Vercel AI SDK) e `@supabase/supabase-js` com pgvector.
2. Criar API route `/api/chat/playbooks` — RAG sobre playbooks.
3. Criar API route `/api/chat/proposals` — gerador de minuta (ou Server Action).
4. (Fase posterior) Bot público no site com contexto limitado.

---

## Diretrizes SecOps

- **Server Actions:** Toda lógica de negócio no servidor.
- **RLS:** FIN invisível para Sales; Sales invisível para Visitantes.
- **Foreign Keys:** Nenhum Input de Métricas sem Contrato; nenhum Serviço ativo sem Playbook.

---

## Evidence & Follow-up

- [ ] Migrations 008 e 009 aplicadas no Supabase.
- [ ] Teste: criar serviço ativo sem playbook — deve falhar (app e DB).
- [ ] Teste: inserir em document_embeddings — deve aceitar vector(1536).
