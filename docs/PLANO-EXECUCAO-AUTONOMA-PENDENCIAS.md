# Plano de Execução Autônoma — Pendências ness.OS

> Para executar: diga **"BOOOM"**, **"execute plano autonomo"** ou **"siga o plano de pendências"**. O agente seguirá esta sequência de passos em ordem.

> **Fases 0–4 concluídas.** Próximo: [PLANO-EXECUCAO-FASE-5-FINAL.md](PLANO-EXECUCAO-FASE-5-FINAL.md) — diga **"EXECUTE FASE 5"** para continuar.

---

## Ordem de execução e dependências

```
FASE 0: Core (base para todos)
  ↓
FASE 1: OPS + PEOPLE (base para GROWTH/FIN)
  ↓
FASE 2: FIN + GROWTH (base) + GROWTH (Cases)
  ↓
FASE 3: GROWTH (IA) + OPS (validações)
  ↓
FASE 4: JUR + GOV (novos módulos)
```

---

## FASE 0 — RF.CORE (Base)

### PASSO 0.1 — RF.CORE.01 Auth Guard
- **Verificar** `app/layout.tsx`: `getUser()` + redirect `/login` para rotas `/app/*`
- **Adicionar** `?redirect=/app` no redirect para retorno pós-login
- **Documentar** em RF-CORE-REQUISITOS.md: status "validado"

### PASSO 0.2 — RF.CORE.02 Dashboard por Role
- **Buscar** `profile.role` do usuário na página `/app`
- **Renderizar** widgets condicionalmente por role (ver RF-CORE-REQUISITOS.md)
- **Fallback** para roles não mapeados: mostrar todos ou subset padrão

---

## FASE 1 — OPS + PEOPLE

### PASSO 1.1 — RF.OPS.01 Playbooks (tags, last_reviewed_at)
- **Migration** `013_playbooks_metadata.sql`: ADD COLUMN tags jsonb, last_reviewed_at date
- **Evoluir** `playbook-editor-form.tsx`: campos Tags e Data de Revisão
- **Evoluir** `playbooks.ts` actions: incluir tags, last_reviewed_at no insert/update
- **Aplicar** migration via MCP Supabase

### PASSO 1.2 — RF.OPS.02 Métricas (RLS, labels)
- **Verificar** role ops_lead: se não existe no enum, considerar admin/ops para RLS
- **Migration** `014_performance_metrics_rls.sql`: policy para performance_metrics (INSERT/UPDATE apenas role IN (admin, ops, superadmin))
- **Evoluir** `metricas-form.tsx`: label "Custo (R$)" → "Custo Cloud (R$)", "Horas trabalhadas" → "Horas Humanas Gastas"
- **Aplicar** migration via MCP Supabase

### PASSO 1.3 — RF.PEO.01 Gaps (playbook_id, fluxo)
- **Migration** `015_training_gaps_playbook.sql`: ADD COLUMN playbook_id uuid REFERENCES playbooks(id)
- **Evoluir** `gap-form.tsx`: select Playbook (obrigatório), ordem Colaborador → Playbook → Correção, label "Descrição" → "Correção"
- **Evoluir** `createGap` action: incluir playbook_id
- **Evoluir** `gaps/page.tsx`: select playbooks
- **Aplicar** migration via MCP Supabase

---

## FASE 2 — FIN + GROWTH (base)

### PASSO 2.1 — RF.FIN.01 Contratos (renewal_date, adjustment_index)
- **Migration** `016_contracts_lifecycle.sql`: ADD COLUMN renewal_date date, adjustment_index text (ex.: 'IGPM','IPCA')
- **Evoluir** `contract-form.tsx`: campos Data Renovação e Índice Reajuste
- **Evoluir** admin/contracts actions: incluir novos campos
- **Aplicar** migration via MCP Supabase

### PASSO 2.2 — RF.FIN.02 Rentabilidade (hourly_rate, gráfico)
- **Migration** `017_rentability_hourly.sql`: ADD COLUMN hourly_rate numeric em performance_metrics OU tabela config global
- **Evoluir** view `contract_rentability`: Margem = MRR - (hours_worked * COALESCE(hourly_rate, 0) + cost_input)
- **Adicionar** gráfico (barras ou linha) na página `/app/fin/rentabilidade` — usar lib leve (recharts ou chart.js) ou CSS
- **Manter** alerta vermelho para margem negativa

### PASSO 2.3 — RF.GRO.04 success_cases + página /casos
- **Migration** `018_success_cases.sql`: CREATE TABLE success_cases (id, title, slug, raw_data text, summary text, is_published boolean, created_at, etc.)
- **Criar** `/app/growth/casos` página de listagem e CRUD
- **Criar** `(site)/casos` e `(site)/casos/[slug]` páginas públicas — filtro is_published
- **Server Action** getSuccessCases, getSuccessCaseBySlug

---

## FASE 3 — GROWTH (IA) + OPS (validações)

### PASSO 3.1 — RF.GRO.05 Agente de Propostas
- **Server Action** `generateProposalWithAI(clientId, serviceId)`: buscar cliente, serviço, playbook; chamar RAG/LLM; retornar escopo + termos
- **Integrar** ao PropostaForm: botão "Gerar com IA" que preenche campos
- **Refatorar** PDF para usar minuta gerada

### PASSO 3.2 — RF.GRO.06 Agente de Conteúdo
- **Botão** "Transformar Case em Post" em success_cases
- **Server Action** `generatePostFromCase(caseId)`: ler raw_data do case; chamar LLM; retornar draft markdown
- **Fluxo** usuário edita draft → salva em public_posts

### PASSO 3.3 — RF.OPS.03 Agente RAG (validação)
- **Revisar** system prompt em `/api/chat/playbooks/route.ts`: reforçar "responda APENAS com conteúdo dos playbooks, não invente"
- **Documentar** em ESPECIFICACAO-AGENTES-IA-EMBEDDINGS.md

### PASSO 3.4 — Chatbot RAG público (RF.GRO)
- **Criar** `POST /api/chat/public` — sem auth, rate limit
- **RAG** com filter_source_type 'post' + 'service' (evoluir document_embeddings)
- **Migration** `019_document_embeddings_service.sql`: ADD source_type 'service' ao CHECK
- **Widget** ou página no site para chat público
- **Captura Lead** ao final ou CTA

---

## FASE 4 — JUR + GOV (novos módulos)

### PASSO 4.1 — ness.JUR (estrutura)
- **Migration** `020_jur_tables.sql`: legal_docs, contract_risk_analysis, compliance_checks, compliance_frameworks
- **Criar** `/app/jur` layout e páginas iniciais
- **Adicionar** role `legal` ao enum user_role (migration)
- **API** `POST /api/jur/risk/analyze` — LLM analisa minuta
- **Sidebar** link para JUR (role legal/admin)

### PASSO 4.2 — ness.GOV (estrutura)
- **Migration** `021_gov_tables.sql`: policies, policy_versions, policy_acceptances
- **Criar** `/app/gov` layout e páginas iniciais
- **Sidebar** link para GOV

---

## Checklist de execução (para o agente)

Ao receber "execute plano autonomo":

1. **workflow-init** name="pendencias-nessos", autonomous=true
2. **plan link** ness-growth-inteligencia-comercial (ou criar plano mestre)
3. Para cada PASSO:
   - Criar/editar arquivos conforme especificação
   - Rodar `npm run build` para validar
   - **apply_migration** via MCP quando houver migration
4. **workflow-advance** ao concluir cada fase
5. **git commit** por fase ou grupo lógico
6. **git push** ao final

---

## Variáveis e convenções

- **Prefixos de commit:** `core:`, `ops-ep:`, `ppl-tc:`, `fin-cfo:`, `growth-ic:`, `jur-cp:`, `gov-pn:`
- **Migrations:** numerar 013, 014, ... em ordem
- **Server Actions:** sempre `'use server'`
- **Branding:** ness.OS, ness. (ver DIRETRIZES-DESENVOLVIMENTO.md)
