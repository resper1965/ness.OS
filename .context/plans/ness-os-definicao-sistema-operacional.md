---
status: filled
generated: 2026-02-02
planSlug: ness-os-definicao-sistema-operacional
trigger: "definição ness.OS", "visão sistema operacional", "ness.OS módulos"
agents:
  - type: "documentation-writer"
    role: "Formalizar definição e atualizar docs/glossary"
  - type: "architect-specialist"
    role: "Alinhar planos de módulos à definição canônica"
docs:
  - "project-overview.md"
  - "glossary.md"
  - "architecture.md"
phases:
  - id: "phase-1"
    name: "Definição Canonical"
    prevc: "P"
  - id: "phase-2"
    name: "Documentação e Alinhamento"
    prevc: "E"
  - id: "phase-3"
    name: "Validação de Consistência"
    prevc: "V"
---

# ness.OS: O Sistema Operacional de Gestão e Inteligência Corporativa

> O **ness.OS** é a plataforma central que atua como o "Sistema Nervoso Digital" da NESS. Integra a operação técnica, a inteligência financeira, a gestão jurídica, o capital humano e a expansão comercial em um único ecossistema auditável.

**Missão:** Transformar a empresa de uma prestadora de serviços (baseada em esforço) em uma orquestradora de negócios (baseada em **conhecimento padronizado, rentabilidade real e gestão ativa**).

---

## Definição Canonical dos Módulos

### 1. ness.GROWTH (Inteligência Comercial, Marketing e DXP)

*Foco: Vendas Inteligentes, Presença Digital e Gestão de Conteúdo.*

Centraliza a presença digital e a engenharia de vendas, utilizando IA para transformar o conhecimento técnico interno em autoridade de mercado e nova receita.

- **Smart Proposals (Engenharia de Vendas):** IA gera propostas técnicas baseadas em **Base de Conhecimento de Sucesso**. Analisa contratos históricos validados para replicar escopos técnicos e jurídicos seguros em novos clientes.
- **Precificação e Upsell:** Calcula preço considerando custos e riscos de penalidades (multas de SLA). Monitora consumo de recursos para alertar sobre oportunidades de novas vendas.
- **Motor de Conteúdo e Site (CMS Inteligente):**
  - **Blog e CMS:** Gestão de conteúdo *headless* integrado ao site institucional.
  - **Geração via IA:** Ingere Casos de Sucesso e dados operacionais (anonimizados) para gerar posts e artigos técnicos automaticamente.
  - **Chatbot Inteligente (RAG):** Assistente virtual no site que consulta a base de conhecimento real (manuais e portfólio), sem alucinações.
- **Branding e Ativos:** Manual da Marca e *brand assets* centralizados.

---

### 2. ness.OPS (Gestão do Conhecimento e Operação)

*Foco: Padronização, Execução Técnica e Eficiência.*

Motor que garante a entrega do que foi vendido. Organiza o caos operacional e transforma obrigações contratuais em processos auditáveis.

- **Engenharia de Processos (Playbook):** Mapeia e padroniza rituais técnicos. Homogeniza atividades em **Manuais de Procedimentos** detalhados. *Nota: Sem detalhamento de verticais InfraOps/SecOps/DataOps — foco em padronização e documentação.*
- **Ingestão de Indicadores:** Centraliza métricas de performance de ferramentas técnicas (API ou input manual) para gerar métricas do setor.
- **Mapeamento de Recursos:** Mede consumo exato por contrato (horas, licenças, nuvem) para alimentar o módulo financeiro e auxiliar precificação.

---

### 3. ness.FIN (CFO Digital e Gestão de Contratos)

*Foco: Rentabilidade Real e Ciclo de Vida.*

Guardião da margem, cruzando dados do ERP com a realidade operacional.

- **CFO Digital:** Conecta ao ERP para cruzar Receita x Despesa em tempo real.
- **Gestão de Custos e Rentabilidade:** Apura custo real por contrato (RH + Ferramentas + Impostos + Rateio). Define rentabilidade líquida real por cliente.
- **Ciclo de Vida do Contrato:** Alertas de renovação, reajustes (IGPM/IPCA), vencimento e cobrança.

---

### 4. ness.JUR (Jurídico e Compliance Legal)

*Foco: Blindagem e Segurança Jurídica.*

- **Análise de Contratos:** Avalia minutas e contratos para identificar riscos (responsabilidade ilimitada, SLAs desproporcionais) e inconformidades.
- **Conformidade Legal:** Verifica aderência à LGPD, Marco Civil, legislações trabalhistas.

---

### 5. ness.GOV (Governança Corporativa Interna)

*Foco: Políticas Internas e Organização.*

- **Gestão de Políticas:** Centraliza normas e políticas internas.
- **Rastreabilidade de Aceite:** Monitora assinaturas de termos, NDAs e aceites de políticas de segurança desde o onboarding.

---

### 6. ness.PEOPLE (Gestão de Talentos e ATS)

*Foco: Desempenho, Recrutamento e Cultura.*

- **Recrutamento Integrado (ATS):** Ciclo de contratação. Vagas baseadas em perfis dos contratos; publicadas em "Trabalhe Conosco" (rota `/people/jobs`); gestão de candidaturas e stakeholders.
- **Avaliação 360º e Liderança:** Ingestão de dados qualitativos/quantitativos para análise de desempenho.
- **Treinamento Orientado:** Cruza falhas operacionais (erros mapeados no ness.OPS) com necessidade de capacitação, sugerindo treinamentos para fechar gaps.

---

## Task Snapshot

- **Primary goal:** Formalizar esta definição como referência canônica; atualizar documentação e planos de módulos para alinhamento.
- **Success signal:** `glossary.md` e `project-overview.md` refletem esta visão; planos ness-growth, ness-ops, ness-fin etc. referenciam este documento.
- **Key references:**
  - [Documentation Index](../docs/README.md)
  - [Plans Index](./README.md)
  - [ness-os-sistema-nervoso](./ness-os-sistema-nervoso.md) — Ciclo de Valor

---

## Escopo de Alinhamento

| Área | Ação |
|------|------|
| **glossary.md** | Incluir termos: ness.GROWTH, ness.OPS, ness.FIN, ness.JUR, ness.GOV, ness.PEOPLE com definições sucintas |
| **project-overview.md** | Atualizar descrição dos módulos com link para este plano |
| **Planos de módulo** | ness-growth, ness-ops, ness-fin, ness-jur, ness-gov, ness-people devem referenciar esta definição |
| **ness.OPS** | Remover referências a detalhes de verticais (InfraOps, SecOps, DataOps); manter foco em Engenharia de Processos |

---

## Working Phases

### Phase 1 — Definição Canonical ✅

- Documento formalizado com a definição atualizada.
- Inclusão explícita da remoção de itens de verticais no ness.OPS.

### Phase 2 — Documentação e Alinhamento

1. Atualizar `glossary.md` com termos dos 6 módulos.
2. Atualizar `project-overview.md` com visão resumida e link para este plano.
3. Revisar planos de módulo e adicionar referência a `ness-os-definicao-sistema-operacional.md`.

### Phase 3 — Validação de Consistência

1. Verificar que nav-config e sidebar refletem os 6 módulos.
2. Conferir que nenhum plano contradiz a definição (ex.: ness.OPS com foco em verticais específicas).

---

## Related Plans

- [ness-os-sistema-nervoso](./ness-os-sistema-nervoso.md) — Ciclo de Valor OPS→GROWTH→FIN
- [ness-growth-inteligencia-comercial](./ness-growth-inteligencia-comercial.md)
- [ness-ops-engenharia-processos](./ness-ops-engenharia-processos.md)
- [ness-fin-cfo-digital](./ness-fin-cfo-digital.md)
- [ness-jur-juridico-compliance](./ness-jur-juridico-compliance.md)
- [ness-gov-governanca-interna](./ness-gov-governanca-interna.md)
- [ness-people-talentos-cultura](./ness-people-talentos-cultura.md)
