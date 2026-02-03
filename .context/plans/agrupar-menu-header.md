---
status: ready
generated: 2026-02-02
planSlug: agrupar-menu-header
phases:
  - phase-1
  - phase-2
constrains:
  - "Manter consistência visual com design system existente"
  - "Header fixo sem scroll (position: fixed), mesma altura que sidebar header (64px)"
---

# Agrupar Menu + Header Fixo — ness.OS

> Menu lateral agrupado por módulos. Header da página fixo (position: fixed), 64px, não some ao rolar; mesma altura do header da sidebar.

**Trigger:** "agrupar menu", "menu por módulos", "header fixo", "header não deve scroll"

---

## Ações Executáveis (ai-context)

### phase-1 — Menu agrupado
| stepIndex | Ação | Artefato | Status |
|-----------|------|----------|--------|
| 1 | Agrupar itens por módulo (Início, GROWTH, OPS, PEOPLE, FIN, JUR, GOV) | app-sidebar.tsx | ✅ |
| 2 | Cabeçalhos de grupo com estilo distinto | app-sidebar.tsx | ✅ |

### phase-2 — Header da página
| stepIndex | Ação | Artefato | Status |
|-----------|------|----------|--------|
| 1 | Definir altura compartilhada 64px (APP_HEADER_HEIGHT_PX) para sidebar e page header | header-constants.ts | ✅ |
| 2 | AppPageHeader fixo (position: fixed), 64px, não some ao rolar | shared/app-page-header.tsx | ✅ |
| 3 | Sidebar header 64px (min/max), uma linha separadora | app-sidebar.tsx | ✅ |
| 4 | Layout main: header fixo + conteúdo scroll | main overflow-auto, header fixed | ✅ |
| 5 | Migrar páginas para usar AppPageHeader | Dashboard, Casos, Leads, Posts, Playbooks, Contratos, GOV, JUR | ✅ |
