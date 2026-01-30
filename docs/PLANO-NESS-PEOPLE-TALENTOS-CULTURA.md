# ness.PEOPLE — Talentos & Cultura

> O elo entre performance e pessoas. Recrutamento, Avaliação e Treinamento Baseado em Dados.

---

## Nomenclatura do plano

**Código do plano:** `PPL-TC` (ness.PEOPLE — Talentos & Cultura)

### Pilares (por sigla)

| Sigla | Nome completo | Descrição curta |
|-------|---------------|-----------------|
| **ATS** | ATS Integrado | Vagas automáticas a partir de perfis exigidos por contratos |
| **TOF** | Treinamento Orientado a Falhas | Gaps OPS × matriz competência → treinamentos específicos |
| **A360** | Avaliação 360º | Feedback contínuo com dados qualitativos e métricas de entrega |

### Tabelas e entidades

| Código | Tabela/entidade | Uso |
|--------|-----------------|-----|
| `job_profiles` | Perfis técnicos (ex: DevOps, SecOps) | ATS — mapeamento contrato/serviço → perfil |
| `contract_skills` | Skills exigidos por contrato | ATS — contrato_id, skill_id, qty |
| `operational_incidents` | Erros/incidentes mapeados ao processo | TOF — playbook_id, employee_id, incident_type |
| `employee_competency` | Matriz de competência por colaborador | TOF — profile_id, skill_id, level |
| `training_suggestions` | Sugestões de treinamento geradas | TOF — gap + playbook/training_link |
| `feedback_360` | Feedbacks e avaliações | A360 |
| `delivery_metrics` | Métricas de entrega por colaborador | A360 |

### Rotas e APIs

| Rota | Sigla | Função |
|------|-------|--------|
| `POST /api/people/jobs/suggest-from-contracts` | ATS | Sugerir/gerar vagas a partir de contratos ativos |
| `GET /api/people/training/suggestions` | TOF | Cruzar gaps OPS × competência → sugestões |
| `POST /api/people/feedback` | A360 | Registrar feedback 360º |

### Fases de implementação

| Fase | Sigla | Pilares |
|------|-------|---------|
| F1 | PPL-A | ATS Integrado |
| F2 | PPL-T | Treinamento Orientado a Falhas |
| F3 | PPL-E | Avaliação 360º |

**Prefixo de commits:** `ppl-tc:` (ex.: `ppl-tc: add job_profiles table`)

### Requisitos Core (pré-requisitos)

| ID | Requisito |
|----|-----------|
| RF.CORE.01 | Auth Guard: /app exige sessão; redirect para /login |
| RF.CORE.02 | Dashboard personalizado por Role |

Ver [RF-CORE-REQUISITOS.md](RF-CORE-REQUISITOS.md)

### Requisitos PEOPLE (ness.PEOPLE — RH & Qualidade)

| ID | Requisito | Detalhes |
|----|-----------|----------|
| **RF.PEO.01** | Registro de Gaps (Auditoria) | Líder Técnico: Colaborador → Playbook Violado → Descrever Correção |
| **RF.PEO.02** | ATS (Vagas) | CRUD de Vagas. Vagas "Aberto" (is_open) → /carreiras |

---

## RF.PEO.01 — Registro de Gaps (Auditoria) (detalhamento)

| Item | Especificação |
|------|---------------|
| **Formulário** | Líder Técnico apontar falha |
| **Fluxo** | Selecionar Colaborador → Selecionar Playbook Violado → Descrever Correção |

**Estado atual:** `training_gaps` tem employee_id, description, severity. GapForm: Colaborador, Descrição, Severidade. Falta **playbook_id** (Playbook Violado) e o fluxo explícito (o campo "Descrição" pode ser renomeado/interpretado como "Correção").

**Entregas RF.PEO.01:** Migration: `training_gaps.playbook_id` (FK playbooks). Evoluir GapForm: adicionar select de Playbook, ajustar label "Descrição" → "Correção" (ou manter description como correção). Ordem: Colaborador, Playbook, Correção.

---

## RF.PEO.02 — ATS (Vagas) (detalhamento)

| Item | Especificação |
|------|---------------|
| **CRUD** | Vagas Abertas |
| **Integração Site** | Vagas com status "Aberto" aparecem em /carreiras |

**Estado atual:** `public_jobs` com is_open; CRUD em /app/people/vagas; getOpenJobs filtra `is_open = true`; /carreiras consome. Implementado.

**Entregas RF.PEO.02:** Validar e documentar; evoluir CRUD (slug, descrição, toggle is_open) conforme necessário.

---

## Resumo: O que existe hoje → O que virá

| Pilares propostos | Hoje no ar | Transformação |
|-------------------|------------|---------------|
| **ATS** | Vagas manuais (`public_jobs`); sem vínculo com contratos | Vagas sugeridas/geradas a partir de perfis exigidos por contratos ativos |
| **TOF** | Gaps manuais (`training_gaps`); sem link com OPS | Cruzar erros operacionais (OPS) com matriz de competência; sugerir treinamentos para fechar gaps reais |
| **A360** | Nenhuma avaliação estruturada | Feedback 360º contínuo; dados qualitativos + métricas de entrega |

---

## Visão proposta

| Pilar | Descrição |
|-------|-----------|
| **ATS — ATS Integrado** | Publicação automática de vagas baseadas nos perfis técnicos exigidos pelos contratos ativos. Contrato X exige SecOps → vaga SecOps sugerida/gerada. |
| **TOF — Treinamento Orientado a Falhas** | Cruzar erros operacionais mapeados no ness.OPS com a matriz de competência do colaborador. Sugerir treinamentos específicos para fechar gaps reais de execução. |
| **A360 — Avaliação 360º** | Feedback contínuo alimentado por dados qualitativos e métricas de entrega. |

---

## Estado atual vs. Estado alvo

### 1. Registro de Gaps (Auditoria) — RF.PEO.01

| Atual | Alvo | Transformação |
|-------|------|---------------|
| Colaborador, Descrição, Severidade | Colaborador → Playbook Violado → Correção | Adicionar playbook_id; evoluir formulário |

### 2. ATS (Vagas) — RF.PEO.02

| Atual | Alvo | Transformação |
|-------|------|---------------|
| CRUD vagas; is_open; /carreiras exibe abertas | Idem | Validar; documentar |

### 3. ATS Integrado (evolução)

| Atual | Alvo | Transformação |
|-------|------|---------------|
| Vagas manuais em `public_jobs` | Vagas baseadas em demandas dos contratos | **Construir** modelo: contratos ativos → serviços (ou skills) exigidos → perfis de vaga. Tabela `contract_services` ou `contract_skills` (contrato_id, skill/profile_id, quantidade). |
| Sem mapeamento contrato → perfil | Mapeamento contrato/serviço → perfil técnico | **Criar** `job_profiles` (DevOps, SecOps, DBA, etc.). Serviços/playbooks mapeiam a perfis. Contrato com serviço X exige perfil Y. |
| Criação manual de vaga | Sugestão ou geração automática | **Construir** ação "Sugerir vagas": consulta contratos ativos, agrega perfis faltantes, sugere vagas. HR edita e publica. |
| Sem visão de demanda | Visão: "precisamos de N SecOps" | **Criar** dashboard ou relatório: demanda por perfil a partir de contratos. |

**Entregas:**
- Migration: `job_profiles` (id, name, slug, description)
- Migration: `contract_services` ou `contract_skills` (contract_id, service_id ou profile_id, fte ou qty)
- Serviço/Vista: demandas por perfil a partir de contratos ativos
- Ação/API: sugerir vagas a partir de demandas
- UI: botão "Sugerir vagas a partir de contratos" em /people/vagas

---

### 4. Treinamento Orientado a Falhas (TOF)

| Atual | Alvo | Transformação |
|-------|------|---------------|
| `training_gaps`: manual, sem link com OPS | Gaps originados de erros operacionais | **Evoluir** ou criar `operational_incidents`: incident_id, contract_id, playbook_id (processo que falhou), employee_id, incident_type, created_at. Vincular a training_gaps. |
| Sem matriz de competência | Matriz colaborador × skill | **Criar** `employee_competency`: profile_id, skill_id (ou playbook_id), level (1-5 ou similar). |
| Gaps genéricos | Gaps com sugestão de treinamento | **Construir** lógica: incidente em playbook X + colaborador Y sem competência em X → sugerir treinamento no playbook X (ou curso vinculado). |
| Sem vínculo gap ↔ playbook | Gap ligado ao processo que falhou | **Evoluir** `training_gaps`: playbook_id, source_incident_id. |

**Entregas:**
- Migration: `operational_incidents` (contract_id, playbook_id, employee_id, type, notes, created_at)
- Migration: `employee_competency` (profile_id, skill_id/playbook_id, level)
- Migration: evoluir `training_gaps` com playbook_id, source_incident_id
- Lógica: ao registrar incidente operacional, criar training_gap e/ou sugestão
- Tabela `training_suggestions` ou campo em training_gaps: suggested_playbook_id, training_url
- UI: em Gaps, mostrar origem (incidente) e sugestão de treinamento
- Integração OPS: métricas/SLA breach ou indicadores podem gerar incidentes

---

### 5. Avaliação 360º (A360)

| Atual | Alvo | Transformação |
|-------|------|---------------|
| Sem avaliação estruturada | Feedback 360º contínuo | **Construir** `feedback_360`: giver_id, receiver_id, type (peer | manager | self), criteria, score/rating, comment, period. |
| Sem métricas de entrega por pessoa | Métricas de entrega | **Criar** `delivery_metrics`: profile_id, period, metric_type (hours_delivered, sla_met, incidents_resolved), value. Pode vir de OPS (performance_metrics por alocação). |
| Sem visão consolidada | Dashboard 360º | **Construir** página /app/people/avaliacao: lista colaboradores, feedbacks recebidos, métricas, evolução. |
| Sem ciclo de avaliação | Ciclos e períodos | **Opcional:** `evaluation_cycles` (period_start, period_end, status). Feedbacks vinculados ao ciclo. |

**Entregas:**
- Migration: `feedback_360` (giver_id, receiver_id, type, criteria, score, comment, period, created_at)
- Migration: `delivery_metrics` (profile_id, period, metric_type, value) — ou consumir de OPS
- Página `/app/people/avaliacao` — dar e ver feedbacks
- Relatório: visão 360 por colaborador (feedbacks + métricas)
- Integração: métricas de OPS (horas, SLA) podem alimentar delivery_metrics se houver alocação contrato↔colaborador

---

## Ordem sugerida de implementação

| Fase | Pilares | Motivo |
|------|---------|--------|
| F1 | TOF — Treinamento Orientado a Falhas | Diferencial maior; usa dados OPS que já existem ou virão (incidentes, playbooks); training_gaps já existe |
| F2 | ATS — ATS Integrado | Depende de mapeamento contrato→serviço→perfil; agrega valor ao recrutamento |
| F3 | A360 — Avaliação 360º | Mais complexo (ciclos, critérios, múltiplos avaliadores); pode ser incremental |

---

## Dependências

- **OPS-EP:** Playbooks, indicadores, incidentes operacionais alimentam TOF
- **FIN-CFO:** Contratos ativos alimentam ATS (demanda por perfil)
- **GOV-PN:** Aceites no onboarding (colaborador novo) podem disparar checklist de competência inicial

---

## Próximos passos imediatos

1. Definir lista de perfis técnicos (`job_profiles`) e mapeamento serviço/playbook → perfil.
2. Decidir origem de `operational_incidents`: manual, integração com indicadores OPS, ou ambos.
3. Especificar critérios da avaliação 360º (competências, comportamentos, etc.).
