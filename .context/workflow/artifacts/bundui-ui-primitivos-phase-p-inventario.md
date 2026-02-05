# Fase P — Inventário e priorização (components/ui — resper1965/clone)

Plano: `bundui-ui-primitivos-nessos`. Artefato da Fase 1. **Fonte:** [resper1965/clone](https://github.com/resper1965/clone) (obtido via MCP GitHub).

---

## 1. Lista real em components/ui (resper1965/clone)

Arquivos e diretórios presentes no repositório (56+ itens):

| Primitivo | Arquivo | ness.OS hoje |
|-----------|---------|--------------|
| accordion | accordion.tsx | — |
| alert-dialog | alert-dialog.tsx | — |
| alert | alert.tsx | — |
| aspect-ratio | aspect-ratio.tsx | — |
| avatar | avatar.tsx | — |
| badge | badge.tsx | — |
| breadcrumb | breadcrumb.tsx | getBreadcrumb (texto) |
| button-group | button-group.tsx | — |
| button | button.tsx | ✅ ui/button |
| calendar | calendar.tsx | — |
| card | card.tsx | ✅ ui/card |
| carousel | carousel.tsx | — |
| chart | chart.tsx | — |
| checkbox | checkbox.tsx | — |
| collapsible | collapsible.tsx | — |
| command | command.tsx | — |
| context-menu | context-menu.tsx | — |
| custom/ | (dir) | — |
| dialog | dialog.tsx | — |
| drawer | drawer.tsx | — |
| dropdown-menu | dropdown-menu.tsx | — |
| empty | empty.tsx | — |
| field | field.tsx | — |
| form | form.tsx | — |
| hover-card | hover-card.tsx | — |
| input-group | input-group.tsx | — |
| input-otp | input-otp.tsx | — |
| input | input.tsx | InputField (shared) |
| item | item.tsx | — |
| kanban | kanban.tsx | — |
| kbd | kbd.tsx | — |
| label | label.tsx | — |
| menubar | menubar.tsx | — |
| native-select | native-select.tsx | — |
| navigation-menu | navigation-menu.tsx | — |
| pagination | pagination.tsx | — |
| popover | popover.tsx | — |
| progress | progress.tsx | — |
| radio-group | radio-group.tsx | — |
| resizable | resizable.tsx | — |
| scroll-area | scroll-area.tsx | — |
| select | select.tsx | — |
| separator | separator.tsx | — |
| sheet | sheet.tsx | — |
| sidebar | sidebar.tsx | sidebar-context + AppSidebar |
| skeleton | skeleton.tsx | Skeleton (shared) |
| slider | slider.tsx | — |
| sonner | sonner.tsx | — |
| spinner | spinner.tsx | — |
| switch | switch.tsx | — |
| table | table.tsx | DataTable (shared) |
| tabs | tabs.tsx | — |
| textarea | textarea.tsx | — |
| timeline | timeline.tsx | — |
| toast | toast.tsx | — |
| toggle-group | toggle-group.tsx | — |
| toggle | toggle.tsx | — |
| tooltip | tooltip.tsx | — |

---

## 2. Dependências e compatibilidade

- **clone:** Next 15, React 19 (README); ao copiar, adaptar para Next 14, React 18 e Tailwind 3.
- Radix: label, dialog, select, dropdown-menu, tooltip, separator, popover, checkbox, tabs, etc. — compatíveis React 18.
- **Ajustes:** cn(), design tokens ness.OS (slate-*, ness); reescrever classes Tailwind 4 → 3 se necessário.

---

## 3. Ordem de priorização para adoção (Fase 2)

| Ordem | Primitivo | Justificativa |
|-------|-----------|---------------|
| 1 | Sheet | Drawer mobile, painéis laterais. |
| 2 | Input | Formulários; InputField pode usar. |
| 3 | Label | Par com Input; a11y. |
| 4 | Dialog | Modais, confirm, alert. |
| 5 | Table | DataTable pode usar primitivos. |
| 6 | Select | Filtros e forms. |
| 7 | DropdownMenu | Ações em tabelas. |
| 8 | Skeleton | Alinhar shared/skeleton. |
| 9 | Tooltip | Sidebar, hover. |
| 10 | Separator | Divisórias. |
| (opcional) | Breadcrumb, Chart, Form, Field | Conforme necessidade. |

---

## 4. Decisão: fonte para cópia

| Opção | Decisão |
|-------|---------|
| **resper1965/clone** | **Sim** — fonte primária; adaptar para Next 14, React 18, Tailwind 3 e design tokens ness.OS. |
| shadcn/ui oficial | Fallback se algum componente do clone depender de APIs não disponíveis no ness.OS. |

---

## 5. Wrappers existentes (não quebrar)

- PrimaryButton, PageCard, InputField, DataTable, Skeleton (shared) — podem passar a usar ui/ internamente em refatoração futura.

---

## DoD Fase 1

- [x] Lista real de primitivos em components/ui (resper1965/clone)
- [x] Compatibilidade React 18 e Tailwind 3; priorização
- [x] Decisão: fonte = resper1965/clone; adaptar ao stack ness.OS

**Próximo:** Fase 2 (E) — implementar primitivos em ordem priorizada em src/components/ui/; README atualizado.
