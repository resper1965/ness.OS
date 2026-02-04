---
status: filled
planSlug: pagina-explicacao-nessos-completa
generated: 2026-02
type: documentation
trigger: "página explicação ness.OS", "explicação completa ness.OS", "fluxos ness.OS"
implemented: "2026-02 — Fases 1 e 2 concluídas: spec em docs/PLANO-PAGINA-EXPLICACAO-NESSOS.md; página em src/app/(site)/nessos/page.tsx; link no header e footer."
scope:
  - "Uma única página (site ou app) que explica o ness.OS por completo"
  - "Fluxos de valor e dados entre módulos"
  - "Detalhamento por módulo usando conteúdo do ai-context"
docs:
  - "project-overview.md"
  - "architecture.md"
  - "data-flow.md"
  - "glossary.md"
plans:
  - "ness-os-definicao-visao.md"
  - "ness-os-sistema-nervoso.md"
  - "ness-data-modulo-dados.md"
  - "ness-ops-engenharia-processos.md"
  - "ness-growth-inteligencia-comercial.md"
  - "ness-fin-cfo-digital.md"
  - "ness-jur-juridico-compliance.md"
  - "ness-gov-governanca-interna.md"
  - "ness-people-talentos-cultura.md"
phases:
  - id: "phase-1"
    name: "Definição e estrutura de conteúdo"
    prevc: "P"
  - id: "phase-2"
    name: "Implementação da página"
    prevc: "E"
  - id: "phase-3"
    name: "Manutenção e sync com ai-context"
    prevc: "V"
---

# Página de Explicação Completa do ness.OS

> **Objetivo:** Uma página única que explica o ness.OS por completo — o que é, os 6 módulos, fluxos de valor e dados, stack e detalhamento — usando o **ai-context** (.context/docs e .context/plans) como fonte de verdade.

**Trigger:** "página explicação ness.OS", "explicação completa ness.OS", "fluxos e detalhamento using ai-context"

---

## Escopo

- **Conteúdo:** O que é ness.OS; 6 módulos + ness.DATA; fluxos (ciclo de valor, Timer→OPS→FIN, OPS→GROWTH→FIN, etc.); stack e arquitetura resumida; detalhamento por módulo (capacidades e planos).
- **Fonte de verdade:** `.context/docs/` (project-overview, architecture, data-flow, glossary) e `.context/plans/` (ness-os-definicao-visao, ness-os-sistema-nervoso, planos por módulo). A página deve ser alimentada ou mantida em sync com esses arquivos.
- **Onde a página vive:** Opções — (1) Site público: `/nessos` ou `/sobre/nessos` para visitantes e stakeholders; (2) App interno: `/app/sobre` ou `/app/nessos` para usuários logados. Recomendação: site público `/nessos` para máxima visibilidade da visão do produto.
- **Formato:** Página Next.js (App Router) com conteúdo estruturado em seções; pode usar MDX ou Server Component que lê markdown/JSON gerado a partir do ai-context; ou conteúdo estático mantido em docs e referenciado.

---

## Estrutura da página (seções)

| # | Seção | Conteúdo | Fonte ai-context |
|---|--------|----------|-------------------|
| 1 | **O que é ness.OS** | Definição, missão, Sistema Nervoso Digital | ness-os-definicao-visao, project-overview |
| 2 | **Os 6 módulos + ness.DATA** | Tabela resumo: GROWTH, OPS, FIN, JUR, GOV, PEOPLE + camada DATA | ness-os-definicao-visao (capítulos por módulo) |
| 3 | **Fluxos de valor e dados** | Ciclo OPS→GROWTH→FIN→PEOPLE→WEB; Timer→métricas→rentabilidade; Site↔App; Integrações externas (DATA) | ness-os-sistema-nervoso, data-flow, docs/FLUXO-TIMER-OPS-FIN |
| 4 | **Stack e arquitetura** | Next.js, Supabase, rotas (site/app/api), camadas (Pages, Actions, Lib) | architecture, project-overview |
| 5 | **Detalhamento por módulo** | Capacidades em tabela; link para plano ai-context de cada módulo | ness-os-definicao-visao + planos ness-*-*.md |
| 6 | **Referências e ai-context** | Lista de documentos e planos que alimentam esta página; como contribuir | .context/docs/README, .context/plans/README |

---

## Fluxos a documentar na página

| Fluxo | Descrição | Onde está |
|-------|-----------|-----------|
| **Ciclo de valor (flywheel)** | OPS (Playbooks) → GROWTH (Catálogo travado) → FIN (Rentabilidade) → PEOPLE (Gaps/Treinamento) → WEB (Vitrine) | ness-os-sistema-nervoso |
| **Timer → OPS → FIN** | time_entries → performance_metrics (hours_worked) → contract_rentability | docs/FLUXO-TIMER-OPS-FIN, data-flow |
| **Site ↔ App** | Visitante (leads, candidatura) → tabelas; usuário (posts, playbooks, contratos) → mesmas tabelas | data-flow |
| **ness.DATA** | Omie, BCB (índices), ingestão indicadores; módulos consomem via actions | ness-data-modulo-dados, data-flow |
| **Trava de catálogo** | Serviço ativo exige playbook; proposta usa playbook | ness-os-sistema-nervoso, PLANO-SISTEMA-NERVOSO-NESSOS |

---

## Fases de execução

### Phase 1 — Definição e estrutura de conteúdo

1. Criar spec da página em `docs/PLANO-PAGINA-EXPLICACAO-NESSOS.md` com outline de cada seção e referências aos arquivos do ai-context.
2. Definir rota final: `/nessos` (site) ou `/app/sobre` (app).
3. Listar todos os trechos ou tabelas que serão extraídos de .context/docs e .context/plans (para copy manual ou geração futura).

### Phase 2 — Implementação da página

1. Criar rota em `src/app/(site)/nessos/page.tsx` (ou `src/app/app/sobre/page.tsx`).
2. Implementar seções com conteúdo estático inicial (texto e tabelas baseados no spec).
3. Estilo consistente com o site (layout (site), design tokens).
4. Links internos para navegação entre seções (âncoras).
5. Opcional: componente que lê um markdown gerado a partir do ai-context (ex.: script que concatena trechos de .context/docs/plans em um único MD).

### Phase 3 — Manutenção e sync com ai-context

1. Documentar no próprio plano (ou em docs) que a fonte de verdade é .context/docs e .context/plans.
2. Ao atualizar definição de módulos ou fluxos no ai-context, revisar a página e atualizar o conteúdo correspondente.
3. Incluir na página uma seção "Referências" com links ou nomes dos documentos ai-context (project-overview, architecture, data-flow, glossary, ness-os-definicao-visao, ness-os-sistema-nervoso, planos por módulo).

---

## Referências

- [ness-os-definicao-visao](./ness-os-definicao-visao.md) — Definição canônica e capacidades por módulo
- [ness-os-sistema-nervoso](./ness-os-sistema-nervoso.md) — Ciclo de valor e flywheel
- [Project Overview](../docs/project-overview.md) — Stack e visão geral
- [Architecture](../docs/architecture.md) — Rotas e camadas
- [Data Flow](../docs/data-flow.md) — Movimento de dados e integrações
- [docs/PLANO-PAGINA-EXPLICACAO-NESSOS.md](../../docs/PLANO-PAGINA-EXPLICACAO-NESSOS.md) — Spec detalhada da página (criada por este plano)
