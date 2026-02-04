# Rate Limit — Chatbot Público (ness.OS)

> Limitação de requisições na API pública de chat (`POST /api/chat/public`). Plano: FASE 5 — Qualidade (PLANO-EXECUCAO-FASE-5-FINAL.md).

## Implementação atual

- **Estratégia:** Rate limit **em memória** por IP.
- **Limite:** 20 requisições por janela de 60 segundos por IP.
- **Identificação do cliente:** `X-Forwarded-For` (primeiro valor) ou `X-Real-IP`; fallback `unknown` (compartilha cota).

## Comportamento

- Ao exceder o limite: resposta **429** com corpo `Muitas requisições. Tente novamente em breve.`
- Em todas as respostas (sucesso ou 429): header **`X-RateLimit-Remaining`** com o número de requisições restantes na janela atual (0 quando bloqueado).

## Limitações

1. **Memória:** O contador é por processo. Em cold start (Vercel serverless) o mapa é reiniciado; em múltiplas instâncias cada uma tem seu próprio contador (não é global).
2. **Persistência:** Não há Redis/KV; não há compartilhamento entre funções ou entre deploys.
3. **Evolução:** Para limite global ou entre instâncias, migrar para Vercel KV ou Redis e manter o mesmo header e lógica de janela.

## Uso em CI / monitoramento

- Clientes podem ler `X-RateLimit-Remaining` para exibir aviso ou desabilitar envio ao se aproximar de 0.
- Em 429, usar `Retry-After` não está implementado; o cliente pode esperar 60s antes de retentar.
