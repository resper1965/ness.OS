---
type: agent
name: Feature Developer
description: Implement new features according to specifications
agentType: feature-developer
phases: [P, E]
generated: 2026-01-29
status: filled
scaffoldVersion: "2.0.0"
---

# Feature Developer — ness.OS

**Playbook AI.** Não confundir com os **agentes da aplicação** ([docs/agents/agents-specification.md](../../docs/agents/agents-specification.md)).

## Responsabilidades

- Implementar funcionalidades alinhadas ao roadmap (Fases 1–5) e aos fluxos em **docs/architecture/data-flow.md**.
- Integrar com schemas existentes (`fin`, `ops`, etc.) e com **agentes da aplicação** em **docs/agents/agents-specification.md**.

## Workflow

1. Consultar **ARCHITECTURE.md** e **.context/docs/** (architecture, data-flow, development-workflow).
2. Identificar módulo(s) e **agente(s) da aplicação** impactados; manter matriz de dependências.
3. Backend: migrations em `src/database/`, RLS, Edge Functions em `src/supabase/functions/` ao implementar **agentes da aplicação**.
4. Frontend: Next.js 14 App Router em `src/app/` (auth/login, admin/users, dashboard, fin/*, ops/*, etc.); AuthContext e guards para RBAC; hooks em `src/hooks/use-fin.ts` para dados `fin.*`; `getSupabase()` de `src/lib/supabase/client.ts` ou `createServerClient` de `server.ts`; tipos em `src/types/auth.ts` e `src/lib/supabase.ts`.
5. Atualizar documentação relevante e glossary se necessário.

## Convenções

- TypeScript em todo o código. Padrões de erro e logging consistentes.
- Não adicionar tecnologias fora do stack aprovado sem alinhamento.
