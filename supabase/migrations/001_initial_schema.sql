-- ness.OS + ness.WEB — Schema Inicial
-- Executar no Supabase SQL Editor

-- ENUMS
create type user_role as enum ('admin', 'sales', 'ops', 'fin', 'employee');

-- 1. USERS & PROFILES
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  role user_role default 'employee',
  avatar_url text
);

-- 2. CORE: CATÁLOGO DE SERVIÇOS (A Verdade Híbrida)
create table public.services_catalog (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  is_active boolean default false,
  -- Dados Técnicos (ness.OS)
  base_price numeric,
  technical_scope text,
  playbook_id uuid,
  -- Dados de Marketing (ness.WEB)
  marketing_pitch text,
  marketing_features jsonb,
  cover_image_url text
);

-- 3. MARKETING: CONTEÚDO (Blog/Cases)
create table public.public_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  content_markdown text,
  seo_description text,
  is_published boolean default false,
  published_at timestamp,
  author_id uuid references public.profiles(id)
);

-- 4. VENDAS: LEADS (Entrada via Site)
create table public.inbound_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  origin_url text,
  message text,
  status text default 'new',
  created_at timestamp default now()
);

-- RLS: Habilitar em todas as tabelas
alter table public.profiles enable row level security;
alter table public.services_catalog enable row level security;
alter table public.public_posts enable row level security;
alter table public.inbound_leads enable row level security;

-- POLICIES: public_posts (leitura pública só se publicado)
create policy "public_posts_read_published"
  on public.public_posts for select
  using (is_published = true);

create policy "public_posts_all_authenticated"
  on public.public_posts for all
  to authenticated
  using (true)
  with check (true);

-- POLICIES: services_catalog (leitura pública só se ativo)
create policy "services_catalog_read_active"
  on public.services_catalog for select
  using (is_active = true);

create policy "services_catalog_all_authenticated"
  on public.services_catalog for all
  to authenticated
  using (true)
  with check (true);

-- POLICIES: inbound_leads (insert anon, select só sales/admin)
create policy "inbound_leads_insert_anon"
  on public.inbound_leads for insert
  to anon
  with check (true);

create policy "inbound_leads_select_sales_admin"
  on public.inbound_leads for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.role in ('admin', 'sales')
    )
  );

create policy "inbound_leads_update_sales_admin"
  on public.inbound_leads for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.role in ('admin', 'sales')
    )
  );

-- POLICIES: profiles (cada um vê o próprio)
create policy "profiles_read_own"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Trigger: Criar profile ao registrar usuário
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
