# Layout do App e Headers — ness.OS

Documentação do layout da área privada (`/app/*`): sidebar, header global e comportamento ao rolar.

**Referência de padrão:** Layout inspirado no [Bundui Shadcn Admin Dashboard Free](https://github.com/bundui/shadcn-admin-dashboard-free) e na estrutura do [clone](https://github.com/resper1965/clone/tree/main/components/layout) — sidebar colapsável, header global com trigger, busca (⌘K), notificações, tema e usuário. Plano: [.context/plans/adaptacao-layout-bundui-nessos.md](../.context/plans/adaptacao-layout-bundui-nessos.md).

## Estrutura do layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Sidebar]  │ [Header global — fixo]                                          │
│ ness.OS    │ [≡] Módulo / Página  |  [🔍] [🔔] [☀/🌙] [Avatar]               │
│ ─────────  ├─────────────────────────────────────────────────────────────────┤
│ Dashboard  │                                                                   │
│ NESS.GROWTH│ Conteúdo da página (rola)                                       │
│ ...        │                                                                   │
│ ─────────  │                                                                   │
│ [Tema][User]                                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

- **Sidebar:** `LayoutAppSidebar` — logo (LayoutLogo), navegação principal (NavMain a partir de nav-config), rodapé (NavUser: tema + menu do usuário). Desktop expandido: largura 224px; recolhido: faixa 48px. Mobile: drawer.
- **Área principal:** `SidebarInset` (main) com `overflow-auto`. Dentro: `SiteHeader` global + conteúdo.
- **Header global:** `SiteHeader` — SidebarTrigger, breadcrumb (Módulo / Página), Separator, Search (⌘K), Notificações, Tema, UserMenu. Altura 52px.
- **Header da página:** `AppPageHeader` — fixo; títulos de seção dentro do conteúdo.

## Componentes do layout

### Header (`src/components/layout/header/`)

| Componente | Descrição |
|------------|-----------|
| `SiteHeader` (index.tsx) | Header global: SidebarTrigger, breadcrumb, Separator, Search, Notificações, Tema, UserMenu. |
| `HeaderSearch` (search.tsx) | Botão lupa + CommandDialog (paleta ⌘K) com itens de nav-config (módulos/áreas). |
| `HeaderNotifications` (notifications.tsx) | Dropdown “Notificações” (dados em data.ts; lista vazia por padrão). |
| `HeaderThemeSwitch` (theme-switch.tsx) | Encapsula ThemeToggle do app. |
| `HeaderUserMenu` (user-menu.tsx) | Encapsula UserMenu do app. |
| `data.ts` | Lista de notificações (placeholder para integração com alertas/eventos). |

### Sidebar (`src/components/layout/sidebar/`)

| Componente | Descrição |
|------------|-----------|
| `LayoutAppSidebar` (app-sidebar.tsx) | Sidebar completa: logo, NavMain, NavUser; mobile = drawer; desktop = colapsado ou expandido. |
| `NavMain` (nav-main.tsx) | Navegação principal a partir de nav-config (módulos, áreas, itens); acordeão; ScrollArea. |
| `NavUser` (nav-user.tsx) | Rodapé: ThemeToggle + UserMenu (variante sidebar). |

### Logo

| Componente | Descrição |
|------------|-----------|
| `LayoutLogo` (src/components/layout/logo.tsx) | Logo: variante normal (NessBrand) ou compacta (“n” com brand-dot). |

## Headers

### Altura única: 52px

| Elemento | Altura | Comportamento |
|----------|--------|---------------|
| Header da sidebar (ness.OS) | 52px | Fixo no topo da sidebar; apenas o nav tem scroll. |
| Header global da página | 52px | Fixo no topo da área de conteúdo; permanece visível ao rolar. |

Constante central: `APP_HEADER_HEIGHT_PX` em `src/lib/header-constants.ts` (52).

### Header da página (AppPageHeader)

- **Posicionamento:** `position: fixed`, `top: 0`, `left: 224px` (largura da sidebar), `right: 0`, `z-index: 10`.
- **Conteúdo:** título (h1), subtítulo opcional, ações (ex.: link “Novo caso”), `UserRoleBadge`.
- **Espaçador:** abaixo do `<header>` há um bloco com altura 52px + marginBottom para o conteúdo não ficar atrás do header.

Arquivo: `src/components/shared/app-page-header.tsx`.

### Header da sidebar

- **Posicionamento:** dentro do `aside`; altura fixa 52px (via estilo inline).
- **Única linha:** `border-b border-slate-700` abaixo do logo “ness.OS”.

Desktop expandido: logo + SidebarTrigger. Desktop recolhido: faixa 48px com trigger + LayoutLogo compacto. Mobile: drawer com logo + botão fechar.

Arquivos: `src/components/layout/sidebar/app-sidebar.tsx`, `src/components/app/sidebar-context.tsx`, `src/components/layout/header/index.tsx`.

## Dados e integração

- **Navegação:** `src/lib/nav-config.ts` (navModules, getAllItems). Usado por SiteHeader (breadcrumb), HeaderSearch (paleta) e NavMain (sidebar).
- **Usuário:** passado do layout do app (auth) para SiteHeader e LayoutAppSidebar.
- **Notificações:** `src/components/layout/header/data.ts` (array vazio; preparado para alertas/eventos).

## Linhas separadoras

- **Sidebar:** uma linha horizontal abaixo de “ness.OS” (`border-b` no header da sidebar).
- **Header global:** Separator vertical entre breadcrumb e Search.
- **Página:** uma linha horizontal abaixo do título/subtítulo (`border-b` no AppPageHeader).

## Referências

- Constantes: `src/lib/header-constants.ts`
- Design tokens (espaçamento, alturas): [DESIGN-TOKENS.md](./DESIGN-TOKENS.md)
- Navegação e áreas: [NAV-AREAS.md](./NAV-AREAS.md)
- Estrutura de pastas do app: [SETUP-INICIAL.md](./SETUP-INICIAL.md)
