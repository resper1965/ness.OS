# ness.PEOPLE — FASE 10 (Status)

> Checklist da FASE 10 do plano de execução final. Ref: [PLANO-EXECUCAO-FASE-5-FINAL.md](PLANO-EXECUCAO-FASE-5-FINAL.md).

## PASSO 10.1 — ATS vinculado a Contratos

- **Migration:** `034_public_jobs_contract_id.sql` — coluna opcional `contract_id` em `public_jobs` (FK para `contracts(id)`).
- **Página:** `/app/people/vagas` — listagem de vagas; **filtro por contrato ativo** (links "Todos" + um link por contrato/cliente). Query param `?contract_id=uuid` filtra vagas por `contract_id`.
- **Formulário nova vaga:** `JobForm` — select opcional "Contrato" (lista de contratos com nome do cliente). Action `createJob` persiste `contract_id`.
- **Formulário editar vaga:** `JobEditForm` — select opcional "Contrato" com valor atual. Action `updateJob` persiste `contract_id`.
- **Componente:** `VagasContractFilter` — links para filtrar vagas por contrato (Todos + um por contrato).

## PASSO 10.2 — Avaliação 360º (estrutura)

- **Migration:** `025_feedback_360.sql` — tabela `feedback_360` (subject_id, rater_id, criteria, score, comment).
- **Página:** `/app/people/avaliacao` — formulário de feedback, relatório agregado (média por colaborador), listagem dos últimos feedbacks.
- **Formulário:** `Feedback360Form` — colaborador avaliado (subject_id, select de profiles), critério (opcional), score (1 a 5), comentário (opcional). Rater = usuário logado. Action `createFeedback360FromForm`.
- **Relatório:** Bloco "Média por colaborador" — `getFeedback360ScoresBySubject()` agrega por subject_id (média e quantidade de avaliações); exibe full_name do profile quando disponível.
- **Listagem:** "Últimos feedbacks" — Avaliado, Avaliador, Critério, Score, Data; nomes resolvidos via profiles.
