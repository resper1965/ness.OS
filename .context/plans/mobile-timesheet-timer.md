---
status: approved
generated: 2026-02-03
planSlug: mobile-timesheet-timer
planVinculado: docs/PLANO-NESS-OPS-ENGENHARIA-PROCESSOS.md, .context/plans/ness-ops-engenharia-processos.md
type: feature
trigger: "timesheet mobile", "timer colaborador", "captura horas", "timesheet timer", "app mobile timesheet"
scope:
  - "Frontend mobile para captura de timesheet dos colaboradores"
  - "Timer: colaborador escolhe cliente/contrato/playbook, dá on, ao terminar dá off"
  - "Integração com ness.OPS (Mapeamento de Recursos) e performance_metrics"
constrains:
  - "Stack: manter Next.js + Supabase; não introduzir nova stack sem consentimento"
  - "Primeira entrega: PWA responsiva no mesmo repo (app.ness.com.br) ou rota dedicada; app nativo (React Native/Expo) só se aprovado"
  - "Auth: mesmo Supabase Auth; RLS por usuário (cada um vê/insere apenas seus registros de tempo)"
docs:
  - "project-overview.md"
  - "architecture.md"
  - "glossary.md"
  - "ness-ops-engenharia-processos.md"
---

# Mobile Timesheet — Timer para Colaboradores

> **Status:** Aprovado. Frontend mobile para captura de timesheet em formato **timer**: colaborador escolhe cliente/contrato/playbook, dá **on**; ao terminar, dá **off**. Tempo registrado alimenta Mapeamento de Recursos (ness.OPS) e rentabilidade (ness.FIN).

**Documentos relacionados:** [ness-ops-engenharia-processos](./ness-ops-engenharia-processos.md), [PLANO-NESS-OPS-ENGENHARIA-PROCESSOS](../../docs/PLANO-NESS-OPS-ENGENHARIA-PROCESSOS.md) — MR (Mapeamento de Recursos).

---

## 1. Contexto

- **performance_metrics:** Hoje existe em `supabase/migrations/003_ops_fin_tables.sql`: `contract_id`, `month`, `hours_worked`, `cost_input`, `sla_achieved`. RLS (014): apenas roles **admin, ops, superadmin** podem inserir/editar. Input atual é manual em `/app/ops/metricas` (form por contrato + mês).
- **Gap:** Colaboradores de campo ou remotos não têm uma forma simples de registrar horas por contrato/playbook em tempo real; o modelo atual exige preenchimento manual no desktop.
- **Proposta:** Um **timer** em frontend mobile (PWA ou rota responsiva): seleção de Cliente → Contrato (e opcionalmente Playbook), botão **Iniciar** → timer corre → botão **Parar** → registro salvo. Cada sessão vira um registro de tempo que pode ser agregado por contrato/mês para alimentar `performance_metrics` ou relatórios.

---

## 2. Escopo da primeira entrega

| Aspecto | Proposta |
|--------|----------|
| **Frontend** | PWA responsiva no mesmo repositório Next.js (rota ex.: `/app/ops/timer` ou `/timer`), otimizada para uso em celular (touch, tela pequena). Sem novo framework (React Native/Expo) na primeira fase, salvo decisão explícita. |
| **UX** | 1) Colaborador abre o app (logado). 2) Seleciona **Cliente** (lista de clientes com contratos ativos). 3) Seleciona **Contrato** (contratos do cliente). 4) Opcional: **Playbook** (atividade/procedimento). 5) Toca **Iniciar** → timer visível (HH:MM:SS). 6) Toca **Parar** → sessão salva; pode iniciar outra ou ver histórico do dia. |
| **Dados** | Nova tabela **time_entries** (ou **timesheet_entries**): `id`, `user_id` (FK profiles), `contract_id` (FK contracts), `playbook_id` (FK playbooks, opcional), `started_at`, `ended_at`, `duration_minutes` (ou calculado), `created_at`. RLS: usuário autenticado pode INSERT com `user_id = auth.uid()` e SELECT apenas seus próprios registros. |
| **Backend** | Server Actions em `app/actions/ops.ts` (ou `timesheet.ts`): `startTimer(contract_id, playbook_id?)`, `stopTimer(entry_id)` ou `saveTimeEntry(contract_id, playbook_id?, started_at, ended_at)`. Leitura: listar contratos ativos por cliente; listar playbooks; listar time entries do usuário (hoje/semana). |
| **Agregação** | Fase 1: apenas persistir time entries. Relatório ou job que soma por `contract_id` + mês pode vir em fase 2 (atualizar `performance_metrics` ou view); OPS continua podendo usar o form atual de métricas para consolidar. |

---

## 3. Modelo de dados proposto

### Tabela `time_entries`

| Coluna | Tipo | Descrição |
|--------|------|------------|
| id | uuid | PK, gen_random_uuid() |
| user_id | uuid | FK profiles(id), NOT NULL — quem registrou |
| contract_id | uuid | FK contracts(id), NOT NULL |
| playbook_id | uuid | FK playbooks(id), NULL — opcional |
| started_at | timestamptz | NOT NULL |
| ended_at | timestamptz | NOT NULL — ao parar o timer |
| duration_minutes | numeric | Duração em minutos (calculado ou armazenado) |
| notes | text | Opcional — observação livre |
| created_at | timestamptz | default now() |

- **RLS:**  
  - SELECT: usuário vê apenas onde `user_id = auth.uid()`.  
  - INSERT: apenas com `user_id = auth.uid()`.  
  - UPDATE/DELETE: apenas próprio registro (opcional, para correção).

- **Índices:** (user_id, started_at), (contract_id, started_at) para listagens e agregações.

---

## 4. Fluxo do timer (UX)

1. **Login:** Mesmo Supabase Auth; colaborador acessa pelo celular (navegador ou PWA instalada).
2. **Home do timer:**  
   - Dropdown/select **Cliente** → carrega contratos ativos daquele cliente.  
   - Dropdown **Contrato** → obrigatório.  
   - Dropdown **Playbook** → opcional (atividade/procedimento).  
   - Botão **Iniciar** → grava `started_at = now()`, exibe cronômetro e botão **Parar**.
3. **Durante:** Timer em tela (HH:MM:SS); botão **Parar** sempre visível.
4. **Parar:** `ended_at = now()`, `duration_minutes` calculado; persiste na tabela `time_entries`; volta à tela de seleção (ou resumo do dia).
5. **Histórico (opcional na v1):** Lista das entradas do dia ou da semana do usuário, para conferência.

---

## 5. Integração com ness.OPS e ness.FIN

- **ness.OPS — Mapeamento de Recursos:** Time entries são a fonte de “horas por contrato”. Em fase 2, job ou relatório pode agregar por `contract_id` + mês e preencher `performance_metrics.hours_worked` (ou exibir em dashboard sem alterar performance_metrics de imediato).
- **ness.FIN — Rentabilidade:** Hoje a view de rentabilidade usa `performance_metrics` (hours_worked, hourly_rate, cost_input). Quando houver agregação timer → performance_metrics, as horas do timer passam a alimentar a margem.
- **Playbook:** Opcional no timer; quando preenchido, permite análise futura de “horas por playbook/atividade” e alinhamento com Engenharia de Processos (OPS).

---

## 6. Riscos e dependências

| Risco | Mitigação |
|-------|------------|
| Colaborador esquece de parar o timer | Mostrar timer em destaque; opcional: notificação após X minutos; permitir edição manual de `ended_at` (próprio usuário). |
| Uso sem contrato ativo | Listar apenas contratos com vigência atual (start_date ≤ hoje, end_date ≥ hoje ou null). |
| PWA vs nativo | Fase 1: PWA no mesmo Next.js; evita nova stack. Se depois for necessário app nativo (push, background), planejar em fase 2. |

**Dependências:** Tabelas `contracts`, `clients`, `playbooks`, `profiles` existentes; Supabase Auth; RLS já usado no app.

---

## 7. Fases sugeridas

| Fase | Conteúdo |
|------|----------|
| **P — Discovery** | Validar modelo `time_entries` com stakeholders; definir se playbook é obrigatório ou opcional; confirmar PWA como primeira entrega. |
| **E — Implementação** | Migration `time_entries` + RLS; Server Actions (start/stop ou save entry); rota `/app/ops/timer` (ou `/timer`) com UI responsiva (cliente → contrato → playbook, Iniciar/Parar, timer); listagem opcional de entradas do dia. |
| **V — Validação** | Teste em dispositivo móvel (navegador e PWA); checagem de RLS (usuário só vê/insere seus dados); documentar onde o timer se encaixa no fluxo OPS/FIN. |
| **Job (fase 2)** | Migration `032_sync_performance_metrics_from_timer.sql`: função `sync_performance_metrics_from_time_entries()`. API `/api/cron/sync-performance-metrics` (POST, Authorization: Bearer CRON_SECRET). Server Action `syncPerformanceMetricsFromTimer()` + botão em /app/ops/metricas. Ver docs/CRON-SYNC-PERFORMANCE-METRICS.md. |

---

## 8. Referências

- [ness-ops-engenharia-processos](./ness-ops-engenharia-processos.md) — MR (Mapeamento de Recursos), performance_metrics.
- [architecture](../docs/architecture.md) — Rotas e camadas do ness.OS.
- [data-flow](../docs/data-flow.md) — Fluxo de dados e formulários.
- Migrations: `003_ops_fin_tables.sql`, `014_performance_metrics_rls.sql`, `017_rentability_hourly.sql`.
