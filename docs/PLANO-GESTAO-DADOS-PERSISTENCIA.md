# Plano: Gestão de dados mais profunda — persistência para avaliações

Objetivo: ampliar a persistência de dados externos (ERP, BCB, etc.) na base do app, priorizando os que alimentam **avaliações** (relatórios FIN, rentabilidade, reconciliação, dashboards CFO/GROWTH, indicadores OPS, 360º).

---

## 1. Mapeamento: fontes → avaliações

| Fonte de dados | Hoje persistido? | Onde é usado (avaliações) |
|----------------|-------------------|---------------------------|
| **Omie — Clientes** | Sim (`clients`) | Contratos, rentabilidade, reconciliação, GROWTH (base clientes) |
| **Omie — Contas a receber** | Não (API sob demanda) | Reconciliação MRR, relatório Omie, Visão CFO (MRR vs Omie), Dashboard GROWTH (faturado mês) |
| **BCB — Dólar PTAX** | Não (fetch sob demanda) | Precificação (ness.GROWTH/FIN), reajuste em moeda |
| **BCB — IPCA / IGP-M** | Não (fetch sob demanda) | Ciclo de vida (reajuste), relatórios FIN |
| **Indicadores (Infra/Sec/Data/Custom)** | Sim (`indicators`) | Dashboards OPS, métricas por contrato |
| **Timer → performance_metrics** | Sim (sync cron) | Rentabilidade, view `contract_rentability` |
| **feedback_360** | Sim | Avaliação 360º (ness.PEOPLE) |
| **contracts, clients, performance_metrics** | Sim | Rentabilidade, alertas, relatórios, CFO |

Conclusão: os principais dados **não persistidos** e usados em avaliações são **contas a receber (Omie)** e **índices BCB (dólar, IPCA, IGP-M)**.

---

## 2. Proposta de persistência (prioridade para avaliações)

### 2.1 Contas a receber (Omie) — alta prioridade

**Problema atual:** toda vez que o usuário abre alertas de reconciliação, relatório Omie ou dashboard GROWTH, o app chama a API Omie. Sem histórico persistido, não há tendência nem relatórios históricos sem nova chamada.

**Proposta:**

- **Tabela:** `erp_revenue_snapshot` (snapshot mensal de faturamento por cliente Omie).
- **Conteúdo:** por mês de referência e por `codigo_cliente_omie`: valor total faturado no mês.
- **Frequência:** sync mensal (cron no início do mês seguinte) ou sob demanda ao rodar sync de clientes (opcional: job que chama ListarContasReceber para o mês anterior e persiste).
- **Uso nas avaliações:** reconciliação MRR, relatório Omie, Visão CFO e Dashboard GROWTH passam a ler da base; histórico permite comparação mês a mês e tendências.

**Schema sugerido:**

```sql
-- erp_revenue_snapshot: faturamento Omie por cliente e mês (persistido para avaliações)
CREATE TABLE IF NOT EXISTS public.erp_revenue_snapshot (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period date NOT NULL,                    -- primeiro dia do mês (YYYY-MM-01)
  omie_codigo text NOT NULL,               -- codigo_cliente_omie
  valor numeric NOT NULL DEFAULT 0,         -- soma valor_documento no período
  created_at timestamptz DEFAULT now(),
  UNIQUE(period, omie_codigo)
);
CREATE INDEX IF NOT EXISTS idx_erp_revenue_snapshot_period ON public.erp_revenue_snapshot(period);
CREATE INDEX IF NOT EXISTS idx_erp_revenue_snapshot_omie ON public.erp_revenue_snapshot(omie_codigo);
COMMENT ON TABLE public.erp_revenue_snapshot IS 'Snapshot mensal de faturamento Omie por cliente; alimenta reconciliação e relatórios sem chamar API sob demanda.';
```

- **Sync:** nova action em `data.ts` (ex.: `syncOmieRevenueSnapshot(period)`) que chama `getOmieContasReceber` para o mês indicado e faz upsert em `erp_revenue_snapshot`. Cron (ex.: `/api/cron/sync-omie-revenue`) no dia 1º do mês para o mês anterior.
- **Consumidores:** `getReconciliationAlerts` e relatório Omie passam a aceitar parâmetro `useSnapshot: boolean`; se true, leem de `erp_revenue_snapshot` para o mês em vez de `getOmieContasReceber`. Dashboard GROWTH (faturado mês) idem.

---

### 2.2 Índices BCB (dólar PTAX, IPCA, IGP-M) — média prioridade

**Problema atual:** dólar, IPCA e IGP-M são buscados sob demanda (com cache de 1h). Não há histórico na base para análises de reajuste ou precificação em períodos passados.

**Proposta:**

- **Tabela:** `bcb_rates_snapshot` (cotação/índice por tipo e data).
- **Conteúdo:** por data e tipo (dollar_ptax, ipca, igpm): valor(es) do dia/mês.
- **Frequência:** job diário (dólar) e mensal (IPCA/IGP-M após divulgação BCB) que chama as funções atuais e persiste.
- **Uso nas avaliações:** relatórios de ciclo de vida e reajuste passam a usar histórico; precificação pode consultar série temporal.

**Schema sugerido:**

```sql
-- bcb_rates_snapshot: cotações e índices BCB persistidos para avaliações e reajuste
CREATE TABLE IF NOT EXISTS public.bcb_rates_snapshot (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rate_type text NOT NULL,                 -- 'dollar_ptax' | 'ipca' | 'igpm'
  ref_date date NOT NULL,                  -- data de referência (cotação ou mês do índice)
  value_buy numeric,                       -- dólar: compra (PTAX)
  value_sell numeric,                      -- dólar: venda (PTAX)
  value numeric,                           -- IPCA/IGPM: valor percentual
  created_at timestamptz DEFAULT now(),
  UNIQUE(rate_type, ref_date)
);
CREATE INDEX IF NOT EXISTS idx_bcb_rates_ref_date ON public.bcb_rates_snapshot(ref_date);
CREATE INDEX IF NOT EXISTS idx_bcb_rates_type ON public.bcb_rates_snapshot(rate_type);
COMMENT ON TABLE public.bcb_rates_snapshot IS 'Snapshot de cotações BCB (PTAX) e índices (IPCA, IGP-M) para reajuste e precificação; alimenta relatórios FIN.';
```

- **Sync:** `syncBcbRatesSnapshot(date?)` em `data.ts`: para a data (ou hoje), chama `getDollarRate`, `getIpcaRate`, `getIgpmRate` e faz upsert em `bcb_rates_snapshot`. Cron diário para dólar; mensal para IPCA/IGP-M (ex.: dia 10 do mês para o mês anterior).
- **Consumidores:** `getDollarRate`, `getIpcaRate`, `getIgpmRate` (ou `getIndices`) passam a ler primeiro da base para a data pedida; se não houver linha, fallback para API e opcionalmente persistir na mesma chamada.

---

### 2.3 Contas a receber — detalhe por documento (opcional, fase 2)

Para avaliações mais granulares (por NF, vencimento, etc.), pode-se persistir **linhas** de contas a receber em vez de só totais por cliente/mês.

- **Tabela:** `erp_contas_receber` (id, period/ref, omie_codigo, numero_documento, valor, data_vencimento, ...).
- **Frequência:** sync mensal ou semanal; volume maior, exige política de retenção (ex.: últimos 24 meses).
- **Uso:** relatórios de inadimplência, aging, concentração por cliente. Pode ser fase 2 após `erp_revenue_snapshot` estável.

---

### 2.4 Outros dados Omie (fase posterior)

- **Contas a pagar:** persistir por período para avaliação de custos e fluxo de caixa (alimentaria custos reais por contrato se houver mapeamento).
- **Produtos/serviços:** catálogo Omie persistido para cruzamento com serviços do app (ness.GROWTH) e precificação.
- **Pedidos de venda:** pipeline comercial e faturamento projetado (ness.GROWTH).

Cada um exige definição de schema e job de sync; recomendado após consolidar contas a receber e BCB.

---

## 3. Estratégia de sync e cron

| Dado | Frequência sugerida | Ação / Cron | Observação |
|------|---------------------|-------------|------------|
| Clientes Omie | Já existe (manual + cooldown 5 min) | `syncOmieErp()` | Mantido. |
| Contas a receber (totais por cliente/mês) | Mensal (mês anterior) | Novo cron: `syncOmieRevenueSnapshot(period)` no dia 1º | Persiste em `erp_revenue_snapshot`. |
| Dólar PTAX | Diário | Novo cron: `syncBcbRatesSnapshot()` para ontem/hoje | Persiste em `bcb_rates_snapshot`. |
| IPCA / IGP-M | Mensal (após divulgação BCB) | Mesmo cron ou job separado no dia 10 | Persiste em `bcb_rates_snapshot`. |
| performance_metrics a partir de timer | Já existe | `/api/cron/sync-performance-metrics` | Mantido. |

- **Fallback:** relatórios e dashboards podem manter opção “dados ao vivo” (API) quando necessário; o padrão passa a ser “dados persistidos” para o período já sincronizado.
- **Retenção:** definir política (ex.: `erp_revenue_snapshot` últimos 36 meses; `bcb_rates_snapshot` 60 meses) e job de limpeza se necessário.

---

## 4. Impacto nas avaliações existentes

| Avaliação / relatório | Hoje | Com persistência |
|-----------------------|------|-------------------|
| **Reconciliação MRR vs Omie** | API Omie a cada acesso | Lê `erp_revenue_snapshot` do mês; opção “atualizar agora” chama API e pode gravar snapshot. |
| **Relatório Omie (faturamento)** | API Omie no período | Lê `erp_revenue_snapshot`; períodos já sincronizados sem nova chamada; histórico para tendências. |
| **Visão CFO (MRR vs faturado Omie)** | API Omie mês atual | Lê snapshot do mês; dashboard mais rápido e estável. |
| **Dashboard GROWTH (faturado mês)** | API Omie mês atual | Lê snapshot; mesma lógica. |
| **Ciclo de vida / reajuste (IPCA, IGP-M)** | API BCB sob demanda | Lê `bcb_rates_snapshot`; análises históricas de reajuste. |
| **Precificação (dólar)** | API BCB sob demanda | Lê snapshot; histórico de câmbio para propostas passadas. |

Nenhuma avaliação deixa de existir; ganha-se velocidade, histórico e menor dependência da disponibilidade das APIs no momento do uso.

---

## 5. Fases sugeridas

| Fase | Escopo | Entregas |
|------|--------|----------|
| **Fase 1** | Snapshot de faturamento Omie (totais por cliente/mês) | Migration `erp_revenue_snapshot`; action `syncOmieRevenueSnapshot(period)`; cron mensal; `getReconciliationAlerts` e relatório Omie (e GROWTH faturado mês) com leitura opcional do snapshot. |
| **Fase 2** | Snapshot BCB (dólar, IPCA, IGP-M) | **Implementado.** Migration `039_bcb_rates_snapshot.sql`; `getDollarRate`/`getIpcaRate`/`getIgpmRate` leem do snapshot primeiro e persistem ao buscar na API; `syncBcbRatesSnapshot(refDate?)`; cron `POST /api/cron/sync-bcb-rates` (diário, sync de ontem). |
| **Fase 3** | Consolidação e documentação | Política de retenção; limpeza de dados antigos; atualizar `docs/DATA-ERP-DICIONARIO.md` e criar doc de “Gestão de dados persistidos”; página ness.DATA exibindo última data de cada snapshot. |
| **Fase 4** (opcional) | Detalhe contas a receber / outros Omie | Tabela `erp_contas_receber` ou equivalente; jobs e relatórios de aging/inadimplência; contas a pagar ou produtos conforme prioridade de negócio. |

---

## 6. Dicionário resumido (novas tabelas)

| Tabela | Descrição | Chave natural | Uso principal |
|--------|-----------|----------------|----------------|
| **erp_revenue_snapshot** | Faturamento Omie por cliente e mês | (period, omie_codigo) | Reconciliação, relatório Omie, CFO, GROWTH (faturado mês). Migration: `038_erp_revenue_snapshot.sql`. |
| **bcb_rates_snapshot** | Cotações e índices BCB por tipo e data | (rate_type, ref_date) | Reajuste (IPCA/IGP-M), precificação (dólar), relatórios FIN. Migration: `039_bcb_rates_snapshot.sql`. rate_type: `dollar_ptax`, `ipca`, `igpm`. |

Campos detalhados conforme schemas na seção 2.

---

## 7. Referências

- **Persistência atual:** `docs/DATA-ERP-DICIONARIO.md`
- **Omie contas a receber:** `docs/INTEGRACAO-OMIE-CONTAS-RECEBER.md`
- **Sync clientes:** `src/app/actions/data.ts` — `syncOmieErp`, `getOmieContasReceber`
- **BCB:** `src/app/actions/data.ts` — `getDollarRate`, `getIpcaRate`, `getIgpmRate`
- **Avaliações FIN:** `docs/CFO-INSIGHTS-NESS-FIN.md`, `docs/relatorios-modulo-fin.md` (plan), view `contract_rentability`
