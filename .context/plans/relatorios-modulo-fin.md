---
status: filled
generated: 2026-02-05
planSlug: relatorios-modulo-fin
agents:
  - type: "feature-developer"
    role: "Implementar páginas de relatório e server actions de agregação"
  - type: "frontend-specialist"
    role: "UI de relatórios, filtros e exportação"
  - type: "architect-specialist"
    role: "Definir reuso de dados e boundaries FIN/DATA"
docs:
  - "project-overview.md"
  - "architecture.md"
  - "data-flow.md"
phases:
  - id: "phase-1"
    name: "Discovery & Alignment"
    prevc: "P"
  - id: "phase-2"
    name: "Implementation & Iteration"
    prevc: "E"
  - id: "phase-3"
    name: "Validation & Handoff"
    prevc: "V"
---

# Relatórios do módulo ness.FIN

> Implementar geração de relatórios do módulo FIN a partir dos dados já disponíveis (contracts, clients, Omie, contract_rentability, alertas), com páginas dedicadas e opção de exportação.

**Código do plano:** `FIN-REL` | **Commits:** `fin-rel:`

## Task Snapshot

- **Primary goal:** Ter relatórios financeiros acionáveis no ness.FIN: MRR, Rentabilidade, Reconciliação MRR vs Omie, Ciclo de Vida (renovações) e Faturamento Omie por período, com visualização em página e exportação CSV.
- **Success signal:** Usuário acessa `/app/fin/relatorios`, escolhe tipo de relatório e período, vê dados corretos e consegue baixar CSV.
- **Key references:**
  - [ness-fin-cfo-digital](./ness-fin-cfo-digital.md)
  - [data-flow](../docs/data-flow.md)
  - [PLANO-NESS-FIN-CFO-DIGITAL](../../docs/PLANO-NESS-FIN-CFO-DIGITAL.md)

## Dados disponíveis (já ingeridos)

| Fonte | Onde está | Uso nos relatórios |
|-------|-----------|---------------------|
| **contracts** | Supabase `contracts` | MRR por cliente/contrato, datas de renovação e fim, índice de reajuste |
| **clients** | Supabase `clients` (431+ linhas, sync Omie) | Nome, `omie_codigo` para cruzar com faturamento |
| **contract_rentability** | View (017): MRR − (hours_worked × hourly_rate + cost_input) | Relatório de Rentabilidade |
| **performance_metrics** | Supabase `performance_metrics` | Horas e custos por contrato/mês (já agregados na view) |
| **Omie – Contas a receber** | `getOmieContasReceber(dataInicio, dataFim)` em `src/app/actions/data.ts` | Faturamento por período por cliente (código Omie); reconciliação MRR vs faturamento |
| **Alertas de reconciliação** | `getReconciliationAlerts()` em `src/app/actions/fin.ts` | Relatório de Reconciliação (MRR vs faturamento Omie, tolerância 5% ou R$ 50) |
| **erp_sync_log** | Supabase `erp_sync_log` | Histórico de sync Omie (opcional em relatório de saúde de dados) |

Fluxo de dados: **ness.DATA** expõe Omie via `data.ts`; **ness.FIN** consome em `fin.ts` e nas páginas. Relatórios devem usar apenas essas actions e tabelas/views existentes.

## Relatórios a implementar

1. **MRR** — Total e por cliente; opcionalmente por período (mesmo mês). Fonte: `contracts` (soma `mrr`), join `clients`.
2. **Rentabilidade** — Já existe página `/app/fin/rentabilidade` com view `contract_rentability`. Relatório: mesma base com filtro de período (performance_metrics.month) e exportação CSV.
3. **Reconciliação (MRR vs Omie)** — Dados já em `getReconciliationAlerts()`. Relatório: tabela consolidada + CSV com cliente, MRR, faturamento Omie, divergência.
4. **Ciclo de vida** — Contratos com `renewal_date`, `end_date`, `adjustment_index`. Relatório: lista de renovações/vencimentos em um intervalo (ex.: próximos 90 dias), opção por índice de reajuste.
5. **Faturamento Omie** — Por período (mês/trimestre). Fonte: `getOmieContasReceber`; exibir por cliente (nome + código Omie) e total; export CSV.

## Codebase Context

- **Actions:** `src/app/actions/fin.ts` (getReconciliationAlerts, addClient, createContract), `src/app/actions/data.ts` (syncOmieErp, getOmieContasReceber). Não criar chamadas diretas ao Omie no FIN; usar apenas DATA.
- **Páginas FIN atuais:** `src/app/app/fin/page.tsx` (dashboard), `fin/contratos`, `fin/rentabilidade`, `fin/alertas`. Incluir nova rota `fin/relatorios` (ou `fin/relatorios/[slug]`) com seletor de tipo de relatório e período.
- **View:** `contract_rentability` (017) — contract_id, client_name, revenue, total_cost, rentability.
- **Componentes reutilizáveis:** `AppPageHeader`, `PageContent`, `PageCard`, `DataTable` em `src/components/shared/`. Padrão de tabela + botão "Exportar CSV" já usado em outras áreas.

## Working Phases

### Phase 1 — Discovery & Alignment

**Steps**

1. Definir estrutura de rota: `/app/fin/relatorios` com subpáginas ou tabs por tipo (MRR, Rentabilidade, Reconciliação, Ciclo de Vida, Faturamento Omie).
2. Listar parâmetros de filtro por relatório: período (data início/fim), cliente (opcional), e garantir que getOmieContasReceber e getReconciliationAlerts aceitam período quando necessário (hoje alertas usam mês atual).
3. Alinhar com ness.DATA: relatórios FIN só consomem `data.ts` e `fin.ts`; nenhuma nova integração Omie no módulo FIN.

**Commit Checkpoint**

- `chore(plan): complete phase 1 discovery — relatorios FIN`

### Phase 2 — Implementation & Iteration

**Steps**

1. **Server actions para relatórios** (em `fin.ts` ou novo `fin-reports.ts`):
   - `getMrrReport(options?: { clientId?, period? })` — agregar MRR a partir de contracts (+ clients).
   - `getRentabilityReport(options?: { period? })` — contract_rentability; se período, filtrar por performance_metrics.month ou manter view atual e documentar que é “até hoje”.
   - `getReconciliationReport()` — reutilizar getReconciliationAlerts; retornar formato tabela + opção de incluir período no futuro.
   - `getLifecycleReport(options?: { fromDate, toDate })` — contracts com renewal_date/end_date no intervalo; incluir adjustment_index.
   - `getOmieRevenueReport(options: { dataInicio, dataFim })` — chamar getOmieContasReceber; mapear omie_codigo → client name via clients; retornar lista + total.

2. **UI**
   - Criar `src/app/app/fin/relatorios/page.tsx`: seletor de tipo de relatório, filtros (período, cliente quando aplicável), tabela com dados e botão “Exportar CSV”.
   - Reutilizar `DataTable` e `PageCard`; adicionar helper `exportToCsv(rows, filename)` no cliente ou em lib.

3. **Navegação**
   - Adicionar “Relatórios” no menu FIN em `src/lib/nav-config.ts` (área financeiro: Rentabilidade, Alertas, **Relatórios**).

4. **Exportação CSV**
   - Implementar download CSV a partir dos dados já carregados na página (sem nova request se não precisar de servidor para gerar arquivo).

**Commit Checkpoint**

- `feat(fin): add reports page and MRR, Rentability, Reconciliation, Lifecycle, Omie revenue reports`
- Atualizar plano com decisões (ex.: Rentabilidade “período” = filtro em performance_metrics se houver necessidade).

### Phase 3 — Validation & Handoff

**Steps**

1. Testar cada relatório com dados reais: sem contratos, com contratos sem Omie, com sync Omie e contratos com omie_codigo.
2. Verificar permissões: apenas roles que já acessam FIN (fin, cfo, admin, superadmin) veem relatórios; usar mesmo padrão de `getServerClient()` e RLS.
3. Documentar em docs: lista de relatórios, fontes de dados e como exportar CSV (para usuário final ou suporte).

**Commit Checkpoint**

- `chore(plan): complete phase 3 validation — relatorios FIN`

## Dependencies & Assumptions

- **Internal:** ness.DATA (`data.ts`) mantém getOmieContasReceber e sync Omie; FIN não altera contrato dessas APIs.
- **External:** Omie API disponível e credenciais configuradas; relatório Faturamento Omie pode falhar se API falhar (tratar erro e exibir mensagem).
- **Technical:** View `contract_rentability` e tabelas contracts/clients/performance_metrics existentes; sem novas migrações para os cinco relatórios iniciais.
- **Assumptions:** Período em “Rentabilidade” pode ser “todos os tempos” na v1 (view já agrega por contrato); evolução futura pode filtrar por mês em performance_metrics. Reconciliação continua mês atual até evoluir getReconciliationAlerts para período parametrizável.

## Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Omie indisponível | Low | Medium | Mensagem clara no relatório “Faturamento Omie”; Reconciliação pode ficar vazia |
| Volume grande de contratos/clients | Low | Medium | Paginar ou limitar exportação CSV (ex.: 5k linhas); otimizar queries com índices existentes |

## Evidence & Follow-up

- PR com nova rota `/app/fin/relatorios`, actions de relatório e exportação CSV.
- Atualização do nav-config e, se houver, do plano ness-fin-cfo-digital com link para “Relatórios”.
- Opcional: adicionar card “Relatórios” no dashboard `/app/fin` apontando para `/app/fin/relatorios`.
