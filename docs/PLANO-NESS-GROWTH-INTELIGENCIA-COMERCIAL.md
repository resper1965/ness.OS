# ness.GROWTH — Comercial & Conteúdo

> Motor de receita e autoridade: Vendas Inteligentes, Presença Digital e Gestão de Conteúdo.

**O que faz:** Motor de Vendas e alimentação do Site Público.

### Funcionalidades Críticas

| # | Funcionalidade | Regra |
|---|----------------|-------|
| **1** | A Trava do Catálogo | O sistema impede criação de serviço "Ativo" sem `playbook_id`. Evita venda de vaporware. (Implementada: migration 008) |
| **2** | Integração Site | Ao publicar um "Caso de Sucesso" ou "Vaga" no app, ele aparece **instantaneamente** no Site Público (`app/(site)`). |

### Uso de IA

| Recurso | Descrição |
|---------|-----------|
| **Agente de Propostas** | Lê dados do cliente + Playbook do serviço → redige minuta de proposta técnica e comercial. |
| **Agente de Conteúdo** | Botão "Transformar Case em Post". IA lê dados técnicos brutos de um projeto → post de blog amigável para o site. |

---

## Nomenclatura do plano

**Código do plano:** `GROWTH-IC` (ness.GROWTH — Inteligência Comercial)

### Pilares (por sigla)

| Sigla | Nome completo | Descrição curta |
|-------|---------------|-----------------|
| **SP** | Smart Proposals | Propostas geradas por IA com BCS |
| **PDU** | Precificação Dinâmica & Upsell | Preço = custos + risco + alertas de upsell |
| **MC** | Motor de Conteúdo | IA gera drafts de blog a partir de dados |
| **CR** | Chatbot RAG | Assistente público no site (RAG sobre playbooks) |
| **BG** | Brand Guardian | Central de marca (logo, cores, fontes) |

### Tabelas e entidades

| Código | Tabela/entidade | Uso |
|--------|-----------------|-----|
| BCS | Base de Conhecimento de Sucesso | Escopos e termos validados para propostas |
| `proposal_templates` | Escopos técnicos/jurídicos aprovados | SP |
| `contract_terms` | SLA, limites, multas por contrato | PDU |
| `success_cases` | Casos de sucesso anonimizados | MC, SP |
| `brand_assets` | Logo, cores, fontes da marca | BG |
| `upsell_alerts` | Alertas de consumo / upsell | PDU |

### Rotas e APIs

| Rota | Sigla | Função |
|------|-------|--------|
| `/api/chat/public` | CR | Chat RAG público (sem auth) |
| `/api/content/generate` | MC | IA gera draft de post |
| `generateProposalWithAI` | SP | Server Action para proposta com IA |

### Fases de implementação

| Fase | Sigla | Pilares |
|------|-------|---------|
| F1 | ICE | Brand Guardian + Chatbot RAG (base) |
| F2 | ICR | Smart Proposals (receita) |
| F3 | ICP | Precificação dinâmica |
| F4 | ICM | Motor de Conteúdo |
| F5 | ICU | Upsell proativo |

**Prefixo de commits:** `growth-ic:` (ex.: `growth-ic: add brand_assets migration`)

### Requisitos Core (pré-requisitos)

| ID | Requisito |
|----|-----------|
| RF.CORE.01 | Auth Guard: /app exige sessão; redirect para /login |
| RF.CORE.02 | Dashboard personalizado por Role |

Ver [RF-CORE-REQUISITOS.md](RF-CORE-REQUISITOS.md)

### Requisitos GROWTH (ness.GROWTH — Comercial & Conteúdo)

| ID | Requisito | Detalhes |
|----|-----------|----------|
| **RF.GRO.01** | Catálogo de Serviços (A Trava) | CRUD. Regra: "Ativar Venda" só habilita com playbook_id válido. marketing_title e marketing_body → /solucoes/[slug] |
| **RF.GRO.02** | Gestão de Leads (CRM) | Kanban: Novo, Qualificado, Proposta, Ganho, Perdido. Leads do site → coluna "Novo" |
| **RF.GRO.03** | CMS do Blog | Editor de Posts. Toggle is_published: se true, aparece no site público |
| **RF.GRO.04** | Integração Site | Caso de Sucesso e Vaga publicados aparecem instantaneamente no Site Público (app/(site)) |
| **RF.GRO.05** | Agente de Propostas | IA: cliente + Playbook do serviço → minuta de proposta técnica e comercial |
| **RF.GRO.06** | Agente de Conteúdo | Botão "Transformar Case em Post": IA lê dados técnicos brutos → post de blog amigável |

---

## RF.GRO.01 — Catálogo de Serviços (A Trava) (detalhamento)

| Item | Especificação |
|------|---------------|
| **CRUD** | Criar, ler, atualizar e excluir Serviços |
| **Regra de Ouro** | Botão "Ativar Venda" só habilita se playbook_id válido (Trava já existe na migration 008) |
| **Integração Site** | marketing_title e marketing_body alimentam /solucoes/[slug] |

**Gap atual:** `services_catalog` tem name, marketing_pitch, content_json. Falta **marketing_title** e **marketing_body** (ou mapear name → title, adicionar body). Trava playbook_id já implementada.

**Entregas RF.GRO.01:** Migration `marketing_title`, `marketing_body` (ou evoluir content_json); página /solucoes/[slug] consome esses campos.

---

## RF.GRO.02 — Gestão de Leads (CRM) (detalhamento)

| Item | Especificação |
|------|---------------|
| **Kanban** | Colunas: Novo, Qualificado, Proposta, Ganho, Perdido |
| **Integração Site** | Leads do formulário do site → coluna "Novo" |

**Estado atual:** Kanban em `/app/growth/leads` com colunas: Novo, Em Análise, Qualificado, Descartado. Status em `inbound_leads.status`.

**Gap:** Ajustar colunas para: new, qualified, proposal, won, lost. Leads do site já vão para inbound_leads com status 'new'.

**Entregas RF.GRO.02:** Migration ou enum para status (new, qualified, proposal, won, lost); atualizar COLUMNS no LeadKanban; garantir insert anon com status 'new'.

---

## RF.GRO.03 — CMS do Blog (detalhamento)

| Item | Especificação |
|------|---------------|
| **Editor** | CRUD de Posts |
| **Toggle** | is_published: se true, aparece em /blog |

**Estado atual:** `public_posts` com is_published; editor em `/app/growth/posts`; /blog lê publicados. Implementado.

**Entregas RF.GRO.03:** Validar e documentar; evoluir editor (rich text) se necessário.

---

## RF.GRO.04 — Integração Site (detalhamento)

| Item | Especificação |
|------|---------------|
| **Regra** | Ao publicar "Caso de Sucesso" ou "Vaga" no app, aparece **instantaneamente** no Site Público |
| **Vaga** | `public_jobs.is_open = true` → /carreiras (PEOPLE). Implementado. |
| **Caso de Sucesso** | Tabela `success_cases` + página /casos ou seção no site. **Construir.** |

**Entregas RF.GRO.04:** Validar fluxo Vaga → /carreiras; criar `success_cases` e página pública para Casos de Sucesso.

---

## RF.GRO.05 — Agente de Propostas (detalhamento)

| Item | Especificação |
|------|---------------|
| **Input** | Dados do cliente + Playbook do serviço |
| **Output** | Minuta de proposta técnica e comercial |

**Estado atual:** Propostas PDF manuais. RAG sobre playbooks existe (OPS).

**Entregas RF.GRO.05:** Server Action `generateProposalWithAI(clienteId, servicoId)`; integrar ao PropostaForm; PDF com minuta gerada por IA.

---

## RF.GRO.06 — Agente de Conteúdo (detalhamento)

| Item | Especificação |
|------|---------------|
| **UX** | Botão "Transformar Case em Post" |
| **Input** | Dados técnicos brutos de um projeto (Case) |
| **Output** | Post de blog amigável para o site |

**Estado atual:** Posts manuais. Tabela `success_cases` planejada.

**Entregas RF.GRO.06:** Tabela `success_cases`; botão em Case → chama IA → gera draft de post → usuário edita e publica em `public_posts`.

---

## Resumo: O que existe hoje → O que virá

| Pilares propostos | Hoje no ar | Transformação |
|-------------------|------------|---------------|
| **Smart Proposals** | Propostas PDF simples (cliente + serviço + valor manual) | IA gera escopo e termos a partir de Base de Conhecimento de Sucesso + playbooks |
| **Precificação Dinâmica & Upsell** | Valor digitado à mão | Preço = custos + margem + risco SLA. Alertas de upsell por consumo |
| **Motor de Conteúdo** | Posts manuais (Markdown) | IA gera drafts a partir de métricas anonimizadas e casos de sucesso |
| **Chatbot RAG** | Knowledge Bot interno (OPS, com login) | Chatbot público no site, mesmo RAG, sem login |
| **Brand Guardian** | Assets genéricos em OPS | Central de marca (logo, cores, fontes) usada em propostas e site |

---

## Visão proposta

| Pilar | Descrição |
|-------|-----------|
| Smart Proposals | Geração de propostas via IA, consultando Base de Conhecimento de Sucesso (escopos técnicos e jurídicos validados) |
| Precificação Dinâmica & Upsell | Preço = custos diretos + riscos (multas SLA). Monitora consumo real (storage, horas) → alertas de upsell proativo |
| Motor de Conteúdo | CMS Headless + IA: dados operacionais anonimizados + casos de sucesso → artigos de blog e posts sociais automaticamente |
| Chatbot RAG | Assistente virtual no **site público** que responde clientes com base nos manuais reais da empresa, sem alucinações |
| Brand Guardian | Centraliza assets e garante consistência visual em todas as propostas |

---

## Estado atual vs. Estado alvo

### 1. Catálogo de Serviços — RF.GRO.01

| Atual | Alvo | Transformação |
|-------|------|---------------|
| CRUD serviços; Trava playbook já existe | marketing_title, marketing_body no site | Adicionar campos; página /solucoes/[slug] usa marketing_title e marketing_body |

### 2. Gestão de Leads — RF.GRO.02

| Atual | Alvo | Transformação |
|-------|------|---------------|
| Kanban: Novo, Em Análise, Qualificado, Descartado | Kanban: Novo, Qualificado, Proposta, Ganho, Perdido | Ajustar colunas e status |

### 3. CMS do Blog — RF.GRO.03

| Atual | Alvo | Transformação |
|-------|------|---------------|
| Editor Posts, is_published, /blog | Idem | Validar; evoluir editor se necessário |

### 4. Integração Site — RF.GRO.04

| Atual | Alvo | Transformação |
|-------|------|---------------|
| Vaga (is_open) → /carreiras ✓ | Caso de Sucesso → site | Criar success_cases + página pública; validar Vaga |

### 5. Smart Proposals — RF.GRO.05 (Agente de Propostas)

| Atual | Alvo | Transformação |
|-------|------|---------------|
| Propostas manuais | IA: cliente + Playbook → minuta | generateProposalWithAI; integrar ao form |

### 6. Agente de Conteúdo — RF.GRO.06

| Atual | Alvo | Transformação |
|-------|------|---------------|
| Posts manuais | Botão "Transformar Case em Post" | success_cases; IA gera draft a partir de dados brutos |

### 7. Smart Proposals (evolução completa)

| Atual | Alvo | Transformação |
|-------|------|---------------|
| Propostas PDF simples (cliente + serviço + valor manual) | Propostas geradas por IA com escopos técnicos e jurídicos validados | **Construir** Base de Conhecimento de Sucesso (BCS). Integrar IA (RAG) para preencher escopo, termos e precificação. PDF deve usar template com BCS + playbook vinculado ao serviço. |
| Form: cliente, serviço, valor | Form: cliente, serviço + IA sugere escopo, termos, preço base | **Evoluir** PropostaForm para: (1) buscar playbook do serviço, (2) chamar IA para montar escopo a partir do playbook e de "casos de sucesso" (tabela `proposal_templates` ou similar), (3) precificação dinâmica (ver abaixo). |
| PDF estático react-pdf | PDF com branding consistente (Brand Guardian) | **Integrar** Brand Guardian: logo, cores, fontes nas propostas. |

**Entregas:**
- Tabela `proposal_templates` ou `proposal_success_cases` (escopos técnicos/jurídicos aprovados)
- API/Server Action `generateProposalWithAI(clienteId, servicoId)` → retorna escopo + termos + preço sugerido
- Refatorar `PropostaForm` e `proposta-pdf` para consumir IA + Brand Guardian

---

### 8. Precificação Dinâmica & Upsell

| Atual | Alvo | Transformação |
|-------|------|---------------|
| Valor digitado manualmente | Preço = custos diretos + margem + risco SLA | **Construir** modelo de precificação: `preco_base = custo_estimado + margem + (multa_sla_esperada * prob_falha)`. Custos vêm de `performance_metrics` (horas, cloud). |
| Nenhum monitoramento de consumo | Alertas de upsell quando consumo excede X% do contrato | **Construir** job/cron ou webhook que compara `performance_metrics` com limites do contrato. Tabela `contract_limits` (storage_limit, hours_limit) e `upsell_alerts`. |
| Contratos com apenas MRR e datas | Contratos com limites e SLA | **Estender** `contracts` ou criar `contract_terms`: `sla_target`, `storage_limit`, `hours_limit`, `sla_penalty`. |

**Entregas:**
- Migration: `contract_terms` ou colunas em `contracts`
- Função `calculate_dynamic_price(servico_id, termos)` ou Server Action
- Página/modal de alertas de upsell (Growth ou Dashboard)
- Integração com PropostaForm para preço sugerido

---

### 3. Motor de Conteúdo (CMS Headless + IA)

| Atual | Alvo | Transformação |
|-------|------|---------------|
| Posts manuais (textarea Markdown) | IA gera artigos a partir de dados operacionais anonimizados e casos de sucesso | **Construir** pipeline: (1) agregar métricas anonimizadas (ex: "X% dos clientes reduziram incidentes"), (2) casos de sucesso em tabela, (3) IA gera draft de post, (4) humano revisa e publica. |
| Blog estático | Conteúdo gerado automaticamente + manual | **Evoluir** `public_posts`: flag `is_ai_generated`, `source_data` (referência aos dados usados). Nova ação `generatePostFromData(topic, source)` → draft. |

**Entregas:**
- Tabela `success_cases` (anonimizado, aprovado para uso em conteúdo)
- API `POST /api/content/generate` → IA gera draft a partir de `success_cases` + métricas
- UI em Growth: "Gerar post com IA" → seleciona tema e fontes → gera → editar → publicar

---

### 10. Chatbot RAG (site público)

| Atual | Alvo | Transformação |
|-------|------|---------------|
| Knowledge Bot **interno** (`/app/ops/playbooks/chat`) — requer login | Chatbot no **site público** para visitantes | **Replicar** lógica do chat RAG em rota pública. Nova rota `/api/chat/public` (sem auth) ou widget no site. RAG já existe (`findRelevantPlaybookContent`). |
| Só OPS acessa | Qualquer visitante pergunta sobre soluções/manuais | **Criar** `(site)/chat` ou widget flutuante. Usar mesmo `match_document_embeddings` filtrado por playbooks de serviços ativos. Rate limit e moderação para abuso. |

**Entregas:**
- `/api/chat/public` — mesmo RAG, sem auth, rate limit
- Componente `SiteChatbot` — widget ou página no site
- Política: só responde com base em playbooks (sem alucinação)

---

### 11. Brand Guardian

| Atual | Alvo | Transformação |
|-------|------|---------------|
| Assets em `/app/ops/assets` (upload genérico) | Central de marca: logo, cores, fontes, templates | **Evoluir** assets: tabela `brand_assets` com tipo (logo, favicon, cores_hex, font_primary). Propostas e site consomem esses valores. |
| PDF com layout hardcoded | Propostas usam branding centralizado | **Refatorar** `proposta-pdf` para ler `brand_assets` (logo URL, cor primária) e aplicar no PDF. |

**Entregas:**
- Migration: `brand_assets` (key, value, type) ou estrutura em `static_pages`/config
- UI Growth: "Brand Guardian" — editar logo, cores, fontes
- `proposta-pdf` e componentes do site usam Brand Guardian

---

## Ordem sugerida de implementação

| Fase | Pilares | Motivo |
|------|---------|--------|
| 1 | Brand Guardian, Chatbot RAG público | Base para propostas e ganho rápido de presença |
| 2 | Smart Proposals (IA + BCS) | Maior impacto em vendas; depende de playbooks (já existe) |
| 3 | Precificação Dinâmica | Depende de `contract_terms` e métricas |
| 4 | Motor de Conteúdo | Depende de `success_cases` e pipeline de aprovação |
| 5 | Upsell proativo | Depende de precificação e limites de contrato |

---

## Dependências técnicas

- **IA:** OpenAI (já em uso para embeddings e chat). Manter `OPENAI_API_KEY`.
- **RAG:** `document_embeddings`, `match_document_embeddings` (já existem). Ver [ESPECIFICACAO-AGENTES-IA-EMBEDDINGS.md](ESPECIFICACAO-AGENTES-IA-EMBEDDINGS.md).
- **Storage:** Supabase Storage para logos e assets.
- **Cron/Jobs:** Vercel Cron ou Supabase Edge Functions para alertas de upsell (opcional em MVP).

---

## Próximos passos imediatos

1. Validar priorização com stakeholders.
2. Criar migrations para: `brand_assets`, `contract_terms`, `success_cases`, `proposal_templates`.
3. Iniciar Fase 1: Brand Guardian + Chatbot RAG público.
