# Plano de Execução — Fases 5 a 10 (ness.OS Final)

> **Trigger:** diga **"EXECUTE FASE 5"** ou **"siga até o final"** para executar todas as pendências restantes.

> **Pré-requisito:** Fases 0–4 concluídas (BOOOM executado).

---

## Visão Geral

```
FASE 5: Qualidade (ESLint, Testes, Rate Limit)
  ↓
FASE 6: ness.GOV completo
  ↓
FASE 7: ness.JUR completo
  ↓
FASE 8: ness.GROWTH avançado
  ↓
FASE 9: ness.FIN avançado
  ↓
FASE 10: ness.PEOPLE avançado
```

---

## FASE 5 — Qualidade

### PASSO 5.1 — ESLint
- Configurar ESLint com `next lint` (Strict)
- Executar `npx eslint .` no CI ou pré-commit (opcional)

### PASSO 5.2 — Testes (opcional, baseline)
- Instalar Vitest + React Testing Library
- Criar teste de smoke para `submitLead` (Server Action)
- Criar teste para página `/app` (renderiza com role)

### PASSO 5.3 — Rate Limit Chatbot
- Migrar rate limit do chatbot público para Redis/KV (Vercel KV) OU
- Manter em memória e documentar limitação; adicionar header `X-RateLimit-Remaining`

---

## FASE 6 — ness.GOV Completo

### PASSO 6.1 — CRUD de Políticas
- Página `/app/gov/politicas`: listagem de policies
- Formulário criar/editar: title, slug, content_text
- Versionamento: ao salvar, criar policy_versions

### PASSO 6.2 — Rastreabilidade de Aceites
- Página `/app/gov/aceites`: lista policy_versions pendentes
- Botão "Registrar aceite" (profile_id = user, policy_version_id)
- Inserir em policy_acceptances

---

## FASE 7 — ness.JUR Completo

### PASSO 7.1 — Conformidade Contínua
- Seed ou migration: inserir compliance_frameworks (LGPD, Marco Civil, CLT)
- Página `/app/jur/conformidade`: listar frameworks
- Formulário compliance_checks: vincular process_ref (playbook slug) a framework, status (ok/gap/pending)

### PASSO 7.2 — Documentos Jurídicos (opcional)
- CRUD legal_docs (title, doc_type, content_text ou storage_path)
- Integrar contract_risk_analysis com legal_docs

---

## FASE 8 — ness.GROWTH Avançado

### PASSO 8.1 — Brand Guardian (base)
- Migration `022_brand_assets.sql`: CREATE TABLE brand_assets
- Página `/app/growth/brand`: listar assets, upload para bucket
- Serviços e propostas podem referenciar brand_assets

### PASSO 8.2 — Upsell Alerts (estrutura)
- Migration `023_upsell_alerts.sql`: CREATE TABLE upsell_alerts
- Trigger ou job: quando consumption > threshold, inserir alerta
- Página `/app/growth/upsell`: listar alertas

---

## FASE 9 — ness.FIN Avançado

### PASSO 9.1 — Alertas de Renovação
- Edge Function ou API route agendada: contratos renewal_date <= hoje + 30
- Enviar notificação ou registrar em notifications
- Página `/app/fin/alertas`: listar contratos próximos de renovação

### PASSO 9.2 — Integração Omie (estrutura)
- Tabela `omie_sync_log`
- Edge Function `sync-omie`: API Omie (clientes, contratos)
- Variáveis: OMIE_APP_KEY, OMIE_APP_SECRET

---

## FASE 10 — ness.PEOPLE Avançado

### PASSO 10.1 — ATS vinculado a Contratos
- Migration: contract_id ou job_profile em public_jobs (opcional)
- Página `/app/people/jobs`: filtro por contrato ativo

### PASSO 10.2 — Avaliação 360º (estrutura)
- Migration `024_feedback_360.sql`
- Página `/app/people/avaliacao`: formulário feedback
- Relatório: agregar scores por colaborador

---

## Checklist de Execução

1. workflow-init name="nessos-fase-5-final", autonomous=true
2. Para cada FASE: executar PASSOS, build, apply_migration
3. workflow-advance ao concluir cada fase
4. git commit por fase
5. plan updateStep para registrar progresso

---

## Variáveis

- Migrations: 022, 023, 024...
- Prefixos commit: quality:, gov-pn:, jur-cp:, growth-ic:, fin-cfo:, ppl-tc:
