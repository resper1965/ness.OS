# ness.OPS — A Verdade Técnica

> Guardião do padrão e da eficiência: Padronização, Auditoria de Processos e Ingestão de Métricas.

**O que faz:** Biblioteca de conhecimento e hub de métricas. Governa a técnica — não executa.

### Funcionalidades Críticas

| # | Funcionalidade | Regra |
|---|----------------|-------|
| **1** | Playbooks | CRUD de manuais técnicos. Todo serviço vendido DEVE ter um Playbook vinculado (Trava Growth×OPS). |
| **2** | Input de Métricas | Sem integração nativa com ferramentas de mercado ainda. Formulários mensais para líderes imputarem: Horas Gastas, Custo Cloud, SLA Atingido por contrato. |

### Uso de IA

| Recurso | Descrição |
|---------|-----------|
| **Agente de Busca (RAG)** | Chatbot interno onde técnicos perguntam (ex.: "Como configuro o backup X?") e a IA responde baseada **APENAS** nos Playbooks cadastrados — sem alucinação. |

---

## Nomenclatura do plano

**Código do plano:** `OPS-EP` (ness.OPS — Engenharia de Processos)

### Pilares (por sigla)

| Sigla | Nome completo | Descrição curta |
|-------|---------------|-----------------|
| **EP** | Engenharia de Processos (The Playbook) | Mapeamento e padronização dos rituais técnicos |
| **HI** | Hub de Indicadores | Métricas agnósticas via API → dashboards unificados |
| **MR** | Mapeamento de Recursos | Consumo granular por contrato (horas, licenças, cloud) |

### Tabelas e entidades

| Código | Tabela/entidade | Uso |
|--------|-----------------|-----|
| `playbooks` | Manuais de Procedimentos | EP — já existe, evoluir estrutura |
| `indicator_sources` | Fontes de métricas (Infra, Sec, Data) | HI |
| `indicator_metrics` | Métricas ingeridas via API | HI |
| `contract_resources` | Consumo granular por contrato | MR |
| `resource_types` | Tipos (horas_humanas, licenca, cloud) | MR |

### Rotas e APIs

| Rota | Sigla | Função |
|------|-------|--------|
| `POST /api/ops/indicators/ingest` | HI | Ingestão de métricas de ferramentas externas |
| `GET /api/ops/indicators/dashboard` | HI | Dashboards unificados |

### Fases de implementação

| Fase | Sigla | Pilares |
|------|-------|---------|
| F1 | OPE | Engenharia de Processos (evoluir Playbooks) |
| F2 | OPI | Hub de Indicadores (API + dashboards) |
| F3 | OPR | Mapeamento de Recursos (consumo granular) |

**Prefixo de commits:** `ops-ep:` (ex.: `ops-ep: add indicator_metrics migration`)

### Requisitos Core (pré-requisitos)

| ID | Requisito |
|----|-----------|
| RF.CORE.01 | Auth Guard: /app exige sessão; redirect para /login |
| RF.CORE.02 | Dashboard personalizado por Role |

Ver [RF-CORE-REQUISITOS.md](RF-CORE-REQUISITOS.md)

### Requisitos OPS (ness.OPS — Verdade Técnica)

| ID | Requisito | Detalhes |
|----|-----------|----------|
| **RF.OPS.01** | Gestão de Playbooks | CRUD de Manuais Técnicos (Editor Markdown). Metadados: Título, Tags, Data de Revisão, Autor. Integração: playbook_id exigido para criar serviço vendável (Trava Growth×OPS). |
| **RF.OPS.02** | Input de Métricas (Mensal) | Interface para Líderes imputarem dados consolidados por Cliente/Contrato. Campos: Mês/Ano, Horas Humanas Gastas, Custo Cloud (R$), SLA Atingido (Boolean). |
| **RF.OPS.03** | Agente de Busca (RAG) | Chatbot interno onde técnicos consultam manuais. IA responde **apenas** com base nos Playbooks cadastrados — sem alucinação. |

---

## RF.OPS.01 — Gestão de Playbooks (detalhamento)

| Item | Especificação |
|------|---------------|
| **CRUD** | Criar, ler, atualizar e excluir Manuais Técnicos |
| **Editor** | Markdown (textarea ou editor rich TipTap/MDXEditor) |
| **Metadados** | Título, Tags (array ou texto), Data de Revisão, Autor (created_by) |
| **Integração** | `playbook_id` obrigatório em `services_catalog` para serviço ativo — Trava já implementada na migration 008 |

**Gap atual:** `playbooks` tem title, slug, content_markdown, created_by. Faltam: **tags**, **review_date** (data de revisão). CRUD e Trava já existem.

**Entregas RF.OPS.01:**
- Migration: `playbooks` + colunas `tags` (text[] ou jsonb) e `last_reviewed_at` (ou `review_date`)
- UI: formulário de playbook com campos Tags e Data de Revisão
- Validação: manter Trava (serviço ativo exige playbook_id)

---

## RF.OPS.02 — Input de Métricas (Mensal) (detalhamento)

| Item | Especificação |
|------|---------------|
| **Público** | Líderes (role ops_lead, admin ou similar) |
| **Granularidade** | Por Cliente/Contrato |
| **Campos** | Mês/Ano, Horas Humanas Gastas, Custo Cloud (R$), SLA Atingido (Boolean) |

**Tabela:** `performance_metrics` — já existe com contract_id, month, hours_worked, cost_input, sla_achieved.

**Estado atual:** Interface em `/app/ops/metricas` com MetricasForm. Campos mapeados: Contrato → contract_id, Mês → month, Horas trabalhadas → hours_worked, Custo (R$) → cost_input, SLA atingido → sla_achieved.

**Entregas RF.OPS.02:**
- Garantir RLS: apenas Líderes (ops_lead, admin, superadmin) podem inserir/editar métricas
- UI: manter ou evoluir formulário em `/app/ops/metricas` com labels explícitos (Horas Humanas Gastas, Custo Cloud)
- Validação: um registro por (contrato, mês); exibir histórico recente
- Opcional: renomear `cost_input` → `cloud_cost` ou adicionar label "Custo Cloud" na UI

---

## RF.OPS.03 — Agente de Busca (RAG) (detalhamento)

| Item | Especificação |
|------|---------------|
| **Uso** | Chatbot interno para técnicos |
| **Fonte** | Respostas **apenas** com base nos Playbooks cadastrados — sem alucinação |
| **Exemplo** | "Como configuro o backup X?" → IA retorna trechos relevantes dos manuais |

**Estado atual:** Knowledge Bot em `/app/ops/playbooks/chat`; API `/api/chat/playbooks`; RAG com `match_document_embeddings` e `document_embeddings` (playbooks). Implementado.

**Entregas RF.OPS.03:** Validar que o contexto do sistema instrui a IA a responder **somente** com conteúdo dos playbooks; documentar; evoluir prompt/system se necessário para reforçar "não invente".

---

## Resumo: O que existe hoje → O que virá

| Pilares propostos | Hoje no ar | Transformação |
|-------------------|------------|---------------|
| **EP — Engenharia de Processos** | Playbooks com Markdown (manual) | Estrutura de Manuais de Procedimentos; rituais técnicos padronizados; qualidade independente do técnico |
| **HI — Hub de Indicadores** | Métricas manuais (form por contrato/mês) | API agnóstica; ingestão de Infra, Sec, Data; dashboards unificados |
| **MR — Mapeamento de Recursos** | `performance_metrics` (horas + custo genérico) | Consumo granular: horas humanas, licenças, cloud por contrato; alimenta custo real ao FIN |

---

## Visão proposta

| Pilar | Descrição |
|-------|-----------|
| **EP — Engenharia de Processos** | Mapeamento e padronização dos rituais técnicos. O sistema descreve o "como fazer" em Manuais de Procedimentos, garantindo que a qualidade independa do técnico alocado. |
| **HI — Hub de Indicadores** | Centralizador agnóstico que recebe métricas de qualquer ferramenta técnica (Infra, Sec, Data) via API para gerar dashboards de performance unificados. |
| **MR — Mapeamento de Recursos** | Medição granular do consumo por contrato (horas humanas, licenças, cloud) para alimentar o módulo financeiro com o custo real. |

---

## Estado atual vs. Estado alvo

### 1. Engenharia de Processos (The Playbook) — RF.OPS.01

| Atual | Alvo | Transformação |
|-------|------|---------------|
| Playbooks: título, slug, Markdown livre | Manuais de Procedimentos estruturados | **Evoluir** estrutura: seções padrão (Pré-requisitos, Rituais, Critérios de Aceite, Auditoria). Template de "ritual técnico" reutilizável. |
| Qualidade depende de quem escreve | Qualidade independente do técnico | **Definir** checklist de padronização por tipo de procedimento. Versionamento e aprovação de playbooks. |
| Sem vínculo com rituais/auditoria | Mapeamento de rituais técnicos | **Criar** entidade `rituals` ou tags em playbooks (ex.: deploy, backup, incidente). Relacionar com auditoria. |

**Entregas:**
- **RF.OPS.01:** Migration `playbooks` + `tags`, `last_reviewed_at`; UI com Editor Markdown e metadados
- Migration: evoluir `playbooks` com `structure_type` (manual | ritual | checklist)
- Template de Manual de Procedimentos (seções obrigatórias)
- UI: wizard de criação de playbook padronizado

---

### 2. Input de Métricas (Mensal) — RF.OPS.02

| Atual | Alvo | Transformação |
|-------|------|---------------|
| Form em `/app/ops/metricas` (todos autenticados) | Interface para Líderes, labels explícitos | **Garantir** RLS por role; labels: Horas Humanas Gastas, Custo Cloud (R$), SLA Atingido |

**Entregas:**
- **RF.OPS.02:** RLS para performance_metrics (ops_lead, admin, superadmin); labels explícitos na UI

### 3. Agente de Busca (RAG) — RF.OPS.03

| Atual | Alvo | Transformação |
|-------|------|---------------|
| Knowledge Bot em /app/ops/playbooks/chat; RAG sobre playbooks | Idem; garantir "sem alucinação" | Validar prompt; documentar; reforçar instrução "responda apenas com base nos playbooks" |

**Entregas:**
- **RF.OPS.03:** Revisar system prompt; documentar Agente de Busca; link no sidebar como "Knowledge Bot" ou "Agente de Busca"

**Especificação técnica:** Ver [ESPECIFICACAO-AGENTES-IA-EMBEDDINGS.md](ESPECIFICACAO-AGENTES-IA-EMBEDDINGS.md) — Internal Knowledge Bot, pgvector, document_embeddings.

### 4. Hub de Indicadores

| Atual | Alvo | Transformação |
|-------|------|---------------|
| `performance_metrics`: form manual, contrato + mês + horas + custo + SLA | Métricas de qualquer ferramenta via API | **Construir** API de ingestão: `POST /api/ops/indicators/ingest` com payload `{ source, contract_id?, metric_type, value, metadata }`. Source = Infra | Sec | Data | Custom. |
| Sem dashboards unificados | Dashboards de performance unificados | **Construir** página de dashboards que agrega métricas por contrato, fonte, período. Gráficos (SLA, uptime, incidentes, etc.). |
| Dados só via form | Dados de ferramentas externas | **Definir** contrato da API: auth por API key, schema flexível (JSON). Webhooks ou polling das ferramentas. |

**Entregas:**
- Migration: `indicator_sources` (nome, tipo, api_key_hash), `indicator_metrics` (source_id, contract_id?, metric_type, value, timestamp, metadata jsonb)
- API `POST /api/ops/indicators/ingest` (api key no header)
- Página `/app/ops/indicators` com dashboards (charts)
- Doc da API para integradores (Infra, Sec, Data)

---

### 5. Mapeamento de Recursos

| Atual | Alvo | Transformação |
|-------|------|---------------|
| `performance_metrics`: horas_worked, cost_input (valor único) | Consumo granular: horas, licenças, cloud | **Construir** `contract_resources`: contract_id, resource_type (horas_humanas | licenca_X | cloud_Y), quantity, unit_cost, period. |
| Custo agregado por mês | Custo real por tipo de recurso | **Evoluir** view `contract_rentability` para somar `contract_resources` por tipo. Separar custo de horas, licenças, cloud. |
| Sem visibilidade de consumo por contrato | Medição granular por contrato | **Criar** página `/app/ops/recursos` listando consumo por contrato e por tipo. Export para FIN. |

**Entregas:**
- Migration: `resource_types` (id, name, unit), `contract_resources` (contract_id, resource_type_id, quantity, unit_cost, period)
- Evoluir `performance_metrics` ou migrar para `contract_resources` (estratégia de migração)
- Página de Mapeamento de Recursos
- Integração com FIN (custo real na rentabilidade)

---

## Ordem sugerida de implementação

| Fase | Pilares | Motivo |
|------|---------|--------|
| F1 | EP — Engenharia de Processos | Base: Playbooks já existem; evoluir estrutura antes de integrar mais |
| F2 | MR — Mapeamento de Recursos | Dados de consumo são pré-requisito para indicadores e FIN |
| F3 | HI — Hub de Indicadores | API e dashboards dependem de modelo de métricas consolidado |

---

## Dependências e integrações

- **FIN:** `contract_rentability` e módulo de rentabilidade consomem `contract_resources`
- **GROWTH-IC:** Playbooks alimentam Smart Proposals e Chatbot RAG
- **Ferramentas externas:** Infra (monitoring), Sec (SIEM?), Data (pipelines) enviam métricas via API

---

## Próximos passos imediatos

1. Validar priorização (EP → MR → HI ou MR → HI → EP).
2. Definir schema de `indicator_metrics` (flexível para Infra/Sec/Data).
3. Decidir: evoluir `performance_metrics` ou criar `contract_resources` do zero com migração.
