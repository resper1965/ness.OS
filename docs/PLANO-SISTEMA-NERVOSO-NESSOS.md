# Plano: ness.OS — Sistema Nervoso Digital

**Referência:** [.context/plans/ness-os-sistema-nervoso.md](../.context/plans/ness-os-sistema-nervoso.md)

---

## Visão

O ness.OS é um **Orquestrador de Negócios** — o "Sistema Nervoso Digital" da NESS. Migra de "Esforço" (vender horas) para "Conhecimento" (vender padrões).

### Ciclo de Valor (Flywheel)

```
ness.OPS (Playbooks) → ness.GROWTH (Catálogo travado) → ness.FIN (Rentabilidade)
       ↑                                                              ↓
ness.PEOPLE (Gaps/Treinamento) ←──────────────────────── ness.WEB (Vitrine)
```

---

## Análise de Gaps (Resposta à pergunta)

> "O que falta para suportar a Trava de Catálogo e a estrutura de Embeddings?"

### Trava de Catálogo

| Camada | Estado | Gap |
|--------|--------|-----|
| **App** | ✅ Implementada | createService/updateService exigem playbook_id |
| **DB** | ⚠️ Incompleta | Sem FK, sem CHECK; bypass possível via SQL |

**Solução:** Migration `008_trava_catalogo.sql` — FK + CHECK.

### Embeddings (Agentes IA)

| Item | Estado | Gap |
|------|--------|-----|
| pgvector | ❌ Ausente | Extensão não habilitada |
| document_embeddings | ❌ Ausente | Tabela não existe |

**Solução:** Migration `009_pgvector_embeddings.sql` — extensão + tabela vector(1536).

---

## Migrations

| # | Arquivo | O que faz |
|---|---------|-----------|
| 008 | `008_trava_catalogo.sql` | FK playbook_id → playbooks; CHECK is_active ⇒ playbook_id |
| 009 | `009_pgvector_embeddings.sql` | pgvector; document_embeddings (source_type, source_id, embedding) |

**Ordem:** Executar 008 antes de 009 (sem dependência entre elas).

---

## Roadmap de Agentes IA

1. **Internal Knowledge Bot** — RAG sobre playbooks (técnicos)
2. **Agente de Propostas** — Minuta a partir de cliente + playbook
3. **Agente de Conteúdo** — "Transformar Case em Post"
4. **Public Sales Bot** — Site: "O que a NESS faz?" + captura Lead

---

## Próximos Passos

1. Aplicar migrations 008 e 009 no Supabase.
2. Instalar Vercel AI SDK + configurar rotas de chat.
3. Implementar pipeline de embeddings (trigger ou job ao salvar playbook/post).
