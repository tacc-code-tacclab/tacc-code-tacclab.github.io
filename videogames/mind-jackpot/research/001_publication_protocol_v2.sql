-- MIND JACKPOT 2.0 — publication protocol
-- Private pre-generated target bank, prediction-before-reveal API, immutable audit trail,
-- prospective individual confirmation, and a privacy-minimised reporting snapshot.

create extension if not exists pgcrypto with schema extensions;

create schema if not exists mj_private;
revoke all on schema mj_private from public, anon, authenticated;

create table if not exists public.mj_v2_banks (
  bank_id uuid primary key,
  protocol_version text not null check (protocol_version = 'mind-jackpot-2.0.0'),
  asset_manifest_hash text not null check (asset_manifest_hash ~ '^[0-9a-f]{64}$'),
  deck_count integer not null check (deck_count between 1 and 100000),
  bank_root text check (bank_root ~ '^[0-9a-f]{64}$'),
  root_algorithm text not null default 'SHA-256(concat(deck_no:deck_commitment, LF))',
  rng_method text not null default 'pgcrypto gen_random_bytes; reject bytes >=252; accepted byte modulo 6',
  generated_at timestamptz not null default clock_timestamp(),
  sealed_at timestamptz,
  published_at timestamptz,
  publication_url text,
  active boolean not null default true,
  check ((sealed_at is null and bank_root is null) or (sealed_at is not null and bank_root is not null)),
  check ((published_at is null and publication_url is null) or (published_at is not null and publication_url is not null))
);

create table if not exists public.mj_v2_decks (
  bank_id uuid not null references public.mj_v2_banks(bank_id),
  deck_no integer not null check (deck_no > 0),
  targets smallint[] not null,
  salt text not null check (salt ~ '^[0-9a-f]{64}$'),
  deck_commitment text not null unique check (deck_commitment ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default clock_timestamp(),
  primary key (bank_id, deck_no),
  check (cardinality(targets) = 180),
  check (targets <@ array[0,1,2,3,4,5]::smallint[])
);

create table if not exists public.mj_v2_sessions (
  session_id uuid primary key default gen_random_uuid(),
  public_id text not null unique check (public_id ~ '^MJ2-[0-9A-F]{16}$'),
  client_nonce uuid not null unique,
  session_token_hash bytea not null,
  longitudinal_id text not null check (longitudinal_id ~ '^[0-9a-f]{64}$'),
  bank_id uuid not null,
  deck_no integer not null,
  deck_commitment text not null check (deck_commitment ~ '^[0-9a-f]{64}$'),
  asset_manifest_hash text not null check (asset_manifest_hash ~ '^[0-9a-f]{64}$'),
  participant jsonb not null,
  consents jsonb not null,
  client jsonb not null default '{}'::jsonb,
  assets_verified boolean not null,
  protocol_version text not null default 'mind-jackpot-2.0.0',
  status text not null default 'committed' check (status in ('committed','in_progress','paused','primary_complete','complete')),
  created_at timestamptz not null default clock_timestamp(),
  started_at timestamptz,
  primary_completed_at timestamptz,
  completed_at timestamptz,
  bonus_opt_in boolean,
  finish_mode text check (finish_mode in ('primary_only','primary_plus_bonus')),
  balance bigint not null default 0 check (balance >= 0),
  is_test boolean not null default false,
  foreign key (bank_id, deck_no) references public.mj_v2_decks(bank_id, deck_no)
);

create index if not exists mj_v2_sessions_longitudinal_idx on public.mj_v2_sessions(longitudinal_id, created_at);
create index if not exists mj_v2_sessions_primary_complete_idx on public.mj_v2_sessions(primary_completed_at) where not is_test;
create index if not exists mj_v2_sessions_deck_idx on public.mj_v2_sessions(bank_id, deck_no);

create table if not exists public.mj_v2_deck_assignments (
  bank_id uuid not null,
  deck_no integer not null,
  session_id uuid not null unique references public.mj_v2_sessions(session_id),
  assigned_at timestamptz not null default clock_timestamp(),
  primary key (bank_id, deck_no),
  foreign key (bank_id, deck_no) references public.mj_v2_decks(bank_id, deck_no)
);

create table if not exists public.mj_v2_trials (
  session_id uuid not null references public.mj_v2_sessions(session_id),
  round_index smallint not null check (round_index between 1 and 60),
  phase text not null check (phase in ('primary','bonus')),
  prediction smallint[] not null,
  target smallint[] not null,
  position_matches boolean[] not null,
  match_count smallint not null check (match_count between 0 and 3),
  response_ms integer check (response_ms between 0 and 3600000),
  prediction_locked_at timestamptz not null default clock_timestamp(),
  revealed_at timestamptz not null default clock_timestamp(),
  reward bigint not null check (reward in (0,10000,1000000,10000000)),
  balance_after bigint not null check (balance_after >= 0),
  primary key (session_id, round_index),
  check (cardinality(prediction) = 3 and prediction <@ array[0,1,2,3,4,5]::smallint[]),
  check (cardinality(target) = 3 and target <@ array[0,1,2,3,4,5]::smallint[]),
  check (cardinality(position_matches) = 3),
  check ((round_index <= 40 and phase = 'primary') or (round_index > 40 and phase = 'bonus'))
);

create index if not exists mj_v2_trials_phase_idx on public.mj_v2_trials(phase, round_index);

create table if not exists public.mj_v2_events (
  event_id bigint generated always as identity primary key,
  session_id uuid not null references public.mj_v2_sessions(session_id),
  event_type text not null,
  occurred_at timestamptz not null default clock_timestamp(),
  details jsonb not null default '{}'::jsonb
);

create index if not exists mj_v2_events_session_idx on public.mj_v2_events(session_id, occurred_at);

create table if not exists public.mj_v2_candidate_screenings (
  longitudinal_id text primary key check (longitudinal_id ~ '^[0-9a-f]{64}$'),
  discovery_session_id uuid not null unique references public.mj_v2_sessions(session_id),
  discovery_matches integer not null check (discovery_matches between 0 and 120),
  discovery_trials integer not null default 120 check (discovery_trials = 120),
  discovery_p_one_sided double precision not null check (discovery_p_one_sided between 0 and 1),
  screening_threshold double precision not null default 0.01,
  screened_at timestamptz not null default clock_timestamp(),
  is_exploratory_candidate boolean not null,
  flagged_at timestamptz,
  check (is_exploratory_candidate = (flagged_at is not null))
);

alter table public.mj_v2_banks enable row level security;
alter table public.mj_v2_decks enable row level security;
alter table public.mj_v2_sessions enable row level security;
alter table public.mj_v2_deck_assignments enable row level security;
alter table public.mj_v2_trials enable row level security;
alter table public.mj_v2_events enable row level security;
alter table public.mj_v2_candidate_screenings enable row level security;

revoke all on public.mj_v2_banks, public.mj_v2_decks, public.mj_v2_sessions,
  public.mj_v2_deck_assignments, public.mj_v2_trials, public.mj_v2_events,
  public.mj_v2_candidate_screenings from public, anon, authenticated;
grant select, insert, update on public.mj_v2_banks, public.mj_v2_sessions to service_role;
grant select, insert on public.mj_v2_decks, public.mj_v2_deck_assignments,
  public.mj_v2_trials, public.mj_v2_events, public.mj_v2_candidate_screenings to service_role;
grant usage, select on sequence public.mj_v2_events_event_id_seq to service_role;

create or replace function mj_private.reject_immutable_change()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
  raise exception 'MJ2_IMMUTABLE_RECORD';
end;
$$;

drop trigger if exists mj_v2_decks_immutable on public.mj_v2_decks;
create trigger mj_v2_decks_immutable
before update or delete on public.mj_v2_decks
for each row execute function mj_private.reject_immutable_change();

drop trigger if exists mj_v2_assignments_immutable on public.mj_v2_deck_assignments;
create trigger mj_v2_assignments_immutable
before update or delete on public.mj_v2_deck_assignments
for each row execute function mj_private.reject_immutable_change();

drop trigger if exists mj_v2_trials_immutable on public.mj_v2_trials;
create trigger mj_v2_trials_immutable
before update or delete on public.mj_v2_trials
for each row execute function mj_private.reject_immutable_change();

drop trigger if exists mj_v2_events_immutable on public.mj_v2_events;
create trigger mj_v2_events_immutable
before update or delete on public.mj_v2_events
for each row execute function mj_private.reject_immutable_change();

drop trigger if exists mj_v2_screenings_immutable on public.mj_v2_candidate_screenings;
create trigger mj_v2_screenings_immutable
before update or delete on public.mj_v2_candidate_screenings
for each row execute function mj_private.reject_immutable_change();

create or replace function mj_private.guard_sealed_bank()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
  if old.sealed_at is not null then
    if new.bank_id is distinct from old.bank_id
      or new.protocol_version is distinct from old.protocol_version
      or new.asset_manifest_hash is distinct from old.asset_manifest_hash
      or new.deck_count is distinct from old.deck_count
      or new.bank_root is distinct from old.bank_root
      or new.root_algorithm is distinct from old.root_algorithm
      or new.rng_method is distinct from old.rng_method
      or new.generated_at is distinct from old.generated_at
      or new.sealed_at is distinct from old.sealed_at then
      raise exception 'MJ2_SEALED_BANK_IMMUTABLE';
    end if;
    if old.published_at is not null and
      (new.published_at is distinct from old.published_at or new.publication_url is distinct from old.publication_url) then
      raise exception 'MJ2_PUBLICATION_RECORD_IMMUTABLE';
    end if;
    if old.active = false and new.active = true then
      raise exception 'MJ2_RETIRED_BANK_CANNOT_REACTIVATE';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists mj_v2_banks_guard on public.mj_v2_banks;
create trigger mj_v2_banks_guard
before update on public.mj_v2_banks
for each row execute function mj_private.guard_sealed_bank();

create or replace function mj_private.binomial_upper_tail(
  p_successes integer,
  p_trials integer,
  p_probability double precision
)
returns double precision
language plpgsql
immutable
strict
set search_path = pg_catalog
as $$
declare
  x integer;
  probability_x double precision;
  total double precision := 0;
begin
  if p_trials < 0 or p_successes < 0 or p_successes > p_trials or p_probability <= 0 or p_probability >= 1 then
    raise exception 'invalid binomial parameters';
  end if;
  probability_x := power(1.0 - p_probability, p_trials);
  for x in 0..p_trials loop
    if x >= p_successes then total := total + probability_x; end if;
    if x < p_trials then
      probability_x := probability_x * ((p_trials - x)::double precision / (x + 1)) * (p_probability / (1.0 - p_probability));
    end if;
  end loop;
  return least(1.0, greatest(0.0, total));
end;
$$;

create or replace function mj_private.wilson_lower(p_successes bigint, p_trials bigint)
returns double precision
language sql
immutable
strict
set search_path = pg_catalog
as $$
  select case when p_trials = 0 then null else
    greatest(0.0,
      ((p_successes::double precision / p_trials) + 3.841458820694124 / (2 * p_trials)
       - 1.959963984540054 * sqrt(
          ((p_successes::double precision / p_trials) * (1 - p_successes::double precision / p_trials) / p_trials)
          + 3.841458820694124 / (4 * p_trials * p_trials)
       )) / (1 + 3.841458820694124 / p_trials)
    ) end;
$$;

create or replace function mj_private.wilson_upper(p_successes bigint, p_trials bigint)
returns double precision
language sql
immutable
strict
set search_path = pg_catalog
as $$
  select case when p_trials = 0 then null else
    least(1.0,
      ((p_successes::double precision / p_trials) + 3.841458820694124 / (2 * p_trials)
       + 1.959963984540054 * sqrt(
          ((p_successes::double precision / p_trials) * (1 - p_successes::double precision / p_trials) / p_trials)
          + 3.841458820694124 / (4 * p_trials * p_trials)
       )) / (1 + 3.841458820694124 / p_trials)
    ) end;
$$;

create or replace function mj_private.create_bank(
  p_deck_count integer,
  p_asset_manifest_hash text
)
returns table(bank_id uuid, bank_root text, deck_count integer, generated_at timestamptz)
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  v_bank_id uuid := gen_random_uuid();
  v_deck_no integer;
  v_targets smallint[];
  v_bytes bytea;
  v_byte integer;
  v_i integer;
  v_salt text;
  v_payload text;
  v_commitment text;
  v_root text;
  v_generated_at timestamptz := clock_timestamp();
begin
  if p_deck_count < 1 or p_deck_count > 100000 then raise exception 'invalid deck count'; end if;
  if p_asset_manifest_hash !~ '^[0-9a-f]{64}$' then raise exception 'invalid asset manifest hash'; end if;

  insert into public.mj_v2_banks(bank_id, protocol_version, asset_manifest_hash, deck_count, generated_at)
  values (v_bank_id, 'mind-jackpot-2.0.0', p_asset_manifest_hash, p_deck_count, v_generated_at);

  for v_deck_no in 1..p_deck_count loop
    v_targets := array[]::smallint[];
    while cardinality(v_targets) < 180 loop
      v_bytes := extensions.gen_random_bytes(256);
      for v_i in 0..length(v_bytes)-1 loop
        v_byte := get_byte(v_bytes, v_i);
        if v_byte < 252 then
          v_targets := array_append(v_targets, (v_byte % 6)::smallint);
          exit when cardinality(v_targets) = 180;
        end if;
      end loop;
    end loop;
    v_salt := encode(extensions.gen_random_bytes(32), 'hex');
    v_payload := 'mind-jackpot-deck-2.0::' || v_bank_id::text || '::' || v_deck_no::text || '::' ||
      v_salt || '::' || array_to_string(v_targets, ',') || '::' || p_asset_manifest_hash;
    v_commitment := encode(extensions.digest(v_payload, 'sha256'), 'hex');
    insert into public.mj_v2_decks(bank_id, deck_no, targets, salt, deck_commitment)
    values (v_bank_id, v_deck_no, v_targets, v_salt, v_commitment);
  end loop;

  select encode(extensions.digest(string_agg(d.deck_no::text || ':' || d.deck_commitment, E'\n' order by d.deck_no), 'sha256'), 'hex')
  into v_root
  from public.mj_v2_decks d where d.bank_id = v_bank_id;

  update public.mj_v2_banks b set bank_root = v_root, sealed_at = clock_timestamp() where b.bank_id = v_bank_id;
  return query select v_bank_id, v_root, p_deck_count, v_generated_at;
end;
$$;

revoke all on function mj_private.create_bank(integer, text) from public, anon, authenticated;

create or replace function public.mj_v2_create_session(
  p_client_nonce uuid,
  p_token_hash text,
  p_longitudinal_id text,
  p_participant jsonb,
  p_consents jsonb,
  p_client jsonb,
  p_assets_verified boolean,
  p_is_test boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  v_existing public.mj_v2_sessions%rowtype;
  v_deck record;
  v_session_id uuid := gen_random_uuid();
  v_public_id text := 'MJ2-' || upper(encode(extensions.gen_random_bytes(8), 'hex'));
begin
  if p_token_hash !~ '^[0-9a-f]{64}$' or p_longitudinal_id !~ '^[0-9a-f]{64}$' then raise exception 'MJ2_INVALID_HASH'; end if;
  if p_participant is null or jsonb_typeof(p_participant) <> 'object' then raise exception 'MJ2_INVALID_PARTICIPANT'; end if;
  if p_consents is null or jsonb_typeof(p_consents) <> 'object' then raise exception 'MJ2_INVALID_CONSENT'; end if;
  if not p_assets_verified then raise exception 'MJ2_ASSET_VERIFICATION_REQUIRED'; end if;

  select * into v_existing from public.mj_v2_sessions where client_nonce = p_client_nonce;
  if found then
    if encode(v_existing.session_token_hash, 'hex') <> p_token_hash then raise exception 'MJ2_NONCE_CONFLICT'; end if;
    return jsonb_build_object(
      'public_id', v_existing.public_id,
      'deck_commitment', v_existing.deck_commitment,
      'bank_id', v_existing.bank_id,
      'deck_no', v_existing.deck_no,
      'asset_manifest_hash', v_existing.asset_manifest_hash,
      'created_at', v_existing.created_at,
      'status', v_existing.status
    );
  end if;

  select b.bank_id, b.asset_manifest_hash, b.bank_root, b.publication_url, d.deck_no, d.deck_commitment
  into v_deck
  from public.mj_v2_banks b
  join public.mj_v2_decks d on d.bank_id = b.bank_id
  left join public.mj_v2_deck_assignments a on a.bank_id = d.bank_id and a.deck_no = d.deck_no
  where b.active and b.sealed_at is not null and b.published_at is not null and a.session_id is null
  order by b.generated_at, d.deck_no
  for update of d skip locked
  limit 1;
  if not found then raise exception 'MJ2_NO_PRECOMMITTED_DECK_AVAILABLE'; end if;

  insert into public.mj_v2_sessions(
    session_id, public_id, client_nonce, session_token_hash, longitudinal_id,
    bank_id, deck_no, deck_commitment, asset_manifest_hash, participant,
    consents, client, assets_verified, is_test
  ) values (
    v_session_id, v_public_id, p_client_nonce, decode(p_token_hash, 'hex'), p_longitudinal_id,
    v_deck.bank_id, v_deck.deck_no, v_deck.deck_commitment, v_deck.asset_manifest_hash,
    p_participant, p_consents, coalesce(p_client, '{}'::jsonb), p_assets_verified, p_is_test
  );
  insert into public.mj_v2_deck_assignments(bank_id, deck_no, session_id) values (v_deck.bank_id, v_deck.deck_no, v_session_id);
  insert into public.mj_v2_events(session_id, event_type, details)
  values (v_session_id, 'session_committed', jsonb_build_object('bank_root', v_deck.bank_root, 'publication_url', v_deck.publication_url));

  return jsonb_build_object(
    'public_id', v_public_id,
    'deck_commitment', v_deck.deck_commitment,
    'bank_id', v_deck.bank_id,
    'deck_no', v_deck.deck_no,
    'bank_root', v_deck.bank_root,
    'precommitment_url', v_deck.publication_url,
    'asset_manifest_hash', v_deck.asset_manifest_hash,
    'created_at', (select created_at from public.mj_v2_sessions where session_id = v_session_id),
    'status', 'committed'
  );
end;
$$;

create or replace function public.mj_v2_reveal_round(
  p_public_id text,
  p_token_hash text,
  p_round_index integer,
  p_prediction smallint[],
  p_response_ms integer
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  v_session public.mj_v2_sessions%rowtype;
  v_existing public.mj_v2_trials%rowtype;
  v_targets smallint[];
  v_target smallint[];
  v_matches boolean[];
  v_match_count smallint;
  v_reward bigint;
  v_balance bigint;
  v_expected integer;
  v_base integer;
begin
  if p_token_hash !~ '^[0-9a-f]{64}$' then raise exception 'MJ2_INVALID_TOKEN'; end if;
  if p_round_index < 1 or p_round_index > 60 then raise exception 'MJ2_INVALID_ROUND'; end if;
  if cardinality(p_prediction) <> 3 or not (p_prediction <@ array[0,1,2,3,4,5]::smallint[]) then raise exception 'MJ2_INVALID_PREDICTION'; end if;
  if p_response_ms is not null and (p_response_ms < 0 or p_response_ms > 3600000) then raise exception 'MJ2_INVALID_RESPONSE_TIME'; end if;

  select * into v_session from public.mj_v2_sessions
  where public_id = p_public_id and encode(session_token_hash, 'hex') = p_token_hash
  for update;
  if not found then raise exception 'MJ2_SESSION_NOT_FOUND'; end if;
  if v_session.status = 'complete' then raise exception 'MJ2_SESSION_COMPLETE'; end if;

  select * into v_existing from public.mj_v2_trials where session_id = v_session.session_id and round_index = p_round_index;
  if found then
    if v_existing.prediction <> p_prediction then raise exception 'MJ2_PREDICTION_ALREADY_LOCKED'; end if;
    return jsonb_build_object(
      'round_index', v_existing.round_index, 'phase', v_existing.phase,
      'prediction', v_existing.prediction, 'target', v_existing.target,
      'position_matches', v_existing.position_matches, 'match_count', v_existing.match_count,
      'reward', v_existing.reward, 'balance_after', v_existing.balance_after,
      'prediction_locked_at', v_existing.prediction_locked_at, 'revealed_at', v_existing.revealed_at,
      'status', v_session.status, 'idempotent', true
    );
  end if;

  select coalesce(max(round_index), 0) + 1 into v_expected from public.mj_v2_trials where session_id = v_session.session_id;
  if p_round_index <> v_expected then raise exception 'MJ2_EXPECTED_ROUND_%', v_expected; end if;
  if p_round_index > 40 and v_session.bonus_opt_in is distinct from true then raise exception 'MJ2_BONUS_NOT_STARTED'; end if;

  select targets into v_targets from public.mj_v2_decks where bank_id = v_session.bank_id and deck_no = v_session.deck_no;
  v_base := (p_round_index - 1) * 3;
  v_target := array[v_targets[v_base + 1], v_targets[v_base + 2], v_targets[v_base + 3]]::smallint[];
  v_matches := array[
    p_prediction[1] = v_target[1],
    p_prediction[2] = v_target[2],
    p_prediction[3] = v_target[3]
  ];
  v_match_count := (v_matches[1]::integer + v_matches[2]::integer + v_matches[3]::integer)::smallint;
  v_reward := case v_match_count when 3 then 10000000 when 2 then 1000000 when 1 then 10000 else 0 end;
  v_balance := v_session.balance + v_reward;

  insert into public.mj_v2_trials(
    session_id, round_index, phase, prediction, target, position_matches,
    match_count, response_ms, reward, balance_after
  ) values (
    v_session.session_id, p_round_index, case when p_round_index <= 40 then 'primary' else 'bonus' end,
    p_prediction, v_target, v_matches, v_match_count, p_response_ms, v_reward, v_balance
  ) returning * into v_existing;

  update public.mj_v2_sessions set
    status = case when p_round_index = 60 then 'complete' when p_round_index = 40 then 'primary_complete' else 'in_progress' end,
    started_at = coalesce(started_at, v_existing.prediction_locked_at),
    primary_completed_at = case when p_round_index = 40 then v_existing.revealed_at else primary_completed_at end,
    completed_at = case when p_round_index = 60 then v_existing.revealed_at else completed_at end,
    finish_mode = case when p_round_index = 60 then 'primary_plus_bonus' else finish_mode end,
    balance = v_balance
  where session_id = v_session.session_id;
  insert into public.mj_v2_events(session_id, event_type, details)
  values (v_session.session_id, 'round_revealed', jsonb_build_object('round_index', p_round_index));

  return jsonb_build_object(
    'round_index', p_round_index,
    'phase', case when p_round_index <= 40 then 'primary' else 'bonus' end,
    'prediction', p_prediction, 'target', v_target,
    'position_matches', v_matches, 'match_count', v_match_count,
    'reward', v_reward, 'balance_after', v_balance,
    'prediction_locked_at', v_existing.prediction_locked_at, 'revealed_at', v_existing.revealed_at,
    'status', case when p_round_index = 60 then 'complete' when p_round_index = 40 then 'primary_complete' else 'in_progress' end,
    'idempotent', false
  );
end;
$$;

create or replace function public.mj_v2_start_bonus(p_public_id text, p_token_hash text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare v_session public.mj_v2_sessions%rowtype; v_rounds integer;
begin
  select * into v_session from public.mj_v2_sessions
  where public_id = p_public_id and encode(session_token_hash, 'hex') = p_token_hash for update;
  if not found then raise exception 'MJ2_SESSION_NOT_FOUND'; end if;
  select count(*) into v_rounds from public.mj_v2_trials where session_id = v_session.session_id;
  if v_rounds <> 40 or v_session.primary_completed_at is null or v_session.status = 'complete' then raise exception 'MJ2_BONUS_NOT_AVAILABLE'; end if;
  update public.mj_v2_sessions set bonus_opt_in = true, status = 'in_progress' where session_id = v_session.session_id;
  insert into public.mj_v2_events(session_id, event_type) values (v_session.session_id, 'bonus_started');
  return jsonb_build_object('ok', true, 'status', 'in_progress', 'next_round', 41);
end;
$$;

create or replace function public.mj_v2_finish_session(p_public_id text, p_token_hash text, p_finish_mode text)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  v_session public.mj_v2_sessions%rowtype;
  v_deck public.mj_v2_decks%rowtype;
  v_rounds integer;
  v_verified text;
begin
  select * into v_session from public.mj_v2_sessions
  where public_id = p_public_id and encode(session_token_hash, 'hex') = p_token_hash for update;
  if not found then raise exception 'MJ2_SESSION_NOT_FOUND'; end if;
  select count(*) into v_rounds from public.mj_v2_trials where session_id = v_session.session_id;
  if p_finish_mode = 'primary_only' and v_rounds = 40 then
    update public.mj_v2_sessions set status = 'complete', completed_at = coalesce(completed_at, clock_timestamp()),
      bonus_opt_in = false, finish_mode = 'primary_only' where session_id = v_session.session_id;
  elsif p_finish_mode = 'primary_plus_bonus' and v_rounds = 60 then
    update public.mj_v2_sessions set status = 'complete', completed_at = coalesce(completed_at, clock_timestamp()),
      bonus_opt_in = true, finish_mode = 'primary_plus_bonus' where session_id = v_session.session_id;
  elsif v_session.status <> 'complete' then
    raise exception 'MJ2_CANNOT_FINISH_AT_ROUND_%', v_rounds;
  end if;

  select * into v_deck from public.mj_v2_decks where bank_id = v_session.bank_id and deck_no = v_session.deck_no;
  v_verified := encode(extensions.digest(
    'mind-jackpot-deck-2.0::' || v_session.bank_id::text || '::' || v_session.deck_no::text || '::' ||
    v_deck.salt || '::' || array_to_string(v_deck.targets, ',') || '::' || v_session.asset_manifest_hash,
    'sha256'), 'hex');
  insert into public.mj_v2_events(session_id, event_type, details)
  values (v_session.session_id, 'session_completed', jsonb_build_object('finish_mode', p_finish_mode, 'rounds', v_rounds));
  return jsonb_build_object(
    'ok', true, 'status', 'complete', 'finish_mode', p_finish_mode,
    'rounds', v_rounds, 'deck_salt', v_deck.salt, 'target_deck', v_deck.targets,
    'deck_commitment', v_deck.deck_commitment, 'commitment_verified_server', v_verified = v_deck.deck_commitment,
    'completed_at', (select completed_at from public.mj_v2_sessions where session_id = v_session.session_id)
  );
end;
$$;

create or replace function public.mj_v2_resume_session(p_public_id text, p_token_hash text)
returns jsonb
language plpgsql
security definer
stable
set search_path = public, pg_temp
as $$
declare v_session public.mj_v2_sessions%rowtype; v_trials jsonb; v_deck jsonb := null;
begin
  select * into v_session from public.mj_v2_sessions
  where public_id = p_public_id and encode(session_token_hash, 'hex') = p_token_hash;
  if not found then raise exception 'MJ2_SESSION_NOT_FOUND'; end if;
  select coalesce(jsonb_agg(jsonb_build_object(
    'round_index', t.round_index, 'phase', t.phase, 'prediction', t.prediction, 'target', t.target,
    'position_matches', t.position_matches, 'match_count', t.match_count, 'response_ms', t.response_ms,
    'prediction_locked_at', t.prediction_locked_at, 'revealed_at', t.revealed_at,
    'reward', t.reward, 'balance_after', t.balance_after
  ) order by t.round_index), '[]'::jsonb) into v_trials
  from public.mj_v2_trials t where t.session_id = v_session.session_id;
  if v_session.status = 'complete' then
    select jsonb_build_object('deck_salt', d.salt, 'target_deck', d.targets) into v_deck
    from public.mj_v2_decks d where d.bank_id = v_session.bank_id and d.deck_no = v_session.deck_no;
  end if;
  return jsonb_build_object(
    'public_id', v_session.public_id, 'status', v_session.status, 'created_at', v_session.created_at,
    'primary_completed_at', v_session.primary_completed_at, 'completed_at', v_session.completed_at,
    'bonus_opt_in', v_session.bonus_opt_in, 'finish_mode', v_session.finish_mode,
    'balance', v_session.balance, 'bank_id', v_session.bank_id, 'deck_no', v_session.deck_no,
    'deck_commitment', v_session.deck_commitment, 'asset_manifest_hash', v_session.asset_manifest_hash,
    'trials', v_trials, 'reveal', v_deck
  );
end;
$$;

revoke all on function public.mj_v2_create_session(uuid,text,text,jsonb,jsonb,jsonb,boolean,boolean) from public, anon, authenticated;
revoke all on function public.mj_v2_reveal_round(text,text,integer,smallint[],integer) from public, anon, authenticated;
revoke all on function public.mj_v2_start_bonus(text,text) from public, anon, authenticated;
revoke all on function public.mj_v2_finish_session(text,text,text) from public, anon, authenticated;
revoke all on function public.mj_v2_resume_session(text,text) from public, anon, authenticated;
grant execute on function public.mj_v2_create_session(uuid,text,text,jsonb,jsonb,jsonb,boolean,boolean) to service_role;
grant execute on function public.mj_v2_reveal_round(text,text,integer,smallint[],integer) to service_role;
grant execute on function public.mj_v2_start_bonus(text,text) to service_role;
grant execute on function public.mj_v2_finish_session(text,text,text) to service_role;
grant execute on function public.mj_v2_resume_session(text,text) to service_role;

create or replace function mj_private.screen_first_complete_session()
returns trigger
language plpgsql
security definer
set search_path = public, mj_private, pg_temp
as $$
declare v_matches integer; v_p double precision; v_candidate boolean;
begin
  if old.primary_completed_at is null and new.primary_completed_at is not null and not new.is_test then
    if not exists (select 1 from public.mj_v2_candidate_screenings where longitudinal_id = new.longitudinal_id) then
      select coalesce(sum(match_count), 0) into v_matches from public.mj_v2_trials
      where session_id = new.session_id and phase = 'primary';
      v_p := mj_private.binomial_upper_tail(v_matches, 120, 1.0/6.0);
      v_candidate := v_p <= 0.01;
      insert into public.mj_v2_candidate_screenings(
        longitudinal_id, discovery_session_id, discovery_matches, discovery_p_one_sided,
        is_exploratory_candidate, flagged_at
      ) values (
        new.longitudinal_id, new.session_id, v_matches, v_p, v_candidate,
        case when v_candidate then clock_timestamp() else null end
      ) on conflict (longitudinal_id) do nothing;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists mj_v2_screen_first_complete on public.mj_v2_sessions;
create trigger mj_v2_screen_first_complete
after update of primary_completed_at on public.mj_v2_sessions
for each row execute function mj_private.screen_first_complete_session();

create or replace view public.mj_v2_session_analysis
with (security_invoker = true)
as
select
  s.session_id,
  s.public_id,
  'P-' || upper(substr(s.longitudinal_id, 1, 10)) as participant_code,
  s.longitudinal_id,
  s.created_at,
  s.primary_completed_at,
  s.completed_at,
  s.status,
  s.finish_mode,
  s.participant,
  s.assets_verified,
  s.is_test,
  count(t.*) filter (where t.phase = 'primary')::integer as primary_rounds,
  coalesce(sum(t.match_count) filter (where t.phase = 'primary'), 0)::integer as primary_matches,
  count(t.*) filter (where t.phase = 'bonus')::integer as bonus_rounds,
  coalesce(sum(t.match_count) filter (where t.phase = 'bonus'), 0)::integer as bonus_matches
from public.mj_v2_sessions s
left join public.mj_v2_trials t on t.session_id = s.session_id
group by s.session_id;

revoke all on public.mj_v2_session_analysis from public, anon, authenticated;
grant select on public.mj_v2_session_analysis to service_role;

create or replace view public.mj_v2_candidate_report
with (security_invoker = true)
as
with candidate_base as (
  select
    c.*,
    'P-' || upper(substr(c.longitudinal_id, 1, 10)) as participant_code,
    s.participant as discovery_context
  from public.mj_v2_candidate_screenings c
  join public.mj_v2_sessions s on s.session_id = c.discovery_session_id
  where c.is_exploratory_candidate
), confirmation as (
  select
    c.longitudinal_id,
    count(a.*) filter (where a.primary_completed_at is not null)::integer as confirmation_sessions,
    coalesce(sum(a.primary_matches) filter (where a.primary_completed_at is not null), 0)::integer as confirmation_matches,
    (count(a.*) filter (where a.primary_completed_at is not null) * 120)::integer as confirmation_trials,
    count(a.*) filter (
      where a.primary_completed_at is null and a.created_at < clock_timestamp() - interval '24 hours'
    )::integer as stale_incomplete_sessions
  from candidate_base c
  left join public.mj_v2_session_analysis a
    on a.longitudinal_id = c.longitudinal_id and a.created_at > c.flagged_at and not a.is_test
  group by c.longitudinal_id
), raw_tests as (
  select
    x.*,
    case when x.confirmation_sessions >= 2 and x.stale_incomplete_sessions = 0
      then mj_private.binomial_upper_tail(x.confirmation_matches, x.confirmation_trials, 1.0/6.0)
      else null end as confirmation_p_raw
  from confirmation x
), ranked as (
  select r.*,
    row_number() over (order by r.confirmation_p_raw, r.longitudinal_id) as p_rank,
    count(*) over () as tests_performed
  from raw_tests r where r.confirmation_p_raw is not null
), adjusted as (
  select r.*,
    least(1.0, max((r.tests_performed - r.p_rank + 1) * r.confirmation_p_raw)
      over (order by r.confirmation_p_raw, r.longitudinal_id rows between unbounded preceding and current row)) as confirmation_p_holm
  from ranked r
)
select
  c.participant_code,
  c.discovery_session_id,
  c.discovery_matches,
  c.discovery_p_one_sided,
  c.screened_at,
  c.flagged_at,
  jsonb_build_object(
    'age_band', c.discovery_context->>'age_band',
    'gender', c.discovery_context->>'gender',
    'alcohol_12h', c.discovery_context->>'alcohol_12h',
    'psychoactive_12h', c.discovery_context->>'psychoactive_12h',
    'attention_medication', c.discovery_context->>'attention_medication',
    'caffeine_4h', c.discovery_context->>'caffeine_4h',
    'physical_presence', c.discovery_context->>'physical_presence',
    'observer_attention', c.discovery_context->>'observer_attention',
    'observer_relationship', c.discovery_context->>'observer_relationship'
  ) as discovery_context,
  x.confirmation_sessions,
  x.confirmation_matches,
  x.confirmation_trials,
  x.stale_incomplete_sessions,
  a.confirmation_p_raw,
  a.confirmation_p_holm,
  case
    when x.stale_incomplete_sessions > 0 then 'confirmation_invalid_incomplete_session'
    when x.confirmation_sessions < 2 then 'awaiting_two_prospective_sessions'
    when a.confirmation_p_holm <= 0.05 and x.confirmation_matches::double precision / x.confirmation_trials > 1.0/6.0 then 'prospectively_above_chance'
    else 'no_confirmatory_evidence'
  end as evidence_status
from candidate_base c
join confirmation x using (longitudinal_id)
left join adjusted a using (longitudinal_id);

revoke all on public.mj_v2_candidate_report from public, anon, authenticated;
grant select on public.mj_v2_candidate_report to service_role;

create or replace function public.mj_v2_report_snapshot()
returns jsonb
language plpgsql
security definer
stable
set search_path = public, mj_private, pg_temp
as $$
declare
  v_sessions bigint;
  v_participants bigint;
  v_matches bigint;
  v_trials bigint;
  v_bonus_matches bigint;
  v_bonus_trials bigint;
  v_demographics jsonb;
  v_candidates jsonb;
  v_targets jsonb;
  v_predictions jsonb;
  v_bank jsonb;
  v_legacy_sessions bigint;
  v_legacy_trials bigint;
begin
  with eligible as (
    select * from public.mj_v2_session_analysis
    where primary_completed_at is not null and not is_test and assets_verified and primary_rounds = 40
  )
  select count(*), count(distinct longitudinal_id), coalesce(sum(primary_matches),0), count(*)*120,
    coalesce(sum(bonus_matches),0), coalesce(sum(bonus_rounds),0)*3
  into v_sessions, v_participants, v_matches, v_trials, v_bonus_matches, v_bonus_trials from eligible;

  with eligible as (
    select participant from public.mj_v2_session_analysis
    where primary_completed_at is not null and not is_test and assets_verified and primary_rounds = 40
  )
  select jsonb_build_object(
    'age_band', (select coalesce(jsonb_object_agg(label,n order by label),'{}'::jsonb) from (select coalesce(participant->>'age_band','Missing') label,count(*) n from eligible group by 1) q),
    'gender', (select coalesce(jsonb_object_agg(label,n order by label),'{}'::jsonb) from (select coalesce(nullif(participant->>'gender',''),'Prefer not to say') label,count(*) n from eligible group by 1) q),
    'alcohol_12h', (select coalesce(jsonb_object_agg(label,n order by label),'{}'::jsonb) from (select coalesce(participant->>'alcohol_12h','Missing') label,count(*) n from eligible group by 1) q),
    'psychoactive_12h', (select coalesce(jsonb_object_agg(label,n order by label),'{}'::jsonb) from (select coalesce(participant->>'psychoactive_12h','Missing') label,count(*) n from eligible group by 1) q),
    'attention_medication', (select coalesce(jsonb_object_agg(label,n order by label),'{}'::jsonb) from (select coalesce(participant->>'attention_medication','Missing') label,count(*) n from eligible group by 1) q),
    'caffeine_4h', (select coalesce(jsonb_object_agg(label,n order by label),'{}'::jsonb) from (select coalesce(participant->>'caffeine_4h','Missing') label,count(*) n from eligible group by 1) q),
    'physical_presence', (select coalesce(jsonb_object_agg(label,n order by label),'{}'::jsonb) from (select coalesce(participant->>'physical_presence','Missing') label,count(*) n from eligible group by 1) q),
    'observer_attention', (select coalesce(jsonb_object_agg(label,n order by label),'{}'::jsonb) from (select coalesce(participant->>'observer_attention','Missing') label,count(*) n from eligible group by 1) q),
    'observer_relationship', (select coalesce(jsonb_object_agg(label,n order by label),'{}'::jsonb) from (select coalesce(participant->>'observer_relationship','Missing') label,count(*) n from eligible group by 1) q),
    'gaming', (select coalesce(jsonb_object_agg(label,n order by label),'{}'::jsonb) from (select coalesce(participant->>'gaming','Missing') label,count(*) n from eligible group by 1) q),
    'gambling', (select coalesce(jsonb_object_agg(label,n order by label),'{}'::jsonb) from (select coalesce(participant->>'gambling','Missing') label,count(*) n from eligible group by 1) q),
    'prior_belief', (select coalesce(jsonb_object_agg(label,n order by label),'{}'::jsonb) from (select coalesce(participant->>'prior_belief','Missing') label,count(*) n from eligible group by 1) q),
    'alertness', (select coalesce(jsonb_object_agg(label,n order by label),'{}'::jsonb) from (select coalesce(participant->>'alertness','Missing') label,count(*) n from eligible group by 1) q),
    'sleep_quality', (select coalesce(jsonb_object_agg(label,n order by label),'{}'::jsonb) from (select coalesce(participant->>'sleep_quality','Missing') label,count(*) n from eligible group by 1) q)
  ) into v_demographics;

  select coalesce(jsonb_agg(to_jsonb(c) order by c.flagged_at), '[]'::jsonb) into v_candidates
  from public.mj_v2_candidate_report c;

  with eligible_sessions as (
    select session_id from public.mj_v2_session_analysis
    where primary_completed_at is not null and not is_test and assets_verified and primary_rounds = 40
  ), counts as (
    select u.symbol::text label, count(*) n
    from public.mj_v2_trials t join eligible_sessions e using (session_id)
    cross join lateral unnest(t.target) u(symbol)
    where t.phase='primary' group by u.symbol
  ) select coalesce(jsonb_object_agg(label,n order by label),'{}'::jsonb) into v_targets from counts;

  with eligible_sessions as (
    select session_id from public.mj_v2_session_analysis
    where primary_completed_at is not null and not is_test and assets_verified and primary_rounds = 40
  ), counts as (
    select u.symbol::text label, count(*) n
    from public.mj_v2_trials t join eligible_sessions e using (session_id)
    cross join lateral unnest(t.prediction) u(symbol)
    where t.phase='primary' group by u.symbol
  ) select coalesce(jsonb_object_agg(label,n order by label),'{}'::jsonb) into v_predictions from counts;

  select coalesce(jsonb_agg(jsonb_build_object(
    'bank_id', b.bank_id, 'bank_root', b.bank_root, 'deck_count', b.deck_count,
    'assigned_decks', (select count(*) from public.mj_v2_deck_assignments a where a.bank_id=b.bank_id),
    'generated_at', b.generated_at, 'sealed_at', b.sealed_at, 'published_at', b.published_at,
    'publication_url', b.publication_url, 'asset_manifest_hash', b.asset_manifest_hash,
    'rng_method', b.rng_method
  ) order by b.generated_at), '[]'::jsonb) into v_bank from public.mj_v2_banks b;

  select count(*) into v_legacy_sessions from public.mj_sessions;
  select count(*) into v_legacy_trials from public.mj_trials;

  return jsonb_build_object(
    'schema', 'mind-jackpot-report-snapshot-2.0',
    'generated_at', clock_timestamp(),
    'analysis_policy', jsonb_build_object(
      'primary_population', 'All non-test v2 sessions completing 40 primary rounds with verified assets',
      'chance_probability_per_position', 1.0/6.0,
      'population_test', 'Exact one-sided binomial test; Wilson 95% confidence interval',
      'individual_discovery', 'First completed primary session only; exploratory candidate if one-sided p <= 0.01',
      'individual_confirmation', 'At least two sessions created after flag; no stale incomplete session; Holm correction across performed tests',
      'language_guardrail', 'Report above-chance performance, never that a person has or proves a premonition ability',
      'covariates', 'Descriptive and exploratory only; no causal claims; suppress sparse groups'
    ),
    'recruitment', jsonb_build_object(
      'v2_sessions_created', (select count(*) from public.mj_v2_sessions where not is_test),
      'v2_sessions_started', (select count(distinct session_id) from public.mj_v2_trials t join public.mj_v2_sessions s using(session_id) where not s.is_test),
      'v2_primary_complete', v_sessions,
      'v2_unique_pseudonymous_participants', v_participants,
      'v2_no_rounds', (select count(*) from public.mj_v2_sessions where not is_test and started_at is null),
      'v2_incomplete_after_start', (select count(*) from public.mj_v2_sessions where not is_test and started_at is not null and primary_completed_at is null),
      'legacy_pilot_sessions_excluded', v_legacy_sessions,
      'legacy_pilot_trials_excluded', v_legacy_trials,
      'test_sessions_excluded', (select count(*) from public.mj_v2_sessions where is_test)
    ),
    'primary_population', jsonb_build_object(
      'sessions', v_sessions, 'participants', v_participants,
      'matches', v_matches, 'trials', v_trials,
      'observed_rate', case when v_trials=0 then null else v_matches::double precision/v_trials end,
      'chance_rate', 1.0/6.0,
      'expected_matches', v_trials/6.0,
      'excess_matches', v_matches-v_trials/6.0,
      'ci95_wilson_lower', case when v_trials=0 then null else mj_private.wilson_lower(v_matches,v_trials) end,
      'ci95_wilson_upper', case when v_trials=0 then null else mj_private.wilson_upper(v_matches,v_trials) end,
      'p_one_sided_exact', case when v_trials=0 then null else mj_private.binomial_upper_tail(v_matches::integer,v_trials::integer,1.0/6.0) end
    ),
    'bonus_descriptive', jsonb_build_object(
      'matches', v_bonus_matches, 'trials', v_bonus_trials,
      'observed_rate', case when v_bonus_trials=0 then null else v_bonus_matches::double precision/v_bonus_trials end
    ),
    'participant_descriptives', v_demographics,
    'exploratory_candidates', v_candidates,
    'randomisation_qc', jsonb_build_object(
      'target_counts_by_symbol_index', v_targets,
      'prediction_counts_by_symbol_index', v_predictions,
      'note', 'Outcome-count tests are diagnostics, not proof of randomness; proof rests on the documented CSPRNG, rejection sampling, immutable bank and public precommitment.'
    ),
    'precommitted_banks', v_bank
  );
end;
$$;

revoke all on function public.mj_v2_report_snapshot() from public, anon, authenticated;
grant execute on function public.mj_v2_report_snapshot() to service_role;

comment on table public.mj_v2_decks is 'Private pre-generated target decks. Targets and salts are never exposed to browser clients before the corresponding round or completed-session reveal.';
comment on table public.mj_v2_trials is 'Append-only authoritative records; prediction and target are inserted atomically before the server returns the reveal.';
comment on view public.mj_v2_candidate_report is 'Exploratory first-session screening followed by prospective, multiplicity-corrected confirmation. Evidence status must not be described as proof of premonition.';
