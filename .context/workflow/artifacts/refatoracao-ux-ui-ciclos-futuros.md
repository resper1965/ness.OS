# Ciclos futuros — Refatoração UX/UI (executável)

**Plano:** [refatoracao-ux-ui-todas-paginas](../plans/refatoracao-ux-ui-todas-paginas.md)  
**Decisão ai-context:** Ciclos futuros com lista explícita de páginas, ação por página, DoD por ciclo, priorização por dependência.  
**Uso:** Ao iniciar ciclo A, B, C ou D, seguir este artefato + seção 10 do plano.

---

## Status geral (pós ciclo 1)

- **Feito no ciclo 1:** fin (4), people/vagas, people/candidatos, growth/leads, growth/posts, ops/playbooks, ops/workflows, ops/assets, ops/indicators, gov/politicas, gov/aceites.
- **Pendente:** people/gaps, people/avaliacao, people/vagas/[id]; growth/casos, growth/services, growth/brand, growth/propostas, growth/upsell + forms/detalhes; ops/metricas, ops/timer, ops/playbooks/novo, ops/playbooks/[id]; jur (3), gov detalhes; /app, /app/data, login, site, _not-found.

---

## Ciclo A — GROWTH restante + PEOPLE restante

**Objetivo:** EmptyState em todas as listagens do escopo; forms com max-w-4xl e toasts onde aplicável.

| # | Página | Ação | Ícone | Título EmptyState | DoD |
|---|--------|------|-------|-------------------|-----|
| 1 | `app/people/gaps/page.tsx` | EmptyState quando lista vazia | Target ou Layers | Nenhum gap cadastrado | icon, title, message, description |
| 2 | `app/people/avaliacao/page.tsx` | EmptyState ou mensagem guia quando sem avaliações | Users | Nenhuma avaliação 360º | Descrição do fluxo |
| 3 | `app/people/vagas/[id]/page.tsx` | Detalhe: PageCard + layout clone/user-profile | — | — | PageContent, AppPageHeader, PageCard |
| 4 | `app/growth/casos/page.tsx` | EmptyState quando sem casos | FolderKanban ou FolderOpen | Nenhum caso de sucesso | CTA "Novo caso" |
| 5 | `app/growth/casos/novo/page.tsx` | Form max-w-4xl; InputField; loading no submit; toasts | — | — | DESIGN-TOKENS form long |
| 6 | `app/growth/casos/[id]/page.tsx` | Detalhe: PageCard + breadcrumb | — | — | Layout products/[id] |
| 7 | `app/growth/services/page.tsx` | EmptyState quando sem serviços | Package ou Box | Nenhum serviço cadastrado | CTA "Novo serviço" |
| 8 | `app/growth/services/[id]/page.tsx` | Detalhe: PageCard | — | — | Layout products/[id] |
| 9 | `app/growth/brand/page.tsx` | EmptyState ou cards quando vazio | Palette ou Award | Nenhum ativo de marca | Referência clone/products |
| 10 | `app/growth/propostas/page.tsx` | EmptyState na listagem quando vazio (se ainda não tiver) | FileText | Nenhuma proposta | DataTable/forms já existem; conferir empty |
| 11 | `app/growth/upsell/page.tsx` | EmptyState ou card único | TrendingUp | Nenhum upsell configurado | Descrição ou CTA |

**DoD Ciclo A:** Todas as 11 ações acima implementadas; `npm run build` verde; lint verde.

---

## Ciclo B — OPS restante + JUR

**Objetivo:** EmptyState onde faltar; hubs jur/ops com cards; build verde.

| # | Página | Ação | Ícone | Título EmptyState | DoD |
|---|--------|------|-------|-------------------|-----|
| 1 | `app/ops/metricas/page.tsx` | EmptyState quando sem métricas | BarChart3 ou LineChart | Nenhuma métrica | Descrição OPS → Métricas |
| 2 | `app/ops/timer/page.tsx` | Layout claro (sem listagem vazia típica) | — | — | PageContent, AppPageHeader |
| 3 | `app/ops/playbooks/novo/page.tsx` | Form max-w-4xl; InputField; toasts | — | — | Form long |
| 4 | `app/ops/playbooks/[id]/page.tsx` | Detalhe: PageCard + breadcrumb | — | — | Layout products/[id] |
| 5 | `app/jur/page.tsx` | Hub: cards de atalho (Conformidade, Risco) | — | — | Como /app/fin |
| 6 | `app/jur/conformidade/page.tsx` | EmptyState por framework quando sem checks (dentro de cada PageCard) | CheckSquare | Nenhum check para [framework] | Por framework |
| 7 | `app/jur/risco/page.tsx` | Page shell; EmptyState ou card de análise | AlertTriangle | Nenhuma análise de risco | Descrição ou CTA |

**DoD Ciclo B:** Todas as 7 ações acima; build e lint verdes.

---

## Ciclo C — GOV detalhes + Site + Auth + Hubs

**Objetivo:** Forms e detalhes padronizados; login e site com InputField/feedback; not-found clone/error; build verde.

| # | Página / escopo | Ação | DoD |
|---|-----------------|------|-----|
| 1 | `app/gov/politicas/novo/page.tsx` | Form max-w-4xl; InputField; toasts | Form long, toasts |
| 2 | `app/gov/politicas/[id]/page.tsx` | Detalhe: PageCard + versões | Layout products/[id] |
| 3 | `app/gov/page.tsx` | Hub: cards de atalho (Políticas, Aceites) | Como /app/fin |
| 4 | `app/page.tsx`, `app/data/page.tsx` | Hubs: cards/stats consistentes; EmptyState se sem dados | PageContent, cards, empty quando aplicável |
| 5 | `login/page.tsx` | InputField; feedback de erro; acessibilidade | Label, helper, error |
| 6 | (site): contato, blog, carreiras, casos, soluções, legal | Forms com label/helper; listagens responsivas; acessibilidade | DESIGN-TOKENS, a11y |
| 7 | `_not-found` (app/not-found ou global) | Página de erro inspirada em clone/error | AlertCircle, "Página não encontrada", link "Voltar ao início" |

**DoD Ciclo C:** Todas as ações acima; build e lint verdes.

---

## Ciclo D — Validação final

| # | Ação | Artefato |
|---|------|----------|
| 1 | Lighthouse acessibilidade (amostra de rotas) | FASE-5-VALIDACAO-UX.md |
| 2 | Navegação por teclado e checklist manual | Checklist em doc |
| 3 | Atualizar DESIGN-TOKENS.md com novos padrões (se houver) | DESIGN-TOKENS.md |
| 4 | Build e lint verdes em toda a base | npm run build |

**DoD Ciclo D:** Evidências de validação; docs atualizados.

---

## Comandos ai-context para ciclos futuros

1. **Iniciar workflow do ciclo:**  
   `workflow-init` com name `refatoracao-ux-ui-ciclo-A` (ou B/C/D), scale `MEDIUM`, require_plan true, archive_previous conforme necessário.

2. **Vincular plano:**  
   `plan({ action: "link", planSlug: "refatoracao-ux-ui-todas-paginas" })`.

3. **Registrar conclusão de steps (após executar páginas):**  
   `plan({ action: "updateStep", planSlug: "refatoracao-ux-ui-todas-paginas", phaseId: "phase-3-usuario-comercial", stepIndex: 1, status: "completed", output: "people/gaps, people/avaliacao, growth/casos,...", notes? })`.  
   (Usar phaseId conforme fase do plano: phase-3-usuario-comercial, phase-4-operacao-jur-gov, phase-5-site-dados, phase-6-validacao.)

4. **Avançar workflow:**  
   P → R → E (executar este artefato) → V (build/lint) → C.
