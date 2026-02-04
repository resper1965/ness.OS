# Validação manual — ness.OS

> Checklist único para **validar manualmente** UX (Fase 5), PWA e fluxos críticos. Executar antes de release ou após mudanças grandes.

**Status da execução:** Preencher após rodar o checklist localmente (Lighthouse, responsivo, acessibilidade). Data: \_\_\_\_\_\_; Responsável: \_\_\_\_\_\_; Resultado: [ ] Aprovado / [ ] Pendências (descrever abaixo).

**Status:** Lighthouse e teste manual (itens 1–8) devem ser executados **localmente** conforme checklist abaixo e [FASE-5-VALIDACAO-UX.md](./FASE-5-VALIDACAO-UX.md). Após executar, marcar no checklist.

**Referências detalhadas:** [FASE-5-VALIDACAO-UX.md](./FASE-5-VALIDACAO-UX.md) (Lighthouse, teclado, screen reader, zoom).

---

## 1. Pré-validação (obrigatório)

```bash
npm run validate:ux
```

Equivale a `npm run lint && npm run build`. Se falhar, corrigir antes dos testes manuais.

---

## 2. UX / Acessibilidade (Fase 5)

| # | Item | Como validar |
|---|------|--------------|
| 1 | Lighthouse Accessibility ≥ 90 | DevTools → Lighthouse → Accessibility. URLs: /login, /app, /nessos, /app/fin, /app/fin/contratos, /app/ops/timer. |
| 2 | Lighthouse Best Practices ≥ 90 | Mesma aba, categoria Best Practices. |
| 3 | Skip link | Tab na página /app: primeiro foco deve mostrar "Ir para o conteúdo"; ao ativar, foco vai para o main. |
| 4 | Ordem de tab | Tab: skip link → sidebar (ou trigger) → main. Sem foco preso. |
| 5 | Modais | Abrir modal (ex.: edição no Timer); Esc deve fechar; Tab não deve travar. |
| 6 | Zoom 200% | Ctrl/Cmd + + até 200%; layout utilizável, texto não cortado. |
| 7 | Screen reader (opcional) | NVDA / VoiceOver: labels dos campos e mensagens de erro anunciados em formulário (ex.: Contratos). |
| 8 | Tema (light/dark) | No header da app (/app): ícone Sol/Lua alterna tema; recarregar página mantém preferência (next-themes). Contraste WCAG em ambos os modos. |

---

## 3. PWA (opcional)

| # | Item | Como validar |
|---|------|--------------|
| 1 | Manifest | Abrir /manifest.webmanifest; conferir name, start_url, display, theme_color. |
| 2 | Ícones | Se existirem `public/icon-192.png` e `public/icon-512.png`, "Adicionar à tela inicial" deve usá-los. |
| 3 | Start URL | Após "instalar", abrir app pela home do dispositivo; deve ir para /app (ou login). |

Ver [public/ICONS-PWA.md](../public/ICONS-PWA.md) para como adicionar ícones.

---

## 4. Fluxo de inputs (explicativo)

| # | Item | Como validar |
|---|------|--------------|
| 1 | Labels e help | Formulários principais (Contrato, Política, Vaga, Compliance, Brand, 360º) têm label + help text onde aplicável. |
| 2 | Placeholders | Campos de texto têm placeholder com exemplo real (não genérico). |

Ver [FLUXO-INPUTS-EXPLICATIVOS.md](./FLUXO-INPUTS-EXPLICATIVOS.md) para checklist por formulário.

---

## 5. Migrações (corp-site / site legacy)

| # | Item | Como validar |
|---|------|--------------|
| 1 | Rotas solucoes e legal | /solucoes/[slug], /legal/[slug] renderizam com conteúdo do banco. |
| 2 | Seed corp-site | Conteúdo de services_catalog e static_pages conferido após seed. |

Ver [VALIDACAO-MIGRACOES.md](./VALIDACAO-MIGRACOES.md) para checklist completo.

---

## 6. Checklist rápido (release)

| Item | Feito |
|------|-------|
| `npm run validate:ux` passou | [ ] |
| Lighthouse Accessibility ≥ 90 (pelo menos uma URL) | [ ] |
| Lighthouse Best Practices ≥ 90 | [ ] |
| Tab: skip link visível ao focar | [ ] |
| Esc fecha modais | [ ] |
| Zoom 200% utilizável | [ ] |
| Manifest e ícones PWA (se aplicável) | [ ] |
| Formulários com label + help (amostra) | [ ] |
| Tema: alternar light/dark e recarregar (preferência mantida) | [ ] |

---

## Referências

- [FASE-5-VALIDACAO-UX.md](./FASE-5-VALIDACAO-UX.md) — Detalhes Lighthouse, teclado, screen reader, zoom.
- [DESIGN-TOKENS.md](./DESIGN-TOKENS.md) — Tokens e padrões de componentes.
- [VALIDACAO-MIGRACOES.md](./VALIDACAO-MIGRACOES.md) — Corp-site e site legacy.
