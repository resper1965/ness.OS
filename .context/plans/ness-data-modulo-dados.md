---
status: approved
generated: 2026-02-03
planSlug: ness-data-modulo-dados
planVinculado: docs/PLANO-NESS-FIN-CFO-DIGITAL.md, .context/plans/integracao-omie-erp.md
type: vision
trigger: "ness.DATA", "módulo de dados", "centralizar Omie", "integrações pontuais", "colher dados ERP"
scope:
  - "ness.DATA como camada de dados única (aprovado)"
  - "Todas as coletas de dados externos em ness.DATA — Omie, BCB/índices, ingestão indicadores (aprovado)"
  - "Centralizar ingestão Omie (e futuros ERPs) em um só lugar; módulos consomem via consultas"
  - "Evitar integrações pontuais (FIN, OPS, etc. cada um falando com Omie)"
constrains:
  - "Stack: Next.js, Supabase, Server Actions ou Edge Functions"
  - "Não duplicar dados desnecessariamente; definir fonte de verdade por entidade"
  - "Manter RLS e segurança por domínio (quem pode ler o quê)"
docs:
  - "project-overview.md"
  - "architecture.md"
  - "glossary.md"
  - "integracao-omie-erp.md"
---

# ness.DATA — Módulo de Dados

> **Status:** Aprovado. ness.DATA é a **camada de dados** do ness.OS: colhe dados do Omie (e outras fontes), trata e disponibiliza **consultas** para os módulos de negócio (FIN, OPS, GROWTH, PEOPLE); evita integrações pontuais em cada módulo.

**Documentos relacionados:** [integracao-omie-erp](./integracao-omie-erp.md), [ness-os-definicao-visao](./ness-os-definicao-visao.md), [ness-fin-cfo-digital](./ness-fin-cfo-digital.md).

---

## 1. Problema atual (integrações pontuais)

- **ness.FIN (CEP):** Hoje o sync Omie vive em `fin.ts` e `lib/omie/`: clientes vão para `clients`, log em `erp_sync_log`. Contas a receber e reconciliação MRR ainda serão implementados no FIN.
- **Risco:** Se ness.OPS, ness.GROWTH ou ness.PEOPLE precisarem de dados do Omie (ex.: fornecedores, produtos, centros de custo), cada um tenderia a criar sua própria chamada à API Omie → credenciais e lógica duplicadas, rate limit compartilhado sem coordenação, sem visão única do que já foi trazido.
- **Fonte de verdade:** `clients` é tabela do domínio FIN; mas o *dado bruto* do Omie (clientes, contas a receber, contas a pagar, etc.) poderia ser tratado em um só lugar antes de alimentar FIN, OPS, etc.

---

## 2. Proposta: ness.DATA como camada de dados

| Aspecto | Proposta |
|--------|----------|
| **Missão** | Colher, normalizar e expor dados de fontes externas (Omie primeiro; depois outros ERPs/APIs) em um único lugar. Módulos de negócio (FIN, OPS, GROWTH, etc.) **consomem** via consultas/views/APIs internas, não chamam o Omie diretamente. |
| **Responsabilidades** | Ingestão (sync Omie: clientes, contas a receber, contas a pagar, produtos, etc.); armazenamento em tabelas/views de “dados Omie” ou staging; jobs de normalização e deduplicação; **expor consultas** (Server Actions, funções SQL, ou APIs internas) para FIN, OPS, PEOPLE, etc. |
| **O que NÃO é** | ness.DATA não substitui a regra de negócio dos módulos (ex.: FIN continua dono de contratos, MRR, reconciliação). DATA apenas entrega *dados brutos ou já tratados* para que cada módulo use como quiser. |

---

## 3. Faz sentido?

- **Prós**
  - **Uma única integração Omie:** credenciais, rate limit, retry e log de sync centralizados.
  - **Visão única do que já foi trazido:** evita dois módulos puxando “clientes” do Omie de formas diferentes.
  - **Reuso:** FIN usa “clientes Omie” e “contas a receber”; OPS pode usar “produtos” ou “centros de custo”; PEOPLE pode usar “fornecedores” para algum fluxo futuro — todos consomem do mesmo poço.
  - **Evolução:** Novas fontes (outro ERP, BI, planilhas) entram em ness.DATA; os módulos não precisam saber de onde veio o dado.
- **Contras / Riscos**
  - **Mais uma camada:** precisa de convenção clara (quem é dono do dado final: DATA ou módulo?). Ex.: `clients` hoje é FIN; se DATA passar a ter `omie_clientes` e FIN “derivar” `clients` daqui, o mapeamento e a migração precisam ser bem definidos.
  - **Escopo inicial:** Se hoje só o FIN consome Omie, criar ness.DATA pode parecer overkill; mas o plano de integração Omie já prevê contas a receber, despesas, etc. — centralizar desde já reduz dívida.
- **Conclusão (proposta):** **Faz sentido** ter ness.DATA como módulo/camada de dados, desde que:
  1. Seja tratado como **camada de ingestão e exposição**, não como dono de todas as entidades de negócio (ex.: FIN continua dono de `contracts` e da regra de reconciliação).
  2. Os módulos existentes (FIN primeiro) passem a **consumir** dados Omie via ness.DATA (consultas/actions) em vez de chamar `lib/omie` diretamente.
  3. A definição canônica do ness.OS (6 módulos) seja atualizada para **7 módulos** ou para “6 módulos de negócio + camada DATA”, conforme decisão de produto.

---

## 4. Encaixe na arquitetura

- **Rotas:** Podem existir páginas em `/app/data/` para: status dos syncs (Omie, etc.), configuração de fontes, log de erros. Ou DATA ser apenas backend (actions + tabelas) sem UI obrigatória no MVP.
- **Tabelas:** 
  - Manter `erp_sync_log` (pode migrar para um schema `data` ou `integration` se desejado).
  - Opcional: tabelas staging como `data_omie_clientes`, `data_omie_contas_receber` (cópia bruta do Omie) e então FIN faz upsert em `clients` a partir daqui; ou DATA já faz o upsert em `clients` sob demanda do FIN (ownership claro: FIN é dono de `clients`, DATA só popula).
- **Cliente Omie:** Migrar `src/lib/omie/` para `src/lib/data/omie/` (ou `src/app/actions/data/`) e passar a ser usado apenas por Server Actions do módulo DATA; FIN chama `getOmieClientesSync()`, `getOmieContasReceber(...)` etc. em vez de chamar Omie diretamente.
- **Fluxo sugerido (MVP):**
  1. ness.DATA expõe `syncOmieErp()` (ou job cron) que chama Omie e grava em staging e/ou em `clients` + `erp_sync_log`.
  2. FIN (e outros) chamam funções como `getLastErpSync()`, `getOmieContasReceber(periodo)` em `actions/data.ts` (ou `fin.ts` que internamente chama data).
  3. Nenhum outro módulo usa `OMIE_APP_KEY` nem `listarClientes` diretamente.

---

## 5. Todas as coletas de dados em ness.DATA

**Regra:** Toda coleta de dados de fontes externas (APIs, webhooks, ERPs, índices, ferramentas técnicas) é responsabilidade do **ness.DATA**. Os módulos de negócio (FIN, OPS, GROWTH, PEOPLE, JUR, GOV) **consomem** via consultas/actions expostas por DATA; não chamam APIs externas diretamente.

### 5.1 Inventário de coletas (atuais e planejadas)

| Fonte | Dados coletados | Consumidor | Responsável coleta | Observação |
|-------|------------------|------------|--------------------|------------|
| **Omie (ERP)** | Clientes, contas a receber, contas a pagar, produtos, centros de custo | FIN, OPS, GROWTH, PEOPLE | ness.DATA | Sync centralizado; `erp_sync_log`; já aprovado. |
| **BCB / índices** | **Dólar (PTAX)** USD/BRL, IGPM, IPCA (reajuste) | ness.FIN, ness.GROWTH (precificação) | ness.DATA | API BCB PTAX; `getDollarRate(date?)`, `getIndices(options?)` em `actions/data.ts`; FIN/GROWTH usam para precificação e reajuste. |
| **Hub de Indicadores (ingestão)** | Métricas de ferramentas externas (Infra, Sec, Data, Custom) | ness.OPS (dashboards) | ness.DATA | API de ingestão em DATA; OPS consome para dashboards em `/app/ops/indicators`. |
| **Outro ERP / BI / planilhas** | (Futuro) Dados financeiros ou operacionais | A definir | ness.DATA | Novas fontes entram como novos jobs/syncs em DATA. |

### 5.2 O que NÃO é coleta em ness.DATA

- **Formulários do usuário (leads, candidaturas, contratos digitados, métricas manuais):** entrada via UI do app; permanecem nas actions dos módulos (growth, people, fin, ops).
- **OpenAI (embeddings, chat):** inferência IA; permanece em `lib/ai/` e rotas de chat; não é fonte externa de dados de negócio.
- **Envio de e-mail (Resend/SendGrid):** saída; não é coleta.

### 5.3 Contrato de exposição

- **DATA expõe:** Server Actions e/ou funções como `syncOmieErp()`, `getLastErpSync()`, `getOmieContasReceber(periodo)`, **`getDollarRate(date?)`**, **`getIndices(options?)`** (dólar PTAX; IPCA e IGP-M via BCB SGS 433/189), **`getIpcaRate(date?)`**, **`getIgpmRate(date?)`**, ingestão de indicadores (endpoint ou action).
- **Módulos consomem:** FIN chama DATA para clientes Omie, contas a receber, índices. OPS chama DATA para indicadores já persistidos. Nenhum módulo usa credenciais de Omie, BCB ou ferramentas externas diretamente.

### 5.4 Ordem de implementação sugerida

1. **Omie (já em curso):** mover sync e cliente para ness.DATA; FIN consome via DATA.
2. **Índices BCB:** job ou action em DATA que busca IGPM/IPCA; expor consultas; FIN usa no Ciclo de Vida (reajuste).
3. **Ingestão de indicadores:** endpoint/action em DATA; OPS define schema das métricas e consome para Hub de Indicadores (dashboards).
4. **Novas fontes:** conforme demanda, cada nova coleta é implementada dentro de ness.DATA.

---

## 6. Próximos passos (aprovado)

1. ~~Decisão de produto~~ Incluir ness.DATA na definição canônica (7º módulo ou “camada DATA”) e atualizar [ness-os-definicao-visao](./ness-os-definicao-visao.md) e [project-overview](../docs/project-overview.md).
2. ~~Planejamento de todas as coletas~~ — Seção 5 aprovada (Omie, BCB/índices, ingestão indicadores).
3. **Implementação:** (a) ~~Mover cliente Omie e sync para ness.DATA~~; (b) ~~actions/consultas para FIN~~; (c) ~~FIN consumir somente via DATA~~; (d) ~~Índice dólar (PTAX)~~: `getDollarRate(date?)` e `getIndices(options?)` em `actions/data.ts` — FIN/GROWTH usam para precificação. (e) ~~IGPM/IPCA (reajuste)~~: `getIpcaRate(date?)`, `getIgpmRate(date?)` e `getIndices()` retornam também `ipca` e `igpm` (BCB SGS 433/189, variação mensal %). (f) ~~API de ingestão de indicadores (OPS)~~: tabela `indicators` (migration 033), POST `/api/data/indicators/ingest` (API key), `getIndicators()` e `ingestIndicator()` em `actions/data.ts`; página `/app/ops/indicators`. Doc: docs/API-INGESTAO-INDICADORES.md.

~~Plano de implementação (obsoleto):~~ Criar plano executável (fases P/E/V) para: (a) mover cliente Omie e sync para ness.DATA; (b) criar actions/consultas de dados para FIN; (c) FIN passar a consumir somente via DATA; (d) documentar contrato “DATA expõe X, FIN consome Y”.
~~Integração integracao-omie-erp (já refletido acima):~~ Ajustar [integracao-omie-erp](./integracao-omie-erp.md) para que “Sync Omie” e “contas a receber” sejam responsabilidade de ness.DATA; FIN foca em contratos, MRR e reconciliação usando os dados já disponibilizados por DATA.

---

## 7. Referências

- [integracao-omie-erp](./integracao-omie-erp.md) — Plano atual de integração Omie (ness.FIN CEP).
- [ness-os-definicao-visao](./ness-os-definicao-visao.md) — Definição dos 6 módulos.
- [ness-fin-cfo-digital](./ness-fin-cfo-digital.md) — CFO Digital e CEP.
- [architecture](../docs/architecture.md) — Camadas e rotas do ness.OS.
