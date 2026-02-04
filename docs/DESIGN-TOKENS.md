# Design Tokens — ness.OS

Espaçamentos baseados em **8pt grid** para ritmo visual consistente.

## Escala de Espaçamento

| Token | Valor | Tailwind |
|-------|-------|----------|
| xs | 4px | space-1 |
| sm | 8px | space-2 |
| md | 12px | space-3 |
| lg | 16px | space-4 |
| xl | 24px | space-6 |
| 2xl | 32px | space-8 |
| 3xl | 40px | space-10 |

## Largura de Formulários

| Tipo | Classe | Largura |
|------|--------|---------|
| Curto (1-4 campos) | max-w-xl | 576px |
| Médio (5-8 campos) | max-w-2xl | 672px |
| Longo (9+ campos, textareas) | max-w-4xl | 896px |

Forms longos usam `max-w-4xl` para reduzir rolagem vertical.

## Alturas e larguras de layout

| Contexto | Valor | Uso |
|----------|--------|-----|
| AppPageHeader / AppHeader global | 64px | Header fixo com título e ações (position: fixed; não some ao rolar; alinhado à sidebar) |
| Sidebar expandida | 224px | `SIDEBAR_WIDTH_PX` em `header-constants.ts`; sidebar desktop aberta |
| Sidebar recolhida (icon strip) | 48px | `SIDEBAR_COLLAPSED_PX` em `sidebar-context.tsx`; desktop colapsado |
| Section/Card/Table | 52px | PageCard title, cards do dashboard, thead de tabelas |

Headers de seção usam `min-h-[52px]` ou `h-[52px]` para consistência visual.

## Uso Recomendado

| Contexto | Classe | Valor |
|----------|--------|-------|
| Entre itens de menu | space-y-1 / space-y-2 | 4–8px |
| Entre seções de página | space-y-8 | 32px |
| Entre campos de formulário | space-y-6 / space-y-8 | 24–32px |
| Label → input | mb-3 | 12px |
| Células de tabela | px-5 py-4 | 20×16px |
| Padding de container | p-8 | 32px |
| Header da sidebar | mb-4 | 16px |

## Componentes UX (Fase 2)

### Toasts (sonner)

- **Toaster** está no layout do app (`/app/app/layout.tsx`): tema `dark`, posição `bottom-right`, `richColors`, `closeButton`.
- **Uso:** em formulários client, após submit: Server Action retorna `{ success?: boolean; error?: string }`; no componente, `useEffect` ou handler chama `toast.success('...')` ou `toast.error(state.error)`.
- **Padrão:** manter mensagem de erro inline no form (acessibilidade) e toast como feedback adicional.

```ts
import { toast } from 'sonner';
useEffect(() => {
  if (state?.success) toast.success('Registro criado.');
  if (state?.error) toast.error(state.error);
}, [state?.success, state?.error]);
```

### InputField

- **Arquivo:** `src/components/shared/input-field.tsx`.
- **Props:** `id`, `label`, `name`, `placeholder?`, `helper?`, `error?`, `disabled?`, `required?`, `as?: 'input' | 'select' | 'textarea'`.
- **Acessibilidade:** label com `htmlFor`/`id`; `aria-invalid` e `aria-describedby` quando há helper/erro; erro com `role="alert"`.

### Componentes UI (primitivos shadcn-style)

- **Pasta:** `src/components/ui/` — primitivos alinhados ao [plano Bundui componentes profundos](../.context/plans/bundui-componentes-profundos-nessos.md).
- **Button:** `import { Button, buttonVariants } from "@/components/ui/button"`. Variantes: default (ness), destructive, outline, secondary, ghost, link. Tamanhos: default, sm, lg, icon.
- **Card:** `import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"`. Bordas slate-700, fundo slate-800/50.
- **Documentação:** `src/components/ui/README.md`. Wrappers existentes (PrimaryButton, PageCard) permanecem; podem usar ui/ internamente no futuro.

### PrimaryButton

- **Loading:** prop `loading` desabilita o botão e exibe spinner; usar em submits (`as="button"` + `type="submit"`).

### Skeleton / TableSkeleton

- **Arquivo:** `src/components/shared/skeleton.tsx`.
- **Uso:** loading de tabelas e cards; `TableSkeleton rows={5} cols={4}` para placeholder de listagens.

## Acessibilidade (Fase 4)

### Foco visível

- **globals.css:** `:focus-visible` com outline ness (#00ade8); `:focus:not(:focus-visible)` sem outline (evita anel no clique com mouse).
- **InputField:** já usa `focus:border-ness focus:ring-1 focus:ring-ness`.

### Skip link

- **Layout app:** primeiro elemento focusable é o link "Ir para o conteúdo" (href="#main-content"); posição fixa, fora da tela até receber foco (Tab).
- **Conteúdo principal:** `<main id="main-content" tabIndex={-1}>` para permitir foco programático.

### Contraste

- **text-slate-300** em bg-slate-900 e **text-ness** (#00ade8) em fundo escuro atendem WCAG AA (≥ 4.5:1) para texto normal.
- Botões ness (bg-ness, text-white) legíveis em fundo escuro.

### Mobile

- Sidebar colapsável (drawer) em &lt;768px (SidebarProvider/AppSidebar).
- Tabelas com `overflow-x-auto` dentro de PageCard; touch targets em botões ≥ 44px (py-2 px-4).

## Tema (light/dark)

- **Provider:** `next-themes` no root layout (`src/app/layout.tsx`); `ThemeProvider` em `src/components/providers/theme-provider.tsx`.
- **Toggle:** `ThemeToggle` em `src/components/app/theme-toggle.tsx`; exposto no AppHeader (ícone Sol/Lua). Alterna entre `dark` e `light`; preferência persistida em cookie (next-themes).
- **Variáveis:** `globals.css` — `:root` = tema escuro (default); `.light` = tema claro (--background, --foreground, --primary, --muted, --border, etc.). Primary ness (#00ade8) mantido em ambos.
- **Default:** tema escuro (`defaultTheme="dark"`). Contraste WCAG: validar em ambos os modos (VALIDACAO-MANUAL item 8).

## Checklist de validação (Fase 5)

Antes de release, executar manualmente:

1. **Lighthouse (DevTools):** Accessibility ≥ 90; Best Practices ≥ 90.
2. **Teclado:** Tab (skip link → sidebar → header → main); Enter em links/botões; Esc fecha modais.
3. **Screen reader:** NVDA/VoiceOver — labels em inputs, títulos de página, mensagens de erro.
4. **Zoom 200%:** layout ainda utilizável (overflow-x em tabelas, quebras de linha).
5. **Novos componentes:** usar InputField (label+id), PrimaryButton (loading), PageCard para blocos; toast após ações assíncronas.

## Fase 5 — Validação

- **Checklist executável:** [FASE-5-VALIDACAO-UX.md](./FASE-5-VALIDACAO-UX.md) — Lighthouse, teclado, zoom, screen reader.
- **Pré-validação:** `npm run validate:ux` (lint + build) antes dos testes manuais.

## Referências

- [LAYOUT-APP-HEADERS.md](./LAYOUT-APP-HEADERS.md) — Layout do app, headers fixos e linhas únicas
- [FASE-5-VALIDACAO-UX.md](./FASE-5-VALIDACAO-UX.md) — Checklist Fase 5 (Lighthouse, a11y)
- [AVALIACAO-FRONTEND-ESPACAMENTO.md](./AVALIACAO-FRONTEND-ESPACAMENTO.md)
- [.context/plans/ajuste-ux-ui-nessos.md](../.context/plans/ajuste-ux-ui-nessos.md)
