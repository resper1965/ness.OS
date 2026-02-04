# Fase R — Revisão architect-specialist (plano pendentes-detalhado-gemini)

**Data:** 2026-02-04  
**Plano:** [pendentes-detalhado-gemini](../plans/pendentes-detalhado-gemini.md)  
**Referência:** [architecture.md](../docs/architecture.md)

---

## Alinhamento com a arquitetura

### Rotas
- **P1.1 Link Workflows:** `/app/ops/workflows` já existe; o plano pede entrada no menu/sidebar. Alinhado: nova rota não criada, apenas navegação (AppSidebar ou nav-config).
- **P1.2 Tela HITL:** Pode ser rota `/app/ops/workflows/aprovacoes` ou modal na mesma página. Recomendação: manter na mesma página com seção "Aprovações pendentes" (já presente) e evoluir para ações aprovar/rejeitar.

### Layout e camadas
- **TooltipProvider (P3.1):** Envolver no `AppLayout` (`app/app/layout.tsx`) ou no layout raiz do app. Não altera camadas.
- **EntityForm (P3.2–P3.3):** Componente shared; uso em páginas e forms por módulo. Alinhado à camada Components (shared + módulos).

### Lib e padrões
- **Step ai_agent + Gemini (P2.1–P2.2):** Nova lib em `src/lib/ai/` (ex.: `gemini.ts` ou uso de SDK); API key em env. Manter chamada no servidor (engine de workflows já é server-side). Alinhado a SecOps First.
- **Prompts centralizados:** `src/lib/ai/prompts.ts` já existe; preenchimento por agente (rex.*) não altera arquitetura.
- **Índices/views rentabilidade (P2.3):** Migrations no Supabase; sem mudança de camada de aplicação.
- **Alertas ciclo de vida (P2.4):** Consultas em `contracts`/dados existentes; exibição em FIN (página ou dashboard). Alinhado a Pages + Actions.

### Riscos de arquitetura
- Nenhum. Plano não introduz novas camadas nem quebra padrões (Server Actions, RLS, FKs).
- **Dependência externa:** Gemini API; mitigar com env e tratamento de erro (fallback ou mensagem clara).

---

## Decisões e handoff

- Plano **aprovado** do ponto de vista de arquitetura.
- **Handoff para code-reviewer:** Revisar qualidade e estilo do código já alterado (ui-primitivos, engine human_review, EntityForm, prompts.ts, página workflows) e do plano em si (clareza, passos acionáveis).

**Artefato:** `.context/workflow/artifacts/pendentes-detalhado-gemini-phase-r-architect-review.md`
