# Qualidade — FASE 5 (ness.OS)

> Checklist da Fase 5 do plano de execução final. Ref: [PLANO-EXECUCAO-FASE-5-FINAL.md](PLANO-EXECUCAO-FASE-5-FINAL.md).

## PASSO 5.1 — ESLint

- **Configuração:** `.eslintrc.json` usa `next/core-web-vitals` (Strict recomendado no Next 14).
- **Comando:** `npm run lint` (roda `next lint`).
- **CI / pré-commit:** Executar `npm run lint` no pipeline (ex.: `npm run validate:ux` já inclui lint + build).

## PASSO 5.2 — Testes (baseline)

- **Vitest + React Testing Library:** Já instalados (`vitest`, `@testing-library/react`, `@testing-library/dom`).
- **Smoke Server Action:** `src/__tests__/leads.test.ts` — testes de `submitLead` (validação nome/email, sucesso com mock).
- **Página /app:** Teste de renderização da página Dashboard pode ser adicionado opcionalmente (component test com mock de auth).

## PASSO 5.3 — Rate limit chatbot

- **Implementado:** `POST /api/chat/public` — rate limit em memória (20 req/60s por IP), resposta 429 ao exceder.
- **Header:** `X-RateLimit-Remaining` em todas as respostas.
- **Documentação:** [RATE-LIMIT-CHATBOT.md](RATE-LIMIT-CHATBOT.md) — limitação em memória e cold start.
