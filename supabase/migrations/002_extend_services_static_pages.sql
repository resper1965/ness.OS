-- Extensão services_catalog para páginas de serviço completas
alter table public.services_catalog add column if not exists content_json jsonb;

comment on column public.services_catalog.content_json is 'Estrutura: { hero, whyItMatters, useCases, resources, metrics, process, cta }';

-- Tabela static_pages para páginas legais
create table if not exists public.static_pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  seo_description text,
  content_json jsonb not null default '{}',
  last_updated date,
  created_at timestamp default now()
);

alter table public.static_pages enable row level security;

create policy "static_pages_read_all"
  on public.static_pages for select
  using (true);
