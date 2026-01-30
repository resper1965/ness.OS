# Roadmap de Desenvolvimento — ness.OS

**Onde estamos:** MVP em produção, login funcionando.

---

## Próximos passos (por prioridade)

### P1 — Conteúdo e site completo (1–2 semanas)

| # | Tarefa | O que fazer | Referência |
|---|--------|-------------|------------|
| 1 | Migrar soluções do legacy | Extrair `_reference/legacy_site/public/locales/pt/products.json` → SQL para `services_catalog` | [PLANO-MIGRACAO-SITE-LEGACY.md](PLANO-MIGRACAO-SITE-LEGACY.md) |
| 2 | Migrar páginas legais restantes | LGPD, cookies, compliance, certifications → `static_pages` | Seed similar a `001_static_pages_legal.sql` |
| 3 | Migrar Sobre | Extrair conteúdo de `about.js` / locales → `static_pages` ou componente | |
| 4 | Ajustar visual do site | Comparar com legacy, alinhar cores, tipografia e componentes | Sprint 1.6 |

**Impacto:** Site público com conteúdo completo, próximo ao legado.

---

### P2 — Melhorias de produto (2–3 semanas)

| # | Tarefa | O que fazer |
|---|--------|-------------|
| 5 | Editor rich (posts e playbooks) | Integrar TipTap ou MDXEditor; substituir textarea por editor WYSIWYG |
| 6 | Testes automatizados | Jest/Vitest para Server Actions críticas (auth, leads, jobs) |
| 7 | Dashboard / métricas | Melhorar `/app` com resumos (leads, contratos, vagas) |
| 8 | i18n (opcional) | PT/EN nas páginas públicas; `next-intl` ou similar |

---

### P3 — Integrações e escala

| # | Tarefa | O que fazer |
|---|--------|-------------|
| 9 | Integração Omie ERP | Sync clientes/contratos; usar `OMIE_APP_KEY` e `OMIE_APP_SECRET` já configurados |
| 10 | Domínio próprio | Configurar dominio custom no Vercel |
| 11 | Monitoramento | Vercel Analytics, Sentry ou equivalente |

---

## Como rodar localmente

```bash
cd ness.OS
npm install
cp .env.example .env.local   # preencher com credenciais
npm run dev
```

- Site: http://localhost:3000
- Login: http://localhost:3000/login
- App: http://localhost:3000/app

---

## Comandos úteis

| Ação | Comando |
|------|---------|
| Deploy produção | `vercel --prod --yes` |
| Listar env vars | `vercel env ls` |
| Migrations | Executar SQL no Supabase Dashboard (SQL Editor) |
| Logs do deploy | `vercel inspect <url> --logs` |

---

## Estrutura do projeto

```
src/app/
├── (site)/          # Site público (/, /contato, /carreiras, /blog, /solucoes, /legal)
├── app/             # ness.OS (dashboard, growth, ops, people, fin)
├── login/           # Página de login
└── auth/callback/   # Callback OAuth Supabase
```

---

## Próximo passo sugerido

Começar pela **migração de conteúdo** (P1.1–1.3): extrair soluções e páginas legais do site legacy e popular o banco. Isso deixa o site público pronto para uso real.
