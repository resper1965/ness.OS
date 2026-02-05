# Visão CFO — Informações a desenvolver (ness.FIN)

Documento de visão: quais informações um CFO desenvolveria à luz dos **dados já existentes** no ness.OS (contracts, clients, contract_rentability, performance_metrics, Omie, erp_sync_log, time_entries, indicators).

---

## Dados disponíveis (resumo)

| Fonte | Conteúdo relevante para CFO |
|-------|----------------------------|
| **contracts** | client_id, mrr, start_date, end_date, renewal_date, adjustment_index |
| **clients** | name, omie_codigo (431+ registros, sync Omie) |
| **contract_rentability** (view) | Por contrato: revenue (MRR), total_cost, rentability (margem) |
| **performance_metrics** | contract_id, month, hours_worked, hourly_rate, cost_input |
| **Omie (Contas a receber)** | Faturamento por período por cliente (código Omie) |
| **erp_sync_log** | Histórico de sincronização Omie (último sync, status) |
| **time_entries** | Horas por contrato (timer → OPS → performance_metrics → rentabilidade) |
| **indicators** | contract_id, metric_type, value, period (OPS/Infra) |

---

## Informações recomendadas para desenvolver

### 1. Concentração de receita (MRR)
- **O quê:** Top N clientes em % do MRR total; índice de concentração (ex.: top 5 = X% do MRR).
- **Por quê:** Risco de dependência de poucos clientes; diversificação da base.
- **Dados:** `contracts` + `clients`; agregação por client_id, ordenar por mrr desc, somar e calcular % acumulado.
- **Entrega sugerida:** Relatório ou card no dashboard: "Top 5 clientes = X% do MRR"; tabela cliente / MRR / % do total.

### 2. Pipeline de renovação em valor (R$)
- **O quê:** Soma do MRR dos contratos que renovam ou vencem em um intervalo (ex.: próximos 30 / 60 / 90 dias).
- **Por quê:** "Quanto da receita recorrente está em janela de renovação/vencimento?" — planejamento de retenção e follow-up.
- **Dados:** `contracts` (renewal_date, end_date, mrr); filtrar por intervalo; somar mrr.
- **Entrega sugerida:** Cards ou relatório: "R$ X em renovação nos próximos 30 dias", "R$ Y em vencimento nos próximos 90 dias".

### 3. Margem média e % de contratos negativos
- **O quê:** Margem média (rentability / revenue) global; quantidade e % de contratos com rentability < 0.
- **Por quê:** Saúde da margem; identificar carteira de contratos "dreno".
- **Dados:** View `contract_rentability` (revenue, rentability).
- **Entrega sugerida:** Dashboard: "Margem média: X%"; "N contratos com margem negativa (Y%)"; lista ou link para rentabilidade.

### 4. Exposição a reajuste (índice)
- **O quê:** Quantidade de contratos com adjustment_index preenchido (IGPM, IPCA, etc.) e MRR total exposto a reajuste.
- **Por quê:** Projeção de impacto de reajuste; planejamento de comunicação e precificação.
- **Dados:** `contracts` (adjustment_index, mrr); filtrar where adjustment_index is not null; contar e somar mrr.
- **Entrega sugerida:** Card ou relatório: "N contratos (R$ X de MRR) com índice de reajuste"; breakdown por índice.

### 5. Receita reconhecida vs recebida (um número)
- **O quê:** Total MRR (soma contracts.mrr) vs total faturamento Omie no mês; diferença absoluta e %.
- **Por quê:** Visão consolidada da reconciliação; "quanto do que reconhecemos foi efetivamente faturado?".
- **Dados:** `contracts` (mrr); `getOmieContasReceber(mês atual)`; somar e comparar.
- **Entrega sugerida:** Card no dashboard: "MRR reconhecido: R$ X | Faturado Omie (mês): R$ Y | Delta: R$ Z (W%)".

### 6. Custo por tipo (mão de obra vs outros)
- **O quê:** Por contrato (ou total): custo "mão de obra" (hours_worked × hourly_rate) vs cost_input (infra, ferramentas, etc.).
- **Por quê:** Entender driver de custo; onde atacar primeiro (pessoas vs infra).
- **Dados:** `performance_metrics` (hours_worked, hourly_rate, cost_input); agregar por contrato ou global.
- **Entrega sugerida:** Relatório ou gráfico: "Custo MO: R$ X | Custo outros: R$ Y" por contrato ou total.

### 7. Dashboard executivo FIN (resumo em uma tela)
- **O quê:** KPIs em uma única tela: MRR total, # contratos, # clientes ativos, margem média, # alertas de reconciliação, valor em renovação (próximos 90 dias), último sync Omie (data/status).
- **Por quê:** Visão de comando para o CFO; tudo que importa em um lugar.
- **Dados:** Já existentes; combinar getMrrReport (total), contract_rentability (margem), getReconciliationAlerts (count), getLifecycleReport (soma mrr), getLastErpSync().
- **Entrega sugerida:** Página ou seção "Visão CFO" em `/app/fin` ou `/app/fin/relatorios` com cards e links para detalhes.

### 8. Evolução de MRR (histórico)
- **Limitação:** Não há snapshot mensal de MRR (tabela de histórico). Contratos atuais refletem só o estado atual.
- **Alternativas:** (a) Criar job que persiste MRR total por mês em tabela `mrr_snapshots (period, mrr_total, contract_count)`; (b) Usar contracts.start_date como proxy de "entrada" e end_date de "saída" para simular MRR por mês (aproximado).
- **Entrega sugerida:** Fase 2: tabela de snapshot + gráfico "MRR mês a mês".

---

## Priorização sugerida (CFO)

| Prioridade | Item | Esforço | Impacto |
|------------|------|---------|---------|
| 1 | Dashboard executivo FIN (KPIs em uma tela) | Médio | Alto |
| 2 | Pipeline de renovação em valor (R$) | Baixo | Alto |
| 3 | Concentração de receita (top N % MRR) | Baixo | Alto |
| 4 | Receita reconhecida vs recebida (um número) | Baixo | Alto |
| 5 | Margem média e % contratos negativos | Baixo | Médio |
| 6 | Exposição a reajuste (índice) | Baixo | Médio |
| 7 | Custo por tipo (MO vs outros) | Médio | Médio |
| 8 | Evolução de MRR (histórico) | Alto | Alto (requer snapshot) |

---

## Referências

- Plano de relatórios: `.context/plans/relatorios-modulo-fin.md`
- Dados e fluxos: `.context/docs/data-flow.md`, `docs/FLUXO-TIMER-OPS-FIN.md`
- ness.DATA (Omie): `src/app/actions/data.ts`; ness.FIN: `src/app/actions/fin.ts`
