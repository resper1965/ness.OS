# Fase E — Execução: empty-states (clone inspiração)

**Data:** 2026-02  
**Workflow:** clone-inspiracao-paginas-nessos  
**Plano:** [clone-inspiracao-paginas-nessos](../../plans/clone-inspiracao-paginas-nessos.md)  
**Referência clone:** [empty-states/01](https://github.com/resper1965/clone/tree/main/app/dashboard/(auth)/pages/empty-states)

---

## Objetivo

Alinhar o componente **EmptyState** do ness.OS ao padrão do clone (empty-states): ícone, título, descrição, CTA.

---

## Alterações

### 1. `src/components/shared/empty-state.tsx`

- **Props adicionadas:** `icon?: LucideIcon`, `title?: string`, `className?: string`.
- **Comportamento:** Ícone opcional (Lucide) no topo; título opcional (h2); mensagem e descrição mantidas; ação (CTA) abaixo. Layout centralizado, compatível com clone empty-states/01.
- **Retrocompatibilidade:** Chamadas só com `message` e `description` continuam válidas.

### 2. `src/app/app/ops/indicators/page.tsx`

- **EmptyState:** Uso de `icon={BarChart3}`, `title="Nenhum indicador ingerido"`, `message` e `description` ajustados para seguir o padrão (título + texto de apoio).

---

## Verificação

- `npm run build`: OK (exit 0).

---

## Próximos passos (inventário)

- Aplicar EmptyState com ícone/título em outras listagens (fin/contratos, people/vagas, people/gaps) onde fizer sentido.
- Página de **error** (404/500) inspirada no clone error.
- Listagens **orders/products** (contratos, propostas, services) com cards/tabelas no padrão clone.
