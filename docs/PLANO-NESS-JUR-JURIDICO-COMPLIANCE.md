# ness.JUR — Jurídico & Compliance

> A blindagem da operação. Mitigação de Risco e Segurança Legal.

---

## Nomenclatura do plano

**Código do plano:** `JUR-CP` (ness.JUR — Jurídico & Compliance)

### Pilares (por sigla)

| Sigla | Nome completo | Descrição curta |
|-------|---------------|-----------------|
| **ARC** | Análise de Risco Contratual | IA varre minutas para cláusulas perigosas |
| **CC** | Conformidade Contínua | LGPD, Marco Civil, leis trabalhistas nos processos |

### Tabelas e entidades

| Código | Tabela/entidade | Uso |
|--------|-----------------|-----|
| `legal_docs` | Documentos jurídicos | Minutas, contratos assinados, termos |
| `contract_risk_analysis` | Resultados da análise de risco | ARC — cláusulas identificadas, severidade |
| `compliance_checks` | Verificações de conformidade | CC — processo, norma, status |
| `compliance_frameworks` | Quadros de referência | LGPD, Marco Civil, CLT, etc. |

### Rotas e APIs

| Rota | Sigla | Função |
|------|-------|--------|
| `POST /api/jur/risk/analyze` | ARC | IA analisa minuta e retorna cláusulas de risco |
| `GET /api/jur/compliance/verify` | CC | Verifica aderência de processo a framework |
| `GET /api/jur/documents` | — | Lista documentos (legal-contracts bucket) |

### Fases de implementação

| Fase | Sigla | Pilares |
|------|-------|---------|
| F1 | JUR-R | Análise de Risco Contratual (ARC) |
| F2 | JUR-C | Conformidade Contínua (CC) |

**Prefixo de commits:** `jur-cp:` (ex.: `jur-cp: add contract_risk_analysis table`)

### Requisitos Core (pré-requisitos)

| ID | Requisito |
|----|-----------|
| RF.CORE.01 | Auth Guard: /app exige sessão; redirect para /login |
| RF.CORE.02 | Dashboard personalizado por Role |

Ver [RF-CORE-REQUISITOS.md](RF-CORE-REQUISITOS.md)

---

## Resumo: O que existe hoje → O que virá

| Pilares propostos | Hoje no ar | Transformação |
|-------------------|------------|---------------|
| **ARC — Análise de Risco Contratual** | Sem módulo JUR; propostas PDF sem análise jurídica | Módulo JUR + IA varre minutas para SLA desproporcional, responsabilidade ilimitada, etc. |
| **CC — Conformidade Contínua** | Páginas legais estáticas (privacidade, termos) em `/legal` | Verificação de aderência de processos (playbooks, fluxos) a LGPD, Marco Civil, leis trabalhistas |

---

## Visão proposta

| Pilar | Descrição |
|-------|-----------|
| **ARC — Análise de Risco Contratual** | Varredura de minutas para identificar cláusulas perigosas: SLAs desproporcionais, responsabilidade ilimitada, multas abusivas, garantias excessivas. |
| **CC — Conformidade Contínua** | Verificação de aderência à LGPD, Marco Civil e leis trabalhistas dentro dos processos operacionais. Garantir que playbooks e fluxos respeitam as normas. |

---

## Estado atual vs. Estado alvo

### 1. Análise de Risco Contratual (ARC)

| Atual | Alvo | Transformação |
|-------|------|---------------|
| Sem módulo JUR no app | Módulo ness.JUR em `/app/jur` | **Criar** estrutura: layout, sidebar, páginas iniciais. Role `legal` no enum (já previsto em ARQUITETURA). |
| Propostas PDF sem análise | Minutas analisadas por IA antes de envio | **Construir** API `POST /api/jur/risk/analyze`: recebe texto da minuta, envia para LLM com prompt estruturado. Retorna lista de cláusulas de risco (tipo, trecho, severidade, sugestão). |
| Sem armazenamento de docs jurídicos | Bucket `legal-contracts` + metadados | **Criar** bucket e tabela `legal_docs` (path, contract_id?, type, analyzed_at, risk_score). Arquitetura já prevê `legal-contracts`. |
| Sem checklist de cláusulas perigosas | Catálogo de cláusulas de risco | **Definir** categorias: sla_desproporcional, responsabilidade_ilimitada, multa_abusiva, garantia_excessiva, confidencialidade_perpétua, etc. Prompt da IA usa esse catálogo. |

**Entregas:**
- Migration: `legal_docs`, `contract_risk_analysis` (doc_id, clause_type, excerpt, severity, suggestion)
- API `POST /api/jur/risk/analyze` — prompt para GPT-4 com instruções de análise jurídica
- Página `/app/jur/analise-risco` — upload/paste de minuta, exibe resultado da análise
- Integração opcional: antes de gerar proposta (Growth), chamar ARC

---

### 2. Conformidade Contínua (CC)

| Atual | Alvo | Transformação |
|-------|------|---------------|
| Páginas `/legal` com conteúdo estático | Verificação de processos vs. normas | **Construir** modelo: `compliance_frameworks` (LGPD, Marco Civil, CLT), `compliance_checks` (process_id, framework_id, status, findings). |
| Playbooks sem vínculo com compliance | Playbooks mapeados a requisitos de lei | **Criar** tabela `playbook_compliance` ou tags. Ex.: playbook de tratamento de dados → checklist LGPD (base legal, consentimento, DPO, etc.). |
| Sem auditoria de conformidade | Auditoria contínua por processo | **Construir** página `/app/jur/conformidade`: lista processos (playbooks), frameworks, status. IA ou checklist manual por item. |
| Sem evidências de conformidade | Registro de evidências | **Opcional:** `compliance_evidences` — link para documento, checklist assinado, data da verificação. |

**Entregas:**
- Migration: `compliance_frameworks` (id, name, description — ex: LGPD, Marco Civil, CLT), `compliance_checks` (playbook_id?, framework_id, checklist_json, status, verified_at)
- Base de requisitos por framework (LGPD: art. 7, 18, DPO; Marco Civil: art. 13, 14; CLT: jornada, férias, etc.)
- Página `/app/jur/conformidade` — matriz processo x framework
- Integração com playbooks: ao criar/editar playbook, sugerir checklist de compliance

---

## Ordem sugerida de implementação

| Fase | Pilares | Motivo |
|------|---------|--------|
| F1 | ARC — Análise de Risco Contratual | Ganho rápido; usa IA existente; impacta propostas (Growth) |
| F2 | CC — Conformidade Contínua | Depende de estrutura de frameworks; mais trabalhoso (checklists por norma) |

---

## Dependências

- **GROWTH-IC:** Propostas podem acionar ARC antes de envio; BCS inclui termos jurídicos aprovados
- **OPS-EP:** Playbooks são insumo para CC (quais processos precisam estar em conformidade)
- **OpenAI:** Análise de risco usa LLM (prompt estruturado)

---

## Considerações jurídicas

- **Disclaimer:** A IA não substitui advogado. Análise é ferramenta de suporte; decisão final é humana.
- **Dados sensíveis:** Minutas podem conter dados confidenciais. Garantir que análise via API não persiste trechos em logs.
- **Governança:** Definir quem aprova frameworks e checklists (área jurídica).

---

## Próximos passos imediatos

1. Adicionar role `legal` ao enum `user_role` (se ainda não existir).
2. Criar bucket `legal-contracts` no Supabase.
3. Definir lista inicial de cláusulas de risco para o prompt da ARC.
