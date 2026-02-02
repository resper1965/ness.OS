# Changelog — ness.OS

## 2026-02-02 — Execução BOOOM + Validação

### Entregas (Fases 0–4)

- **FASE 0:** RF.CORE.01 Auth Guard, RF.CORE.02 Dashboard por Role
- **FASE 1:** RF.OPS.01 Playbooks tags, RF.OPS.02 Métricas RLS, RF.PEO.01 Gaps playbook_id
- **FASE 2:** RF.FIN.01 Contratos lifecycle, RF.FIN.02 Rentabilidade, RF.GRO.04 success_cases
- **FASE 3:** RF.GRO.05 Agente Propostas, RF.GRO.06 Agente Conteúdo, RAG validação, Chatbot público
- **FASE 4:** ness.JUR (Análise de Risco), ness.GOV (Políticas, Aceites)

### Migrations 013–021

- 013: playbooks tags, last_reviewed_at
- 014: performance_metrics RLS
- 015: training_gaps playbook_id
- 016: contracts renewal_date, adjustment_index
- 017: hourly_rate, view rentabilidade
- 018: success_cases
- 019: document_embeddings service, RAG público
- 020: ness.JUR tables
- 021: ness.GOV tables

### Validação Fase V

- Build: OK
- Security audit: SecOps First atendido
- Relatório: docs/VALIDACAO-FASE-V.md
