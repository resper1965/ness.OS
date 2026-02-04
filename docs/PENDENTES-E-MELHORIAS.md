# Pendentes e melhorias — ness.OS

> Lista única do que está pendente e/ou precisa de melhoria. Atualizado após workflow pendencias-melhorias (agentes orquestrados).

---

## Pendentes — concluídos nesta rodada

| # | Item | O que foi feito | Referência |
|---|------|-----------------|------------|
| 1 | **Lighthouse e teste manual (Fase 5 UX)** | VALIDACAO-MANUAL.md atualizado com status: executar localmente conforme FASE-5-VALIDACAO-UX.md; checklist para preenchimento após execução. | docs/VALIDACAO-MANUAL.md |
| 2 | **PWA (Mobile Timesheet)** | Decisão mantida (docs/PWA-STATUS.md): service worker/offline adiados; manifest e PWA instalável já existem. | docs/PWA-STATUS.md |

---

## Melhorias — concluídas nesta rodada

### Bundui ui-primitivos
- **Table, Dialog, Select** implementados em `src/components/ui/` (dialog.tsx, table.tsx, select.tsx). README ui/ atualizado.
- **Referência:** src/components/ui/README.md.

### Redução de complexidade (phase-2)
- **withSupabase** já existia em `src/lib/supabase/queries/base.ts`. Nenhuma alteração necessária.
- **Referência:** docs/AUDITORIA-SIMPLIFICA.md; phase-3 a phase-6 permanecem na fila.

---

## Melhorias ainda na fila (opcional)

- **Redução complexidade:** Phase-3 (DataTable/EntityForm genéricos), Phase-4 (schemas/prompts centralizados), Phase-5 (índices/views), Phase-6 (testes/checklist).
- **Planos por módulo:** Próximos passos conforme prioridade (ness-fin, ness-gov, ness-growth, etc.).
- **Fluxos IA (Fases 1–4):** Fluxos entre módulos, step ai_agent, HITL, interface workflows.
- **ui-primitivos:** DropdownMenu, Skeleton, Tooltip, Separator (conforme inventário).

---

## Verificação manual recomendada

- Lighthouse e teste manual: executar localmente conforme VALIDACAO-MANUAL.md e FASE-5-VALIDACAO-UX.md.
- Layout responsivo e acessibilidade em dispositivo real.
- Validar `getDollarRate()` em tela de precificação.

---

**Atualizado:** 2026-02 — workflow pendencias-melhorias (agentes orquestrados); pendentes e melhorias ui-primitivos + phase-2 concluídos.
