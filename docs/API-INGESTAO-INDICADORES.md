# API de Ingestão de Indicadores (ness.DATA)

API para receber métricas de ferramentas externas (Infra, Sec, Data, Custom). ness.DATA persiste; OPS consome em `/app/ops/indicators`.

## Endpoint

**POST** `/api/data/indicators/ingest`

## Autenticação

- **Header:** `x-api-key: <INGEST_INDICATORS_API_KEY>` ou `Authorization: Bearer <INGEST_INDICATORS_API_KEY>`
- Configurar `INGEST_INDICATORS_API_KEY` no ambiente (Vercel/backend).

## Body (JSON)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| source | string | Sim | `"Infra"` \| `"Sec"` \| `"Data"` \| `"Custom"` |
| metric_type | string | Sim | Tipo da métrica (ex.: `uptime`, `incidents_count`, `sla_pct`) |
| value | number | Sim | Valor numérico |
| contract_id | string (uuid) | Não | Contrato associado (opcional) |
| period | string (date) | Não | Período de referência (ex.: `"2025-02-01"` para fev/2025) |
| metadata | object | Não | Dados extras (JSON) |

## Exemplo

```bash
curl -X POST https://seu-app.vercel.app/api/data/indicators/ingest \
  -H "Content-Type: application/json" \
  -H "x-api-key: SEU_API_KEY" \
  -d '{
    "source": "Infra",
    "metric_type": "uptime_pct",
    "value": 99.9,
    "period": "2025-02-01",
    "metadata": { "environment": "prod" }
  }'
```

## Resposta

- **200:** `{ "ok": true, "id": "<uuid>", "message": "Indicador ingerido." }`
- **400:** body inválido (source, metric_type ou value ausentes/incorretos)
- **401:** API key ausente ou inválida
- **500:** erro interno ou env não configurado

## Consumo (OPS)

- Página **Indicadores:** `/app/ops/indicators` — lista indicadores recentes (via `getIndicators()` em ness.DATA).
- Server Action `ingestIndicator(payload)` para ingestão interna (admin/ops/superadmin).

## Referências

- [.context/plans/ness-data-modulo-dados.md](../.context/plans/ness-data-modulo-dados.md)
- [PLANO-NESS-OPS-ENGENHARIA-PROCESSOS.md](./PLANO-NESS-OPS-ENGENHARIA-PROCESSOS.md) — Hub de Indicadores (HI)
- Migration: `033_indicators_ingest.sql`
