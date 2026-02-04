# ness.GOV — FASE 6 (Status)

> Checklist da FASE 6 do plano de execução final. Ref: [PLANO-EXECUCAO-FASE-5-FINAL.md](PLANO-EXECUCAO-FASE-5-FINAL.md).

## PASSO 6.1 — CRUD de Políticas

- **Listagem:** `/app/gov/politicas` — tabela com título, slug, quantidade de versões, data, link Editar.
- **Formulário criar:** `/app/gov/politicas/novo` — PolicyForm com title, slug, content_text; `createPolicyFromForm` insere em `policies` e cria primeira `policy_version` (version 1).
- **Formulário editar:** `/app/gov/politicas/[id]` — PolicyForm com dados da política; `updatePolicyFromForm` atualiza `policies` e insere nova `policy_version` (version N+1).
- **Versionamento:** Ao salvar (criar ou editar), sempre é criado um registro em `policy_versions` (content_text, version).
- **UX:** PolicyForm alinhado a InputField, PrimaryButton, toast (sonner); mensagem "Nova versão registrada" ao salvar.

## PASSO 6.2 — Rastreabilidade de Aceite

- **Listagem pendentes:** `/app/gov/aceites` — `getPendingAcceptances()` retorna versões ainda não aceitas pelo usuário (profile_id).
- **Registrar aceite:** Botão "Registrar aceite" chama `acceptPolicyVersion(policyVersionId)`; insere em `policy_acceptances` (profile_id, policy_version_id).
- **Feedback:** Toast de sucesso/erro; `router.refresh()` para atualizar a lista sem recarregar a página.

## Schema (migration 021_gov_tables.sql)

- `policies`: id, title, slug, created_at
- `policy_versions`: id, policy_id, content_text, version, effective_at, created_at
- `policy_acceptances`: id, policy_version_id, profile_id, accepted_at
