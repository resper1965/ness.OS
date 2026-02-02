# Seeds

## Opção 1: arquivo único (recomendado)

Use `complete_seed.sql` — um único arquivo com todos os seeds na ordem correta. Copie e execute no **Supabase SQL Editor**.

```bash
npm run seed:complete   # regenera complete_seed.sql
```

## Opção 2: arquivos separados

Executar no **Supabase SQL Editor** nesta ordem:

| Ordem | Arquivo | Conteúdo |
|-------|---------|----------|
| 1 | `000_playbooks_seed.sql` | Playbooks (obrigatório para services_catalog) |
| 2 | `002_corp_site_content.sql` | 11 soluções + 6 páginas legais (corp-site) |
| 3 | `003_blog_posts_seed.sql` | 3 posts do blog |
| 4 | `004_verify_seed.sql` | Verificação (contagens, legitima execução) |

**Nota:** `001_static_pages_legal.sql` é redundante com 002. Use 002 para conteúdo completo.

## Regenerar 002

```bash
# Requer _reference/corp-site-ness clonado
node scripts/seed-from-corp-site.js > supabase/seed/002_corp_site_content.sql
```

Ou: `npm run seed:generate`
