---
status: ready
progress: 100
generated: 2026-02-05
planSlug: refatoracao-ux-ui-todas-paginas
planVinculado: docs/DESIGN-TOKENS.md, docs/AVALIACAO-FRONTEND-ESPACAMENTO.md
trigger: "refatoração UX/UI todas as páginas", "melhorar UX/UI por tema", "plano páginas por módulo"
constrains:
  - "Respeitar branding ness. (ness.OS, ness.FIN, etc.)"
  - "Manter stack: Next 14, Tailwind 3, shadcn/ui"
  - "Inspirar-se em clone e ajuste-ux-ui; não quebrar rotas ou auth"
phases:
  - phase-1-inventario
  - phase-2-financeiro
  - phase-3-usuario-comercial
  - phase-4-operacao-jur-gov
  - phase-5-site-dados
  - phase-6-validacao
docs:
  - "DESIGN-TOKENS.md"
  - "NAV-AREAS.md"
  - "LAYOUT-APP-HEADERS.md"
  - "FASE-5-VALIDACAO-UX.md"
lastUpdated: "2026-02-05T00:22:50.180Z"
---

# Refatoração UX/UI — Todas as Páginas por Tema

> Plano detalhado passando por **todas as páginas existentes** do ness.OS: refatoração inspirada nas melhores referências do repositório (clone, ajuste-ux-ui, design-tokens), com **ligação temática** (financeiro, usuário, comercial, operação, jurídico, governança) e foco em **melhorar em muito o UX/UI** da aplicação.

**Referências:** [clone-inspiracao-paginas-nessos](./clone-inspiracao-paginas-nessos.md), [ajuste-ux-ui-nessos](./ajuste-ux-ui-nessos.md), [docs/DESIGN-TOKENS.md](../../docs/DESIGN-TOKENS.md), [docs/NAV-AREAS.md](../../docs/NAV-AREAS.md)

**Trigger:** "refatoração UX/UI todas as páginas", "melhorar UX/UI por tema", "plano páginas por módulo"

---

## 1. Inventário completo de páginas (54)

Todas as `page.tsx` existentes, agrupadas por **módulo/tema** e **tipo** (listagem, formulário, detalhe, hub, site).

### 1.1 App — Dashboard e módulos (autenticados)

| Tema / Módulo | Página (rota) | Tipo | Referência clone / UX |
|---------------|----------------|------|------------------------|
| **Início** | `/app` | Hub | Dashboard / page shell |
| **Início** | `/app/data` | Hub | Dashboard / page shell |
| **ness.FIN (financeiro)** | `/app/fin` | Hub | orders, stats, cards |
| **ness.FIN** | `/app/fin/alertas` | Listagem + cards | empty-states, orders |
| **ness.FIN** | `/app/fin/contratos` | Listagem + formulário | orders, products, DataTable |
| **ness.FIN** | `/app/fin/rentabilidade` | Listagem / métricas | orders, stats |
| **ness.GROWTH (comercial)** | `/app/growth/leads` | Listagem | users, empty-states |
| **ness.GROWTH** | `/app/growth/propostas` | Listagem + formulário | orders, products |
| **ness.GROWTH** | `/app/growth/upsell` | Página | products |
| **ness.GROWTH** | `/app/growth/posts` | Listagem | products, empty-states |
| **ness.GROWTH** | `/app/growth/posts/novo` | Formulário | forms, label/help |
| **ness.GROWTH** | `/app/growth/posts/[id]` | Detalhe/edição | products/[id] |
| **ness.GROWTH** | `/app/growth/casos` | Listagem | products |
| **ness.GROWTH** | `/app/growth/casos/novo` | Formulário | forms |
| **ness.GROWTH** | `/app/growth/casos/[id]` | Detalhe | products/[id] |
| **ness.GROWTH** | `/app/growth/brand` | Página | products |
| **ness.GROWTH** | `/app/growth/services` | Listagem | products |
| **ness.GROWTH** | `/app/growth/services/[id]` | Detalhe | products/[id] |
| **ness.OPS (operação)** | `/app/ops/playbooks` | Listagem | products, empty-states |
| **ness.OPS** | `/app/ops/playbooks/novo` | Formulário | forms |
| **ness.OPS** | `/app/ops/playbooks/[id]` | Detalhe | products/[id] |
| **ness.OPS** | `/app/ops/playbooks/chat` | Chat / bot | — |
| **ness.OPS** | `/app/ops/workflows` | Listagem | products |
| **ness.OPS** | `/app/ops/metricas` | Listagem / métricas | stats |
| **ness.OPS** | `/app/ops/timer` | Página / timer | — |
| **ness.OPS** | `/app/ops/indicators` | Listagem | empty-states (já refatorado) |
| **ness.OPS** | `/app/ops/assets` | Listagem | products |
| **ness.PEOPLE (usuário/talentos)** | `/app/people/vagas` | Listagem | users, empty-states |
| **ness.PEOPLE** | `/app/people/vagas/[id]` | Detalhe | user-profile |
| **ness.PEOPLE** | `/app/people/candidatos` | Listagem | users |
| **ness.PEOPLE** | `/app/people/gaps` | Listagem | products |
| **ness.PEOPLE** | `/app/people/avaliacao` | Página (360º) | user-profile |
| **ness.JUR (jurídico)** | `/app/jur` | Hub | page shell |
| **ness.JUR** | `/app/jur/conformidade` | Listagem | products |
| **ness.JUR** | `/app/jur/risco` | Página / análise | — |
| **ness.GOV (governança)** | `/app/gov` | Hub | page shell |
| **ness.GOV** | `/app/gov/politicas` | Listagem | products |
| **ness.GOV** | `/app/gov/politicas/novo` | Formulário | forms |
| **ness.GOV** | `/app/gov/politicas/[id]` | Detalhe | products/[id] |
| **ness.GOV** | `/app/gov/aceites` | Listagem (usuários) | users |

### 1.2 Auth e site público

| Tema | Página (rota) | Tipo | Referência clone / UX |
|------|----------------|------|------------------------|
| **Auth** | `/login` | Login | profile, forms |
| **Auth** | `/auth/callback` | Callback | — |
| **Site** | `/(site)` raiz | Landing | — |
| **Site** | `/(site)/nessos` | Página | — |
| **Site** | `/(site)/contato` | Formulário | forms |
| **Site** | `/(site)/sobre` | Página | — |
| **Site** | `/(site)/blog` | Listagem | products |
| **Site** | `/(site)/blog/[slug]` | Detalhe | — |
| **Site** | `/(site)/carreiras` | Listagem | products |
| **Site** | `/(site)/carreiras/[slug]/candidatar` | Formulário | forms |
| **Site** | `/(site)/casos` | Listagem | products |
| **Site** | `/(site)/casos/[slug]` | Detalhe | — |
| **Site** | `/(site)/solucoes` | Listagem | products |
| **Site** | `/(site)/solucoes/[slug]` | Detalhe | — |
| **Site** | `/(site)/legal/[slug]` | Página estática | — |
| **Outros** | `/_not-found` | Erro | error (clone) |
| **Outros** | `/manifest.webmanifest` | PWA | — |

---

## 2. Ligação temática e priorização

| Tema | Módulo(s) | Páginas (contagem) | Foco UX/UI | Referência principal |
|------|-----------|--------------------|------------|------------------------|
| **Financeiro** | ness.FIN | 4 | Cards, tabelas, empty-states, toasts | clone/orders, ajuste-ux phase-3 |
| **Usuário / Talentos** | ness.PEOPLE | 5 | Listagens users, vagas, candidatos, 360º | clone/users, user-profile |
| **Comercial / Marketing** | ness.GROWTH | 12 | Leads, propostas, posts, casos, services, brand | clone/orders, products, empty-states |
| **Operação / Conhecimento** | ness.OPS | 9 | Playbooks, workflows, métricas, timer, indicators, assets | clone/products, empty-states (já em indicators) |
| **Jurídico** | ness.JUR | 3 | Conformidade, risco | clone/products, page shell |
| **Governança** | ness.GOV | 5 | Políticas, aceites | clone/users, products, forms |
| **Dados** | ness.DATA, /app, /app/data | 2 | Hubs | page shell, stats |
| **Site público** | (site) | 11+ | Forms, listagens, detalhes | forms, acessibilidade |
| **Auth** | login, callback | 2 | Login, callback | profile, forms |

**Ordem de execução sugerida (por impacto e dependência):**

1. **Phase 2 — Financeiro (ness.FIN):** visão geral, alertas, contratos, rentabilidade — alto impacto, referência clone/orders.
2. **Phase 3 — Usuário + Comercial (ness.PEOPLE + ness.GROWTH):** vagas, candidatos, leads, propostas, posts, casos, services — maior volume de listagens e forms.
3. **Phase 4 — Operação, Jurídico, Governança (ness.OPS, JUR, GOV):** playbooks, workflows, métricas, timer, indicators (já feito), assets; jur conformidade/risco; gov políticas/aceites.
4. **Phase 5 — Site + Dados:** hubs /app e /app/data; páginas site (contato, blog, carreiras, casos, soluções); login.
5. **Phase 6 — Validação:** Lighthouse, checklist FASE-5-VALIDACAO-UX, DESIGN-TOKENS atualizado.

---

## 3. Padrões de refatoração (referências do repositório)

Aplicar em todas as páginas, conforme tipo:

| Padrão | Fonte | Onde aplicar |
|--------|--------|----------------|
| **Page shell** | clone dashboard, ajuste-ux phase-3 | PageContent + AppPageHeader + PageCard em toda página app |
| **EmptyState** | clone/empty-states, ajuste-ux phase-2 | Todas as listagens sem itens: icon + title + message + description + CTA |
| **DataTable + StatusBadge** | clone/orders, products; ajuste-ux phase-3 | leads, contratos, vagas, playbooks, políticas, aceites |
| **Forms** | clone forms, InputField, ajuste-ux phase-2/3 | Formulários com label, helper, erro inline, loading no submit, max-w-xl/4xl |
| **Cards e stats** | clone/orders, bundui-finance | fin/alertas, fin, hubs |
| **Toasts** | ajuste-ux phase-2 | Todas as Server Actions (create/update/delete) |
| **Loading** | Skeleton, Spinner, ajuste-ux phase-2 | Tabelas e botões assíncronos |
| **Error** | clone/error | not-found, error boundary |
| **8pt grid + design tokens** | DESIGN-TOKENS.md | Espaçamentos, headers 64px, sidebar 224px |
| **Acessibilidade** | ajuste-ux phase-4 | Contraste, focus, labels, sidebar responsivo |

---

## 4. Fases executáveis (Working Phases)

### Phase 1 — Inventário e alinhamento (PREVC: P)

| Step | Ação | Artefato |
|------|------|----------|
| 1 | Confirmar inventário de 54 páginas e mapeamento tema → referência clone/ux | Este plano (seção 1 e 2) |
| 2 | Listar páginas que já usam EmptyState, PageCard, AppPageHeader corretamente | Checklist em artifact |
| 3 | Priorizar por módulo (FIN → GROWTH/PEOPLE → OPS/JUR/GOV → site) | Priorização na seção 2 |

**DoD:** Artefato em `.context/workflow/artifacts/` com checklist de páginas e priorização.  
**Commit:** `chore(plan): phase 1 inventário refatoração UX/UI todas as páginas`

---

### Phase 2 — Tema financeiro (ness.FIN)

| Step | Página | Ação |
|------|--------|------|
| 1 | `/app/fin` | PageContent + cards/stats no padrão clone/orders; EmptyState se sem dados |
| 2 | `/app/fin/alertas` | EmptyState com ícone + título; cards homogêneos; espaçamento 8pt |
| 3 | `/app/fin/contratos` | DataTable + StatusBadge; EmptyState com CTA; toasts em create/update/delete |
| 4 | `/app/fin/rentabilidade` | Layout homogêneo; EmptyState ou tabela com overflow-x-auto |

**DoD:** 4 páginas FIN refatoradas; build e lint verdes.  
**Commit:** `feat(ui): refatoração UX/UI ness.FIN — page shell, empty-states, tabelas`

---

### Phase 3 — Tema usuário + comercial (ness.PEOPLE + ness.GROWTH)

| Step | Módulo | Páginas | Ação |
|------|--------|---------|------|
| 1 | PEOPLE | vagas, vagas/[id], candidatos, gaps, avaliacao | EmptyState em listagens; DataTable onde couber; forms com InputField e loading |
| 2 | GROWTH | leads, propostas, upsell | Idem; clone/orders e products como referência |
| 3 | GROWTH | posts, posts/novo, posts/[id] | EmptyState, form max-w-4xl, toasts |
| 4 | GROWTH | casos, casos/novo, casos/[id], brand, services, services/[id] | PageCard, EmptyState, forms, detalhes consistentes |

**DoD:** Páginas PEOPLE e GROWTH alinhadas a PageContent, EmptyState, DataTable/forms.  
**Commit:** `feat(ui): refatoração UX/UI ness.PEOPLE e ness.GROWTH`

---

### Phase 4 — Operação, jurídico, governança (ness.OPS, JUR, GOV)

| Step | Módulo | Páginas | Ação |
|------|--------|---------|------|
| 1 | OPS | playbooks, playbooks/novo, playbooks/[id], playbooks/chat, workflows, metricas, timer, assets | EmptyState onde falta; forms e tabelas padronizados; indicators já feito |
| 2 | JUR | jur, conformidade, risco | Page shell; listagens com EmptyState; risco com layout claro |
| 3 | GOV | gov, politicas, politicas/novo, politicas/[id], aceites | clone/users em aceites; products/forms em políticas |

**DoD:** Todas as páginas OPS, JUR, GOV com padrões aplicados.  
**Commit:** `feat(ui): refatoração UX/UI ness.OPS, ness.JUR, ness.GOV`

---

### Phase 5 — Site e dados

| Step | Escopo | Ação |
|------|--------|------|
| 1 | /app, /app/data | Hubs com page shell e cards/stats consistentes |
| 2 | login, auth/callback | Forms com InputField; feedback de erro |
| 3 | (site): contato, blog, carreiras, casos, soluções, legal | Forms (contato, candidatar) com label/helper; listagens/detalhes responsivos; acessibilidade |
| 4 | _not-found | Página de erro inspirada em clone/error |

**DoD:** Hubs, login e páginas site com UX/UI alinhada.  
**Commit:** `feat(ui): refatoração UX/UI hubs, login e site público`

---

### Phase 6 — Validação

| Step | Ação |
|------|------|
| 1 | Lighthouse acessibilidade (FASE-5-VALIDACAO-UX.md) em amostra de rotas |
| 2 | Navegação por teclado e checklist manual |
| 3 | Atualizar DESIGN-TOKENS.md com quaisquer novos padrões |
| 4 | Build e lint verdes em toda a base |

**DoD:** Evidências de validação; docs atualizados.  
**Commit:** `chore(ux): validação refatoração UX/UI todas as páginas`

---

## 5. Task Snapshot

- **Primary goal:** Passar por todas as páginas existentes do ness.OS e refatorar UX/UI com base nas melhores referências do repositório (clone, ajuste-ux-ui, design-tokens), organizando por ligação temática (financeiro, usuário, comercial, operação, jurídico, governança) para melhorar em muito a experiência do usuário.
- **Success signal:** Páginas com PageContent/AppPageHeader/PageCard consistentes; EmptyState em 100% das listagens; forms com InputField, loading e toasts; tabelas com DataTable onde aplicável; design tokens e acessibilidade respeitados; build e lint verdes.
- **Key references:**
  - [clone-inspiracao-paginas-nessos](./clone-inspiracao-paginas-nessos.md)
  - [ajuste-ux-ui-nessos](./ajuste-ux-ui-nessos.md)
  - [docs/DESIGN-TOKENS.md](../../docs/DESIGN-TOKENS.md)
  - [docs/NAV-AREAS.md](../../docs/NAV-AREAS.md)
  - [docs/FASE-5-VALIDACAO-UX.md](../../docs/FASE-5-VALIDACAO-UX.md)
  - [resper1965/clone — dashboard pages](https://github.com/resper1965/clone/tree/main/app/dashboard/(auth)/pages)

---

## 6. Codebase Context

- **ness.OS:** Next 14, React 18, Tailwind 3, shadcn/ui (Radix), Supabase. Área app em `src/app/app/` com layout (AppSidebar, AppHeader, UserMenu). Componentes shared: PageContent, PageCard, AppPageHeader, EmptyState (icon, title, message, description, action), InputField, Skeleton, PrimaryButton. Módulos em `nav-config.ts`: GROWTH, OPS, PEOPLE, FIN, JUR, GOV, DATA.
- **Rotas:** 54 `page.tsx` (app, auth, site). Listagem em seção 1 deste plano.
- **Referências internas:** DESIGN-TOKENS (8pt grid, header 64px, form widths), LAYOUT-APP-HEADERS, clone como inspiração visual (Next 15/React 19/Tailwind 4 — adaptar para stack atual).

---

## 7. Agent Lineup (resumido)

| Agent | Role neste plano |
|-------|------------------|
| **architect-specialist** | Validar mapeamento tema → páginas e priorização |
| **frontend-specialist** | Implementar refatorações por fase (page shell, EmptyState, DataTable, forms) |
| **refactoring-specialist** | Identificar padrões repetidos e componentes reutilizáveis |
| **documentation-writer** | Atualizar DESIGN-TOKENS e FASE-5-VALIDACAO-UX |
| **code-reviewer** | Revisar consistência visual e acessibilidade |

---

## 8. Riscos e dependências

| Risk | Probabilidade | Impacto | Mitigação |
|------|---------------|---------|-----------|
| Escopo grande (54 páginas) | Alta | Médio | Priorizar por tema; 1 módulo por vez; registrar progresso no plano |
| Regressão visual | Média | Alto | Build e lint a cada fase; comparação antes/depois em 2–3 páginas chave |
| Clone Tailwind 4 / React 19 | Alta | Baixo | Adaptar apenas padrões; não copiar código cru |

- **Dependências internas:** nav-config, RoleProvider, auth Supabase, PageContent/PageCard/AppPageHeader/EmptyState — manter intactos.
- **Assumptions:** Rotas e contratos de dados não mudam; apenas UI e estrutura de página; branding ness. preservado.

---

## 9. Evidência e acompanhamento

- **Artefatos:** checklist de páginas (phase-1); commits por fase (phase-2 a phase-6).
- **Métricas:** número de páginas com EmptyState; número de forms com InputField + loading + toast; Lighthouse accessibility em amostra.
- **Atualização do plano:** usar `plan({ action: "updateStep", planSlug: "refatoracao-ux-ui-todas-paginas", phaseId, stepIndex, status, output?, notes? })` para marcar progresso por fase/step.

---

## 10. Ciclos futuros — aprofundamento

> **Decisão registrada (ai-context):** Para cada ciclo futuro, usar (1) lista explícita de páginas pendentes com status feito/pendente; (2) ação concreta por página (EmptyState com ícone sugerido, ou form/DataTable); (3) critério de aceite (DoD) por ciclo; (4) priorização por dependência (listagens antes de detalhes). Ciclos A–D definidos abaixo e no artefato [refatoracao-ux-ui-ciclos-futuros.md](../workflow/artifacts/refatoracao-ux-ui-ciclos-futuros.md).

### 10.1 Status por página (feito no ciclo 1 / pendente)

| Página | Status ciclo 1 | Ação pendente (ciclos futuros) |
|--------|----------------|---------------------------------|
| /app/fin | ✓ | — |
| /app/fin/alertas | ✓ | — |
| /app/fin/contratos | ✓ | — |
| /app/fin/rentabilidade | ✓ | — |
| /app/people/vagas | ✓ | — |
| /app/people/candidatos | ✓ | — |
| /app/people/gaps | Pendente | EmptyState (Target ou Layers); listagem vazia |
| /app/people/avaliacao | Pendente | EmptyState ou mensagem guia (Users); 360º vazio |
| /app/people/vagas/[id] | Pendente | Detalhe: PageCard + layout clone/user-profile |
| /app/growth/leads | ✓ | — |
| /app/growth/posts | ✓ | — |
| /app/growth/propostas | Pendente | EmptyState na listagem se vazio; DataTable/forms já existem |
| /app/growth/upsell | Pendente | EmptyState ou card único; referência clone/products |
| /app/growth/casos | Pendente | EmptyState (FolderKanban ou FolderOpen); CTA "Novo caso" |
| /app/growth/casos/novo | Pendente | Form max-w-4xl; InputField; loading no submit |
| /app/growth/casos/[id] | Pendente | Detalhe: PageCard + breadcrumb |
| /app/growth/brand | Pendente | EmptyState ou cards; referência clone/products |
| /app/growth/services | Pendente | EmptyState (Package ou Box); CTA "Novo serviço" |
| /app/growth/services/[id] | Pendente | Detalhe: PageCard + layout products/[id] |
| /app/ops/playbooks | ✓ | — |
| /app/ops/workflows | ✓ | — |
| /app/ops/assets | ✓ | — |
| /app/ops/indicators | ✓ (anterior) | — |
| /app/ops/metricas | Pendente | EmptyState quando sem métricas (BarChart3 ou LineChart) |
| /app/ops/timer | Pendente | Layout claro; sem listagem vazia típica |
| /app/ops/playbooks/novo | Pendente | Form max-w-4xl; InputField; toasts |
| /app/ops/playbooks/[id] | Pendente | Detalhe: PageCard + breadcrumb |
| /app/jur | Pendente | Hub: cards de atalho como /app/fin |
| /app/jur/conformidade | Pendente | EmptyState por framework quando sem checks (Scale ou CheckSquare) |
| /app/jur/risco | Pendente | Page shell; EmptyState ou card de análise |
| /app/gov | Pendente | Hub: cards de atalho |
| /app/gov/politicas | ✓ | — |
| /app/gov/aceites | ✓ | — |
| /app/gov/politicas/novo | Pendente | Form max-w-4xl; InputField; toasts |
| /app/gov/politicas/[id] | Pendente | Detalhe: PageCard + versões |
| /app, /app/data | Pendente | Hubs: garantir cards/stats consistentes; EmptyState se sem dados |
| /login | Pendente | InputField; feedback de erro; acessibilidade |
| (site) contato, blog, carreiras, casos, soluções, legal | Pendente | Forms com label/helper; listagens responsivas; acessibilidade |
| _not-found | Pendente | Página de erro inspirada em clone/error |

### 10.2 Ciclos futuros A–D (ordem sugerida)

| Ciclo | Escopo | Páginas (principais) | DoD ciclo |
|-------|--------|----------------------|-----------|
| **A** | GROWTH restante + PEOPLE restante | casos, casos/novo, casos/[id], services, services/[id], brand, propostas (empty), upsell; people/gaps, people/avaliacao, people/vagas/[id] | EmptyState em todas as listagens do escopo; forms com max-w-4xl e toasts onde aplicável; build verde |
| **B** | OPS + JUR | ops/metricas, ops/timer, ops/playbooks/novo, ops/playbooks/[id]; jur, jur/conformidade, jur/risco | EmptyState onde faltar; hubs jur/ops com cards; build verde |
| **C** | GOV detalhes + Site + Auth | gov/politicas/novo, gov/politicas/[id]; /app, /app/data; login; (site) contato, blog, carreiras, casos, soluções; _not-found | Forms e detalhes padronizados; login e site com InputField/feedback; not-found clone/error; build verde |
| **D** | Validação final | — | Lighthouse acessibilidade (amostra); DESIGN-TOKENS e FASE-5-VALIDACAO-UX atualizados; checklist manual |

### 10.3 Ação por página (referência rápida para ciclos futuros)

| Página | Ícone sugerido (Lucide) | Título EmptyState sugerido | CTA / ação |
|--------|--------------------------|----------------------------|------------|
| people/gaps | Target ou Layers | Nenhum gap cadastrado | Link para criar ou descrição |
| people/avaliacao | Users | Nenhuma avaliação 360º | Descrição do fluxo |
| growth/casos | FolderKanban | Nenhum caso de sucesso | PrimaryButton "Novo caso" |
| growth/services | Package | Nenhum serviço cadastrado | PrimaryButton "Novo serviço" |
| growth/brand | Palette ou Award | Nenhum ativo de marca | Descrição ou CTA |
| growth/propostas | FileText | Nenhuma proposta | Já tem form; EmptyState na listagem |
| growth/upsell | TrendingUp | Nenhum upsell configurado | Descrição |
| ops/metricas | BarChart3 | Nenhuma métrica | Descrição OPS → Métricas |
| jur/conformidade | CheckSquare | Nenhum check para [framework] | Dentro de cada PageCard por framework |
| jur/risco | AlertTriangle | Nenhuma análise de risco | Descrição ou CTA |
| gov/politicas/novo | — | Form | InputField, toasts |
| gov/politicas/[id] | — | Detalhe | PageCard + versões |
| _not-found | AlertCircle | Página não encontrada | Link "Voltar ao início" |

### 10.4 Workflow para ciclos futuros

1. **Iniciar ciclo:** `workflow-init` com name `refatoracao-ux-ui-ciclo-A` (ou B/C/D), scale `MEDIUM`, `planSlug`: `refatoracao-ux-ui-todas-paginas`.
2. **Vincular plano:** `plan({ action: "link", planSlug: "refatoracao-ux-ui-todas-paginas" })`.
3. **Executar:** Seguir a tabela "Ação por página" e a seção 10.2 para o ciclo escolhido; usar `EmptyState` com `icon`, `title`, `message`, `description`, `action` conforme padrão já aplicado em FIN, PEOPLE, GROWTH, OPS, GOV.
4. **Registrar progresso:** `plan({ action: "updateStep", planSlug: "refatoracao-ux-ui-todas-paginas", phaseId: "phase-3-usuario-comercial" (ou phase-4/5/6), stepIndex, status: "completed", output?, notes? })`.
5. **Validar:** Build e lint ao final do ciclo; avançar workflow P → R → E → V → C.

---

## Execution History

> Last updated: 2026-02-05T00:22:50.180Z | Progress: 100%

### phase-2-financeiro [DONE]
- Started: 2026-02-05T00:22:50.180Z
- Completed: 2026-02-05T00:22:50.180Z

- [x] Step 1: Step 1 *(2026-02-05T00:22:50.180Z)*
  - Output: src/app/app/fin/*.tsx
