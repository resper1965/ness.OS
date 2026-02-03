---
status: ready
generated: 2026-02-02
planSlug: agrupar-atividades-por-area
phases:
  - phase-1
  - phase-2
  - phase-3
constrains:
  - "Manter rotas existentes (/app/growth/leads etc.) — sem migração de URL"
  - "Sidebar colapsável por módulo e por área — preservar UX atual"
  - "Áreas são apenas agrupamento visual/organizacional no menu"
---

# Agrupar Atividades por Área — ness.OS

> Organizar itens do menu lateral dentro de cada módulo por **áreas** correlatas (marketing, comercial, operação etc.), melhorando descoberta e contexto semântico.

**Trigger:** "agrupar atividades por área", "menu por marketing comercial", "áreas dentro do módulo"

---

## Conceito

Cada módulo (ness.GROWTH, ness.OPS, etc.) terá **subgrupos por área**. Áreas são labels organizacionais que agrupam atividades correlatas. Exemplo:

| Módulo | Área | Itens |
|--------|------|-------|
| ness.GROWTH | Comercial | Leads, Propostas, Upsell |
| ness.GROWTH | Marketing | Posts, Casos, Brand |
| ness.GROWTH | Catálogo | Serviços |
| ness.OPS | Conhecimento | Playbooks, Knowledge Bot |
| ness.OPS | Operação | Métricas, Assets |
| ness.PEOPLE | Aquisição | Vagas, Candidatos |
| ness.PEOPLE | Desenvolvimento | Gaps, 360º |
| ness.FIN | Contratos | Contratos |
| ness.FIN | Financeiro | Rentabilidade, Alertas |
| ness.JUR | — | Visão Geral, Conformidade, Risco |
| ness.GOV | — | Visão Geral, Políticas, Aceites |

**Nota:** Módulos com poucos itens ou sem divisão clara (JUR, GOV) podem manter lista plana.

---

## Mapeamento Completo por Módulo

### ness.GROWTH
| Área | Descrição | Itens |
|------|-----------|-------|
| **Comercial** | Vendas, pipeline, propostas | Leads, Propostas, Upsell |
| **Marketing** | Conteúdo, blog, casos, brand | Posts, Casos, Brand |
| **Catálogo** | O que vendemos | Serviços |

### ness.OPS
| Área | Descrição | Itens |
|------|-----------|-------|
| **Conhecimento** | Know-how, playbooks, bot | Playbooks, Knowledge Bot |
| **Operação** | Métricas, assets | Métricas, Assets |

### ness.PEOPLE
| Área | Descrição | Itens |
|------|-----------|-------|
| **Aquisição** | Recrutamento | Vagas, Candidatos |
| **Desenvolvimento** | Gaps, avaliação | Gaps, 360º |

### ness.FIN
| Área | Descrição | Itens |
|------|-----------|-------|
| **Contratos** | Gestão contratual | Contratos |
| **Financeiro** | Rentabilidade, alertas | Rentabilidade, Alertas |

### ness.JUR / ness.GOV
- Manter lista plana (2–3 itens cada).
- Opcional: Área única "Governança" para GOV; "Compliance" para JUR.

---

## Ações Executáveis (ai-context)

> Use `plan({ action: "updateStep", planSlug: "agrupar-atividades-por-area", phaseId, stepIndex, status, output?, notes? })` para marcar progresso.

### phase-1 — Definição e Estrutura de Dados
| stepIndex | Ação | Artefato | Entrega |
|-----------|------|----------|---------|
| 1 | Criar `src/lib/nav-config.ts` com estrutura de áreas | nav-config.ts | `NavArea`, `NavModule`, tipos exportados |
| 2 | Mapear todos os módulos para áreas | nav-config.ts | Config completa GROWTH, OPS, PEOPLE, FIN, JUR, GOV |
| 3 | Documentar convenções em `docs/NAV-AREAS.md` | NAV-AREAS.md | Critérios para nova área/item |

### phase-2 — Sidebar com Subgrupos por Área
| stepIndex | Ação | Artefato | Entrega |
|-----------|------|----------|---------|
| 1 | Estender `CollapsibleGroup` para aceitar áreas opcionais | app-sidebar.tsx | Renderizar áreas como subcabecalhos |
| 2 | Consumir `nav-config` no sidebar | app-sidebar.tsx | Substituir `navGroups` hardcoded |
| 3 | Estilo visual para área (label menor, indent) | app-sidebar.tsx | Área não clicável, só organizacional |
| 4 | Preservar estado expandido por pathname | app-sidebar.tsx | Abrir módulo + área ativa ao navegar |

### phase-3 — Validação e Ajustes
| stepIndex | Ação | Artefato | Entrega |
|-----------|------|----------|---------|
| 1 | Testar navegação em todos os módulos | Manual | Links corretos, ativo highlight |
| 2 | Verificar mobile/colapsável | app-sidebar | Áreas colapsam com o módulo |
| 3 | Atualizar README de plans se necessário | .context/plans/README.md | Referência ao plano |

---

## Estrutura de Dados Proposta

```ts
// src/lib/nav-config.ts
type NavItem = { href: string; label: string };
type NavArea = { id: string; title: string; items: NavItem[] };
type NavModule = {
  id: string;
  title: string;
  areas?: NavArea[];  // se ausente, usa items direto (JUR, GOV)
  items?: NavItem[];
};
```

---

## Impacto

| Aspecto | Impacto |
|---------|---------|
| **Rotas** | Nenhuma alteração — mesmas URLs |
| **Permissões** | Nenhuma — RLS e roles inalterados |
| **Sidebar** | Nova hierarquia: Módulo → Área → Item |
| **Mobile** | Mesmo comportamento colapsável |
| **Performance** | Irrelevante — config estática |

---

## Referências

- [agrupar-menu-header.md](./agrupar-menu-header.md) — Agrupamento por módulo (concluído)
- [ajuste-ux-ui-nessos.md](./ajuste-ux-ui-nessos.md) — Design tokens, espaçamento
- [architecture.md](../docs/architecture.md) — Rotas e camadas
