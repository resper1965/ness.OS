---
status: ready
generated: 2026-01-30
planVinculado: docs/PLANO-EXECUCAO-AUTONOMA-PENDENCIAS.md
---

# Execução Autônoma — Pendências ness.OS

> Plano mestre para implementar todas as pendências de todos os módulos de forma autônoma.

**Documento completo:** [docs/PLANO-EXECUCAO-AUTONOMA-PENDENCIAS.md](../docs/PLANO-EXECUCAO-AUTONOMA-PENDENCIAS.md)

**Trigger:** **"BOOOM"**, "execute plano autonomo" ou "siga o plano de pendências"

## Resumo das fases

| Fase | Módulos | Passos |
|------|---------|--------|
| 0 | Core | RF.CORE.01 Auth Guard, RF.CORE.02 Dashboard por Role |
| 1 | OPS, PEOPLE | RF.OPS.01 tags/review, RF.OPS.02 RLS/labels, RF.PEO.01 playbook_id em gaps |
| 2 | FIN, GROWTH | RF.FIN.01 renewal/adjustment, RF.FIN.02 hourly_rate/gráfico, RF.GRO.04 success_cases |
| 3 | GROWTH, OPS | RF.GRO.05 Agente Propostas, RF.GRO.06 Agente Conteúdo, RF.OPS.03 validação, Chatbot público |
| 4 | JUR, GOV | ness.JUR estrutura, ness.GOV estrutura |

## Ordem de execução

Seguir **exatamente** a ordem do documento vinculado. Cada PASSO tem entregas explícitas. Aplicar migrations via MCP Supabase (user-supabase nessOS).
