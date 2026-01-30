# ness.GOV — Governança Interna

> A ordem na casa. Políticas, Normas e Rastreabilidade.

---

## Nomenclatura do plano

**Código do plano:** `GOV-PN` (ness.GOV — Políticas e Normas)

### Pilares (por sigla)

| Sigla | Nome completo | Descrição curta |
|-------|---------------|-----------------|
| **GP** | Gestão de Políticas | Criação e versionamento de normas internas |
| **RTA** | Rastreabilidade de Aceite | Controle digital de assinaturas (NDA, termos, políticas) desde o onboarding |

### Tabelas e entidades

| Código | Tabela/entidade | Uso |
|--------|-----------------|-----|
| `policies` | Políticas e normas internas | GP — título, conteúdo, versão, vigência |
| `policy_versions` | Histórico de versões | GP — versionamento |
| `acceptance_records` | Registros de aceite | RTA — quem aceitou, quando, qual documento |
| `acceptance_templates` | Tipos de documento para aceite | NDA, termo responsabilidade, política segurança |
| `onboarding_checklist` | Checklist de onboarding por colaborador | RTA — quais aceites são obrigatórios no onboarding |

### Rotas e APIs

| Rota | Sigla | Função |
|------|-------|--------|
| `/app/gov/politicas` | GP | CRUD de políticas, versionamento |
| `/app/gov/aceites` | RTA | Lista de aceites pendentes e realizados |
| `POST /api/gov/accept` | RTA | Registrar aceite (colaborador ou candidato) |
| `/app/gov/onboarding` | RTA | Visão de onboarding por colaborador |

### Fases de implementação

| Fase | Sigla | Pilares |
|------|-------|---------|
| F1 | GOV-P | Gestão de Políticas (GP) |
| F2 | GOV-A | Rastreabilidade de Aceite (RTA) |

**Prefixo de commits:** `gov-pn:` (ex.: `gov-pn: add policies table`)

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
| **GP — Gestão de Políticas** | Sem gestão de normas internas | Módulo ness.GOV: criação, versionamento, vigência de políticas |
| **RTA — Rastreabilidade de Aceite** | Sem controle de aceite | Aceite digital de NDA, termos, políticas desde o onboarding; histórico auditável |

---

## Visão proposta

| Pilar | Descrição |
|-------|-----------|
| **GP — Gestão de Políticas** | Criação e versionamento de normas internas. Histórico de alterações, vigência, aprovação. |
| **RTA — Rastreabilidade de Aceite** | Controle digital de assinaturas de NDAs, termos de responsabilidade e políticas de segurança desde o onboarding do colaborador. Quem aceitou, quando, qual versão. |

---

## Estado atual vs. Estado alvo

### 1. Gestão de Políticas (GP)

| Atual | Alvo | Transformação |
|-------|------|---------------|
| Sem repositório de políticas internas | Central de políticas com versionamento | **Construir** tabela `policies`: id, title, slug, content_markdown, version, effective_date, status (draft | active | deprecated). |
| Sem histórico de alterações | Versionamento completo | **Criar** `policy_versions`: policy_id, version, content_snapshot, changed_at, changed_by. Cada edição gera nova versão. |
| Páginas legais (`static_pages`) são para site público | Políticas internas separadas | **Distinguir** `static_pages` (site) vs. `policies` (internas, só logados). Ou estender static_pages com tipo `internal`. |
| Sem fluxo de aprovação | Opcional: aprovação antes de ativar | **Opcional:** status draft → pending_review → active. Workflow simples. |

**Entregas:**
- Migration: `policies` (title, slug, content_markdown, version, effective_date, status, created_by)
- Migration: `policy_versions` (policy_id, version, content, changed_at, changed_by)
- Página `/app/gov/politicas` — listar, criar, editar, ver histórico
- UI: diff entre versões (opcional)

---

### 2. Rastreabilidade de Aceite (RTA)

| Atual | Alvo | Transformação |
|-------|------|---------------|
| Sem controle de aceite de documentos | Aceite digital rastreável | **Construir** `acceptance_templates`: tipo (nda | termo_responsabilidade | politica_seguranca), policy_id (opcional), obrigatório_onboarding. |
| Candidatos e colaboradores sem fluxo de aceite | Aceite desde o onboarding | **Criar** `acceptance_records`: person_id (profile ou job_application), template_id, policy_version_id, accepted_at, ip_address (opcional). |
| Sem checklist de onboarding | Onboarding com aceites obrigatórios | **Construir** `onboarding_checklist` ou lógica: ao criar profile (colaborador), lista templates obrigatórios. Colaborador acessa e aceita. Pendências visíveis. |
| Sem vínculo candidato → colaborador | Candidato que vira colaborador | **Considerar:** job_application pode ter aceites (pré-contratação). Ao converter em employee (profile), herdar ou re-apresentar conforme regra. |

**Entregas:**
- Migration: `acceptance_templates` (name, type, policy_id nullable, required_onboarding)
- Migration: `acceptance_records` (person_type: profile | job_application, person_id, template_id, policy_version_id, accepted_at, metadata jsonb)
- Página `/app/gov/aceites` — lista templates, quem aceitou, pendências
- Página ou modal para colaborador: "Documentos pendentes de aceite" — ler e aceitar
- Integração onboarding: ao ativar novo colaborador, criar pendências de aceite
- Relatório: export de aceites por colaborador (auditoria)

---

## Ordem sugerida de implementação

| Fase | Pilares | Motivo |
|------|---------|--------|
| F1 | GP — Gestão de Políticas | Base: políticas precisam existir antes de serem objeto de aceite |
| F2 | RTA — Rastreabilidade de Aceite | Consome políticas; integra com People (onboarding) |

---

## Dependências

- **People:** Colaboradores (profiles) e candidatos (job_applications) são sujeitos de aceite
- **JUR-CP:** Políticas podem ser aprovadas/validadas pelo jurídico antes de publicação
- **Auth:** Aceite requer usuário identificado (ou link único para candidato pré-login)

---

## Considerações

- **Candidatos sem login:** Aceite de NDA/termos pode ocorrer antes de criar conta. Usar link único (token) ou formulário público com e-mail + aceite.
- **Prova do aceite:** Armazenar hash do conteúdo aceito + timestamp + IP (opcional) para evidência em caso de disputa.
- **Reaceite em alteração:** Quando política tem nova versão, definir se colaboradores precisam reaceitar.

---

## Próximos passos imediatos

1. Definir lista inicial de templates de aceite (NDA, termo de responsabilidade, política de segurança).
2. Decidir: aceite de candidatos antes do login (link único) ou apenas após contratação (profile)?
3. Criar estrutura `/app/gov` no app.
