---
status: filled
planSlug: bundui-theme-customizer-nessos
generated: 2026-02
type: frontend
trigger: "theme customizer Bundui", "theme-customizer", "adequação theme-customizer ness.OS"
constrains:
  - "Respeitar ness. branding (ness., ness.OS); cor primária ness (#00ade8) mantida ou variável por tema"
  - "Manter stack: Next.js 14, React 18, Tailwind 3 — sem upgrade forçado"
  - "Zero breaking: auth, nav-config, rotas; preferência de tema persistida (cookie ou localStorage)"
  - "Adotar incrementalmente; tema atual (dark) permanece default"
docs:
  - "project-overview.md"
  - "DESIGN-TOKENS.md"
plans:
  - "adaptacao-layout-bundui-nessos.md"
  - "bundui-componentes-profundos-nessos.md"
---

# Plano — Adequação do theme-customizer Bundui ao ness.OS

> Planejar e adequar o [Theme Customizer](https://github.com/bundui/shadcn-ui-kit-dashboard/tree/main/components/theme-customizer) do Bundui Shadcn UI Kit Dashboard ao ness.OS, integrando preferências de tema (modo claro/escuro, eventualmente raio de borda ou acento) sem quebrar o design atual.

**Referência (repositório):**
- [resper1965/clone — components/theme-customizer](https://github.com/resper1965/clone/tree/main/components/theme-customizer) — color-mode-selector, panel, preset/radius/scale/sidebar-mode selectors, reset-theme; inventário real em artefato Fase P (via MCP GitHub).

**Trigger:** "theme customizer Bundui", "theme-customizer", "resper1965/clone theme-customizer"

**Relação com outros planos:**
- [adaptacao-layout-bundui-nessos](./adaptacao-layout-bundui-nessos.md) — shell já adaptado; theme-customizer pode ser exposto no header ou sidebar.
- [bundui-componentes-profundos-nessos](./bundui-componentes-profundos-nessos.md) — primitivos ui/ (Button, Card); theme-customizer pode usar Dropdown ou Popover ui/.

---

## Objetivo

- Inventariar o conteúdo de **components/theme-customizer** do repositório Bundui (quando acessível).
- Definir escopo no ness.OS: **mínimo** = modo claro/escuro; **opcional** = raio de borda, acento (mantendo ness como opção primária).
- Integrar ao app (/app/*): persistência (cookie ou localStorage), aplicação de tema via classe no `<html>` ou CSS variables em `globals.css`.
- Respeitar DESIGN-TOKENS e tema **dark** atual como default.

---

## Restrições

| Bundui (referência) | ness.OS (manter) | Ação |
|---------------------|------------------|------|
| Next 16, React 19, Tailwind 4 | Next 14, React 18, Tailwind 3 | Copiar/adaptar; reescrever classes Tailwind 4 → 3. |
| Possível uso de next-themes ou similar | — | Adotar `next-themes` ou implementação com cookie/localStorage + classe em `html`. |
| Múltiplos temas (light/dark/system) | Tema dark atual | **Default:** dark; opcional: light; system = preferência do OS. |
| Acento configurável | ness (#00ade8) como primário | Manter ness como opção principal; customizer pode permitir variantes (ness + 1–2 alternativas) ou só light/dark. |

---

## Estado atual do tema no ness.OS

- **globals.css:** `:root` com variáveis HSL (--background, --foreground, --primary, --muted, --border, etc.); fundo escuro (slate-900), primary = ness (#00ade8).
- **Tailwind:** cores ness.* e slate; semantic tokens (border, input, ring) usam `hsl(var(--*))`.
- **Sem theme switcher:** não há toggle light/dark nem UI de customização hoje.
- **Design tokens:** DESIGN-TOKENS.md descreve 8pt grid, cores, headers; não cita tema configurável.

---

## Inventário esperado (theme-customizer)

Tipicamente theme-customizers em kits shadcn incluem:

| Elemento (esperado) | Descrição | Adequação ness.OS |
|--------------------|-----------|-------------------|
| **ThemeProvider** | Contexto React para tema atual (light/dark/system) | Adotar ou equivalente com useState + useEffect (classe em document.documentElement). |
| **ThemeToggle** / **ModeToggle** | Botão ou dropdown (Sun/Moon/System) | Colocar no AppHeader ou sidebar footer; ícones Lucide. |
| **Customizer UI** (opcional) | Painel para radius, acento (paleta) | Opcional; se adotar, restringir a opções pré-definidas (ness + 1–2) e radius (none, sm, md, lg). |
| **Persistência** | Cookie (`theme`) ou localStorage | next-themes usa cookie; ou localStorage + cookie para SSR. |
| **Aplicação** | Classe `dark`/`light` em `<html>` ou troca de variáveis CSS | ness.OS já usa :root; adicionar `.light` com variáveis claras ou usar `next-themes` (class no html). |

**Nota:** O repositório pode não estar acessível via API. Ao executar: clone local ou documentação Bundui para listar arquivos em `components/theme-customizer`.

---

## Fases de execução

### Fase 1 — Inventário e decisões (P)

| # | Ação | Entregável |
|---|------|------------|
| 1 | Obter lista de arquivos em `components/theme-customizer` do repo Bundui (clone ou docs). | Lista: ex.: theme-provider.tsx, theme-toggle.tsx, customizer.tsx. |
| 2 | Decidir escopo no ness.OS: só light/dark ou também radius/acento; se acento, manter ness como default. | Decisão registrada (recordDecision). |
| 3 | Decidir onde expor: AppHeader (ícone), sidebar footer, ou página /app/configuracoes. | Decisão registrada. |
| 4 | Decidir persistência: next-themes (cookie) vs localStorage + cookie para SSR. | Decisão registrada; dependência se next-themes. |
| 5 | Definir variáveis CSS para tema light (globals.css): --background, --foreground, etc. para modo claro. | Especificação em DESIGN-TOKENS ou artefato. |

**DoD Fase 1:** Documento de inventário e decisões (markdown em `.context/workflow/artifacts/` ou no plano).

- **Artefato Fase 1 (P):** [bundui-theme-customizer-phase-p-inventario.md](../workflow/artifacts/bundui-theme-customizer-phase-p-inventario.md) — inventário real theme-customizer (resper1965/clone via MCP GitHub), decisões (escopo light/dark, AppHeader, next-themes, variáveis .light). **Concluído.**

---

### Fase 2 — Implementação (E)

| # | Ação | Entregável |
|---|------|------------|
| 1 | Provider de tema: ThemeProvider (next-themes ou custom) envolvendo o layout do app; leitura de preferência ao montar. | Provider em layout ou componente raiz do app. |
| 2 | Aplicação de tema: classe `dark`/`light` em `<html>` ou atributo `data-theme`; variáveis CSS em globals.css para `.light` (e opcionalmente `.dark` explícito). | globals.css atualizado; tema aplicado sem flash. |
| 3 | Componente de toggle: ThemeToggle (ou ModeToggle) com ícones Lucide (Sun/Moon/Monitor); colocado no AppHeader ou sidebar. | Componente em `src/components/app/` ou `shared/`. |
| 4 | Persistência: cookie ou localStorage; hidratação sem flash (script inline ou next-themes). | Preferência persistida entre sessões. |
| 5 | (Opcional) Painel theme-customizer: radius, acento; só se decidido na Fase 1. | Componente opcional; DESIGN-TOKENS atualizado. |

**DoD Fase 2:** Usuário pode alternar light/dark; preferência persistida; tema default = dark; build verde.

---

### Fase 3 — Verificação e documentação (V / C)

| # | Ação | Entregável |
|---|------|------------|
| 1 | Teste manual: alternar tema; recarregar página (preferência mantida); contraste WCAG em ambos os modos. | Checklist passando (VALIDACAO-MANUAL). |
| 2 | Atualizar DESIGN-TOKENS.md: seção "Tema (light/dark)", variáveis por modo, onde está o toggle. | Docs atualizados. |
| 3 | Registrar no plano status (filled) e referência cruzada. | Plano atualizado. |

**DoD Fase 3:** Verificação concluída; documentação sincronizada.

---

## Riscos e mitigações

| Risco | Mitigação |
|-------|-----------|
| Flash de tema errado no carregamento | Script inline no `<head>` que lê cookie/localStorage e aplica classe antes do first paint; ou next-themes com `enableSystem` e `defaultTheme`. |
| Bundui usa Tailwind 4 / CSS que não existe no Tailwind 3 | Reescrever classes para Tailwind 3; temas via CSS variables já usadas em globals.css. |
| Conflito com cores fixas (bg-ness, text-ness) | Manter utilitários .bg-ness/.text-ness; em tema light usar --primary = ness; garantir contraste em ambos. |
| Repo Bundui privado ou alterado | Documentar inventário quando acessível; usar padrão next-themes + toggle como fallback. |

---

## Referências

- [resper1965/clone — components/theme-customizer](https://github.com/resper1965/clone/tree/main/components/theme-customizer)
- [next-themes](https://github.com/pacocoursey/next-themes) — opção para ThemeProvider em Next.js (SSR-safe)
- [adaptacao-layout-bundui-nessos](./adaptacao-layout-bundui-nessos.md)
- [bundui-componentes-profundos-nessos](./bundui-componentes-profundos-nessos.md)
- [docs/DESIGN-TOKENS.md](../../docs/DESIGN-TOKENS.md)
- [src/app/globals.css](../../src/app/globals.css) — variáveis :root atuais
