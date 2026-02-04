---
status: ready
progress: 100
generated: 2026-02-03
planSlug: adaptacao-layout-bundui-nessos
constrains:
  - "Respeitar ness. branding (ness., ness.OS, módulos ness.X)"
  - "Manter stack: Next.js, Tailwind, shadcn/ui (Radix + Tailwind)"
  - "Zero breaking: auth, RLS, RoleProvider, nav-config e rotas intactos"
  - "Adaptar padrões visuais e estrutura de layout, não copiar código cru"
phases:
  - phase-p
  - phase-r
  - phase-e
  - phase-v
  - phase-c
lastUpdated: "2026-02-03T21:59:58.821Z"
---

# Adaptação do layout Bundui (shadcn-ui-kit-dashboard) para ness.OS

> Planejamento para incorporar o layout e padrões do [Bundui Shadcn Admin Dashboard Free](https://github.com/bundui/shadcn-admin-dashboard-free) na aplicação ness.OS, evitando quebra, seguindo melhores práticas e usando ai-context (plan + workflow + agentes).

**Referência:** [bundui/shadcn-admin-dashboard-free](https://github.com/bundui/shadcn-admin-dashboard-free) — template free: 1 dashboard, 5+ páginas, sidebar, layouts comuns, componentes shadcn.

**Trigger:** "adaptar layout bundui", "layout dashboard shadcn", "sidebar bundui ness.OS"

---

## Objetivo

- Adotar **padrões de layout** do Bundui (sidebar, header, área de conteúdo, responsividade) na área **app** do ness.OS.
- **Não** substituir em bloco: migrar de forma **incremental**, mantendo `nav-config`, `RoleProvider`, auth Supabase e todas as rotas atuais.
- Alinhar com **design tokens** e **ajuste-ux-ui-nessos** já planejados.

---

## Princípios (evitar quebra)

| Princípio | Ação |
|-----------|------|
| **Contrato de navegação** | Manter `nav-config.ts` e `getAllItems()`; sidebar pode trocar de implementação visual, não de dados. |
| **Auth e roles** | Layout app continua protegido; `RoleProvider` e `profiles.role` inalterados. |
| **Rotas** | Nenhuma URL de `app/app/**` alterada; apenas o shell (sidebar + main) pode mudar. |
| **Branding** | ness.OS, ness.GROWTH etc. e `NessBrand` permanecem; cores/tokens podem convergir com Bundui. |
| **Incremental** | Fase E em etapas: primeiro layout shell, depois componentes de página (headers, cards). |

---

## Uso do ai-context

- **Plano:** este arquivo; `planSlug`: `adaptacao-layout-bundui-nessos`.
- **Workflow:** inicializar com `workflow-init` (name: `adaptacao-layout-bundui-nessos`, scale: `LARGE`, require_plan: true). Vincular plano com `plan({ action: "link", planSlug: "adaptacao-layout-bundui-nessos" })`.
- **Progresso:** usar `plan({ action: "updateStep", planSlug: "adaptacao-layout-bundui-nessos", phaseId, stepIndex, status, output?, notes? })` e, ao fechar fases, `updatePhase`.
- **Agentes sugeridos (agent MCP):**
  - **P (Plan) / R (Review):** `architect-specialist` — definir onde o layout Bundui se encaixa (sidebar vs main, header global vs por página).
  - **E (Execute):** `frontend-specialist` — implementar sidebar/layout adaptados, depois componentes de página.
  - **V (Verify):** `code-reviewer` ou checklist manual (navegação, auth, responsivo).
  - **C (Complete):** `documentation-writer` — atualizar docs de layout e DESIGN-TOKENS se necessário.

Orquestração: `agent({ action: "getSequence", task: "Adaptar layout Bundui para ness.OS app sem quebrar auth/nav", phases: ["P","R","E","V","C"], includeReview: true })`.

---

## Fase P — Planejamento e decisões

**Responsável sugerido:** architect-specialist (ai-context agent).

| stepIndex | Ação | Artefato | Entrega |
|-----------|------|----------|---------|
| 1 | Auditar estrutura do repo Bundui (app/, components/, layout, sidebar) | — | Notas: rotas do dashboard, componente de sidebar, header, wrapper do main |
| 2 | Mapear equivalências: Bundui sidebar ↔ `AppSidebar`; Bundui main ↔ `main` atual com `SIDEBAR_WIDTH_PX` | — | Tabela de equivalência e lista de arquivos a adaptar |
| 3 | Decidir: sidebar colapsável ou sempre expandida (ness.OS hoje é expandida) | .context/docs ou este plano | Decisão registrada (recordDecision) |
| 4 | Decidir: header global único vs header por página (ness.OS usa headers por página em vários módulos) | idem | Decisão registrada |
| 5 | Listar componentes Bundui a reutilizar (ex.: SidebarProvider, SidebarInset) e quais instalar via shadcn CLI | docs/ ou plano | Lista de componentes + dependências |
| 6 | Documentar ordem de implementação: 1) shell (layout + sidebar), 2) headers, 3) cards/tabelas | artefato phase-p | DoD Fase P |

**DoD Fase P:** Decisões registradas no ai-context (`recordDecision`), artefato de design (markdown) descrevendo o novo shell e ordem de implementação.

---

## Fase R — Revisão do design

**Responsável sugerido:** architect-specialist ou code-reviewer.

| stepIndex | Ação | Entrega |
|-----------|------|---------|
| 1 | Revisar artefato da Fase P: consistência com nav-config e header-constants | OK ou ajustes |
| 2 | Validar que nenhuma rota ou action é removida/alterada | Checklist aprovado |
| 3 | Aprovar lista de componentes shadcn a adicionar (evitar conflito com dependências atuais) | Lista aprovada |

**DoD Fase R:** Aprovação para seguir para Fase E (sem mudança de escopo de rotas/auth).

---

## Fase E — Execução (incremental)

**Responsável sugerido:** frontend-specialist.

### E.1 — Shell (layout + sidebar)

| stepIndex | Ação | Artefato | Entrega |
|-----------|------|----------|---------|
| 1 | Se necessário: instalar/ajustar shadcn (components.json) e componentes base usados pelo Bundui (Sidebar, Sheet, etc.) | package.json, components.json | Build verde |
| 2 | Introduzir estrutura de layout Bundui (ex.: SidebarProvider + Sidebar + SidebarInset) em `app/app/layout.tsx` mantendo RoleProvider e auth | layout.tsx | App renderiza com novo shell |
| 3 | Adaptar `AppSidebar` para usar componentes e estilos do Bundui, **mantendo** dados de `navModules` e `getAllItems`; colapsável se decidido em P | app-sidebar.tsx | Navegação idêntica em rotas |
| 4 | Ajustar main content: largura, marginLeft/inset conforme sidebar colapsável ou fixa; preservar `min-w-0`, `overflow-auto` | layout.tsx / globals | Conteúdo não quebrado |

### E.2 — Headers e conteúdo

| stepIndex | Ação | Artefato | Entrega |
|-----------|------|----------|---------|
| 5 | Alinhar headers de página (AppPageHeader ou equivalente) ao padrão Bundui (altura, breadcrumb se houver) | app-page-header.tsx, páginas | Headers consistentes |
| 6 | Opcional: adoptar padrão de cards/containers do Bundui em 1–2 módulos piloto (ex.: growth, ops) | page-card, page-content | Sem quebra em outras páginas |

**DoD Fase E:** Layout visível igual ou muito próximo ao Bundui; navegação e auth funcionando; build e lint OK.

---

## Fase V — Verificação

| stepIndex | Ação | Entrega |
|-----------|------|---------|
| 1 | Teste manual: login → todas as entradas de nav (GROWTH, OPS, PEOPLE, FIN, JUR, GOV) | Nenhuma rota quebrada |
| 2 | Teste responsivo: sidebar em viewport reduzido (comportamento definido em P) | OK mobile/tablet |
| 3 | Verificar acessibilidade: foco, contraste, labels (alinhado a ajuste-ux-ui-nessos) | Checklist aprovado |

**DoD Fase V:** Testes passando; sem regressão em funcionalidade ou auth.

---

## Fase C — Conclusão

| stepIndex | Ação | Entrega |
|-----------|------|---------|
| 1 | Atualizar documentação: ARCHITECTURE ou LAYOUT-APP com referência ao layout inspirado no Bundui | docs | Doc atualizada |
| 2 | Se novos tokens ou componentes: atualizar DESIGN-TOKENS ou design-tokens.ts | design-tokens.ts / docs | Consistência com ajuste-ux-ui |
| 3 | Marcar plano como concluído no ai-context; commit com mensagem descritiva | workflow/plan | Fase C completa |

---

## Referências rápidas

- **Layout atual ness.OS:** `src/app/app/layout.tsx` (AppSidebar + main com marginLeft), `src/components/app/app-sidebar.tsx`, `src/lib/nav-config.ts`, `src/lib/header-constants.ts`.
- **Bundui:** [github.com/bundui/shadcn-admin-dashboard-free](https://github.com/bundui/shadcn-admin-dashboard-free) — estrutura em app/, components/.
- **Plano UX/UI existente:** [.context/plans/ajuste-ux-ui-nessos.md](./ajuste-ux-ui-nessos.md).
- **Agentes:** `.context/agents/` (architect-specialist, frontend-specialist, code-reviewer, documentation-writer).

---

## Checklist de não-quebra

- [x] `nav-config.ts` não alterado em estrutura de módulos/itens (ou apenas extensão).
- [x] Auth redirect e RoleProvider intactos.
- [x] Todas as rotas em `app/app/**` continuam acessíveis pela sidebar.
- [x] Nenhuma Server Action ou API route removida ou alterada por causa do layout.
- [x] Build `next build` e lint sem erros.

**Fase C concluída (2026-02-04):** LAYOUT-APP-HEADERS.md e DESIGN-TOKENS.md atualizados com referência Bundui; project-overview layout atualizado; plano de pendências consolidado criado (pendencias-abertas-nessos).

## Execution History

> Last updated: 2026-02-03T21:59:58.821Z | Progress: 100%

### phase-r [DONE]
- Started: 2026-02-03T21:59:58.821Z
- Completed: 2026-02-03T21:59:58.821Z

- [x] Step 3: Step 3 *(2026-02-03T21:59:58.821Z)*
  - Notes: Lista de componentes aprovada: sidebar, sheet, tooltip, skeleton, use-mobile; Next 14 compatível.
