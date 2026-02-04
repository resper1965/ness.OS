# Navegação por Módulos e Áreas — ness.OS

> Convenções para o menu lateral: módulos (ness.GROWTH, ness.OPS, etc.) e áreas (subgrupos semânticos). Plano: [agrupar-atividades-por-area](../.context/plans/agrupar-atividades-por-area.md).

## Onde está a configuração

- **Arquivo:** `src/lib/nav-config.ts`
- **Tipos:** `NavItem`, `NavArea`, `NavModule`
- **Consumidor:** `src/components/app/app-sidebar.tsx` (CollapsibleGroup)

## Estrutura

- **NavItem:** `{ href: string; label: string }` — rota e texto do link.
- **NavArea:** `{ id: string; title: string; items: NavItem[] }` — subgrupo dentro de um módulo (ex.: Comercial, Marketing). O `title` aparece como cabeçalho não clicável no menu.
- **NavModule:** `{ id: string; title: string; areas?: NavArea[]; items?: NavItem[] }` — módulo do produto. Se tiver `areas`, o sidebar mostra áreas e depois itens; se tiver só `items`, lista plana (ex.: JUR, GOV).

## Critérios para nova área

1. **Agrupar por afinidade:** Criar área quando há 3+ itens com tema claro (ex.: Comercial = Leads, Propostas, Upsell).
2. **Uma área por tema:** Evitar áreas com um único item; nesse caso, manter em lista plana ou juntar a outra área.
3. **Título curto:** `title` em 1–2 palavras (ex.: "Comercial", "Operação", "Conhecimento").
4. **id em kebab-case:** `id` único no módulo (ex.: `conhecimento`, `operacao`).

## Critérios para novo item

1. **href:** Sempre sob `/app/...`; manter rotas existentes (sem migração de URL).
2. **label:** Nome curto para o menu (ex.: "Leads", "Contratos", "360º").
3. **Colocar na área certa:** Inserir no `NavArea` correspondente em `nav-config.ts`; se o módulo não usa áreas, em `NavModule.items`.

## Módulos sem áreas

JUR e GOV usam `items` direto (lista plana). Use `areas` só quando o agrupamento melhorar a descoberta; módulos com 2–3 itens podem ficar planos.

## Atualizar o menu

1. Editar `src/lib/nav-config.ts`.
2. Novo link: adicionar `{ href: '/app/...', label: '...' }` no array `items` da área (ou do módulo) correta.
3. Nova área: adicionar `{ id: '...', title: '...', items: [...] }` no array `areas` do módulo.
4. O sidebar lê `navModules` e `getAllItems(module)`; não é necessário alterar o componente para novos itens/áreas.
