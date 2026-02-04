# Fase 5 — Validação UX/UI (ajuste-ux-ui-nessos)

Checklist executável para validar que os ajustes de interface (Fases 1–4) não quebraram nada e atendem às metas de acessibilidade.

**Plano:** [.context/plans/ajuste-ux-ui-nessos.md](../.context/plans/ajuste-ux-ui-nessos.md)

---

## 1. Pré-validação (CI/local)

Antes dos testes manuais, garantir que o projeto compila e passa no lint:

```bash
npm run validate:ux
```

Equivale a `npm run lint && npm run build`. Se falhar, corrigir antes de rodar Lighthouse.

---

## 2. Lighthouse (DevTools)

**Onde:** Chrome/Edge DevTools → aba **Lighthouse**.

**URLs sugeridas (com app rodando em `http://localhost:3000`):**

| Página | URL | Observação |
|--------|-----|------------|
| ness.OS (site) | `/nessos` | Página explicativa pública, âncoras, tabelas |
| Login | `/login` | Formulário, labels, foco |
| App (após login) | `/app` | Sidebar, header, skip link |
| Contratos | `/app/fin/contratos` | Form, toasts, PageCard |
| Timer | `/app/ops/timer` | Timer, tabela, responsivo |
| Métricas | `/app/ops/metricas` | Form, botão sync |

**Metas:**

- **Accessibility** ≥ 90
- **Best Practices** ≥ 90

**Modo:** Desktop e Mobile (rodar os dois se possível).

**Lighthouse via CLI (opcional):** com o app rodando (`npm run dev`), em outro terminal:

```bash
npx lighthouse http://localhost:3000/nessos --only-categories=accessibility,best-practices --output=html --output-path=./lighthouse-report.html
```

Abre `lighthouse-report.html` no navegador para ver o relatório. Repetir para outras URLs se desejar.

---

## 3. Navegação por teclado

- **Tab:** ordem lógica: skip link → sidebar → header → main. O skip link deve aparecer ao focar (está fora da tela até receber foco).
- **Enter:** ativa links e botões.
- **Esc:** fecha modais (ex.: edição de registro no Timer).
- **Nenhum foco preso** em modais (conseguir sair com Esc ou Tab).

---

## 4. Screen reader (opcional)

- **NVDA (Windows)** ou **VoiceOver (macOS):** abrir uma página com formulário (ex.: Contratos) e verificar:
  - Labels dos campos anunciados.
  - Mensagens de erro (role="alert") anunciadas.
  - Título da página coerente.

---

## 5. Zoom 200%

- No navegador: Zoom 200% (Ctrl/Cmd + + até 200%).
- Verificar: layout ainda utilizável, tabelas com scroll horizontal se necessário, texto não cortado.

---

## 6. Checklist rápido (release)

| Item | Feito |
|------|-------|
| `npm run validate:ux` passou | [ ] |
| Lighthouse Accessibility ≥ 90 (pelo menos uma URL) | [ ] |
| Lighthouse Best Practices ≥ 90 | [ ] |
| Tab: skip link visível ao focar | [ ] |
| Tab: ordem skip → sidebar → main | [ ] |
| Esc fecha modais | [ ] |
| Zoom 200% utilizável | [ ] |

---

## Referências

- [VALIDACAO-MANUAL.md](./VALIDACAO-MANUAL.md) — Checklist único (UX + PWA + fluxo inputs + migrações)
- [DESIGN-TOKENS.md](./DESIGN-TOKENS.md) — Tokens e checklist de novos componentes
- [WCAG 2.1 AA](https://www.w3.org/WAI/WCAG21/quickref/)
