# Fase P — Inventário e compatibilidade (Bundui componentes profundos)

Plano: `bundui-componentes-profundos-nessos`. Artefato de planejamento da Fase 1.

---

## 1. components/ui (primitivos) — lista e dependências

Inventário típico de kits shadcn/Bundui (referência: [Bundui shadcn-ui-kit-dashboard/components/ui](https://github.com/bundui/shadcn-ui-kit-dashboard/tree/main/components/ui)):

| Primitivo | Dependências comuns |
|-----------|---------------------|
| button | CVA, tailwind-merge, Radix Slot (opcional) |
| card | tailwind (CardHeader, CardContent, CardFooter) |
| sidebar | SidebarProvider, Sheet (mobile), Tooltip, Separator |
| sheet | Radix Dialog/Drawer, overlay |
| input | Label, forwardRef |
| label | Radix Label |
| table | TableHeader, TableBody, TableRow, TableCell |
| dialog | Radix Dialog, overlay |
| select | Radix Select |
| dropdown-menu | Radix DropdownMenu |
| skeleton | div + animate-pulse |
| tooltip | Radix Tooltip, TooltipProvider |
| separator | Radix Separator |

**Nota:** Repo Bundui pode não estar acessível via API; usar [shadcn/ui](https://ui.shadcn.com/) como fonte alternativa para primitivos compatíveis com React 18.

---

## 2. components/ (composados) — lista

| Composado | Uso típico | Depende de (ui/) |
|-----------|------------|-------------------|
| app-sidebar | Navegação lateral | sidebar, sheet, tooltip |
| site-header | Barra superior (trigger + título) | button, sidebar (trigger) |
| Dashboard cards / stats | Cards de estatística no dashboard | card, skeleton |
| Data tables | Tabelas com filtros/pagination | table, button, input |
| Forms (bloco) | Formulários multi-campo | input, label, button, select |

---

## 3. Mapeamento Bundui → ness.OS atual

| Bundui (ui/) | ness.OS hoje | Decisão |
|--------------|--------------|---------|
| button | PrimaryButton (shared), estilos inline | **Estender:** adotar ui/button; PrimaryButton vira wrapper. |
| card | PageCard, bordas slate | **Estender:** adotar ui/card; PageCard usa ui/card ou mantém. |
| sidebar | sidebar-context + AppSidebar custom | **Revisar:** já adaptado no layout; ver se Bundui ui/sidebar traz melhorias. |
| sheet | — | **Adotar:** drawer mobile se ainda não houver. |
| input | InputField (shared) | **Estender:** ui/input + ui/label; InputField usa ou mantém. |
| table | DataTable (shared) | **Estender:** ui/table; DataTable usa primitivos ou mantém. |
| dialog | — | **Adotar:** modais (confirm, alert). |
| select, dropdown-menu | — | **Adotar:** se necessário para filtros/forms. |
| skeleton | Skeleton (shared) | **Alinhar:** com ui/skeleton se existir. |
| tooltip | — | **Adotar:** sidebar icon mode, hover. |

| Bundui (components/) | ness.OS | Decisão |
|---------------------|---------|---------|
| app-sidebar | AppSidebar (nav-config) | Alinhar visual/a11y se desejado. |
| site-header | AppHeader | Idem. |
| Dashboard cards/stats | /app grid de links | **Opcional:** adicionar cards de stat (ex.: total leads). |
| Charts | — | Opcional; só se requisito. |
| Forms em bloco | ContractForm, etc. | Padronizar com ui/input, ui/label. |

---

## 4. Compatibilidade Tailwind 3

- **Bundui pode usar Tailwind 4:** reescrever classes ao copiar (Tailwind 3 não tem todas as utilidades do v4).
- **Cores:** usar design tokens ness.OS (slate-*, ness, border-slate-700, etc.) — ver `docs/DESIGN-TOKENS.md`.
- **Espaçamento:** 8pt grid (8, 16, 24, 32px); evitar valores custom que não existam no Tailwind 3.

---

## 5. Decisão: shadcn CLI vs cópia manual

| Opção | Prós | Contras |
|-------|------|---------|
| **shadcn CLI** | Consistência, updates oficiais | Exige `components.json`; ness.OS não tem hoje. |
| **Cópia manual** | Controle fino, sem novo tooling | Manutenção manual; fonte = Bundui ou shadcn/ui. |

**Decisão:** **Cópia manual** na primeira leva (Fase 2). Fonte: [ui.shadcn.com](https://ui.shadcn.com/) (React 18 compatível). Se depois for necessário escalar, criar `components.json` e usar CLI para novos primitivos. Evitar copiar direto do Bundui se o repo usar Tailwind 4 / React 19; preferir shadcn/ui oficial.

---

## DoD Fase P

- [x] Lista de primitivos (components/ui) e dependências
- [x] Lista de composados (components/)
- [x] Tabela de mapeamento Bundui → ness.OS e decisão por componente
- [x] Nota de compatibilidade Tailwind 3
- [x] Decisão registrada: cópia manual + shadcn/ui como fonte na Fase 2

**Próximo:** Fase R (Revisão) — aprovar inventário e ordem de implementação; em seguida Fase E (Execução).
