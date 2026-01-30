---
type: doc
name: tooling
description: Tools, frameworks, and environment
category: reference
generated: 2026-01-29
status: filled
scaffoldVersion: "2.0.0"
---

# Ferramentas

## Stack

- **Runtime:** Node 18+ (Next.js), Deno (Edge Functions).  
- **Linguagem:** TypeScript.  
- **UI:** React 18, Radix UI, Tailwind, Recharts, Lucide, date-fns, clsx, tailwind-merge, class-variance-authority.  
- **Frontend:** Next.js 14 App Router; `src/app/` (dashboard, fin, ops, growth, jur, gov, people); `src/components/`; `src/hooks/use-fin.ts`; `src/lib/`. Deploy: `vercel.json` (region gru1).  
- **Backend:** Supabase (Postgres, Auth, Storage, Realtime, Edge).  
- **ORM:** Drizzle ou Prisma (futuro).  
- **LLM/Embeddings:** Claude API, OpenAI (ada-002).  
- **Deploy:** Vercel (frontend), Supabase (backend).  
- **Dev:** IA Coder (Cursor).  

## NPM e ambiente

- **Scripts:** `npm run dev`, `npm run build`, `npm run start`, `npm run lint`.  
- **Env:** `.env.local` com `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`; usar [.env.example](../../.env.example) como base.  
- **Package:** [package.json](../../package.json); dependências incluem `@supabase/ssr`, `@supabase/supabase-js`, Radix, Tailwind, etc.

## Repositório

- Código em `ness.OS/`; app em `src/`; documentação em `docs/` e `ARCHITECTURE.md`.  
- Contexto AI em `.context/` (docs, agents, skills, workflow).
