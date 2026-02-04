# ness.GROWTH — FASE 8 (Status)

> Checklist da FASE 8 do plano de execução final. Ref: [PLANO-EXECUCAO-FASE-5-FINAL.md](PLANO-EXECUCAO-FASE-5-FINAL.md).

## PASSO 8.1 — Brand Guardian (base)

- **Migration:** `023_brand_assets.sql` — tabela `brand_assets` (id, name, asset_type, url, metadata, created_at).
- **Página:** `/app/growth/brand` — listagem de assets em PageCard; formulário "Novo asset" (nome, tipo, URL).
- **Formulário:** `BrandAssetForm` — name (obrigatório), asset_type (select: logo, imagem, documento, outro), url (link externo ou path no bucket os-assets). Action `createBrandAssetFromForm` insere em `brand_assets`.
- **Listagem:** Tabela com Nome, Tipo, URL (link clicável), Data. URL pode ser link externo ou caminho no storage (bucket os-assets — ver migration 006).
- **Próximo passo (opcional):** Upload de arquivo para bucket os-assets e preenchimento automático de url.

## PASSO 8.2 — Upsell Alerts (estrutura)

- **Migration:** `024_upsell_alerts.sql` — tabela `upsell_alerts` (id, contract_id, alert_type, message, created_at).
- **Página:** `/app/growth/upsell` — listagem de alertas em PageCard (Contrato/Cliente, Tipo, Mensagem, Data).
- **Trigger/job (pendente):** Quando consumption > threshold, inserir alerta — pode ser implementado via job (pg_cron ou API route agendada) consumindo métricas/contratos.
