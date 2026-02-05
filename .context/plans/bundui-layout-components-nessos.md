---
status: ready
planSlug: bundui-layout-components-nessos
generated: 2026-02
type: frontend
trigger: "Bundui layout", "components/layout Bundui", "shadcn-ui-kit-dashboard layout"
constrains:
  - "Respeitar ness. branding (ness., ness.OS, módulos ness.X)"
  - "Manter stack: Next.js 14, React 18, Tailwind 3 — sem upgrade forçado"
  - "Zero breaking: auth, RLS, nav-config, rotas e actions intactos"
  - "Adotar incrementalmente; manter contrato de navegação (nav-config, getAllItems)"
docs:
  - "project-overview.md"
  - "architecture.md"
  - "DESIGN-TOKENS.md"
  - "LAYOUT-APP-HEADERS.md"
plans:
  - "adaptacao-layout-bundui-nessos.md"
  - "bundui-componentes-profundos-nessos.md"
---

# Plano — Componentes de layout Bundui (components/layout) no ness.OS

> Planejar e adotar os componentes da pasta **layout** do [Bundui Shadcn UI Kit Dashboard](https://github.com/bundui/shadcn-ui-kit-dashboard/tree/main/components/layout) no ness.OS, integrando ao shell atual (sidebar, header, main) sem quebrar auth/nav.

**Referência (repositório):**
- [resper1965/clone — components/layout](https://github.com/resper1965/clone/tree/main/components/layout) — componentes de estrutura (header/, sidebar/, logo.tsx); inventário real em artefato Fase P (via MCP GitHub).

**Trigger:** "Bundui layout", "components/layout", "resper1965/clone layout"

**Relação com outros planos:**
- [adaptacao-layout-bundui-nessos](./adaptacao-layout-bundui-nessos.md) — **concluído:** shell (SidebarProvider, SidebarInset, AppSidebar, AppHeader) já adaptado; padrões visuais e estrutura documentados.
- [bundui-componentes-profundos-nessos](./bundui-componentes-profundos-nessos.md) — primitivos ui/ (Button, Card) e composados; este plano foca **apenas** em `components/layout`.

---

## Objetivo

- Inventariar o conteúdo de **components/layout** do repositório Bundui (quando acessível: clone local, docs ou screenshot).
- Mapear cada componente de layout Bundui → equivalente atual no ness.OS (`app-sidebar.tsx`, `app-header.tsx`, `sidebar-context.tsx`, `app/app/layout.tsx`).
- Adotar ou estender de forma **incremental**: melhorar estrutura visual, breadcrumb, page shell, etc., sem alterar rotas, auth ou nav-config.

---

## Restrições de stack

| Bundui (referência) | ness.OS (manter) | Ação |
|---------------------|------------------|------|
| Next 16, React 19, Tailwind 4 | Next 14, React 18, Tailwind 3 | Copiar/adaptar código; reescrever classes Tailwind 4 → 3. |
| Ícones (Tabler ou outro) | lucide-react | Trocar ícones por Lucide equivalente. |
| Dados de navegação hardcoded | nav-config.ts, getAllItems() | **Manter** nav-config; layout components apenas consomem. |

---

## Inventário esperado (components/layout)

Tipicamente kits shadcn/dashboard expõem em **layout** (ou equivalente):

| Componente (esperado) | Descrição | Equivalente ness.OS atual |
|-----------------------|-----------|---------------------------|
| **Sidebar** / **AppSidebar** | Shell da sidebar (provider, trigger, content, footer) | `AppSidebar`, `SidebarProvider`, `sidebar-context.tsx` |
| **Header** / **SiteHeader** | Barra superior (trigger, título, breadcrumb, ações) | `AppHeader` (`app-header.tsx`) |
| **Main** / **Content** | Wrapper do conteúdo (inset, padding) | `SidebarInset` + `<main>` em `app/app/layout.tsx` |
| **Breadcrumb** | Navegação hierárquica (Módulo / Página) | Opcional no AppHeader; derivar de pathname |
| **PageShell** / **PageLayout** | Container de página (título + conteúdo) | `PageContent`, `AppPageHeader` em shared/ |
| **MobileNav** / **Sheet** | Drawer para sidebar em mobile | Já em AppSidebar (Sheet/drawer) |

**Nota:** O repositório pode não estar acessível via API pública. Ao executar o plano: clone local ou consultar documentação Bundui/21st.dev para listar arquivos em `components/layout`.

**Consumo unificado header/sidebar:** Header e sidebar consomem os mesmos componentes e recursos (SidebarTrigger, ThemeToggle, UserMenu com variant header/sidebar, APP_HEADER_HEIGHT_PX, nav-config, AppUser). Ver [shell-header-sidebar-consumo-unificado.md](../docs/shell-header-sidebar-consumo-unificado.md).

---

## Fases de execução

### Fase 1 — Inventário e mapeamento (P)

| # | Ação | Entregável |
|---|------|------------|
| 1 | Obter lista de arquivos em `components/layout` do repo Bundui (clone, docs ou listagem manual). | Lista: ex.: sidebar.tsx, header.tsx, breadcrumb.tsx, page-shell.tsx. |
| 2 | Para cada arquivo: resumir responsabilidade e dependências (ui/, hooks). | Tabela: componente, responsabilidade, deps. |
| 3 | Mapear cada um → componente ness.OS (AppSidebar, AppHeader, layout.tsx, PageContent, etc.). | Tabela: Bundui layout component, ness.OS atual, decisão (adotar / estender / ignorar). |
| 4 | Verificar compatibilidade Tailwind 3 e React 18; listar ajustes necessários. | Notas de compatibilidade. |

**DoD Fase 1:** Documento de inventário (markdown) em `.context/workflow/artifacts/` com listas e tabelas de mapeamento.

- **Artefato Fase 1 (P):** [bundui-layout-phase-p-inventario.md](../workflow/artifacts/bundui-layout-phase-p-inventario.md) — inventário real components/layout (resper1965/clone via MCP GitHub), mapeamento clone → ness.OS, priorização (theme-switch, Breadcrumb). **Concluído.**

---

### Fase 2 — Adoção incremental (E)

| # | Ação | Entregável |
|---|------|------------|
| 1 | Priorizar 1–2 componentes de layout (ex.: Breadcrumb no header, ou PageShell padrão). | Decisão registrada. |
| 2 | Implementar ou adaptar: copiar/reescrever para Next 14 + Tailwind 3; integrar em AppHeader ou layout.tsx mantendo nav-config e RoleProvider. | Código em `src/components/app/` ou `src/components/shared/`. |
| 3 | Garantir design tokens ness.OS (slate-*, ness, header 64px). | Build verde; sem regressão visual. |
| 4 | Documentar em LAYOUT-APP-HEADERS.md ou DESIGN-TOKENS.md o que foi adotado. | Docs atualizados. |

**DoD Fase 2:** Pelo menos um componente de layout Bundui integrado; docs atualizados.

---

### Fase 3 — Verificação e conclusão (V / C)

| # | Ação | Entregável |
|---|------|------------|
| 1 | Teste manual: navegação, responsivo (drawer &lt;768px), teclado (skip link, tab). | Checklist passando (VALIDACAO-MANUAL). |
| 2 | Registrar no plano status (filled) e referência cruzada com adaptacao-layout e bundui-componentes-profundos. | Plano atualizado. |

**DoD Fase 3:** Verificação concluída; plano marcado como concluído ou em manutenção.

---

## Riscos e mitigações

| Risco | Mitigação |
|-------|------------|
| Repo Bundui privado ou URL alterada | Documentar inventário assim que acessível; usar shadcn/ui oficial como fallback para padrões de layout (breadcrumb, page shell). |
| Conflito com shell já adaptado (adaptacao-layout) | Não substituir AppSidebar/AppHeader em bloco; apenas enriquecer (ex.: adicionar Breadcrumb) ou refatorar internamente. |
| Tailwind 4 / React 19 no Bundui | Reescrever classes para Tailwind 3; garantir React 18 compat. |

---

## Referências

- [resper1965/clone — components/layout](https://github.com/resper1965/clone/tree/main/components/layout)
- [adaptacao-layout-bundui-nessos](./adaptacao-layout-bundui-nessos.md) — shell já adaptado
- [bundui-componentes-profundos-nessos](./bundui-componentes-profundos-nessos.md) — primitivos ui/ e composados
- [docs/LAYOUT-APP-HEADERS.md](../../docs/LAYOUT-APP-HEADERS.md)
- [docs/DESIGN-TOKENS.md](../../docs/DESIGN-TOKENS.md)
- [architecture.md](../docs/architecture.md)
