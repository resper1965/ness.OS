---
status: ready
generated: 2026-01-29
updated: 2026-02-03
planSlug: ajuste-ux-ui-nessos
planVinculado: docs/AVALIACAO-FRONTEND-ESPACAMENTO.md
constrains:
  - "Respeitar ness. branding (ness., ness.OS, módulos ness.X)"
  - "Manter stack: Next.js, Tailwind, shadcn/ui"
  - "Sem breaking changes em funcionalidade"
phases:
  - phase-0
  - phase-1
  - phase-2
  - phase-3
  - phase-4
  - phase-5
---

# Ajuste UX/UI — ness.OS

> Melhorar interface e experiência do usuário da aplicação interna ness.OS, respeitando melhores práticas de design (8pt grid, hierarquia visual, feedback, acessibilidade) e mantendo consistência entre módulos.

**Referências:** [docs/AVALIACAO-FRONTEND-ESPACAMENTO.md](../../docs/AVALIACAO-FRONTEND-ESPACAMENTO.md), [docs/LAYOUT-APP-HEADERS.md](../../docs/LAYOUT-APP-HEADERS.md)

**Trigger:** "ajuste UX/UI", "melhora interface", "design system" ou "ajuste design ness.OS"

---

## Fase 0 — Correções prioritárias (2026-02-03)

**Problemas reportados:** Homogeneização, espaçamentos errados, grids que se sobrepõem ou encostam em limites de tela, formulários compridos demais (rolagem excessiva).

| Problema | Solução |
|----------|---------|
| **Formulários longos estreitos** | Aumentar `max-w-2xl` → `max-w-4xl` (896px) para case-form, post-editor-form, playbook-editor-form, proposta-form, policy-form — reduz rolagem |
| **max-width inconsistente** | Padronizar: forms curtos `max-w-xl`, forms longos `max-w-4xl` |
| **Header/grid encostando** | Garantir `min-w-0` em flex children; `overflow-x-auto` em tabelas; margens consistentes |
| **Espaçamentos** | Usar design-tokens; evitar sobreposição de margens negativas |

**Executado 2026-02-03:** Forms longos → max-w-4xl; forms curtos → max-w-xl; tabelas → overflow-x-auto; main → min-w-0; grids → min-w-0.

---

## Princípios de Design

| Princípio | Descrição |
|-----------|-----------|
| **8pt Grid** | Espaçamentos múltiplos de 8 (8, 16, 24, 32px) para ritmo visual consistente |
| **Hierarquia clara** | Títulos, subtítulos e corpo com escala tipográfica definida |
| **Feedback imediato** | Loading, success, error em toda ação assíncrona |
| **Estado vazio útil** | Empty states com CTA e explicação do que fazer |
| **Acessibilidade** | Contraste WCAG AA, foco visível, labels em formulários |

---

## Ações Executáveis (ai-context)

> Use `plan({ action: "updateStep", planSlug: "ajuste-ux-ui-nessos", phaseId, stepIndex, status, output?, notes? })` para marcar progresso.

### phase-1 — Design Tokens e Consistência
| stepIndex | Ação | Artefato | Entrega |
|-----------|------|----------|---------|
| 1 | Criar `src/lib/design-tokens.ts` | tokens.ts | Spacing (8pt), typography scale, radii |
| 2 | Revisar espaçamento sidebar | app-sidebar.tsx | `space-y-0.5` → `space-y-1` ou `gap-2` consistente |
| 3 | Garantir headers 64px idênticos e fixos | app-page-header, sidebar | min/max 64px; AppPageHeader position: fixed, não some ao rolar |
| 4 | Documentar tokens em `docs/DESIGN-TOKENS.md` | DESIGN-TOKENS.md | DoD Fase 1 |

### phase-2 — Componentes Base
| stepIndex | Ação | Artefato | Entrega |
|-----------|------|----------|---------|
| 1 | Padronizar inputs (label, placeholder, helper, error) | InputField wrapper | Acessibilidade, estados |
| 2 | Loading states em botões e tabelas | Skeleton, Spinner | Feedback visual |
| 3 | EmptyState em todas as listagens | empty-state.tsx | Mensagem + CTA por contexto |
| 4 | Toasts para feedback de ações | useToast ou similar | Success/error após submit |

### phase-3 — Páginas por Módulo
| stepIndex | Ação | Módulos | Entrega |
|-----------|------|---------|---------|
| 1 | Homogeneizar layout (header + content + cards) | growth, ops, fin, people, jur, gov | PageContent, PageCard em todas |
| 2 | Padronizar títulos e breadcrumbs | Todas as páginas app | AppPageHeader com subtitle |
| 3 | Tabelas com DataTable + StatusBadge | leads, contratos, vagas, playbooks | Colunas consistentes, ações |
| 4 | Forms com validação visual (Zod) | leads, posts, contratos, vagas | Mensagens de erro inline |

### phase-4 — Acessibilidade e Responsivo
| stepIndex | Ação | Artefato | Entrega |
|-----------|------|----------|---------|
| 1 | Contraste texto/fundo (slate + ness) | globals.css, tailwind | WCAG AA mínimo |
| 2 | Focus visible em interativos | outline, ring | skip-link, tab ordem |
| 3 | Labels em todos os inputs | Formulários | aria-label quando necessário |
| 4 | Sidebar colapsável em mobile | app-sidebar | Menu hamburger, overlay |

### phase-5 — Validação e Documentação
| stepIndex | Ação | Comando/Artefato |
|-----------|------|------------------|
| 1 | Lighthouse acessibilidade | DevTools |
| 2 | Teste manual navegação por teclado | Tab, Enter, Esc |
| 3 | Atualizar DESIGN-TOKENS.md | Checklist final |
| 4 | Commit | `style(ux): ajuste interface ness.OS` |

---

## Resumo das Fases

| Fase | Foco | Entregas |
|------|------|----------|
| 1 | Tokens e consistência | design-tokens.ts, espaçamentos, headers 64px, header fixo |
| 2 | Componentes base | Inputs, loading, empty state, toasts |
| 3 | Páginas por módulo | Layout homogêneo, tabelas, forms |
| 4 | Acessibilidade e mobile | Contraste, focus, labels, sidebar responsivo |
| 5 | Validação | Lighthouse, teste manual, docs |

---

## FASE 1 — Design Tokens e Consistência

**Objetivo:** Estabelecer base visual consistente antes de alterar páginas.

### Passo 1.1 — Criar design-tokens.ts
```typescript
// src/lib/design-tokens.ts
export const spacing = {
  xs: 4,   // 0.5 * 8
  sm: 8,   // 1 * 8
  md: 16,  // 2 * 8
  lg: 24,  // 3 * 8
  xl: 32,  // 4 * 8
  '2xl': 48,
} as const;

export const headerHeight = 64;  // APP_HEADER_HEIGHT_PX em src/lib/header-constants.ts
export const sidebarWidth = 224; // w-56 (14rem)
```

### Passo 1.2 — Sidebar
- [ ] `space-y-0.5` entre itens → `space-y-1` (4px) ou `gap-2` (8px) entre grupos
- [ ] Espaço header ↔ nav = espaço entre grupos

### Passo 1.3 — Headers
- [x] `AppPageHeader`: minHeight 64px, maxHeight 64px; **position: fixed** (não some ao rolar); left: 224px (sidebar), right: 0; espaçador abaixo.
- [x] Sidebar header: 64px (min/max), mb-4.
- [ ] UserRoleBadge sempre visível (fallback "—")

### Passo 1.4 — Documentar
- [ ] `docs/DESIGN-TOKENS.md` com escala de espaçamento, tipografia, cores

---

## FASE 2 — Componentes Base

**Objetivo:** Componentes reutilizáveis com boa UX.

### Passo 2.1 — InputField
- [ ] Label associado (htmlFor, id)
- [ ] Placeholder descritivo
- [ ] Mensagem de erro abaixo (text-destructive)
- [ ] Helper text opcional
- [ ] Estado disabled visível

### Passo 2.2 — Loading
- [ ] Skeleton para tabelas e cards
- [ ] Spinner em botões de submit (disabled + loading)
- [ ] Suspense boundaries em rotas dinâmicas

### Passo 2.3 — EmptyState
- [ ] Ícone, título, descrição, CTA
- [ ] Usar em: leads, posts, contratos, vagas, playbooks, políticas

### Passo 2.4 — Toasts
- [ ] Success após create/update/delete
- [ ] Error com mensagem clara
- [ ] Usar em Server Actions (revalidatePath + toast)

---

## FASE 3 — Páginas por Módulo

**Objetivo:** Layout e padrões homogêneos em todos os módulos.

### Estrutura padrão de página
```
<PageContent>
  <AppPageHeader title="..." subtitle="..." />
  <PageCard>
    {/* Conteúdo ou EmptyState */}
  </PageCard>
</PageContent>
```

### Módulos a ajustar
| Módulo | Páginas | Ajustes |
|--------|---------|---------|
| growth | leads, postas, posts, casos, services | DataTable, EmptyState, forms |
| ops | playbooks, metricas, assets | Idem |
| fin | contratos, rentabilidade, alertas | Idem |
| people | vagas, candidatos, gaps, 360 | Idem |
| jur | conformidade, risco | Idem |
| gov | politicas, aceites | Idem |

### Passo 3.1 — Layout
- [ ] Todas as páginas usam PageContent (space-y-6)
- [ ] Todas usam PageCard para blocos de conteúdo
- [ ] AppPageHeader em todas (title obrigatório)

### Passo 3.2 — Tabelas
- [ ] DataTable com colunas definidas
- [ ] StatusBadge para status
- [ ] Ações (editar, excluir) com ícones + tooltip

### Passo 3.3 — Forms
- [ ] Validação Zod com mensagens em português
- [ ] Erro exibido inline (não apenas toast)
- [ ] Botão submit com loading state

---

## FASE 4 — Acessibilidade e Responsivo

**Objetivo:** WCAG AA e uso confortável em mobile.

### Passo 4.1 — Contraste
- [ ] text-slate-300 em bg-slate-900 ≥ 4.5:1
- [ ] text-ness em bg escuro ≥ 4.5:1
- [ ] Botões ness em fundo escuro legíveis

### Passo 4.2 — Foco
- [ ] `:focus-visible` com ring-ness ou outline
- [ ] Skip link "Ir para conteúdo" no app layout
- [ ] Tab ordem lógica (header → sidebar → main)

### Passo 4.3 — Labels
- [ ] Todos os inputs com label visível ou aria-label
- [ ] Botões com texto ou aria-label (ícones sozinhos)

### Passo 4.4 — Mobile
- [ ] Sidebar colapsável (drawer) em <768px
- [ ] Tabelas com scroll horizontal ou cards em mobile
- [ ] Touch targets ≥ 44px

---

## FASE 5 — Validação

**Objetivo:** Garantir que ajustes não quebraram nada.

### Passo 5.1 — Lighthouse
- [ ] Accessibility score ≥ 90
- [ ] Best Practices ≥ 90

### Passo 5.2 — Manual
- [ ] Navegação por teclado (Tab, Enter, Esc)
- [ ] Screen reader básico (NVDA/VoiceOver)
- [ ] Zoom 200% ainda usável

### Passo 5.3 — Docs
- [ ] DESIGN-TOKENS.md atualizado
- [ ] Checklist de novos componentes

---

## Métricas de Sucesso

| Métrica | Meta |
|---------|------|
| Lighthouse Accessibility | ≥ 90 |
| Páginas com EmptyState | 100% listagens |
| Páginas com loading state | 100% assíncronas |
| Consistência headers | 64px em todas; header da página fixo ao rolar |
| Espaçamento 8pt | 100% layout |

---

## Ordem de Execução

1. **FASE 1** — Base (tokens, sidebar, headers)
2. **FASE 2** — Componentes (inputs, loading, empty, toasts)
3. **FASE 3** — Aplicar em páginas (por módulo)
4. **FASE 4** — Acessibilidade e mobile
5. **FASE 5** — Validação

---

## Referências

- [8pt Grid System](https://spec.fm/specifics/8-pt-grid)
- [WCAG 2.1 AA](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design - Layout](https://m3.material.io/foundations/layout/understanding-layout/overview)
- [Nielsen Norman - Empty States](https://www.nngroup.com/articles/empty-states/)
