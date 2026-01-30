# Plano de Migração — Site Legacy para ness.OS

**Data:** 2025-01  
**Fonte:** `_reference/legacy_site/pages`  
**Destino:** `src/app/(site)/`

---

## 1. Varredura e Inventário

### 1.1 Estrutura de pastas do site antigo

```
pages/
├── _app.js, _document.js, _oauth-callback.js   # Não migrar (framework)
├── index.js                                    # Home
├── about.js                                    # Sobre
├── contact.js                                  # Contato
├── careers.js                                  # Carreiras (listagem)
├── blog.js                                     # Blog (listagem)
├── blog/[slug].js                              # Post dinâmico
├── services.js                                 # Serviços (listagem)
├── products.js                                 # Produtos (listagem)
├── products/[slug].js                          # Produto dinâmico (Supabase)
├── markets.js                                  # Mercados
├── verticals.js                                # Verticais (listagem)
│
├── [SERVIÇOS — 10 arquivos com layout idêntico]
├── nsecops.js, ninfraops.js, ndevarch.js
├── nautoops.js, ncirt.js, nprivacy.js
├── nfaturasons.js, nflow.js
├── trustness.js, forense.js
├── trustness/dpo.js, trustness/index.js
├── forense/index.js
│
├── [LEGAIS — 5 arquivos]
├── privacy.js, terms.js, lgpd.js, cookies.js, compliance.js
├── certifications.js
│
├── jobs/[slug]/apply.js                        # Candidatura vaga
├── ncirt/emergency.js                          # Emergência NCIRT
├── sitemap.xml.js
│
├── api/                                        # APIs (migrar para ness.OS)
└── admin/                                      # NÃO migrar (fica no ness.OS)
```

### 1.2 Reconhecimento de padrão

Foram analisadas páginas de **3 grupos**:

| Grupo | Páginas analisadas | Estrutura compartilhada |
|-------|--------------------|--------------------------|
| **Serviços** | nsecops.js, ninfraops.js, trustness.js | Hero → Por que importa → Casos de uso → Recursos → Métricas → Processo → CTA |
| **Conteúdo** | blog/[slug].js | Hero → Imagem → Conteúdo HTML → Tags → Related → CTA |
| **Produtos** | products/[slug].js | Hero → Features → Casos de uso → CTA (dados do Supabase) |

**Conclusão:** Serviços e Verticais (trustness, forense) têm **exatamente o mesmo layout**. O conteúdo vem de `public/locales/pt/products.json` (e equivalentes en/es).

---

## 2. Taxonomia — 4 tipos de página

| Tipo | Descrição | Exemplos | Estratégia |
|------|-----------|----------|------------|
| **1. Institucionais** | Layout único, migração 1:1 | Home, Sobre, Contato | Arquivos estáticos `page.tsx` |
| **2. Serviços/Soluções** | Layout repetido, mesma cara | nsecops, ninfraops, trustness… | **1 rota dinâmica** `/[slug]` + banco |
| **3. Conteúdo** | Layout repetido | Blog, Cases | **1 rota dinâmica** `/[slug]` + banco |
| **4. Legais** | Texto puro, seções | Privacidade, Termos, LGPD | **1 rota dinâmica** `/[slug]` ou arquivos estáticos |

---

## 3. Arquitetura proposta

### 3.1 Rotas no novo site (Next.js App Router)

| Rota | Tipo | Fonte de dados |
|------|------|----------------|
| `/` | Institucional | `(site)/page.tsx` |
| `/sobre` | Institucional | `(site)/sobre/page.tsx` |
| `/contato` | Institucional | `(site)/contato/page.tsx` |
| `/carreiras` | Listagem | `(site)/carreiras/page.tsx` + `public_jobs` |
| `/carreiras/[slug]/candidatar` | Formulário | `(site)/carreiras/[slug]/candidatar/page.tsx` |
| `/solucoes` | Listagem | `(site)/solucoes/page.tsx` + `services_catalog` |
| `/solucoes/[slug]` | **Dinâmica** | `(site)/solucoes/[slug]/page.tsx` + `services_catalog` |
| `/produtos` | Listagem | `(site)/produtos/page.tsx` + `products` |
| `/produtos/[slug]` | **Dinâmica** | `(site)/produtos/[slug]/page.tsx` + `products` |
| `/blog` | Listagem | `(site)/blog/page.tsx` + `public_posts` |
| `/blog/[slug]` | **Dinâmica** | `(site)/blog/[slug]/page.tsx` + `public_posts` |
| `/privacidade`, `/termos`, etc. | Legais | `(site)/legal/[slug]/page.tsx` + `static_pages` |

### 3.2 O truque: 1 arquivo, N páginas

**Antes (legacy):**
```
pages/nsecops.js
pages/ninfraops.js
pages/ndevarch.js
… (10+ arquivos)
```

**Depois (ness.OS):**
```
src/app/(site)/solucoes/[slug]/page.tsx   ← único arquivo
```

O conteúdo vem do banco. Ao acessar `/solucoes/nsecops`, o Next.js busca `slug='nsecops'` e renderiza o template.

---

## 4. Schema de banco — extensões necessárias

### 4.1 `services_catalog` (já existe — estender)

O schema atual tem: `name`, `slug`, `marketing_pitch`, `marketing_features`. Para o layout completo de serviço (Hero, Por que importa, Casos de uso, etc.) é preciso adicionar:

```sql
-- Extensão para páginas de serviço completas
alter table public.services_catalog add column if not exists
  content_json jsonb;
-- Estrutura: { hero, whyItMatters, useCases, resources, metrics, process, cta }
```

### 4.2 Nova tabela `static_pages` (páginas legais)

```sql
create table public.static_pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,           -- 'privacidade', 'termos', 'lgpd'
  title text not null,
  seo_description text,
  content_json jsonb not null,         -- { sections: [{ title, content, items?, note? }] }
  last_updated date,
  created_at timestamp default now()
);

alter table public.static_pages enable row level security;

create policy "static_pages_read_all"
  on public.static_pages for select
  using (true);
```

### 4.3 `public_posts` (já existe)

Compatível com blog. Campos: `slug`, `title`, `content_markdown`, `seo_description`, `is_published`, `published_at`, `author_id`.

### 4.4 `public_jobs` (a criar — PRD)

Para carreiras e candidaturas.

---

## 5. Componentes reutilizáveis (Blocos de Lego)

Extraídos do legacy, a implementar em `src/components/site/`:

| Componente | Descrição | Uso |
|------------|-----------|-----|
| `<HeroSection>` | Hero com título, subtítulo, CTA | Serviços, Sobre |
| `<ContentBlock>` | Título + parágrafos | Por que importa, texto institucional |
| `<FeatureGrid>` | Grid de cards com ícone | Recursos, valores |
| `<UseCasesGrid>` | Cards de casos de uso | Serviços |
| `<MetricsGrid>` | Valores numéricos em destaque | Serviços |
| `<ProcessSteps>` | Lista numerada (onboarding) | Serviços |
| `<CTABanner>` | Faixa com gradiente NESS | Todas as páginas de conversão |
| `<ProseContent>` | Conteúdo HTML/Markdown estilizado | Blog, Legais |

---

## 6. Fluxo de migração massiva

### Passo A: Inventário e extração ✅

- [x] Listar arquivos em `pages/`
- [x] Agrupar por tipo
- [x] Identificar padrões visuais

### Passo B: Criação de templates (componentização)

- [ ] Criar `<HeroSection>`, `<FeatureGrid>`, `<ContentBlock>`, `<CTABanner>`
- [ ] Criar template `SolucaoPageTemplate` que compõe esses blocos
- [ ] Criar template `BlogPostTemplate`
- [ ] Criar template `LegalPageTemplate`

### Passo C: Migração de dados (arquivo → banco)

**Serviços:** Extrair de `public/locales/pt/products.json` (e en, es) e gerar SQL INSERT para `services_catalog` com `content_json`.

**Legais:** Extrair de `public/locales/pt/legal.json` e gerar INSERT para `static_pages`.

**Blog:** Já em Supabase (`blog_posts`) — mapear para `public_posts` se schema diferir.

### Passo D: Rotas dinâmicas

- [ ] `solucoes/[slug]/page.tsx` — Server Component, `getServiceBySlug(slug)`
- [ ] `blog/[slug]/page.tsx` — Server Component, `getPostBySlug(slug)`
- [ ] `legal/[slug]/page.tsx` — Server Component, `getStaticPageBySlug(slug)`

---

## 7. Roteiro de Sprints

| Sprint | Foco | Entregas |
|--------|------|----------|
| **Sprint 1** | Base e páginas únicas | Layout global, Home, Sobre, Contato. Site “parece pronto”, links internos 404. |
| **Sprint 2** | Template de serviços | Extender `services_catalog`, rota `solucoes/[slug]`, componentes de bloco, migrar conteúdo de locales → SQL. |
| **Sprint 3** | Blog e conteúdo | Template blog, rota `blog/[slug]`, migrar/criar `public_posts`. |
| **Sprint 4** | Legais e refinamentos | Tabela `static_pages`, rota `legal/[slug]`, carreiras com `public_jobs`. |

---

## 8. Resumo executivo

- **~150 arquivos** no legacy → **~15 arquivos** no novo site.
- **Arquivos únicos:** Home, Sobre, Contato, listagens (solucoes, blog, carreiras, produtos).
- **Rotas dinâmicas:** `solucoes/[slug]`, `blog/[slug]`, `legal/[slug]`, `produtos/[slug]`, `carreiras/[slug]/candidatar`.
- **Dados no banco:** `services_catalog`, `public_posts`, `static_pages`, `public_jobs`.
- **Conteúdo legado:** Em `public/locales/*/products.json`, `legal.json` — extrair e gerar SQL INSERT.

---

## 9. Próxima ação imediata

Executar **Passo B** (componentização) criando os blocos base, e em seguida **Sprint 2** (template de serviços + rota dinâmica).
