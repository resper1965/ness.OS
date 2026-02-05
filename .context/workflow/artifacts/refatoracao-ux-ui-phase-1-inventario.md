# Phase 1 — Inventário e priorização (refatoração UX/UI todas as páginas)

**Plano:** [refatoracao-ux-ui-todas-paginas](../plans/refatoracao-ux-ui-todas-paginas.md)  
**Workflow:** refatoracao-ux-ui-todas-paginas  
**Data:** 2026-02-05

---

## Checklist: páginas que já usam padrões

| Página | PageContent | AppPageHeader | PageCard | EmptyState (quando vazio) |
|--------|-------------|---------------|----------|---------------------------|
| /app | ✓ | ✓ | ✓ | — |
| /app/data | ✓ | ✓ | ✓ | — |
| /app/fin | ✓ | ✓ | ✓/cards | verificar |
| /app/fin/alertas | ✓ | ✓ | ✓ | verificar |
| /app/fin/contratos | ✓ | ✓ | ✓ | DataTable emptyMessage |
| /app/fin/rentabilidade | ✓ | ✓ | ✓ | verificar |
| /app/growth/leads | ✓ | ✓ | ✓ | verificar |
| /app/growth/propostas | ✓ | ✓ | ✓ | verificar |
| /app/growth/upsell | ✓ | ✓ | ✓ | verificar |
| /app/growth/posts | ✓ | ✓ | ✓ | verificar |
| /app/growth/posts/novo | ✓ | ✓ | form | — |
| /app/growth/posts/[id] | ✓ | ✓ | ✓ | — |
| /app/growth/casos | ✓ | ✓ | ✓ | verificar |
| /app/growth/casos/novo | ✓ | ✓ | form | — |
| /app/growth/casos/[id] | ✓ | ✓ | ✓ | — |
| /app/growth/brand | ✓ | ✓ | ✓ | verificar |
| /app/growth/services | ✓ | ✓ | ✓ | verificar |
| /app/growth/services/[id] | ✓ | ✓ | ✓ | — |
| /app/ops/playbooks | ✓ | ✓ | ✓ | verificar |
| /app/ops/playbooks/novo | ✓ | ✓ | form | — |
| /app/ops/playbooks/[id] | ✓ | ✓ | ✓ | — |
| /app/ops/playbooks/chat | ✓ | ✓ | ✓ | — |
| /app/ops/workflows | ✓ | ✓ | ✓ | verificar |
| /app/ops/metricas | ✓ | ✓ | ✓ | verificar |
| /app/ops/timer | ✓ | ✓ | ✓ | — |
| /app/ops/indicators | ✓ | ✓ | ✓ | ✓ (já refatorado) |
| /app/ops/assets | ✓ | ✓ | ✓ | verificar |
| /app/people/vagas | ✓ | ✓ | ✓ | verificar |
| /app/people/vagas/[id] | ✓ | ✓ | ✓ | — |
| /app/people/candidatos | ✓ | ✓ | ✓ | verificar |
| /app/people/gaps | ✓ | ✓ | ✓ | verificar |
| /app/people/avaliacao | ✓ | ✓ | ✓ | verificar |
| /app/jur | ✓ | ✓ | ✓ | — |
| /app/jur/conformidade | ✓ | ✓ | ✓ | verificar |
| /app/jur/risco | ✓ | ✓ | ✓ | — |
| /app/gov | ✓ | ✓ | ✓ | — |
| /app/gov/politicas | ✓ | ✓ | ✓ | verificar |
| /app/gov/politicas/novo | ✓ | ✓ | form | — |
| /app/gov/politicas/[id] | ✓ | ✓ | ✓ | — |
| /app/gov/aceites | ✓ | ✓ | ✓ | verificar |

**Priorização (ordem de execução):**

1. **Phase 2 — ness.FIN:** /app/fin, /app/fin/alertas, /app/fin/contratos, /app/fin/rentabilidade  
2. **Phase 3 — PEOPLE + GROWTH:** vagas, candidatos, leads, propostas, posts, casos, services, brand, gaps, avaliacao  
3. **Phase 4 — OPS, JUR, GOV:** playbooks, workflows, metricas, assets, jur, conformidade, risco, gov, politicas, aceites  
4. **Phase 5 — Site + dados:** /app, /app/data, login, site público  
5. **Phase 6 — Validação:** build, lint, Lighthouse (amostra)

**DoD Phase 1:** ✓ Inventário confirmado; priorização registrada; artefato em `.context/workflow/artifacts/`.
