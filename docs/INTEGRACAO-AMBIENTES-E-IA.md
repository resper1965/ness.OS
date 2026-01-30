# Integração dos Ambientes e Papel da IA

---

## 1. Integração dos ambientes (ness.OS + ness.WEB)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ness.OS (base única Next.js)                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   SITE PÚBLICO (ness.WEB)              APP INTERNO (ness.OS)             │
│   src/app/(site)/                      src/app/app/                      │
│   ─────────────────                   ─────────────────                 │
│   • /              Home               • /app            Dashboard        │
│   • /contato       Formulário lead    • /app/growth     Posts, Leads,    │
│   • /carreiras     Vagas abertas      • /app/ops        Serviços         │
│   • /blog          Artigos            • /app/people     Playbooks, Métricas│
│   • /solucoes      Serviços           • /app/fin        Vagas, Gaps      │
│   • /legal         Privacidade        • /app/login      Contratos        │
│                                                                          │
│   ↓ Lê publicados    ↓ Escreve         ↑ Edita tudo                      │
│   public_posts       inbound_leads     services_catalog                  │
│   public_jobs        job_applications  playbooks, contracts              │
│   services_catalog                                                       │
│                                                                          │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         SUPABASE (backend único)                          │
│  • PostgreSQL (tabelas)  • Auth (login)  • Storage (os-assets)            │
└──────────────────────────────────────────────────────────────────────────┘
```

### Fluxo de dados

| Origem | Ação | Destino |
|--------|------|---------|
| Visitante | Preenche contato | `inbound_leads` |
| Visitante | Candidata a vaga | `job_applications` |
| Visitante | Lê blog, vagas, soluções | `public_posts`, `public_jobs`, `services_catalog` |
| Usuário logado | Cria post, serviço, lead | Mesmas tabelas (escrita) |
| Usuário logado | Cria playbook, contrato, métrica | `playbooks`, `contracts`, `performance_metrics` |

**Integração:** Site e app compartilham o mesmo banco, mesmas Server Actions e mesmo deploy (Vercel). O site consome o que o app publica.

---

## 2. Onde está a IA?

### A) IA no desenvolvimento (já existe)

A IA está na **ferramenta de desenvolvimento**, não no produto:

| Camada | Onde | Função |
|--------|------|--------|
| **Cursor** | IDE | Assistente de código (este agente) |
| **ai-context** | `.context/` | Planos, workflow PREVC, scaffolds |
| **MCP** | Supabase, Vercel, GitHub | Ferramentas (migrations, deploy) via Cursor |

**Arquivos relevantes:**
- `.context/plans/` — planos (ness-os-proximos-passos, etc.)
- `.context/workflow/` — status do workflow
- `.context/agents/` — playbooks para agentes
- `.context/docs/` — documentação interna para IA

**Como usar:** Abrir o projeto no Cursor e pedir "siga", "execute o plano", etc. O ai-context e MCP entram em ação via integração Cursor ↔ repositório.

### B) IA no produto

| Feature | Status | Onde |
|---------|--------|------|
| **Internal Knowledge Bot** | ✅ Implementado | `/app/ops/playbooks/chat` — RAG sobre playbooks |
| **Public Sales Bot** | ⏳ Planejado | Site público — Catálogo + Posts; captura Lead |
| Agente de Propostas | ⏳ Planejado | ness.GROWTH |
| Agente de Conteúdo | ⏳ Planejado | ness.GROWTH |

**Especificação técnica:** Ver [ESPECIFICACAO-AGENTES-IA-EMBEDDINGS.md](ESPECIFICACAO-AGENTES-IA-EMBEDDINGS.md) — Vector DB (pgvector, document_embeddings), agentes e evolução do schema.

**Requisito:** `OPENAI_API_KEY` nas variáveis de ambiente (Vercel e `.env.local`).

**Possíveis adições futuras:**

| Ideia | Onde encaixaria | Esforço |
|-------|-----------------|---------|
| ~~Assistente IA para playbooks~~ | ness.OPS | ✅ Feito |
| Sugestão de respostas para leads | ness.GROWTH (Kanban) | Médio |
| Resumo automático de métricas | ness.FIN (rentabilidade) | Médio |
| Geração de propostas com IA | ness.GROWTH (propostas PDF) | Médio |

---

## 3. Resumo

| Pergunta | Resposta |
|----------|----------|
| **Integração site ↔ app?** | Mesmo código, mesmo banco; site lê dados que o app edita. |
| **IA no produto?** | Não há. O produto é um sistema operacional de negócio. |
| **IA no desenvolvimento?** | Sim. Cursor + ai-context + MCP para planejar, codificar e fazer deploy. |

---

## 4. Próximo passo (se quiser IA no produto)

Definir um caso de uso prioritário (ex.: sugestão de respostas para leads) e incluir no roadmap como tarefa P2 ou P3.
