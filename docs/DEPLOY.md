# Deploy — ness.OS + ness.WEB

## 1. Supabase

1. Crie o projeto no [Supabase](https://supabase.com)
2. Execute as migrations em ordem (SQL Editor): 001, 002, 003, 004, 005, 006
3. Execute o seed (opcional): `supabase/seed/001_static_pages_legal.sql` → páginas /legal/privacidade e /legal/termos
4. Crie o bucket **os-assets** no Storage (privado)
5. Configure Auth (Email/Password) e crie o primeiro usuário

## 2. Variáveis de Ambiente (Vercel)

No projeto Vercel, Settings > Environment Variables:

| Nome | Valor | Ambiente |
|------|-------|----------|
| NEXT_PUBLIC_SUPABASE_URL | URL do projeto | Production, Preview |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Chave anon | Production, Preview |

## 3. Vercel

1. Conecte o repositório GitHub
2. Framework: Next.js (detectado)
3. Build: `npm run build`
4. Deploy

## 4. URLs

- Site público: `https://seu-projeto.vercel.app`
- ness.OS: `https://seu-projeto.vercel.app/app` (exige login)
- Login: `https://seu-projeto.vercel.app/login`
