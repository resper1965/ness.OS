# ness.FIN — CFO Digital

> A verdade financeira sobre cada contrato. Rentabilidade Real e Gestão do Ciclo de Vida.

---

## Nomenclatura do plano

**Código do plano:** `FIN-CFO` (ness.FIN — CFO Digital)

### Pilares (por sigla)

| Sigla | Nome completo | Descrição curta |
|-------|---------------|-----------------|
| **CEP** | Conexão ERP | Cruzamento em tempo real Receita x Despesa |
| **RLR** | Rentabilidade Líquida Real | Receita - (RH + Ferramentas + Impostos + Overhead) |
| **GCV** | Gestão de Ciclo de Vida | Datas críticas, reajustes, alertas de faturamento |

### Tabelas e entidades

| Código | Tabela/entidade | Uso |
|--------|-----------------|-----|
| `contracts` | Contratos (evoluir) | MRR, datas, reajuste_index, renewal_alert_days |
| `contract_cost_breakdown` | Detalhamento de custos por contrato | RLR — RH, ferramentas, impostos, overhead |
| `cost_categories` | Categorias de custo | rh, ferramentas, impostos, overhead |
| `lifecycle_events` | Datas críticas | Renovação, reajuste IGPM/IPCA, vencimento |
| `erp_sync_log` | Log de sincronização ERP | CEP — auditoria de sync |

### Rotas e APIs

| Rota | Sigla | Função |
|------|-------|--------|
| `POST /api/fin/erp/sync` | CEP | Disparar sync com Omie/ERP |
| `GET /api/fin/rentabilidade/real` | RLR | Rentabilidade líquida com breakdown |
| `GET /api/fin/ciclo-vida/alertas` | GCV | Próximas renovações, reajustes, vencimentos |

### Fases de implementação

| Fase | Sigla | Pilares |
|------|-------|---------|
| F1 | FIN-R | Rentabilidade Líquida Real (breakdown de custos) |
| F2 | FIN-E | Conexão ERP (Omie) |
| F3 | FIN-C | Gestão de Ciclo de Vida (alertas, reajustes) |

**Prefixo de commits:** `fin-cfo:` (ex.: `fin-cfo: add contract_cost_breakdown migration`)

### Requisitos Core (pré-requisitos)

| ID | Requisito |
|----|-----------|
| RF.CORE.01 | Auth Guard: /app exige sessão; redirect para /login |
| RF.CORE.02 | Dashboard personalizado por Role |

Ver [RF-CORE-REQUISITOS.md](RF-CORE-REQUISITOS.md)

### Requisitos FIN (ness.FIN — CFO Digital)

| ID | Requisito | Detalhes |
|----|-----------|----------|
| **RF.FIN.01** | Gestão de Contratos | Contrato vinculado a Cliente. Campos: MRR, Data Início, Data Renovação, Índice Reajuste |
| **RF.FIN.02** | Rentabilidade (Calculadora) | Tabela/Gráfico. Margem = MRR - (Custos Ops + Rateio Fixo). Alerta visual para margens negativas |

---

## RF.FIN.01 — Gestão de Contratos (detalhamento)

| Item | Especificação |
|------|---------------|
| **Cadastro** | Contrato vinculado a Cliente |
| **Dados** | MRR (Receita Recorrente), Data Início, Data Renovação, Índice Reajuste |

**Estado atual:** `contracts` tem client_id, mrr, start_date, end_date, notes. Falta **renewal_date** (Data Renovação) e **adjustment_index** (Índice Reajuste: IGPM, IPCA, etc.).

**Entregas RF.FIN.01:** Migration para renewal_date e adjustment_index; evoluir ContractForm; validar CRUD em /app/fin/contratos.

---

## RF.FIN.02 — Rentabilidade (Calculadora) (detalhamento)

| Item | Especificação |
|------|---------------|
| **Fórmula** | Margem = Receita Contrato (FIN) − (Horas × Custo Hora + Custo Infra) (OPS) |
| **Visualização** | Tabela e Gráfico |
| **Alerta** | Visual para margens negativas (vermelho ou destaque) |

**Estado atual:** Tabela em /app/fin/rentabilidade; view contract_rentability: revenue - total_cost (cost_input de performance_metrics). Margem negativa já em vermelho. **Gap:** A fórmula canônica exige (Horas × Custo Hora + Custo Infra) — `performance_metrics` tem hours_worked e cost_input; falta `hourly_rate` explícito ou convenção (ex.: cost_input = Custo Infra; hours × rate em outra coluna).

**Entregas RF.FIN.02:** Evoluir view/lógica para Margem = MRR - (hours_worked × hourly_rate + cost_input); adicionar hourly_rate (em performance_metrics ou config global); gráfico; manter alerta visual para margem negativa.

---

## Resumo: O que existe hoje → O que virá

| Pilares propostos | Hoje no ar | Transformação |
|-------------------|------------|---------------|
| **CEP — Conexão ERP** | Dados manuais (contratos, métricas) | Sync em tempo real com Omie: receita e despesa por contrato |
| **RLR — Rentabilidade Líquida Real** | Receita - custo único (performance_metrics.cost_input) | Receita - (RH + Ferramentas + Impostos + Rateio Overhead). Identifica clientes lucrativos vs. drenam caixa |
| **GCV — Gestão de Ciclo de Vida** | Apenas start_date, end_date em contratos | Automação de renovações, reajustes IGPM/IPCA, alertas de faturamento |

---

## Visão proposta

| Pilar | Descrição |
|-------|-----------|
| **CEP — Conexão ERP** | Cruzamento em tempo real de Receita x Despesa. Integração com Omie (ou outro ERP) para trazer faturamento e despesas reais. |
| **RLR — Rentabilidade Líquida Real** | Cálculo automático: Receita - (RH + Ferramentas + Impostos + Rateio de Overhead). Identifica quais clientes são lucrativos e quais drenam caixa. |
| **GCV — Gestão de Ciclo de Vida** | Automação de datas críticas (renovações, reajustes IGPM/IPCA) e alertas de faturamento. |

---

## Estado atual vs. Estado alvo

### 1. Gestão de Contratos — RF.FIN.01

| Atual | Alvo | Transformação |
|-------|------|---------------|
| client_id, mrr, start_date, end_date | + Data Renovação, Índice Reajuste | Adicionar renewal_date e adjustment_index em contracts |

### 2. Rentabilidade (Calculadora) — RF.FIN.02

| Atual | Alvo | Transformação |
|-------|------|---------------|
| Margem = MRR - cost_input; alerta vermelho | Fórmula: MRR − (Horas × Custo Hora + Custo Infra); alerta visual | Evoluir para fórmula canônica; hourly_rate; gráfico |

### 3. Conexão ERP (CEP)

| Atual | Alvo | Transformação |
|-------|------|---------------|
| Dados manuais em `contracts` e `performance_metrics` | Receita e despesa vindas do ERP em tempo real | **Construir** integração Omie: sync clientes, contratos, faturas. API Omie já prevista (OMIE_APP_KEY, OMIE_APP_SECRET). |
| MRR digitado manualmente | MRR reconciliado com faturamento ERP | **Criar** job/cron ou webhook que compara MRR interno vs. faturamento Omie. Alerta de divergência. |
| Custos via performance_metrics | Despesas por contrato do ERP | **Mapear** despesas Omie para contratos (por centro de custo, tags, ou mapeamento manual). |

**Entregas:**
- Edge Function ou Server Action para sync Omie (clientes, contratos, contas a receber)
- Tabela `erp_sync_log` (last_sync, status, record_count)
- UI: botão "Sincronizar ERP" + status da última sync
- Reconciliar receita: `contracts.mrr` vs. faturamento Omie

---

### 4. Rentabilidade Líquida Real (RLR)

| Atual | Alvo | Transformação |
|-------|------|---------------|
| `contract_rentability`: revenue - total_cost (cost_input único) | Receita - (RH + Ferramentas + Impostos + Overhead) | **Construir** `contract_cost_breakdown`: contract_id, cost_category (rh | ferramentas | impostos | overhead), amount, period. |
| Sem breakdown de custos | Breakdown por categoria | **Evoluir** view ou criar `contract_rentability_real`: soma custos por categoria. Exibir RH, Ferramentas, Impostos, Overhead separados. |
| Sem rateio de overhead | Overhead rateado por contrato | **Definir** regra de rateio (ex.: proporcional ao MRR, ou horas alocadas). Campo overhead_rate ou fórmula. |
| Sem identificação de dreno | Identifica clientes que drenam caixa | **Adicionar** indicador na UI: lucrativo (verde) vs. dreno (vermelho). Métrica: margem % ou rentabilidade líquida. |

**Entregas:**
- Migration: `cost_categories`, `contract_cost_breakdown`
- View ou função `contract_rentability_real` com breakdown
- Evoluir página de Rentabilidade: tabela com colunas RH, Ferramentas, Impostos, Overhead, Total, Margem
- Regra de rateio de overhead (configurável)

---

### 5. Gestão de Ciclo de Vida (GCV)

| Atual | Alvo | Transformação |
|-------|------|---------------|
| Contratos: start_date, end_date | Datas críticas automatizadas | **Evoluir** `contracts`: renewal_date, adjustment_index (IGPM | IPCA), adjustment_frequency (anual | semestral). |
| Sem alertas | Alertas de renovação, reajuste, faturamento | **Construir** `lifecycle_events` ou campos em contracts. Job que gera alertas: "Contrato X vence em 30 dias", "Reajuste IGPM em 15 dias". |
| Sem cálculo de reajuste | Reajuste IGPM/IPCA automático | **Integrar** API de índices (BCB ou similar) ou input manual. Calcular próximo valor reajustado. |
| Sem central de alertas | Central de alertas de faturamento | **Criar** página `/app/fin/ciclo-vida` ou seção no Dashboard: próximas renovações, reajustes pendentes, contratos vencendo. |

**Entregas:**
- Migration: `contracts` + renewal_date, adjustment_index, adjustment_frequency; ou `lifecycle_events`
- Job/cron ou página que lista alertas (renovação em X dias, reajuste em Y dias)
- UI: Gestão de Ciclo de Vida com filtros e ações (renovar, aplicar reajuste)
- Opcional: integração API índices IGPM/IPCA para cálculo automático

---

## Ordem sugerida de implementação

| Fase | Pilares | Motivo |
|------|---------|--------|
| F1 | RLR — Rentabilidade Líquida Real | Base analítica; não depende de ERP. Usa dados já existentes + novo breakdown. |
| F2 | CEP — Conexão ERP | Enriquecer com dados reais; Omie já está no roadmap. |
| F3 | GCV — Gestão de Ciclo de Vida | Depende de contratos evoluídos; complementa com operacional. |

---

## Dependências

- **OPS-EP:** `contract_resources` (MR) alimenta custo RH e ferramentas em RLR
- **GROWTH-IC:** Contratos e rentabilidade informam Smart Proposals (precificação)
- **Omie:** API para clientes, contratos, contas a receber, contas a pagar

---

## Próximos passos imediatos

1. Validar regra de rateio de overhead (proporcional ao MRR, horas, ou fixo).
2. Definir categorias de custo iniciais (rh, ferramentas, impostos, overhead).
3. Confirmar credenciais Omie e escopo da API (quais endpoints).
