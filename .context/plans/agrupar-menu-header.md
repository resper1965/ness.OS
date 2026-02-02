---
status: ready
generated: 2026-02-02
planSlug: agrupar-menu-header
phases:
  - phase-1
  - phase-2
constrains:
  - "Manter consistência visual com design system existente"
  - "Header fixo sem scroll, mesma altura que sidebar header"
---

# Agrupar Menu + Header Fixo — ness.OS

> Menu lateral agrupado por módulos. Header da página sticky, mesma altura do header da sidebar.

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
| 1 | Definir altura compartilhada (h-14) para sidebar header e page header | APP_HEADER_HEIGHT | ✅ |
| 2 | Criar AppPageHeader sticky, mesma altura | shared/app-page-header.tsx | ✅ |
| 3 | Atualizar sidebar header para altura fixa | app-sidebar.tsx | ✅ |
| 4 | Layout main: header sticky + conteúdo scroll | main overflow-auto, header sticky | ✅ |
| 5 | Migrar páginas para usar AppPageHeader | Dashboard, Casos, Leads, Posts, Playbooks, Contratos, GOV, JUR | ✅ |
