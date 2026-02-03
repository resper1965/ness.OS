# Integração Omie ERP — Decisões de Arquitetura (Phase P)

**Workflow:** integracao-omie-erp | **Fase PREVC:** P (Planning)  
**Data:** 2026-02-03

---

## 1. Padrão de integração REST

| Decisão | Escolha | Motivo |
|---------|---------|--------|
| Onde rodar a integração | Server-side apenas (Server Actions ou API Route Next.js) | Credenciais OMIE_APP_KEY/OMIE_APP_SECRET nunca no frontend |
| Cliente HTTP | `fetch` nativo (Node 18+) ou módulo em `lib/omie/` | Sem dependência extra; Next.js roda em Node no server |
| Autenticação Omie | app_key + app_secret no body de cada request JSON | Conforme documentação Omie (não OAuth) |
| Base URL | `https://app.omie.com.br/api/v1` | Oficial; HTTPS obrigatório |

---

## 2. Mapeamento Omie ↔ ness.OS

### Tabela `clients` (existente)

| Coluna atual | Uso |
|--------------|-----|
| id | UUID interno |
| name | Razão social |
| document | CNPJ (ou CPF) — **chave de matching com Omie** |
| contact_email | Contato |

**Decisão:** Adicionar coluna `omie_codigo` (text, nullable, unique) para armazenar o código do cliente no Omie. Matching na primeira sync: por `document` (CNPJ); em syncs seguintes: por `omie_codigo` para evitar duplicatas.

- **Migration necessária:** `ALTER TABLE clients ADD COLUMN IF NOT EXISTS omie_codigo text UNIQUE;`
- **Upsert:** Se `document` ou `omie_codigo` já existir → atualizar; senão → insert. Atualizar `omie_codigo` no primeiro match por document.

### Contas a receber (Omie) → Faturamento para reconciliação

- **Decisão (MVP):** Não criar tabela `erp_receivables` na primeira entrega. Listar contas a receber por período (ex.: mês atual) via API Omie, agregar em memória por cliente (codigo_cliente_omie) e comparar com soma de `contracts.mrr` por cliente (via `clients.omie_codigo`).
- **Evolução:** Se volume ou necessidade de histórico crescer, criar `erp_receivables` (id, client_id, period, amount_receivable, synced_at) e popular no sync.

---

## 3. Regras de reconciliação MRR vs. faturamento Omie

| Regra | Valor sugerido | Observação |
|-------|----------------|------------|
| Tolerância de divergência | 5% do MRR ou R$ 50 (o que for maior) | Configurável depois (tabela config ou env) |
| Período de faturamento Omie | Mês corrente (data início/fim do mês) | ListarContasReceber com filtro de período |
| Agregação Omie | Soma dos valores "a receber" ou "recebidos" no período, por codigo_cliente | Confirmar nome do campo no retorno da API |
| Alerta na UI | Exibir quando \|MRR - faturamento_omie\| > tolerância | Coluna "Divergência" ou badge em /app/fin/contratos ou rentabilidade |

---

## 4. Endpoints Omie a usar (Phase 2)

| Endpoint | Método | Uso |
|----------|--------|-----|
| `geral/clientes` | ListarClientes (POST com paginação) | Sync clientes → clients |
| `geral/clientes` | ConsultarCliente (POST) | Opcional: detalhe por codigo_cliente |
| `financas/contareceber/` | Listar (POST com filtro período) | Agregar faturamento por cliente para reconciliação |

Documentação oficial: https://app.omie.com.br/developer/ — validar nomes exatos dos métodos e payloads antes da implementação.

---

## 5. Fluxo de sync (alto nível)

1. Usuário autorizado (admin/cfo) clica "Sincronizar ERP" ou cron dispara.
2. Inserir registro em `erp_sync_log` (status: running).
3. Chamar ListarClientes (paginado se necessário); para cada página, upsert em `clients` (document / omie_codigo).
4. Chamar listagem de contas a receber do mês; agregar por cliente em memória.
5. Atualizar `erp_sync_log` (status: success, finished_at, record_count opcional).
6. Em caso de erro: atualizar `erp_sync_log` (status: error, error_message); não expor stack no frontend.

---

## 6. Segurança (para Phase 2 / Security Auditor)

- OMIE_APP_KEY e OMIE_APP_SECRET: apenas em variáveis de ambiente (Vercel/Supabase Edge secrets ou .env.local); nunca em código commitado nem em resposta de API.
- Rota/action de sync: proteger por role (ex.: admin, cfo); verificar sessão server-side.
- erp_sync_log: RLS para que apenas roles autorizados leiam; escrita apenas pelo processo de sync.
- Logs: não logar body de request/response que contenha app_secret; logar apenas status e error_message genérico.

---

## Referências

- Plano: [.context/plans/integracao-omie-erp.md](../plans/integracao-omie-erp.md)
- Negócio: [docs/PLANO-NESS-FIN-CFO-DIGITAL.md](../../docs/PLANO-NESS-FIN-CFO-DIGITAL.md)
- API Omie: https://app.omie.com.br/developer/
