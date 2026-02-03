---
slug: project-structure
category: architecture
generatedAt: 2026-01-30T14:50:38.633Z
---

# How is the codebase organized?

## Project Structure

- **Site público:** `src/app/(site)/` — layout com SiteHeader, páginas (blog, soluções, carreiras, contato).
- **App interno:** `src/app/app/` — layout com AppSidebar + main; cada página usa PageContent, AppPageHeader (fixo 64px), componentes por módulo.
- **Layout do app:** Sidebar 224px (w-56), header da página fixo (position: fixed, não some ao rolar). Ver `docs/LAYOUT-APP-HEADERS.md`.
