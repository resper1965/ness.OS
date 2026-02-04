# Planos por módulo — próximos passos por prioridade

> **Referência:** [PLANO-PROXIMOS-PASSOS.md](PLANO-PROXIMOS-PASSOS.md), [PLANO-REDUCAO-COMPLEXIDADE.md](PLANO-REDUCAO-COMPLEXIDADE.md), fluxos IA (.context/plans/fluxos-integracao-ia-automacao.md).

---

## Visão por módulo

| Módulo | Foco | Prioridade próxima |
|--------|------|--------------------|
| **ness.OPS** | Homogeneização, mapeamento, playbooks, workflows, timer | Workflows UI (listagem + HITL), step ai_agent |
| **ness.FIN** | Rentabilidade, ciclo de vida, contratos | Índices/views rentabilidade (phase-5), alertas |
| **ness.GROWTH** | Vendas, precificação, marketing, leads, casos | Agentes rex.* (prompts centralizados) |
| **ness.PEOPLE** | Vagas, gaps, avaliação 360 | Consolidação forms com EntityForm |
| **ness.JUR** | Conformidade, risco | Integração com workflow human_review |
| **ness.GOV** | Políticas, aceites | Políticas + aceites em fluxos |

---

## Prioridade P0 (Deploy / estabilidade)

- Executar migrations pendentes no Supabase (incl. **037_workflow_pending_approvals**).
- `npm run build` e `npm test` verdes após alterações de redução de complexidade.

---

## Prioridade P1 (Redução de complexidade — concluído / em uso)

- **Phase 2:** `withSupabase` em `src/lib/supabase/queries/base.ts` — confirmado.
- **Phase 3:** DataTable genérico (existente); **EntityForm** genérico em `shared/entity-form.tsx` — criado.
- **Phase 4:** `src/lib/ai/prompts.ts` com placeholders (getSystemPrompt, getContextPrompt por agente) — criado.
- **Phase 5:** Índices/views rentabilidade — revisado: view `contract_rentability` (005), índices `idx_contracts_renewal` e `idx_contracts_client` (026) cobrem consultas de rentabilidade; migração adicional só se surgir query lenta.
- **Phase 6:** Validar `npm test` e `npm run build` após mudanças.

---

## Prioridade P2 (Fluxos IA — Fases 1–4)

- **Fase 1:** Tabela `workflow_pending_approvals` — migração **037** criada.
- **Fase 2:** Step `human_review` no engine — implementado em `src/lib/workflows/engine.ts` (insere aprovação, para fluxo com `awaitingApproval`).
- **Fase 3:** Interface workflows — página **/app/ops/workflows** para listar workflows e aprovações pendentes (HITL) — criada.
- **Fase 4:** Step `ai_agent` — stub; próximos passos: integrar `src/lib/ai/prompts.ts` e chamada ao agente (**Gemini** API) conforme docs/agents.

---

## Prioridade P3 (UI e UX)

- **ui-primitivos:** DropdownMenu, Skeleton, Tooltip, Separator em `src/components/ui/` — implementados.
- Tooltip: envolver app com `TooltipProvider` onde necessário.
- Formulários de entidade: migrar gradualmente para usar `EntityForm` onde fizer sentido (title, loading, onSubmit).

---

## Próximos passos por módulo (resumo)

1. **ness.OPS:** Link para `/app/ops/workflows` no menu; opcional: tela de resolução de aprovação (aprovar/rejeitar com payload).
2. **ness.FIN:** Revisar 005/017/026 para índices de rentabilidade; alertas de ciclo de vida.
3. **ness.GROWTH:** Preencher `prompts.ts` com prompts reais dos agentes (rex.growth, etc.) e conectar ao step `ai_agent` (LLM: **Gemini**).
4. **ness.PEOPLE / JUR / GOV:** Adotar EntityForm nos forms novos; usar workflow human_review para fluxos que exigem aceite. **Exemplo:** ness.PEOPLE Gaps usa `EntityForm` em `/app/people/gaps`; fluxos com step `human_review` são resolvidos em `/app/ops/workflows` (aprovar/rejeitar).

5. **getDollarRate / getIndices:** Utilizados em `/app/fin/contratos` para exibir índices (dólar, IPCA, IGPM). Validar em tela conforme VALIDACAO-MANUAL.

---

## Referências

- Agentes da aplicação: `docs/agents/agents-specification.md`
- Separação agentes vs Playbooks AI: `docs/context-separation.md`
- Branding: `.cursor/rules/ness-branding.mdc`
