# Mapeamento corp-site-ness → ness.OS

**Fonte:** `_reference/corp-site-ness` (clonado de https://github.com/resper1965/corp-site-ness)  
**Idioma:** pt-BR apenas (i18n na próxima versão)

---

## Produtos/Soluções → services_catalog

| Slug (ness.OS)   | Nome     | Origem corp-site   |
|------------------|----------|--------------------|
| nsecops          | n.secops | products.json      |
| ninfraops        | n.infraops | products.json    |
| ndevarch         | n.devarch | products.json     |
| nautoops         | n.autoops | products.json     |
| ncirt            | n.cirt   | products.json      |
| nprivacy         | n.privacy | products.json     |
| nfaturasons      | n.faturasONS | products.json  |
| nflow            | n.flow   | products.json      |
| forense          | forense.io | products.json     |
| trustness        | trustness. | products.json    |
| trustness-dpo    | DPOaaS   | products.json (dpoaas) |

---

## Legais → static_pages

| Slug        | Título                    | Origem        |
|-------------|---------------------------|---------------|
| privacidade | Política de Privacidade   | legal.json    |
| termos      | Termos de Uso             | legal.json    |
| lgpd        | LGPD e Proteção de Dados  | legal.json    |
| cookies     | Política de Cookies       | legal.json    |
| compliance  | Compliance e Conformidade | legal.json    |
| certificacoes | Certificações e Prêmios | legal.json    |

---

## Rotas

| Rota corp-site   | Rota ness.OS       |
|------------------|--------------------|
| /nsecops         | /solucoes/nsecops  |
| /trustness       | /solucoes/trustness |
| /forense         | /solucoes/forense  |
| /trustness/dpo   | /solucoes/trustness-dpo |
| /privacy         | /legal/privacidade |
| /terms           | /legal/termos      |
| /lgpd            | /legal/lgpd        |
| /cookies         | /legal/cookies     |

---

## Seed

- **Script:** `node scripts/seed-from-corp-site.js`
- **Output:** `supabase/seed/002_corp_site_content.sql`
- **Executar:** Via Supabase Dashboard SQL Editor ou `psql` conectado ao projeto
