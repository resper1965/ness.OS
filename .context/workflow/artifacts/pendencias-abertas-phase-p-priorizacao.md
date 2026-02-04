# Fase P — Pendências abertas ness.OS: priorização e sequência

Workflow: **pendencias-abertas-nessos**. Plano: [pendencias-abertas-nessos](../plans/pendencias-abertas-nessos.md).

---

## 1. Escopo validado

O inventário do plano foi tomado como referência:

- **Concluído:** Adaptação layout (Fase C), ness.DATA dólar (PTAX).
- **Em aberto alta:** Omie (payload ListarContasReceber), ness.DATA (IGPM, IPCA, ingestão indicadores).
- **Em aberto média:** Timesheet (job performance_metrics, doc, PWA opcional), Ajuste UX/UI (fases 2–5).
- **Fila:** Demais planos (agrupar atividades, menu header, migrações, módulos, redução complexidade).

---

## 2. Sequência de execução proposta

| Ordem | Item | Plano | Agente sugerido | Critério |
|-------|------|--------|------------------|----------|
| 1 | Validar payload Omie ListarContasReceber | integracao-omie-erp | feature-developer / bug-fixer | Desbloqueia reconciliação MRR em produção |
| 2 | ness.DATA: IGPM/IPCA (reajuste) | ness-data-modulo-dados | feature-developer | FIN Ciclo de Vida |
| 3 | Ajuste UX/UI — fases 2–3 (InputField, toasts, homogeneizar páginas) | ajuste-ux-ui-nessos | frontend-specialist | Consistência antes de mais features |
| 4 | Timesheet: job performance_metrics + doc fluxo | mobile-timesheet-timer | feature-developer + documentation-writer | Fecha ciclo OPS → métricas |
| 5 | ness.DATA: API ingestão indicadores (OPS) | ness-data-modulo-dados | architect-specialist + feature-developer | Hub indicadores |
| 6 | Ajuste UX/UI — fases 4–5 (a11y, Lighthouse) | ajuste-ux-ui-nessos | frontend-specialist | Validação final |

Planos da fila (agrupar atividades, menu header, migrações, etc.) entram após os itens acima ou em paralelo conforme capacidade.

---

## 3. Decisões registradas

| Decisão | Justificativa |
|---------|----------------|
| Omie primeiro | Impacto direto em reconciliação; validação de API evita erros em produção. |
| IGPM/IPCA antes de ingestão indicadores | Reajuste de contratos (FIN) é uso já definido; ingestão OPS depende de schema. |
| UX/UI fases 2–3 antes de timesheet job | Base de componentes (toasts, inputs) beneficia qualquer nova tela. |

---

## 4. Entregas da Fase P

- Este artefato (priorização e sequência).
- Plano [pendencias-abertas-nessos](../plans/pendencias-abertas-nessos.md) vinculado ao workflow e usado como escopo.

**DoD Fase P:** Escopo validado; ordem de execução definida; decisões registradas. Pronto para Fase R (Revisão).
