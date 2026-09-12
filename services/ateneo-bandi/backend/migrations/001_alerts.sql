create extension if not exists pgcrypto;

create table if not exists public.academic_alerts (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  filters jsonb not null default '{}'::jsonb,
  cadence text not null default 'daily' check (cadence in ('daily','weekly')),
  status text not null default 'pending' check (status in ('pending','confirmed','unsubscribed')),
  verify_token_hash text,
  verify_expires_at timestamptz,
  unsubscribe_token_hash text not null,
  created_at timestamptz not null default now(),
  confirmed_at timestamptz,
  last_sent_at timestamptz,
  unique (email, filters)
);

create table if not exists public.academic_alert_deliveries (
  alert_id uuid not null references public.academic_alerts(id) on delete cascade,
  call_id text not null,
  sent_at timestamptz not null default now(),
  primary key (alert_id, call_id)
);

alter table public.academic_alerts enable row level security;
alter table public.academic_alert_deliveries enable row level security;
-- Intentionally no public policies: only Edge Functions using the service role may access emails.
create index if not exists academic_alerts_digest_idx on public.academic_alerts(status, cadence, last_sent_at);
create index if not exists academic_alerts_verify_idx on public.academic_alerts(verify_token_hash) where status = 'pending';
