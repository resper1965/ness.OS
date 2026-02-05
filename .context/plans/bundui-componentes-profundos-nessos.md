---
status: ready
planSlug: bundui-componentes-profundos-nessos
generated: 2026-02
type: frontend
trigger: "componentes Bundui", "shadcn-ui-kit-dashboard", "componentes ui Bundui"
constrains:
  - "Respeitar ness. branding (ness., ness.OS, módulos ness.X)"
  - "Manter stack: Next.js 14, React 18, Tailwind 3 — sem upgrade forçado"
  - "Zero breaking: auth, RLS, nav-config, rotas e actions intactos"
  - "Adotar incrementalmente; preferir copiar/adaptar a substituir em bloco"
docs:
  - "project-overview.md"
  - "architecture.md"
  - "DESIGN-TOKENS.md"
plans:
  - "adaptacao-layout-bundui-nessos.md"
---

# Plano — Componentes Bundui (shadcn-ui-kit-dashboard) mais profundos no ness.OS

> Adotar de forma mais profunda os componentes do [Bundui Shadcn UI Kit Dashboard](https://github.com/bundui/shadcn-ui-kit-dashboard) no ness.OS: **components** (composados) e **components/ui** (primitivos).

**Referências (repositório):**
- [components](https://github.com/bundui/shadcn-ui-kit-dashboard/tree/main/components) — componentes de aplicação (sidebar, header, cards, charts, etc.)
- [components/ui](https://github.com/bundui/shadcn-ui-kit-dashboard/tree/main/components/ui) — primitivos shadcn (Button, Card, Sidebar, Sheet, etc.)

**Trigger:** "componentes Bundui", "shadcn-ui-kit-dashboard", "implementar componentes ui Bundui"

**Relação com plano existente:** [adaptacao-layout-bundui-nessos](./adaptacao-layout-bundui-nessos.md) cobriu **layout/shell** (SidebarProvider, SidebarInset, AppSidebar, header global). Este plano estende para **componentes de UI e blocos de página** (cards, tabelas, formulários, gráficos, etc.).

---

## Objetivo

- Inventariar e priorizar componentes em `components/` e `components/ui` do repositório Bundui.
- Integrar ao ness.OS de forma **incremental**, mantendo Next 14, React 18 e Tailwind 3.
- Alinhar com DESIGN-TOKENS e com componentes já existentes (PageCard, DataTable, InputField, etc.) — substituir ou estender onde fizer sentido.

---

## Restrições de stack

| Bundui (referência) | ness.OS (manter) | Ação |
|---------------------|------------------|------|
| Next 16, React 19, Tailwind 4 | Next 14, React 18, Tailwind 3 | **Não** atualizar stack por causa deste plano; copiar/adaptar código compatível. |
| Possível uso de @radix-ui/* variado | @radix-ui/react-slot já usado | Adicionar apenas Radix primitives necessários (evitar conflito de versão). |
| Ícones (Tabler ou Lucide) | lucide-react | Manter Lucide; ao copiar componentes Bundui, trocar ícones por Lucide equivalente. |

---

## Fases de execução

### Fase 1 — Inventário e compatibilidade (P)

| # | Ação | Entregável |
|---|------|------------|
| 1 | Listar conteúdo de `components/ui`: Button, Card, Sidebar, Sheet, Input, Table, Dialog, etc. | Lista de primitivos + dependências (Radix, CVA, tailwind-merge). |
| 2 | Listar conteúdo de `components/`: app-sidebar, site-header, dashboard cards, charts, forms, etc. | Lista de composados e quais dependem de quais primitivos. |
| 3 | Mapear cada primitivo Bundui → equivalente atual no ness.OS (ex.: Bundui Card → PageCard; Button → PrimaryButton). | Tabela: Bundui component, ness.OS atual, decisão (adotar / estender / ignorar). |
| 4 | Verificar compatibilidade Tailwind 3: classes Tailwind 4 ou custom que não existem no Tailwind 3. | Lista de ajustes necessários (prefixos, cores, espaçamentos) ou uso de design tokens existentes. |
| 5 | Decidir: usar shadcn CLI (components.json) para adicionar primitivos ou copiar manualmente de Bundui/shadcn-ui. | Decisão registrada; se CLI, criar components.json e instalar apenas os necessários. |

**DoD Fase 1:** Documento de inventário (markdown) com listas, tabela de mapeamento e decisões de compatibilidade.

---

### Fase 2 — Primitivos UI (components/ui) (E)

| # | Ação | Entregável |
|---|------|------------|
| 1 | Instalar ou copiar primitivos em falta: Card, Sidebar (se ainda não integrado), Sheet, Table, Dialog, Input, Label, Select, etc. | Pasta `src/components/ui/` com componentes compatíveis com Next 14 + Tailwind 3. |
| 2 | Garantir que cada componente use design tokens do ness.OS (slate-*, ness, bordas, etc.) onde aplicável. | Componentes alinhados a DESIGN-TOKENS.md. |
| 3 | Manter ou criar wrappers de conveniência (ex.: PrimaryButton que usa ui/button) para não quebrar uso atual. | Build verde; páginas existentes sem regressão visual. |

**DoD Fase 2:** Conjunto mínimo de primitivos ui/ disponíveis e utilizáveis no app sem quebrar layout atual.

---

### Fase 3 — Componentes composados (components/) (E)

| # | Ação | Entregável |
|---|------|------------|
| 1 | Priorizar componentes Bundui úteis para o ness.OS: cards de dashboard, tabelas de dados, headers, formulários em bloco, charts (se houver). | Lista priorizada com justificativa (ex.: "card de stat" para dashboard /app). |
| 2 | Adaptar 1–2 componentes composados (ex.: card de estatística, tabela com filtros) ao ness.OS: dados de nav-config/actions, branding ness.OS. | Componentes em `src/components/` (shared ou por módulo) usando ui/ quando possível. |
| 3 | Integrar no dashboard (/app): opcionalmente substituir ou complementar o grid de widgets por blocos estilo Bundui (cards de resumo, links rápidos). | Dashboard visualmente mais rico, sem remover funcionalidade atual (widgets por role). |
| 4 | Documentar padrão: quando usar componente ui/ direto vs wrapper shared (PageCard, DataTable). | Nota em DESIGN-TOKENS ou docs/LAYOUT-APP-HEADERS. |

**DoD Fase 3:** Pelo menos um bloco de página (dashboard ou listagem) usando componentes inspirados/adaptados do Bundui; documento de padrão.

---

### Fase 4 — Verificação e documentação (V / C)

| # | Ação | Entregável |
|---|------|------------|
| 1 | Teste manual: sidebar, header, dashboard, uma listagem e um formulário; responsivo e acessibilidade (tab, skip link). | Checklist passando (ver VALIDACAO-MANUAL). |
| 2 | Atualizar docs: DESIGN-TOKENS, LAYOUT-APP-HEADERS e project-overview com referência a componentes Bundui adotados. | Docs atualizados. |
| 3 | Registrar no plano adaptacao-layout-bundui-nessos (ou neste) a conclusão da adoção de componentes profundos. | Status preenchido; referência cruzada. |

**DoD Fase 4:** Verificação concluída e documentação sincronizada.

---

## Inventário sugerido (template para Fase 1)

### components/ui (tipos comuns em kits shadcn/Bundui)

| Componente | ness.OS hoje | Ação sugerida |
|------------|--------------|---------------|
| button | PrimaryButton (shared), estilos inline | Adotar ui/button; manter PrimaryButton como wrapper. |
| card | PageCard, bordas slate | Adotar ui/card; PageCard usa ui/card internamente ou mantém atual. |
| sidebar | sidebar-context + AppSidebar custom | Já adaptado no layout; revisar se Bundui ui/sidebar traz melhorias (colapsável, a11y). |
| sheet | — | Adotar para drawer mobile se ainda não houver. |
| input | InputField (shared) | Adotar ui/input + ui/label; InputField usa ou mantém atual. |
| table | DataTable (shared) | Adotar ui/table; DataTable usa primitivos ou mantém. |
| dialog | — | Adotar para modais (confirm, alert). |
| select, dropdown-menu | — | Adotar se necessário para filtros/forms. |
| skeleton | Skeleton (shared) | Alinhar com ui/skeleton se existir no Bundui. |
| tooltip | — | Adotar para ícones e hover (sidebar icon mode). |

### components/ (composados Bundui)

| Componente | Uso no ness.OS | Ação sugerida |
|------------|----------------|----------------|
| app-sidebar | Já temos AppSidebar (nav-config) | Apenas alinhar visual/a11y com Bundui se desejado. |
| site-header | Temos AppHeader | Idem. |
| Dashboard cards / stats | /app é grid de links | Opcional: adicionar cards de estatística (ex.: total leads, contratos ativos). |
| Charts | Não temos | Opcional; só se for requisito (ex.: gráfico em FIN ou OPS). |
| Forms em bloco | Formulários por módulo (ContractForm, etc.) | Padronizar estrutura (label + input + error) com ui/input, ui/label. |

---

## Riscos e mitigações

| Risco | Mitigação |
|-------|------------|
| Bundui usa Tailwind 4 / React 19 | Copiar apenas JSX/estrutura; reescrever classes para Tailwind 3 e design tokens ness.OS. |
| Conflito de dependências Radix | Adicionar apenas pacotes compatíveis com React 18; testar build após cada novo ui/. |
| Regressão visual em páginas atuais | Adotar um componente por vez; manter wrappers (PageCard, DataTable) até migração completa. |
| Repo Bundui privado ou alterado | Documentar inventário localmente; se links quebrarem, usar shadcn/ui oficial como fallback para primitivos. |

---

## Referências

- [Bundui shadcn-ui-kit-dashboard — components](https://github.com/bundui/shadcn-ui-kit-dashboard/tree/main/components)
- [Bundui shadcn-ui-kit-dashboard — components/ui](https://github.com/bundui/shadcn-ui-kit-dashboard/tree/main/components/ui)
- [adaptacao-layout-bundui-nessos](./adaptacao-layout-bundui-nessos.md) — layout e shell já adaptados
- [ajuste-ux-ui-nessos](./ajuste-ux-ui-nessos.md) — design tokens e consistência
- [docs/DESIGN-TOKENS.md](../../docs/DESIGN-TOKENS.md)
- [shadcn/ui](https://ui.shadcn.com/) — documentação oficial dos primitivos
