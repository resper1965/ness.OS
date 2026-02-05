---
status: filled
planSlug: bundui-finance-dashboard-nessos
generated: 2026-02
type: frontend
trigger: "Bundui dashboard finance", "app/dashboard/(auth)/finance", "ness.FIN dashboard"
constrains:
  - "Respeitar ness. branding (ness., ness.FIN); design tokens slate-*, ness"
  - "Manter stack: Next.js 14, React 18, Tailwind 3"
  - "Zero breaking: rotas /app/fin/contratos, rentabilidade, alertas intactas; auth e nav-config alinhados"
docs:
  - "project-overview.md"
  - "DESIGN-TOKENS.md"
  - "PLANO-NESS-FIN-CFO-DIGITAL.md"
plans:
  - "ness-fin-cfo-digital.md"
  - "bundui-componentes-profundos-nessos.md"
---

# Plano — Adaptar dashboard finance (Bundui) ao ness.FIN

> Adaptar o padrão **app/dashboard/(auth)/finance** do [resper1965/clone](https://github.com/resper1965/clone/tree/main/app/dashboard/(auth)/finance) ao módulo **ness.FIN** do ness.OS: hub de visão geral com cards de resumo e links para Contratos, Rentabilidade e Alertas.

**Referência (repositório):**  
- [resper1965/clone — app/dashboard/(auth)/finance](https://github.com/resper1965/clone/tree/main/app/dashboard/(auth)/finance) — page.tsx + components/; estrutura obtida via MCP GitHub.

**Trigger:** "Bundui dashboard finance", "dashboard/(auth)/finance", "resper1965/clone finance"

**Relação com outros planos:**
- [ness-fin-cfo-digital](./ness-fin-cfo-digital.md) — CFO Digital; dashboard finance é a visão geral do módulo.
- [bundui-componentes-profundos-nessos](./bundui-componentes-profundos-nessos.md) — uso de ui/card e design tokens.

---

## Objetivo

- Oferecer uma **página de visão geral** do ness.FIN em `/app/fin` (hub), no estilo dashboard Bundui: cards de resumo (MRR total, quantidade de contratos, alertas de renovação, alertas de reconciliação) e cards de navegação para Contratos, Rentabilidade e Alertas.
- Manter as páginas existentes `/app/fin/contratos`, `/app/fin/rentabilidade` e `/app/fin/alertas` sem alteração de contrato; o hub apenas agrega dados e links.
- Usar componentes alinhados ao design system (PageContent, AppPageHeader, ui/card) e design tokens (slate-*, ness).

---

## Estado atual

| Rota | Conteúdo |
|------|----------|
| `/app/fin/contratos` | Formulários Cliente/Contrato, DataTable, ErpSyncButton, IndicesCard |
| `/app/fin/rentabilidade` | Tabela contract_rentability, barras de margem por contrato |
| `/app/fin/alertas` | Reconciliação MRR vs Omie, Renovação (próximos 30 dias) |
| `/app/fin` | **Não existe** — primeira entrada no módulo leva direto às subáreas via nav. |

**Nav:** ness.FIN tem áreas Contratos e Financeiro (Rentabilidade, Alertas); não há item "Visão Geral" para `/app/fin`.

---

## Estrutura em resper1965/clone (app/dashboard/(auth)/finance)

Obtido via MCP GitHub:

- **finance/page.tsx** — página principal do dashboard finance.
- **finance/components/** — diretório de componentes da seção finance.

A adaptação ao ness.FIN seguiu o padrão: hub em `/app/fin` com cards de resumo (MRR, contratos, renovações, reconciliação) e cards de navegação para Contratos, Rentabilidade e Alertas. Layout (auth): ness.OS já usa `/app` sob layout com auth.

---

## Fases de execução

### Fase 1 — Hub /app/fin (E)

| # | Ação | Entregável |
|---|------|------------|
| 1 | Criar página `/app/fin/page.tsx`: AppPageHeader "ness.FIN" / "Financeiro", subtitle. | page.tsx |
| 2 | Buscar dados agregados: soma MRR, count contratos, count renovação (30 dias), count reconciliação (getReconciliationAlerts). | Queries em createClient + getReconciliationAlerts |
| 3 | Renderizar cards de resumo (ui/card): MRR total, N contratos, N renovações, N reconciliação. | Grid de stats |
| 4 | Renderizar cards de navegação (links): Contratos, Rentabilidade, Alertas. | Grid de links (estilo dashboard principal) |
| 5 | Usar PageContent, design tokens (slate-*, 8pt grid). | Build verde |

**DoD Fase 1:** Página `/app/fin` acessível com resumo e links; sem quebrar sub-rotas.

### Fase 2 — Navegação e documentação (V / C)

| # | Ação | Entregável |
|---|------|------------|
| 1 | Adicionar "Visão Geral" ao ness.FIN em nav-config (item ou área apontando para /app/fin). | nav-config.ts atualizado |
| 2 | Registrar no plano status e referência cruzada; atualizar VALIDACAO-MANUAL se necessário. | Plano e docs |

**DoD Fase 2:** Nav permite chegar ao hub; plano marcado concluído.

- **Entregas:** Página `/app/fin/page.tsx` com cards de resumo (MRR total, contratos, renovações 30d, alertas reconciliação) e cards de navegação (Contratos, Rentabilidade, Alertas). Nav-config atualizado com área "Visão Geral" → /app/fin. Build verde.

---

## Restrições

| Item | Regra |
|------|--------|
| Rotas existentes | Não alterar paths de contratos, rentabilidade, alertas. |
| Auth | Página /app/fin sob mesmo layout /app (já protegido). |
| Dados | Apenas leitura (Supabase + getReconciliationAlerts); sem novas tabelas. |
| UI | ui/card, PageContent, AppPageHeader; design tokens ness.OS. |

---

## Referências

- [ness-fin-cfo-digital](./ness-fin-cfo-digital.md)
- [docs/PLANO-NESS-FIN-CFO-DIGITAL.md](../../docs/PLANO-NESS-FIN-CFO-DIGITAL.md)
- [src/lib/nav-config.ts](../../src/lib/nav-config.ts)
- [src/app/app/page.tsx](../../src/app/app/page.tsx) — padrão de grid de widgets do dashboard principal
