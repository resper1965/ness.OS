# Fase P — Inventário e mapeamento (layout components — resper1965/clone)

Plano: `bundui-layout-components-nessos`. Artefato da Fase 1. **Fonte:** [resper1965/clone](https://github.com/resper1965/clone) (Shadcn UI Kit; obtido via MCP GitHub).

---

## 1. Lista real em components/layout (resper1965/clone)

| Tipo | Caminho | Descrição |
|------|---------|-----------|
| dir | **layout/header/** | Barra superior: index.tsx, data.ts, notifications.tsx, search.tsx, theme-switch.tsx, user-menu.tsx |
| dir | **layout/sidebar/** | Sidebar: app-sidebar.tsx, nav-main.tsx, nav-user.tsx |
| file | layout/logo.tsx | Logo |

**Header:** index.tsx, data.ts, notifications.tsx, search.tsx, theme-switch.tsx, user-menu.tsx.  
**Sidebar:** app-sidebar.tsx, nav-main.tsx, nav-user.tsx.

---

## 2. Mapeamento clone layout → ness.OS atual

| Componente clone | Equivalente ness.OS | Decisão |
|------------------|---------------------|---------|
| **layout/sidebar (app-sidebar, nav-main, nav-user)** | AppSidebar, SidebarProvider, sidebar-context.tsx | **Estender:** shell já adaptado; enriquecer com nav-main/nav-user se fizer sentido. |
| **layout/header (index, search, notifications, theme-switch, user-menu)** | AppHeader (SidebarTrigger + breadcrumb) | **Estender:** theme-switch → ThemeToggle; opcional: search, notifications; manter breadcrumb. |
| **Main / Content** | SidebarInset + main em app/app/layout.tsx | **Manter.** |
| **Breadcrumb** | getBreadcrumb(pathname) no AppHeader | **Adotar (opcional):** ui/breadcrumb com links. |
| **PageShell** | PageContent + AppPageHeader em shared/ | **Manter** ou padronizar API. |
| **MobileNav / Sheet** | AppSidebar (Sheet &lt;768px) | **Manter.** |

---

## 3. Compatibilidade Tailwind 3 e React 18

- **clone:** Next.js 15, React 19 (README); ao copiar, reescrever para Tailwind 3 e React 18.
- **Design tokens ness.OS:** header 64px, sidebar 224px/48px, border-slate-700, bg-slate-900/50 — ver DESIGN-TOKENS.md, LAYOUT-APP-HEADERS.md.
- **Navegação:** manter nav-config.ts e getAllItems(); layout apenas consome.

---

## 4. Priorização para Fase 2

| Prioridade | Componente | Ação |
|------------|------------|------|
| 1 | **theme-switch** (header) | Adotar como ThemeToggle no AppHeader (light/dark). |
| 2 | **ui/breadcrumb** | Opcional no AppHeader com links. |
| 3 | Sidebar/Header | Melhorias pontuais (a11y, ícones Lucide). |

---

## DoD Fase 1

- [x] Lista real de arquivos em components/layout (resper1965/clone via MCP GitHub)
- [x] Mapeamento clone → ness.OS e decisão por componente
- [x] Notas de compatibilidade Tailwind 3 / React 18

**Próximo:** Fase 2 (E) — adoção incremental (ex.: theme-switch, Breadcrumb); Fase 3 (V/C).
