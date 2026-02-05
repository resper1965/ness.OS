# Inventário — clone (auth)/pages

**Fonte:** [resper1965/clone — app/dashboard/(auth)/pages](https://github.com/resper1965/clone/tree/main/app/dashboard/(auth)/pages)  
**Plano:** [clone-inspiracao-paginas-nessos](../plans/clone-inspiracao-paginas-nessos.md)  
**Uso:** Referência para Fase P (mapeamento) e Fase E (padrões de página) do plano clone inspiração.

---

## Lista de páginas (clone)

| # | Pasta | Descrição esperada |
|---|-------|---------------------|
| 1 | **empty-states** | Estados vazios (listas sem itens, CTAs). |
| 2 | **error** | Página de erro (404, 500, fallback). |
| 3 | **onboarding-flow** | Fluxo de onboarding (steps, wizard). |
| 4 | **orders** | Listagem/detalhe de pedidos. |
| 5 | **pricing** | Página de preços/planos. |
| 6 | **products** | Listagem/detalhe de produtos. |
| 7 | **profile** | Perfil do usuário logado. |
| 8 | **settings** | Configurações da conta ou app. |
| 9 | **user-profile** | Perfil de usuário (visão admin ou outro usuário). |
| 10 | **users** | Listagem de usuários (admin). |

---

## Mapeamento clone → ness.OS

| Clone (auth)/pages | ness.OS (app) | Observação |
|--------------------|---------------|------------|
| empty-states | `EmptyState` em shared/; listagens em fin, growth, people, ops | Padrão de estado vazio. |
| error | `not-found.tsx`, error boundary | Páginas de erro. |
| onboarding-flow | — | Futuro: primeiro acesso ou wizard. |
| orders | `/app/fin/contratos`, `/app/growth/propostas` | Listagem + detalhe. |
| pricing | — | Opcional (B2B). |
| products | `/app/growth/services`, `/app/growth/brand` | Catálogo/serviços. |
| profile | UserMenu (dropdown); futura `/app/profile` | Perfil do usuário. |
| settings | Futura `/app/configuracoes` | Theme, preferências. |
| user-profile | `/app/people/candidatos`, perfis em PEOPLE | Perfil de outro usuário. |
| users | `/app/people/candidatos`, `/app/gov/aceites` | Listagem de usuários. |

---

## Priorização sugerida (Fase E)

1. **empty-states / error** — Padrões de estado vazio e erro já existem; alinhar visual ao clone.
2. **orders / products** — Listagens (contratos, propostas, services); cards e tabelas inspirados no clone.
3. **profile / settings** — Página de perfil ou configurações usando padrões do clone (profile, settings).
4. **users** — Listagens de usuários (candidatos, aceites) com padrão clone/users.

---

## Referências

- [clone-inspiracao-paginas-nessos](../plans/clone-inspiracao-paginas-nessos.md)
- [resper1965/clone](https://github.com/resper1965/clone)
