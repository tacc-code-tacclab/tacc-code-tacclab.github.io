-- Ateneo Bandi: dedicated Supabase project only.
-- Target: blyqhuqalgduhbixunye (ateneo-bandi). Never apply to the game project.
-- Contains no recipient, credentials or delivery history. Seed these privately.
begin;
create schema if not exists ateneo_private;
revoke all on schema ateneo_private from public, anon, authenticated;
create table if not exists ateneo_private.digest_settings (
 id boolean primary key default true check (id),
 recipient text not null,
 enabled boolean not null default false,
 criteria jsonb not null check (jsonb_typeof(criteria) = 'object'),
 created_at timestamptz not null default now()
);
create table if not exists ateneo_private.digest_runs (
 id bigint generated always as identity primary key,
 run_date date not null unique,
 source_updated_at timestamptz,
 checked_at timestamptz not null default now(),
 status text not null check (status in ('prepared','sent','incomplete','failed')),
 report jsonb not null,
 gmail_message_id text,
 sent_at timestamptz
);
alter table ateneo_private.digest_settings enable row level security;
alter table ateneo_private.digest_runs enable row level security;
revoke all on all tables in schema ateneo_private from public, anon, authenticated;
revoke all on all sequences in schema ateneo_private from public, anon, authenticated;
alter default privileges in schema ateneo_private revoke all on tables from public, anon, authenticated;
alter default privileges in schema ateneo_private revoke all on sequences from public, anon, authenticated;
alter default privileges in schema ateneo_private revoke execute on functions from public, anon, authenticated;
commit;
