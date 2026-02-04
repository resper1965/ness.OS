# Layout do App e Headers Fixos — ness.OS

Documentação do layout da área privada (`/app/*`): sidebar, header da página e comportamento ao rolar.

**Referência de padrão:** Layout inspirado no [Bundui Shadcn Admin Dashboard Free](https://github.com/bundui/shadcn-admin-dashboard-free) — sidebar colapsável, header global com trigger, drawer em mobile. Plano: [.context/plans/adaptacao-layout-bundui-nessos.md](../.context/plans/adaptacao-layout-bundui-nessos.md).

## Estrutura do layout

```
┌─────────────────────────────────────────────────────────────┐
│ [Sidebar]  │ [Header da página — fixo]                       │
│ ness.OS    │ Título · Subtítulo · Ações · UserRoleBadge     │
│ ─────────  ├────────────────────────────────────────────────┤
│ Dashboard  │                                                 │
│ NESS.GROWTH│ Conteúdo da página (rola)                      │
│ ...        │                                                 │
└─────────────────────────────────────────────────────────────┘
```

- **Sidebar:** `AppSidebar` — largura fixa `w-56` (224px). Header “ness.OS” + nav com módulos.
- **Área principal:** `SidebarInset` (main) com `overflow-auto`. Dentro: `AppHeader` global (trigger + breadcrumb) + conteúdo.
- **Header global:** `AppHeader` — `SidebarTrigger` + breadcrumb (Módulo / Página). Altura 64px.
- **Header da página:** `AppPageHeader` — fixo; títulos de seção dentro do conteúdo.

## Headers

### Altura única: 64px

| Elemento | Altura | Comportamento |
|----------|--------|----------------|
| Header da sidebar (ness.OS) | 64px | Fixo no topo da sidebar; não rola (apenas o `<nav>` tem scroll). |
| Header da página (título + subtítulo) | 64px | Fixo no topo da área de conteúdo; permanece visível ao rolar. |

Constante central: `APP_HEADER_HEIGHT_PX` em `src/lib/header-constants.ts` (64).

### Header da página (AppPageHeader)

- **Posicionamento:** `position: fixed`, `top: 0`, `left: 224px` (largura da sidebar), `right: 0`, `z-index: 10`.
- **Conteúdo:** título (h1), subtítulo opcional, ações (ex.: link “Novo caso”), `UserRoleBadge`.
- **Espaçador:** abaixo do `<header>` há um bloco com altura 64px + `marginBottom: 24px` para o conteúdo não ficar atrás do header.

Arquivo: `src/components/shared/app-page-header.tsx`.

### Header da sidebar

- **Posicionamento:** dentro do `aside`; altura fixa 64px (via estilo inline).
- **Única linha:** `border-b border-slate-700` abaixo do logo “ness.OS”.

Desktop expandido: logo + `SidebarTrigger`. Desktop recolhido: faixa 48px com trigger + ícone brand. Mobile: drawer com logo + botão fechar.

Arquivos: `src/components/app/app-sidebar.tsx`, `src/components/app/sidebar-context.tsx`, `src/components/app/app-header.tsx`.

## Linhas separadoras

- **Sidebar:** uma linha horizontal abaixo de “ness.OS” (`border-b` no header da sidebar).
- **Página:** uma linha horizontal abaixo do título/subtítulo (`border-b` no `AppPageHeader`).

Não há bordas duplicadas nesses blocos; cada contexto tem uma única linha de separação.

## Referências

- Constantes: `src/lib/header-constants.ts`
- Design tokens (espaçamento, alturas): [DESIGN-TOKENS.md](./DESIGN-TOKENS.md)
- Estrutura de pastas do app: [SETUP-INICIAL.md](./SETUP-INICIAL.md)
