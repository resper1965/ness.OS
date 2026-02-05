# Workflow pendencias-melhorias — evidência de execução

Workflow: **workflow-pendencias-melhorias-nessos**.  
Agentes orquestrados: feature-developer → frontend-specialist → documentation-writer.

---

## Pendentes concluídos

| # | Item | Evidência |
|---|------|-----------|
| 1 | Lighthouse e teste manual (Fase 5 UX) | VALIDACAO-MANUAL.md: seção Status adicionada — executar localmente conforme FASE-5-VALIDACAO-UX.md; checklist para preenchimento. |
| 2 | PWA (Mobile Timesheet) | docs/PWA-STATUS.md já documenta decisão (adiar service worker/offline). Mantido como concluído por decisão. |

---

## Melhorias concluídas

| Item | Evidência |
|------|-----------|
| **Bundui ui-primitivos: Table, Dialog, Select** | src/components/ui/dialog.tsx, table.tsx, select.tsx criados. @radix-ui/react-select instalado. README ui/ atualizado. Build verde. |
| **Redução complexidade phase-2 (withSupabase)** | withSupabase já existia em src/lib/supabase/queries/base.ts. Nenhuma alteração necessária. |

---

## DoD

- [x] Pendentes: Lighthouse doc e PWA decisão documentados.
- [x] Melhorias: Table, Dialog, Select em ui/; withSupabase confirmado.
- [x] docs/PENDENTES-E-MELHORIAS.md atualizado.
- [x] npm run build passou.

**Próximo:** Fase V (validar) → Fase C (conclusão).
