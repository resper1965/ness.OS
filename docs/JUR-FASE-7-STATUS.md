# ness.JUR — FASE 7 (Status)

> Checklist da FASE 7 do plano de execução final. Ref: [PLANO-EXECUCAO-FASE-5-FINAL.md](PLANO-EXECUCAO-FASE-5-FINAL.md).

## PASSO 7.1 — Conformidade Contínua

- **Seed frameworks:** Migration `022_compliance_frameworks_seed.sql` — LGPD, Marco Civil da Internet, CLT.
- **Página:** `/app/jur/conformidade` — lista frameworks e checks por framework.
- **Formulário compliance_checks:** Framework (select), Processo (playbook) = **slug do playbook** (process_ref), Status (ok / gap / pending), Notas. Vincula processo (referência estável por slug) a framework com status.
- **UX:** PageCard, InputField, PrimaryButton, toast (sonner); listagem por framework em PageCards.
- **Schema:** `compliance_checks` — framework_id, process_ref (text, playbook slug), status, notes (migration 020).

## PASSO 7.2 — Documentos Jurídicos (opcional)

- **Tabelas:** `legal_docs` (title, doc_type, content_text, storage_path), `contract_risk_analysis` (legal_doc_id, clause_type, excerpt, severity, suggestion) — migration 020.
- **Pendente:** CRUD de legal_docs e integração com contract_risk_analysis (página ou fluxo dedicado). Pode ser implementado em ciclo posterior.
