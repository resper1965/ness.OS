# ness.DATA — ERP (Omie): persistência, tabelas e dicionário de dados

## 2. Os dados importados do ERP são persistidos na base do app?

**Sim, em parte.**

| Fonte Omie | Persistido na base? | Onde / Como |
|------------|---------------------|-------------|
| **Clientes** (ListarClientes) | **Sim** | Tabela `clients`. O sync (`syncOmieErp`) insere ou atualiza registros com `name`, `document`, `contact_email`, `omie_codigo`. |
| **Contas a receber** (ListarContasReceber) | **Não** | Consulta **sob demanda** via API Omie. O app chama `getOmieContasReceber(periodo)` quando precisa (ex.: reconciliação MRR no ness.FIN, relatórios). Nenhuma tabela do app armazena contas a receber. |
| **Log de sync** | **Sim** | Tabela `erp_sync_log`: cada execução do sync grava `started_at`, `finished_at`, `status`, `record_count`, `error_message`. |
| **Faturamento por mês (snapshot)** | **Sim** (Fase 1) | Tabela `erp_revenue_snapshot`: snapshot mensal de faturamento por `omie_codigo`. Sincronizado via cron (`/api/cron/sync-omie-revenue`) ou action `syncOmieRevenueSnapshot(period)`. Reconciliação, relatório Omie, CFO e GROWTH leem via `getOmieFaturamentoForPeriod` (usa snapshot quando disponível para o mês). |

Resumo: **clientes** e **snapshot de faturamento mensal** são persistidos. Contas a receber em tempo real continuam disponíveis via API quando o período não tiver snapshot ou for multi-mês.

---

## 3. Por que não vejo os dados persistidos em ness.DATA?

A página **ness.DATA** (`/app/data`) hoje é um hub de **ações** (botão Sync ERP, link para Indicadores) e texto explicativo. Ela **não listava** resumo dos dados já persistidos (quantos clientes, quantos com Omie, último sync).

A partir desta documentação e da melhoria na página:

- A página ness.DATA passa a exibir **resumo dos dados persistidos**: total de clientes, clientes com `omie_codigo`, último sync (já existia no botão), e links para onde os dados são usados (ex.: ness.FIN Contratos).
- Os **dados brutos** (lista de clientes) continuam acessíveis em **ness.FIN → Contratos** (e em outras telas que usam `clients`), não na tela ness.DATA, que fica como visão de “camada de dados” e sync.

---

## 4. Quais tabelas são importadas e quais dados vêm do ERP — dicionário

### Tabelas envolvidas no ERP (Omie)

| Tabela | Papel | Preenchida pelo ERP? |
|--------|--------|----------------------|
| **`clients`** | Cadastro de clientes do app | **Parcialmente.** Campos `name`, `document`, `contact_email`, `omie_codigo` são atualizados/inseridos pelo sync Omie. Clientes criados manualmente no app não têm `omie_codigo`. |
| **`erp_sync_log`** | Auditoria das execuções do sync | **Sim.** Só escrita pelo processo de sync (Omie → app). |
| **`erp_revenue_snapshot`** | Snapshot mensal de faturamento por cliente Omie | **Sim.** Preenchida por `syncOmieRevenueSnapshot(period)` (cron ou manual). |

Nenhuma outra tabela do app é **populada diretamente** pelo Omie. Contratos (`contracts`), métricas, etc. são do app; o Omie só influencia **clientes** e o **log de sync**.

### Dicionário de dados — origem ERP

#### Tabela `clients` (campos que vêm ou são usados no sync Omie)

| Coluna | Tipo | Origem | Descrição |
|--------|------|--------|-----------|
| `id` | uuid | App | PK, gerado no app. |
| `name` | text | **Omie** (sync) ou app | Nome: no sync usa `razao_social` ou `nome_fantasia` do Omie. |
| `document` | text | **Omie** (sync) ou app | CNPJ/CPF apenas dígitos. Omie: `cnpj_cpf` normalizado. |
| `contact_email` | text | **Omie** (sync) ou app | E-mail do cadastro Omie. |
| `created_at` | timestamp | App | Data de criação no app. |
| `omie_codigo` | text | **Omie** (sync) | Código do cliente no Omie (`codigo_cliente_omie`). Único quando preenchido. Usado para matching no sync e na reconciliação MRR × faturamento Omie. |

Mapeamento **Omie → app** no sync:

- `codigo_cliente_omie` → `clients.omie_codigo`
- `razao_social` ou `nome_fantasia` → `clients.name`
- `cnpj_cpf` (só dígitos) → `clients.document`
- `email` → `clients.contact_email`

#### Tabela `erp_revenue_snapshot` (snapshot de faturamento mensal)

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | uuid | PK. |
| `period` | date | Primeiro dia do mês (YYYY-MM-01). |
| `omie_codigo` | text | Código do cliente no Omie. |
| `valor` | numeric | Soma do faturamento no período. |
| `created_at` | timestamptz | Criação/atualização. |

Único: `(period, omie_codigo)`. Migration: `038_erp_revenue_snapshot.sql`. Plano: `docs/PLANO-GESTAO-DADOS-PERSISTENCIA.md` (Fase 1).

#### Tabela `erp_sync_log` (auditoria do sync)

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | uuid | PK. |
| `started_at` | timestamptz | Início da execução do sync. |
| `finished_at` | timestamptz | Fim (null enquanto `status = 'running'`). |
| `status` | text | `running` \| `success` \| `error`. |
| `record_count` | int | Número de clientes processados (inseridos ou atualizados) naquele sync. |
| `error_message` | text | Mensagem de erro se `status = 'error'`. |
| `created_at` | timestamptz | Criação do registro. |

---

### Dados do ERP que **não** são persistidos

- **Contas a receber:** usadas em memória (ex.: `getOmieContasReceber`). Servem para comparação com MRR (reconciliação) e relatórios; não há tabela “contas a receber” no app.
- **Outros endpoints Omie** (produtos, contas a pagar, etc.): não estão em uso no app hoje; se forem usados no futuro, o desenho (persistir ou só consultar) deve ser definido e documentado aqui.

---

## Massa de dados e índices (ness.DATA)

Tabelas para **acontecimentos** e **índices derivados** (além do ERP):

| Tabela | Descrição | Uso |
|--------|-----------|-----|
| **event_aggregates** | Contagem de eventos por (period, module, event_type). | Agregação de `module_events` por dia; cron `POST /api/cron/aggregate-events`. Dashboards de acontecimentos. |
| **data_indices** | Índices calculados por período (period, index_key, value). | leads_mes, contratos_ativos, mrr_total; cron `POST /api/cron/compute-data-indices` (dia 1 do mês). Relatórios e KPIs. |

- **event_aggregates:** Migration `040_event_aggregates.sql`. Actions: `aggregateModuleEventsForPeriod(period)`, `getEventAggregates(options?)`.
- **data_indices:** Migration `041_data_indices.sql`. Actions: `computeDataIndices(period)`, `getDataIndices(options?)`.
- Plano: [PLANO-PERSISTENCIA-MASSA-INDICES-ACONTECIMENTOS.md](PLANO-PERSISTENCIA-MASSA-INDICES-ACONTECIMENTOS.md).

---

## Referências

- Sync: `src/app/actions/data.ts` — `syncOmieErp()`, `getLastErpSync()`, `syncOmieRevenueSnapshot(period)`, `getOmieFaturamentoForPeriod()`, `getOmieRevenueFromSnapshot(period)`.
- Cliente Omie: `src/lib/omie/client.ts` — `listarClientes()`, `listarContasReceber()`.
- Cron: `POST /api/cron/sync-omie-revenue` (sync do mês anterior; exige CRON_SECRET).
- Migrations: `003_ops_fin_tables.sql` (clients), `029_erp_sync_omie.sql` (omie_codigo, erp_sync_log), `038_erp_revenue_snapshot.sql` (erp_revenue_snapshot), `040_event_aggregates.sql`, `041_data_indices.sql`.
