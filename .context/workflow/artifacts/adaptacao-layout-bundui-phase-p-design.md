# Fase P — Adaptação layout Bundui → ness.OS

Artefato de planejamento e decisões. Plano: `adaptacao-layout-bundui-nessos`.

---

## 1. Auditoria do repo Bundui (step 1)

**Fonte:** [bundui/shadcn-admin-dashboard-free](https://github.com/bundui/shadcn-admin-dashboard-free)

| Aspecto | Bundui |
|---------|--------|
| **Layout dashboard** | `app/dashboard/layout.tsx`: `SidebarProvider` > `AppSidebar` + `SidebarInset`; dentro do Inset: `SiteHeader` + `{children}` |
| **Rotas dashboard** | `/dashboard`, `/dashboard/users`, `/dashboard/settings`, `/login`, `/register`, 404/500 |
| **Sidebar (UI)** | `components/ui/sidebar.tsx`: `SidebarProvider` (context: state expanded/collapsed, open, isMobile, toggleSidebar), `Sidebar` (collapsible: offcanvas \| icon \| none), `SidebarInset` (main), `SidebarTrigger`, `SidebarHeader`, `SidebarContent`, `SidebarFooter`, `SidebarMenu`, `SidebarMenuButton`, etc. Mobile = Sheet. Cookie para estado, atalho Cmd/Ctrl+B. Larguras: 16rem expandida, 3rem icon. |
| **AppSidebar (Bundui)** | `components/app-sidebar.tsx`: usa `NavMain`, `NavSecondary`, `NavUser`; dados hardcoded (navMain, navClouds, navSecondary). Ícones: @tabler/icons-react. |
| **Header** | `components/site-header.tsx`: `SidebarTrigger` + título "Dashboard" + links (Get Pro, etc.). |

**Dependências Bundui relevantes:** next 16, react 19, tailwind 4, class-variance-authority, clsx, tailwind-merge, lucide-react, react-resizable-panels, radix-ui (Slot), Sheet, Button, Separator, Skeleton, Tooltip, use-mobile (hook). Sidebar usa `Slot as SlotPrimitive` de "radix-ui".

---

## 2. Mapeamento equivalências (step 2)

| Bundui | ness.OS atual | Ação |
|--------|----------------|------|
| `SidebarProvider` | — | Introduzir; envolve sidebar + main. |
| `AppSidebar` (Bundui) | `components/app/app-sidebar.tsx` | **Substituir implementação visual**, manter **dados** de `nav-config.ts` (navModules, getAllItems). Não usar NavMain/NavUser do Bundui; manter collapsible groups por módulo e NessBrand. |
| `Sidebar` (UI) | Sidebar fixa com `SIDEBAR_WIDTH_PX` (224px) | Adotar componente Sidebar do shadcn (colapsável se decidido). |
| `SidebarInset` | `<main className="..." style={{ marginLeft: SIDEBAR_WIDTH_PX }}>` | Trocar por `SidebarInset`; largura/inset vêm do contexto. |
| `SiteHeader` | Headers por página (AppPageHeader em várias rotas) | Decisão em step 4: header global vs por página. |
| `layout.tsx` (dashboard) | `app/app/layout.tsx` | Injetar SidebarProvider + Sidebar (nosso AppSidebar dentro) + SidebarInset; manter RoleProvider e auth. |

**Arquivos a adaptar (ordem):**

1. `src/app/app/layout.tsx` — estrutura SidebarProvider + SidebarInset.
2. `src/components/app/app-sidebar.tsx` — usar Sidebar* do UI; conteúdo continua de nav-config.
3. `src/lib/header-constants.ts` — eventual alinhamento com 16rem (256px) ou manter 224px.
4. Opcional: novo `AppHeader` global (SiteHeader-like) se decisão for header global.

---

## 3. Decisão: sidebar colapsável ou sempre expandida (step 3)

**Decisão:** **Colapsável**, com **default expandida** para não alterar comportamento inicial. Em desktop: modo expandido (16rem) ou icon-only (3rem). Em mobile: Sheet (drawer).

**Alternativas consideradas:** Sempre expandida (menos mudança, mas sem alinhamento ao Bundui); sempre colapsada (pior UX para quem está acostumado).

**Registrado no ai-context:** recordDecision.

---

## 4. Decisão: header global único vs por página (step 4)

**Decisão:** **Header global** (tipo SiteHeader) com: SidebarTrigger + breadcrumb/título da área atual (derivado da rota). **Headers de página** (AppPageHeader) permanecem **dentro** do conteúdo para títulos de seção/card (ex.: "Leads", "Contratos"). Ou seja: uma barra superior global (trigger + contexto) + títulos de seção dentro do main.

**Alternativas consideradas:** Só headers por página (menos mudança); só header global sem títulos de seção (perde hierarquia).

**Registrado no ai-context:** recordDecision.

---

## 5. Componentes a reutilizar / instalar (step 5)

**Do Bundui/shadcn a adotar:**

| Componente | Onde | Ação ness.OS |
|------------|------|--------------|
| `SidebarProvider`, `Sidebar`, `SidebarInset`, `SidebarTrigger`, `SidebarHeader`, `SidebarContent`, `SidebarFooter` | ui/sidebar | Adicionar via shadcn CLI (sidebar) ou copiar adaptado. |
| `SidebarMenu`, `SidebarMenuButton`, `SidebarMenuItem`, `SidebarGroup`, `SidebarGroupLabel`, `SidebarGroupContent` | ui/sidebar | Idem. |
| `Sheet`, `SheetContent` | ui/sheet | Para sidebar mobile (drawer). |
| `Button`, `Separator` | ui/button, ui/separator | Se ainda não existirem. |
| Hook `useIsMobile` | hooks/use-mobile | Necessário para sidebar (mobile vs desktop). |
| `TooltipProvider`, `Tooltip`, `TooltipTrigger`, `TooltipContent` | ui/tooltip | Para SidebarMenuButton em modo icon. |
| `Skeleton` | ui/skeleton | Opcional (loading sidebar). |

**Dependências:** Bundui usa Next 16, React 19, Tailwind 4. **ness.OS** usa Next 14, React 18, Tailwind 3. **Não** atualizar Next/React por causa deste plano; usar **sidebar shadcn compatível com Next 14** (copiar de shadcn/ui ou versão compatível). Evitar `radix-ui` como pacote (Bundui usa); ness.OS já tem `@radix-ui/react-slot` — sidebar shadcn oficial usa Radix primitives, não o pacote "radix-ui". Instalar apenas: componentes shadcn (sidebar, sheet, button, separator, tooltip, skeleton se necessário) e criar `use-mobile` (ou usar implementação simples com matchMedia).

**Conflitos:** Nenhuma rota ou action alterada. `nav-config.ts` e `getAllItems()` permanecem; apenas a UI da sidebar muda.

---

## 6. Ordem de implementação (step 6)

1. **Shell (layout + sidebar)**  
   - 1.1 Instalar/ajustar shadcn: `components.json` se ainda não existir; adicionar `sidebar`, `sheet`, `tooltip`, `skeleton`; criar `hooks/use-mobile.ts`.  
   - 1.2 Em `app/app/layout.tsx`: introduzir `SidebarProvider` + nosso `AppSidebar` (dentro de `Sidebar`) + `SidebarInset`; manter RoleProvider e redirect de auth.  
   - 1.3 Adaptar `AppSidebar`: usar `SidebarHeader`, `SidebarContent`, `SidebarFooter` e blocos SidebarMenu; **dados** de `navModules`/getAllItems; ícones lucide-react; colapsável (estado do provider); mobile = Sheet.  
   - 1.4 Ajustar main: conteúdo dentro de `SidebarInset`; preservar `min-w-0`, `overflow-auto`, padding atual.

2. **Header global**  
   - 2.1 Criar `AppHeader` (SiteHeader-like): SidebarTrigger + título/breadcrumb da rota.  
   - 2.2 Inserir AppHeader dentro de SidebarInset, acima de `{children}`.

3. **Headers de página e cards (opcional)**  
   - 3.1 Alinhar AppPageHeader ao estilo Bundui (altura, espaçamento).  
   - 3.2 Piloto: 1–2 módulos (growth, ops) com padrão de cards do Bundui se desejado.

---

**DoD Fase P:** Decisões registradas; este artefato descreve o shell e a ordem de implementação. Fase R valida e aprova para Fase E.
