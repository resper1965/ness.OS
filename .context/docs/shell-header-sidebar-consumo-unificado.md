# Shell app — Header e Sidebar: consumo unificado de componentes e recursos

**Data:** 2026-02  
**Objetivo:** Header e sidebar consumirem os **mesmos** componentes e recursos, sem quebrar o principal (auth, nav, rotas).

---

## Contrato de consumo (header e sidebar)

| Recurso / componente | Header | Sidebar | Observação |
|----------------------|--------|---------|------------|
| **SidebarTrigger** | Sim (esquerda) | Sim (no header interno da sidebar e no modo colapsado) | `@/components/app/sidebar-context` |
| **ThemeToggle** | Sim (ml-auto) | Sim (footer da sidebar) | `@/components/app/theme-toggle` |
| **UserMenu** | Sim (`variant="header"`) | Sim (`variant="sidebar"`) | Um único componente `@/components/app/user-menu`; variante define apenas o layout do trigger. |
| **APP_HEADER_HEIGHT_PX** | Sim (altura do header) | Sim (altura do header interno da sidebar) | `@/lib/header-constants` |
| **nav-config** (navModules, getAllItems) | Sim (getBreadcrumb) | Sim (SidebarNavContent, CollapsibleGroup) | `@/lib/nav-config` |
| **AppUser** (user) | Sim (prop do layout) | Sim (prop do layout) | Passado pelo layout; tipo `AppUser` em user-menu.tsx |

---

## Componente único: UserMenu

- **Arquivo:** `src/components/app/user-menu.tsx`
- **Variantes:** `header` (avatar compacto) e `sidebar` (bloco avatar + nome + email + ChevronDown).
- **Conteúdo do dropdown:** Idêntico em ambas as variantes (label com user, link Início, ação Sair); implementado em `UserMenuDropdownContent`.
- **Recursos usados:** Avatar, DropdownMenu (ui), signOut (actions/auth), AppUser, cn (utils).

Não existe mais `NavUser` separado; sidebar usa `UserMenu` com `variant="sidebar"`.

---

## Estrutura do footer da sidebar

- Uma única barra no rodapé: `ThemeToggle` + `UserMenu variant="sidebar"` (mesma ordem lógica do header: tema + usuário).
- Container: `flex items-center gap-2 p-3 border-t border-slate-700`; UserMenu dentro de `flex-1 min-w-0` para truncar texto.

---

## Referências

- [bundui-layout-components-nessos](../plans/bundui-layout-components-nessos.md)
- [LAYOUT-APP-HEADERS](../../docs/LAYOUT-APP-HEADERS.md)
- [header-constants](../../src/lib/header-constants.ts)
- [nav-config](../../src/lib/nav-config.ts)
