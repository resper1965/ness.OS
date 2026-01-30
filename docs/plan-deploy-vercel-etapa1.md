# Plano: Deploy Vercel — Etapa 1 (ness.OS)

## Objetivo

Publicar a primeira etapa funcional do ness.OS na Vercel para avaliação, com todas as variáveis de ambiente necessárias, e registrar o commit no GitHub com integração ao AI-context.

---

## 1. Variáveis de ambiente necessárias

| Variável | Tipo | Uso | Obrigatória |
|----------|------|-----|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Pública | URL do projeto Supabase (client) | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Pública | Chave anon/publishable (client, Edge) | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Sensível | Operações admin em server components | ✅ |

**Nota:** OMIE_APP_KEY e OMIE_APP_SECRET já existem (Edge Functions no Supabase), não na Vercel.

---

## 2. Ajuste do vercel.json

O `vercel.json` atual usa referências `@supabase-url` e `@supabase-anon-key`. Para simplificar e evitar dependência de Vercel Secrets, as variáveis são configuradas diretamente no projeto via CLI ou dashboard.

---

## 3. Passos de execução

### 3.1 Configurar variáveis na Vercel

```bash
cd ness.OS
vercel link  # se ainda não linkado

# Supabase (públicas - production + preview)
vercel env add NEXT_PUBLIC_SUPABASE_URL production preview < <(echo "https://jagerqrvcdraxkuqkrip.supabase.co")
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production preview < <(echo "<ANON_KEY>")

# Supabase Service Role (sensível - production + preview)
vercel env add SUPABASE_SERVICE_ROLE_KEY production --sensitive < <(echo "<SERVICE_ROLE_KEY>")
vercel env add SUPABASE_SERVICE_ROLE_KEY preview --sensitive < <(echo "<SERVICE_ROLE_KEY>")
```

Ou via Dashboard: Project → Settings → Environment Variables.

### 3.2 Atualizar vercel.json

Remover o bloco `env` que referencia secrets inexistentes, ou garantir que as variáveis sejam definidas no projeto.

### 3.3 Deploy

```bash
vercel --prod
# ou: git push origin main (se CI/CD configurado)
```

### 3.4 Commit e push (AI-context)

1. Stage das alterações
2. Commit com mensagem convencional (feat/fix/docs)
3. Push para `origin main`
4. Atualizar `plan-github-novos-passos-integracao` com a rodada

---

## 4. Checklist

- [ ] Variáveis Supabase configuradas (URL, anon, service role)
- [ ] vercel.json compatível
- [ ] Deploy executado
- [ ] URL de produção validada
- [ ] Commit feito com mensagem adequada
- [ ] Push para GitHub
- [ ] plan-github-novos-passos-integracao atualizado
- [ ] .context/docs (tooling, development-workflow) revisado

---

## 5. Mapeamento das chaves fornecidas

| Fornecida | Mapeamento | Ambiente |
|-----------|------------|----------|
| `sb_publishable_*` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview |
| `sb_secret_*` | `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview (sensível) |

**Segurança:** Nunca commitar chaves em código. Usar apenas via Vercel env/dashboard.

---

## 6. Referências

- [plan-github-integracao-ai-context](plan-github-integracao-ai-context.md)
- [plan-implementacao-epicos-ai-context](plan-implementacao-epicos-ai-context.md)
- [setup-mcp-supabase](setup-mcp-supabase.md)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
