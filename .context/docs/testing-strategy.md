---
type: doc
name: testing-strategy
description: Testing approach and coverage
category: process
generated: 2026-01-29
status: filled
scaffoldVersion: "2.0.0"
---

# Estratégia de testes

## Escopo

- **Frontend:** testes de componente e E2E (ferramentas a definir: Jest, Vitest, Playwright, etc.).  
- **Edge Functions:** testes unitários dos **agentes da aplicação** (Deno test).  
- **DB:** migrations testadas em staging; cenários críticos (ex.: RLS, funções RAG) cobertos.  
- **Integrações:** mocks para Omie e demais APIs em CI.  

## Critérios

- Cobertura mínima a definir por módulo; fluxos OPS→FIN→GROWTH e ciclos de vida devem ter testes automatizados.  
- Regressão antes de deploy (CI); ambientes de staging espelhando Supabase + Vercel.
