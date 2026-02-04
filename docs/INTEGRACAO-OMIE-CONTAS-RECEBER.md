# Integração Omie — ListarContasReceber (Contas a Receber)

Validação do payload da API Omie para listagem de contas a receber por período. ness.DATA expõe `getOmieContasReceber(periodo)`; ness.FIN consome para reconciliação MRR (alertas em `/app/fin/alertas`).

## Endpoint Omie

- **Serviço:** `financas/contareceber/`
- **Call:** `ListarContasReceber`
- **Doc:** https://app.omie.com.br/developer/

## Parâmetros (request)

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| filtrar_por_data_de | string | Não | Data inicial do período (formato **dd/mm/yyyy**) |
| filtrar_por_data_ate | string | Não | Data final do período (formato **dd/mm/yyyy**) |
| pagina | number | Sim | Paginação (1-based) |
| registros_por_pagina | number | Sim | Itens por página (ex.: 100) |

**Observação:** Não usar `data_inclusao` ou nomes alternativos; a API Omie usa `filtrar_por_data_de` e `filtrar_por_data_ate` para filtrar por período.

## Resposta (response)

- **Campo da lista:** `conta_receber_cadastro` (array de lançamentos).
- **Fallback:** Em algumas versões da API pode vir como `lista_contas_receber`; o código em `getOmieContasReceber` usa `res.conta_receber_cadastro ?? res.lista_contas_receber ?? []`.
- **Campos por item (relevantes para reconciliação):** `codigo_cliente_fornecedor` (ou `codigo_cliente_omie`), `valor_documento` (ou `valor`).

## Uso no ness.OS

- **Cliente:** `src/lib/omie/client.ts` — `listarContasReceber({ filtrar_por_data_de, filtrar_por_data_ate, pagina, registros_por_pagina })`.
- **Action:** `src/app/actions/data.ts` — `getOmieContasReceber({ dataInicio, dataFim })` recebe datas em **dd/mm/yyyy**, pagina e agrega `valor_documento` por `codigo_cliente_fornecedor`/`codigo_cliente_omie`, retornando `Record<string, number>` (código Omie → soma do faturamento no período).
- **Consumidor:** `getReconciliationAlerts()` em `app/actions/fin.ts` compara MRR (contracts) com esse faturamento por cliente (via `clients.omie_codigo`).

## Referências

- [.context/plans/integracao-omie-erp.md](../.context/plans/integracao-omie-erp.md)
- [.context/plans/ness-data-modulo-dados.md](../.context/plans/ness-data-modulo-dados.md)
- [PLANO-NESS-FIN-CFO-DIGITAL.md](./PLANO-NESS-FIN-CFO-DIGITAL.md) — CEP e reconciliação MRR
