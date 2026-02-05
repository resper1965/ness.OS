---
status: ready
planSlug: bundui-ui-primitivos-nessos
generated: 2026-02
type: frontend
trigger: "Bundui components/ui", "components/ui Bundui", "primitivos ui ness.OS"
constrains:
  - "Respeitar ness. branding (ness., ness.OS); design tokens slate-*, ness"
  - "Manter stack: Next.js 14, React 18, Tailwind 3 — sem upgrade forçado"
  - "Zero breaking: wrappers existentes (PrimaryButton, PageCard, InputField, DataTable) preservados"
  - "Adotar incrementalmente; fonte alternativa: shadcn/ui oficial se repo Bundui inacessível"
docs:
  - "project-overview.md"
  - "DESIGN-TOKENS.md"
plans:
  - "bundui-componentes-profundos-nessos.md"
---

# Plano — components/ui (primitivos Bundui) no ness.OS

> Planejar e adotar os **primitivos UI** da pasta [components/ui](https://github.com/bundui/shadcn-ui-kit-dashboard/tree/main/components/ui) do Bundui Shadcn UI Kit Dashboard no ness.OS, completando o conjunto em `src/components/ui/` com design tokens e compatibilidade Tailwind 3.

**Referência (repositório):**
- [resper1965/clone — components/ui](https://github.com/resper1965/clone/tree/main/components/ui) — primitivos shadcn (56+ arquivos: button, card, sheet, input, table, dialog, select, dropdown-menu, sidebar, chart, etc.); inventário real em artefato Fase P (via MCP GitHub).

**Trigger:** "Bundui components/ui", "components/ui", "resper1965/clone ui"

**Relação com outros planos:**
- [bundui-componentes-profundos-nessos](./bundui-componentes-profundos-nessos.md) — plano mais amplo (components/ + components/ui); **já entregou** Button e Card em `src/components/ui/`. Este plano foca **apenas** em **components/ui** e estende o inventário para os demais primitivos.

---

## Objetivo

- Inventariar o conteúdo de **components/ui** do repositório Bundui (quando acessível: clone, docs ou listagem manual).
- Completar `src/components/ui/` com os primitivos em falta: Sheet, Input, Label, Table, Dialog, Select, DropdownMenu, Skeleton, Tooltip, Separator, etc.
- Manter **Button** e **Card** já existentes; alinhar novos componentes a DESIGN-TOKENS (slate-*, ness).
- Wrappers existentes (PrimaryButton, PageCard, InputField, DataTable) permanecem; podem passar a usar ui/ internamente em refatoração futura.

---

## Restrições

| Bundui (referência) | ness.OS (manter) | Ação |
|---------------------|------------------|------|
| Next 16, React 19, Tailwind 4 | Next 14, React 18, Tailwind 3 | Copiar/adaptar; reescrever classes Tailwind 4 → 3. |
| @radix-ui/* variado | @radix-ui/react-slot já usado | Adicionar apenas Radix primitives compatíveis com React 18. |
| Ícones (Tabler ou outro) | lucide-react | Trocar ícones por Lucide equivalente. |
| Repo privado ou alterado | — | Usar [shadcn/ui](https://ui.shadcn.com/) como fonte alternativa para primitivos. |

---

## Estado atual em src/components/ui/

| Componente | Status |
|------------|--------|
| **Button** | ✅ Adotado (CVA, variantes default/destructive/outline/secondary/ghost/link, sizes). |
| **Card** | ✅ Adotado (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter). |
| **README** | ✅ Documentação dos primitivos e relação com wrappers. |

---

## Inventário esperado (components/ui)

Tipicamente kits shadcn/Bundui expõem em **components/ui**:

| Primitivo | ness.OS hoje | Ação |
|-----------|--------------|------|
| button | ✅ ui/button | Mantido. |
| card | ✅ ui/card | Mantido. |
| sidebar | sidebar-context + AppSidebar custom | Adotar ui/sidebar (shadcn) se melhorar colapsável/a11y; ou manter atual. |
| sheet | — | Adotar (drawer mobile, painéis laterais). |
| input | InputField (shared) | Adotar ui/input; InputField pode usar internamente. |
| label | — | Adotar ui/label (Radix Label). |
| table | DataTable (shared) | Adotar ui/table (Table, TableHeader, TableBody, TableRow, TableCell); DataTable pode usar. |
| dialog | — | Adotar (modais, confirm, alert). |
| select | — | Adotar (filtros, formulários). |
| dropdown-menu | — | Adotar (ações em tabelas, menus). |
| skeleton | Skeleton (shared) | Adotar ui/skeleton ou alinhar shared/skeleton com padrão shadcn. |
| tooltip | — | Adotar (sidebar icon mode, hover). |
| separator | — | Adotar (divisórias visuais). |
| popover | — | Adotar se necessário (customizer, filtros). |
| checkbox, radio-group | — | Adotar se necessário para forms. |
| tabs | — | Adotar se necessário para páginas com abas. |

**Nota:** O repositório pode não estar acessível via API. Ao executar: clone local ou documentação Bundui para listar arquivos; ou usar [ui.shadcn.com](https://ui.shadcn.com/) como fonte para cada primitivo.

---

## Fases de execução

### Fase 1 — Inventário e priorização (P)

| # | Ação | Entregável |
|---|------|------------|
| 1 | Obter lista de arquivos em `components/ui` do repo Bundui (clone ou docs). | Lista: ex.: button.tsx, card.tsx, sheet.tsx, input.tsx, table.tsx, dialog.tsx, etc. |
| 2 | Para cada primitivo: dependências (Radix, CVA, tailwind-merge), compatibilidade React 18 e Tailwind 3. | Tabela: componente, deps, ajustes necessários. |
| 3 | Priorizar ordem de adoção: Sheet, Input, Label, Table, Dialog, Select, DropdownMenu, Skeleton, Tooltip, Separator. | Lista priorizada com justificativa (uso imediato no app). |
| 4 | Decidir: adicionar via shadcn CLI (components.json) ou cópia manual de Bundui/shadcn-ui. | Decisão registrada (recordDecision). |

**DoD Fase 1:** Documento de inventário e priorização (markdown em `.context/workflow/artifacts/` ou no plano).

- **Artefato Fase 1 (P):** [bundui-ui-primitivos-phase-p-inventario.md](../workflow/artifacts/bundui-ui-primitivos-phase-p-inventario.md) — lista real de primitivos (resper1965/clone via MCP GitHub), ordem priorizada, decisão: fonte resper1965/clone; adaptar para Next 14, React 18, Tailwind 3. **Concluído.**

---

### Fase 2 — Adoção incremental (E)

| # | Ação | Entregável |
|---|------|------------|
| 1 | Implementar primitivos em ordem priorizada: Sheet, Input, Label, Table, Dialog, Select, DropdownMenu, Skeleton, Tooltip, Separator (ou subconjunto acordado). | Arquivos em `src/components/ui/` com design tokens ness.OS (slate-*, ness). |
| 2 | Garantir cada componente: forwardRef quando aplicável, cn(), variantes CVA se fizer sentido, acessibilidade (labels, roles). | Build verde; sem regressão em páginas atuais. |
| 3 | Atualizar `src/components/ui/README.md` com novos componentes e uso. | README atualizado. |
| 4 | (Opcional) Refatorar wrappers (InputField → ui/input + ui/label; DataTable → ui/table) em etapas separadas. | Sem quebra; refatoração opcional. |

**DoD Fase 2:** Conjunto acordado de primitivos ui/ disponíveis; documentação atualizada.

---

### Fase 3 — Verificação e documentação (V / C)

| # | Ação | Entregável |
|---|------|------------|
| 1 | Teste manual: formulário com ui/input, ui/label; modal com ui/dialog; tabela com ui/table (se adotados). | Checklist passando (VALIDACAO-MANUAL). |
| 2 | Atualizar DESIGN-TOKENS.md com referência a componentes ui/ adotados. | Docs atualizados. |
| 3 | Registrar no plano status (filled) e referência cruzada com bundui-componentes-profundos-nessos. | Plano atualizado. |

**DoD Fase 3:** Verificação concluída; documentação sincronizada.

---

## Riscos e mitigações

| Risco | Mitigação |
|-------|-----------|
| Bundui usa Tailwind 4 / React 19 | Copiar estrutura; reescrever classes para Tailwind 3; garantir React 18. |
| Conflito de dependências Radix | Adicionar apenas pacotes compatíveis; testar build após cada novo ui/. |
| Regressão visual | Adotar um componente por vez; manter wrappers até migração explícita. |
| Repo Bundui inacessível | Usar [shadcn/ui](https://ui.shadcn.com/) como fonte; componentes são compatíveis com Next 14 + Tailwind 3. |

---

## Referências

- [resper1965/clone — components/ui](https://github.com/resper1965/clone/tree/main/components/ui)
- [bundui-componentes-profundos-nessos](./bundui-componentes-profundos-nessos.md) — plano que já entregou Button e Card
- [docs/DESIGN-TOKENS.md](../../docs/DESIGN-TOKENS.md)
- [src/components/ui/README.md](../../src/components/ui/README.md) — estado atual dos primitivos
- [shadcn/ui](https://ui.shadcn.com/) — documentação oficial (fonte alternativa)
