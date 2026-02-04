# Plano — Página de Explicação Completa do ness.OS

> Spec e outline da página que explica o ness.OS por completo, com fluxos e detalhamento. **Fonte de verdade:** ai-context (.context/docs e .context/plans).  
> **Plano ai-context:** [.context/plans/pagina-explicacao-nessos-completa.md](../.context/plans/pagina-explicacao-nessos-completa.md)

---

## Status da implementação

- **Rota:** `/nessos` (site público).
- **Arquivo:** `src/app/(site)/nessos/page.tsx`.
- **Navegação:** Link "ness.OS" no header (desktop e mobile) e no footer (Empresa).
- **Manutenção:** Ao alterar definição ou fluxos em `.context/docs` ou `.context/plans`, atualizar o conteúdo da página conforme as seções 2.1–2.6 deste spec.

---

## 1. Objetivo e rota

- **Objetivo:** Uma única página que responde "O que é o ness.OS?" com definição, módulos, fluxos de valor/dados, stack e detalhamento por módulo.
- **Rota sugerida:** Site público **`/nessos`** (ex.: `src/app/(site)/nessos/page.tsx`) para visitantes e stakeholders. Alternativa: `/app/sobre` no app interno.
- **Público:** Visitantes do site, novos colaboradores, stakeholders e IA/agentes que consomem o ai-context (a página pode ser espelho legível do contexto).

---

## 2. Estrutura da página (seções)

### 2.1 O que é o ness.OS

- **Conteúdo:** Definição em 1–2 parágrafos; missão (transformar esforço em conhecimento padronizado, rentabilidade real, gestão ativa); conceito "Sistema Nervoso Digital".
- **Fonte ai-context:** `.context/plans/ness-os-definicao-visao.md` (abertura); `.context/docs/project-overview.md` (primeiro bloco).

### 2.2 Os 6 módulos + ness.DATA

- **Conteúdo:** Tabela resumo com colunas: Módulo | Foco | Capabilidades (resumo em 1 linha).
- **Linhas:** ness.GROWTH, ness.OPS, ness.FIN, ness.JUR, ness.GOV, ness.PEOPLE, ness.DATA (camada de dados).
- **Fonte ai-context:** `.context/plans/ness-os-definicao-visao.md` (seções 1–6 e 3.1).

### 2.3 Fluxos de valor e dados

- **2.3.1 Ciclo de valor (flywheel)**  
  Texto + diagrama (ASCII ou descrição):  
  `OPS (Playbooks) → GROWTH (Catálogo travado) → FIN (Rentabilidade) → PEOPLE (Gaps/Treinamento) → WEB (Vitrine) → …`  
  Fonte: `.context/plans/ness-os-sistema-nervoso.md`, `docs/PLANO-SISTEMA-NERVOSO-NESSOS.md`.

- **2.3.2 Fluxo Timer → OPS → FIN**  
  Passos: Timer (time_entries) → Sincronização (performance_metrics.hours_worked) → Rentabilidade (contract_rentability).  
  Fonte: `docs/FLUXO-TIMER-OPS-FIN.md`, `.context/docs/data-flow.md`.

- **2.3.3 Site ↔ App**  
  Tabela: Origem (Visitante / Usuário logado) | Ação | Destino (tabelas).  
  Fonte: `.context/docs/data-flow.md` (Fluxo Site ↔ App).

- **2.3.4 ness.DATA e integrações externas**  
  Texto: DATA como camada única (Omie, BCB, ingestão indicadores); módulos consomem via actions.  
  Fonte: `.context/plans/ness-data-modulo-dados.md`, `.context/docs/data-flow.md` (External Integrations).

### 2.4 Stack e arquitetura

- **Conteúdo:** Next.js 14 (App Router), Supabase (Auth, Postgres, pgvector, Storage), Tailwind, Vercel; rotas (site) / (app) / api; camadas (Pages, Actions, Components, Lib).
- **Fonte ai-context:** `.context/docs/project-overview.md`, `.context/docs/architecture.md`.

### 2.5 Detalhamento por módulo

- **Conteúdo:** Uma subseção por módulo (GROWTH, OPS, FIN, JUR, GOV, PEOPLE, DATA). Em cada uma: título, foco em 1 linha, tabela de capacidades (Capabilidade | Descrição) e link para o plano ai-context do módulo.
- **Fonte ai-context:** `.context/plans/ness-os-definicao-visao.md` (tabelas de capacidades); links para `ness-growth-inteligencia-comercial.md`, `ness-ops-engenharia-processos.md`, `ness-fin-cfo-digital.md`, `ness-jur-juridico-compliance.md`, `ness-gov-governanca-interna.md`, `ness-people-talentos-cultura.md`, `ness-data-modulo-dados.md`.

### 2.6 Referências e ai-context

- **Conteúdo:** Lista de documentos e planos que alimentam esta página. Texto curto: "Esta página é mantida em sync com o ai-context do repositório (.context/docs e .context/plans)."
- **Lista:** project-overview, architecture, data-flow, glossary; ness-os-definicao-visao, ness-os-sistema-nervoso; planos por módulo (links relativos ou nomes).

---

## 3. Fluxos a incluir (resumo)

| Fluxo | Onde na página | Fonte |
|-------|----------------|-------|
| Ciclo de valor (flywheel) | Seção 2.3.1 | ness-os-sistema-nervoso |
| Timer → métricas → rentabilidade | Seção 2.3.2 | FLUXO-TIMER-OPS-FIN, data-flow |
| Site ↔ App (leads, candidatura, leitura) | Seção 2.3.3 | data-flow |
| ness.DATA (Omie, BCB, indicadores) | Seção 2.3.4 | ness-data-modulo-dados, data-flow |
| Trava de catálogo (serviço ↔ playbook) | Opcional em 2.5 GROWTH | ness-os-sistema-nervoso |

---

## 4. Implementação sugerida

1. **Arquivo:** `src/app/(site)/nessos/page.tsx` (ou `nessos/page.tsx` dentro de (site)).
2. **Conteúdo:** Server Component com seções em HTML/JSX; texto e tabelas podem ser copiados/adaptados do ai-context na primeira versão.
3. **Layout:** Usar layout do site (`(site)/layout.tsx`); título "ness.OS — O Sistema Operacional de Gestão" (ou similar); âncoras para navegação interna (ex.: `#modulos`, `#fluxos`, `#stack`).
4. **Estilo:** Consistente com o site (design tokens, tipografia); tabelas com bordas e cabeçalhos legíveis.
5. **Manutenção:** Ao alterar definição ou fluxos em .context/docs ou .context/plans, atualizar a página conforme este spec (seções 2.1–2.6).

---

## 5. Checklist de conteúdo (por seção)

| Seção | Conteúdo mínimo | Fonte |
|-------|-----------------|--------|
| O que é | Definição + missão + Sistema Nervoso | ness-os-definicao-visao, project-overview |
| 6 módulos + DATA | Tabela 7 linhas (módulo, foco, resumo) | ness-os-definicao-visao |
| Fluxos | Flywheel + Timer→FIN + Site↔App + DATA | sistema-nervoso, FLUXO-TIMER, data-flow |
| Stack | Next.js, Supabase, rotas, camadas | project-overview, architecture |
| Detalhamento | 7 subseções com tabela capacidades + link plano | ness-os-definicao-visao + planos * |
| Referências | Lista docs/plans ai-context | .context/docs README, .context/plans |

---

## 6. Referências cruzadas

- [.context/plans/pagina-explicacao-nessos-completa.md](../.context/plans/pagina-explicacao-nessos-completa.md) — Plano ai-context desta página
- [.context/plans/ness-os-definicao-visao.md](../.context/plans/ness-os-definicao-visao.md) — Definição canônica e módulos
- [.context/plans/ness-os-sistema-nervoso.md](../.context/plans/ness-os-sistema-nervoso.md) — Ciclo de valor
- [.context/docs/data-flow.md](../.context/docs/data-flow.md) — Fluxos de dados
- [FLUXO-TIMER-OPS-FIN.md](./FLUXO-TIMER-OPS-FIN.md) — Timer → rentabilidade
