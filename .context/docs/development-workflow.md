---
type: doc
name: development-workflow
description: How to develop, test, and deploy
category: process
generated: 2026-01-29
status: filled
scaffoldVersion: "2.0.0"
---

# Fluxo de desenvolvimento

## Roadmap (fases)

1. **Fase 1:** Infraestrutura + ness.FIN (sync Omie) — 4 semanas  
2. **Fase 2:** ness.OPS + integração FIN — 4 semanas  
3. **Fase 3:** ness.GROWTH (propostas, precificação) — 4 semanas  
4. **Fase 4:** ness.JUR + ness.GOV — 4 semanas  
5. **Fase 5:** ness.PEOPLE + refinamentos — 4 semanas  

## Convenções

- **Stack:** Next.js 14 (App Router), TypeScript, Supabase, Radix + Tailwind. App em `src/app/`, componentes em `src/components/`, lib em `src/lib/`.  
- **Agentes:** Edge Functions (Deno) em `src/supabase/functions/`.  
- **DB:** schema `fin` em `src/database/001_schema_fin.sql`; RBAC em `supabase/migrations/001_rbac_schema.sql`; demais schemas planejados (migrations futuras).  
- **Docs:** manter `docs/` e `ARCHITECTURE.md` alinhados.  
- **Frontend:** `npm i` → copiar `.env.example` para `.env.local` → `npm run dev`.  

## Deploy

- Frontend: Vercel (CI/CD).  
- Backend: Supabase (Auth, DB, Edge, Storage, Realtime).  
- Cron: pg_cron para jobs (ex.: sync Omie, alertas).  

## PREVC

Para mudanças não triviais, usar workflow PREVC (Plan → Review → Execute → Verify → Complete) via `workflow-init` no contexto AI.
