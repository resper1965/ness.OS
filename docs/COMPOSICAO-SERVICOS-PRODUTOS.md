# Composição Serviços/Produtos — Task → Playbook → Service Action → Service

Especificação do modelo de composição de serviços e produtos no ness.OS seguindo os princípios da **ITIL v4**: **Task** (menor unidade), **Playbook** (procedimento padronizado), **Service Action** (unidade de entrega/job) e **Service** (produto vendável).

As unidades operacionais (**Task**, **Playbook** e **Service Action**) devem ter **métrica de consumo** — temporal ou valor — para fundamentar Ops, Growth e FIN.

---

## 1. Modelo de composição

| Nível | Entidade           | Definição                                                                                                                                        | Métrica                                              |
| ----- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| **1** | **Task**           | Menor unidade de composição. Tarefa atômica e técnica (ex.: "Revisar backup", "Configurar SSL").                                                 | **Temporal** (minutos) ou **Valor** (R$).            |
| **2** | **Playbook**       | **Standard Operating Procedure (SOP)**. Conjunto ordenado de tasks que descreve o "como fazer".                                                  | Soma das tasks ou estimativa manual do procedimento. |
| **3** | **Service Action** | **Job / Unidade de Entrega**. Conjunto de playbooks que representa uma entrega de valor para o cliente (ex.: "Onboarding", "Manutenção Mensal"). | Estimativa de custo/tempo para a entrega completa.   |
| **4** | **Service**        | **Service Offering**. Conjunto de Service Actions vendável no catálogo (`services_catalog`).                                                     | `base_price` e/ou soma das Service Actions.          |

**Regra de negócio:** Task e Playbook **devem** ter ao menos uma métrica de consumo (temporal ou valor) para permitir planejamento, precificação e acompanhamento (ness.OPS / ness.FIN).

---

## 2. Hierarquia e relações

```
Service (services_catalog)
  └── N playbooks (services_playbooks: service_id, playbook_id, sort_order)
        └── N tasks (tasks: playbook_id, title, slug, sort_order, métricas)
```

- **Service → Playbook:** já existente (`services_playbooks`, N:N).
- **Playbook → Task:** nova entidade `tasks` com `playbook_id` (1 playbook → N tasks). Ordem via `sort_order`.

---

## 3. Métricas de Consumo e Precificação

Para permitir uma precificação precisa e determinação de tempo, as métricas seguem um modelo de **Agregação em Cascata (Bottom-Up)** com possibilidade de **Sobrescrita Manual (Top-Down)**.

### 3.1 Agregação de Métricas

| Nível              | Lógica de Cálculo (Tempo/Custo)           | Racional                                      |
| :----------------- | :---------------------------------------- | :-------------------------------------------- |
| **Task**           | Valor Atômico (Input Manual)              | Base técnica (ex: 30 min ou R$ 50).           |
| **Playbook**       | `SUM(Tasks)` ou `Manual Override`         | Agregado dos passos + margem de erro técnica. |
| **Service Action** | `SUM(Playbooks)` + `Operational Buffer`   | Custo de orquestração e entrega (Job).        |
| **Service**        | `SUM(Service Actions)` + `Market Premium` | Valor final de venda (Produto).               |

### 3.2 Campos de Detalhamento Técnico

Cada entidade deve conter os seguintes campos para suporte a precificação e crescimento (Growth/Costs):

- **estimated_duration_minutes:** Tempo técnico estimado para execução.
- **estimated_cost_value:** Custo base (recursos humanos/ferramentas).
- **complexity_factor:** Multiplicador de risco (1.0 a 2.0) para Service Actions complexas.
- **resource_type:** Identificação se o custo é predominantemente Humano (horas) ou Tecnológico (licença/cloud).

### 3.3 Fórmulas Sugeridas

1.  **Custo Operacional (Ops):**
    `Total_Cost = (SUM(Tasks.cost) * complexity_factor) + platform_overhead`
2.  **Tempo de Entrega (Estimation):**
    `Lead_Time = SUM(Playbooks.duration) / availability_index`
3.  **Preço de Venda (Growth):**
    `Selling_Price = Total_Cost * profit_margin_target`

---

## 4. Schema Detalhado (Evolução)

### 4.1 Tabela `tasks` (Nova)

- `playbook_id`: FK
- `title`, `slug`, `description`
- `estimated_duration_minutes`: numeric
- `estimated_cost_value`: numeric (custo base)
- `sort_order`: int

### 4.2 Tabela `playbooks` (SOP)

- (Evoluir campos atuais)
- `estimated_duration_minutes`: numeric (auto-soma ou manual)
- `estimated_cost_value`: numeric
- `is_manual_metric`: boolean (se true, ignora a soma das tasks)

### 4.3 Tabela `service_actions` (Jobs)

- `id`, `title`, `slug`
- `description`
- `complexity_factor`: numeric (default 1.0)
- `estimated_duration_total`: numeric
- `estimated_cost_total`: numeric

### 4.4 Tabela `service_action_playbooks` (N:N)

- `service_action_id`, `playbook_id`, `sort_order`

---

## 5. UI ness.OPS — Foco em Estimativas

A interface deve permitir que o gestor de Ops veja o "Preço de Custo" vs "Preço de Venda" conforme as tasks são adicionadas.

- **Dashboard de Composição:** Visualização em árvore (Tree View) mostrando Service → Actions → Playbooks → Tasks com os totais de tempo e custo acumulados em cada nó.

---

## 6. Integração com módulos

- **ness.OPS:** Playbooks (CRUD), Tasks (CRUD por playbook, ordenar), Timer (time_entries com playbook_id; opcional task_id).
- **ness.FIN:** performance_metrics por contrato/mês; custo/hora e custo por playbook podem usar estimated_duration_minutes e estimated_value para planejamento.
- **ness.GROWTH:** services_catalog + services_playbooks já compõem serviço → playbooks; propostas podem referenciar serviços e, no futuro, exibir composição task/playbook e estimativas.

---

## 7. Referências

- Migrations: 003_ops_fin_tables (playbooks), 028_services_playbooks_many, 030_time_entries_timesheet
- Planos: [ness.OPS Engenharia Processos](PLANO-NESS-OPS-ENGENHARIA-PROCESSOS.md), [ness.FIN CFO Digital](PLANO-NESS-FIN-CFO-DIGITAL.md)
- Glossary: .context/docs/glossary.md (atualizar com Task e métrica de consumo)
