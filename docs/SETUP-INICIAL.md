# Setup Inicial — ness.OS + ness.WEB

## 1. Estrutura Criada

```
src/
├── app/
│   ├── (site)/              # Rotas públicas (marketing)
│   │   ├── layout.tsx       # Header + Footer
│   │   ├── page.tsx         # Home
│   │   ├── contato/         # Formulário de leads (Server Action)
│   │   └── solucoes/        # Lista + [slug] (Server Action getServiceBySlug)
│   ├── app/                 # Rotas privadas (ness.OS)
│   │   ├── layout.tsx       # Auth Guard + Sidebar
│   │   ├── page.tsx         # Dashboard
│   │   └── growth/services/ # CRUD serviços (placeholder)
│   ├── login/
│   ├── actions/             # Server Actions
│   │   ├── leads.ts         # submitLead (seguro, sem expor API no browser)
│   │   └── services.ts      # getServiceBySlug
│   └── layout.tsx
├── components/
│   ├── site/                # Site público
│   │   ├── site-header.tsx
│   │   ├── site-footer.tsx
│   │   └── contact-form.tsx
│   └── app/                 # Dashboard
│       └── app-sidebar.tsx
└── lib/
    ├── supabase/
    │   ├── server.ts        # createClient (Server Components/Actions)
    │   └── client.ts        # createClient (Client Components)
    └── utils.ts
```

## 2. SQL — Executar no Supabase

Na ordem, no SQL Editor do Supabase:

1. **001_initial_schema.sql** — profiles, services_catalog, public_posts, inbound_leads
2. **002_extend_services_static_pages.sql** — content_json, static_pages
3. **003_ops_fin_tables.sql** — playbooks, clients, contracts, performance_metrics
4. **004_people_tables.sql** — public_jobs, job_applications, training_gaps
5. **005_rentabilidade_view.sql** — view contract_rentability
6. **006_storage_os_assets.sql** — políticas Storage (criar bucket `os-assets` no Dashboard antes)

**Storage:** Dashboard > Storage > New bucket > `os-assets` (privado)

**Seed (opcional):** Após 002, executar `supabase/seed/001_static_pages_legal.sql` para privacidade e termos.

## 3. Variáveis de Ambiente

Copiar `.env.example` para `.env.local` e preencher:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=  # opcional, para server-side admin
```

## 4. Comandos

```bash
npm install
npm run dev
```

## 5. Regras de Segurança Implementadas

- **Zero Client-Side DB:** Site usa Server Actions e Server Components
- **submitLead:** Server Action; form não expõe API key
- **getServiceBySlug:** Retorna apenas campos de marketing (nunca base_price, technical_scope)
- **RLS:** Configurado no SQL
