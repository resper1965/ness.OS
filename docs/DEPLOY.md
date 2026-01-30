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
| NEXT_PUBLIC_SUPABASE_URL | `https://mjkzhzcwqvgcrfutoqsc.supabase.co` | Production, Preview |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Chave anon do projeto (Supabase → Settings → API) | Production, Preview |
| OPENAI_API_KEY | Chave da OpenAI (para Knowledge Bot / RAG) | Production, Preview |

**Valores corretos**: Supabase Dashboard → Settings → API. Use a **anon/public** key (JWT ou sb_publishable).

## 3. Vercel

1. Conecte o repositório GitHub
2. Framework: Next.js (detectado)
3. Build: `npm run build`
4. Deploy

## 4. URLs

- Site público: `https://seu-projeto.vercel.app`
- ness.OS: `https://seu-projeto.vercel.app/app` (exige login)
- Login: `https://seu-projeto.vercel.app/login`

## 5. Troubleshooting — "fetch failed" no login

1. **Variáveis de ambiente**: Confirme em Vercel → Settings → Environment Variables que `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão definidas para **Production** (e Preview).
2. **Supabase pausado**: Projetos free tier pausam após inatividade. Em Supabase Dashboard, reative o projeto se estiver pausado.
3. **Chave correta**: Prefira a chave **anon** (JWT, começa com `eyJ...`) em Supabase → Settings → API. A sb_publishable também funciona, mas a JWT costuma ser mais estável.
4. **Redeploy**: Após alterar env vars, faça um redeploy (Deployments → ⋮ → Redeploy).
