-- Migration: 20260209000000_init_ness_data.sql

-- 1. Create Schema
create schema if not exists ness_data;

-- 2. Enable Vector Extension (if not enabled)
create extension if not exists vector with schema public;

-- 3. Create raw_events (Data Lake)
create table if not exists ness_data.raw_events (
    id uuid primary key default gen_random_uuid(),
    source text not null, -- e.g., 'web_hook', 'frontend', 'manual_import'
    event_type text not null, -- e.g., 'new_lead', 'page_view', 'error_log'
    payload jsonb not null default '{}'::jsonb,
    ingested_at timestamptz not null default now()
);

-- RLS for raw_events (Only service role or admin can insert/read initially)
alter table ness_data.raw_events enable row level security;

-- 4. Create unified_entities (Golden Records)
create type ness_data.entity_type as enum ('person', 'organization', 'project', 'contract');

create table if not exists ness_data.unified_entities (
    id uuid primary key default gen_random_uuid(),
    entity_type ness_data.entity_type not null,
    canonical_data jsonb not null default '{}'::jsonb,
    embedding vector(1536), -- Compatible with OpenAI embeddings
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- RLS for unified_entities
alter table ness_data.unified_entities enable row level security;

-- 5. Create data_gaps (Gap Tracking)
create table if not exists ness_data.data_gaps (
    id uuid primary key default gen_random_uuid(),
    module text not null, -- e.g., 'growth', 'ops', 'fin'
    missing_data text not null,
    impact text not null,
    status text not null default 'open', -- 'open', 'resolved', 'ignored'
    created_at timestamptz not null default now()
);

-- RLS for data_gaps
alter table ness_data.data_gaps enable row level security;

-- 6. Indexes for performance
create index if not exists idx_raw_events_source on ness_data.raw_events(source);
create index if not exists idx_raw_events_event_type on ness_data.raw_events(event_type);
create index if not exists idx_unified_entities_type on ness_data.unified_entities(entity_type);

-- 7. Comments for documentation
comment on schema ness_data is 'Central Data Lakehouse for ness.OS';
comment on table ness_data.raw_events is 'Stores immutable raw events from all sources.';
comment on table ness_data.unified_entities is 'Stores processed and unified entities (Golden Records).';
comment on table ness_data.data_gaps is 'Tracks identified data gaps per module as per brainstorming.';
