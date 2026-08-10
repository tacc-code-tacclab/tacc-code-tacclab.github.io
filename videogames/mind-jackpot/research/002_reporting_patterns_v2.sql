-- MIND JACKPOT 2.0 — privacy-minimised descriptive pattern snapshot.
-- Patterns are descriptive only and never establish the presence or absence of premonition.

create or replace function public.mj_v2_pattern_snapshot()
returns jsonb
language sql
security definer
stable
set search_path = public, mj_private, pg_temp
as $$
with
group_catalog(group_name, group_label) as (
  values
    ('all_eligible'::text, 'All eligible participants'::text),
    ('prospectively_above_chance', 'Prospectively above chance'::text),
    ('exploratory_candidate_unconfirmed', 'Exploratory candidate, not confirmed'::text),
    ('no_evidence_above_chance', 'No statistical evidence above chance'::text)
),
eligible_sessions as (
  select
    a.session_id,
    a.longitudinal_id,
    a.participant,
    a.created_at,
    a.primary_matches
  from public.mj_v2_session_analysis a
  where a.primary_completed_at is not null
    and not a.is_test
    and a.assets_verified
    and a.primary_rounds = 40
),
first_participant_session as (
  select distinct on (e.longitudinal_id)
    e.longitudinal_id,
    e.session_id,
    e.participant,
    e.created_at
  from eligible_sessions e
  order by e.longitudinal_id, e.created_at, e.session_id
),
participant_evidence as (
  select
    p.longitudinal_id,
    p.session_id,
    p.participant,
    case
      when r.evidence_status = 'prospectively_above_chance' then 'prospectively_above_chance'
      when coalesce(c.is_exploratory_candidate, false) then 'exploratory_candidate_unconfirmed'
      else 'no_evidence_above_chance'
    end as evidence_group
  from first_participant_session p
  left join public.mj_v2_candidate_screenings c
    on c.longitudinal_id = p.longitudinal_id
  left join public.mj_v2_candidate_report r
    on r.discovery_session_id = c.discovery_session_id
),
participant_expanded as (
  select
    'all_eligible'::text as group_name,
    p.longitudinal_id,
    p.participant
  from participant_evidence p
  union all
  select
    p.evidence_group,
    p.longitudinal_id,
    p.participant
  from participant_evidence p
),
session_labeled as (
  select
    e.session_id,
    e.longitudinal_id,
    e.primary_matches,
    p.evidence_group
  from eligible_sessions e
  join participant_evidence p using (longitudinal_id)
),
session_expanded as (
  select
    'all_eligible'::text as group_name,
    s.session_id,
    s.longitudinal_id,
    s.primary_matches
  from session_labeled s
  union all
  select
    s.evidence_group,
    s.session_id,
    s.longitudinal_id,
    s.primary_matches
  from session_labeled s
),
trial_expanded as (
  select
    s.group_name,
    t.session_id,
    t.round_index,
    t.prediction,
    t.match_count,
    t.response_ms
  from session_expanded s
  join public.mj_v2_trials t using (session_id)
  where t.phase = 'primary'
),
participant_totals as (
  select group_name, count(distinct longitudinal_id)::integer as participant_count
  from participant_expanded
  group by group_name
),
session_totals as (
  select
    group_name,
    count(*)::integer as session_count,
    sum(primary_matches)::integer as matches,
    (count(*) * 120)::integer as positions
  from session_expanded
  group by group_name
),
context_counts as (
  select
    p.group_name,
    x.field_name,
    x.field_value,
    count(*)::integer as participants
  from participant_expanded p
  cross join lateral (
    values
      ('age_band'::text, coalesce(nullif(p.participant->>'age_band',''), 'Missing')),
      ('gender'::text, coalesce(nullif(p.participant->>'gender',''), 'Prefer not to say')),
      ('alertness'::text, coalesce(nullif(p.participant->>'alertness',''), 'Missing')),
      ('sleep_quality'::text, coalesce(nullif(p.participant->>'sleep_quality',''), 'Missing')),
      ('prior_belief'::text, coalesce(nullif(p.participant->>'prior_belief',''), 'Missing')),
      ('alcohol_12h'::text, coalesce(nullif(p.participant->>'alcohol_12h',''), 'Missing')),
      ('psychoactive_12h'::text, coalesce(nullif(p.participant->>'psychoactive_12h',''), 'Missing')),
      ('attention_medication'::text, coalesce(nullif(p.participant->>'attention_medication',''), 'Missing')),
      ('caffeine_4h'::text, coalesce(nullif(p.participant->>'caffeine_4h',''), 'Missing')),
      ('physical_presence'::text, coalesce(nullif(p.participant->>'physical_presence',''), 'Missing')),
      ('observer_attention'::text, coalesce(nullif(p.participant->>'observer_attention',''), 'Missing')),
      ('observer_relationship'::text, coalesce(nullif(p.participant->>'observer_relationship',''), 'Missing')),
      ('gaming'::text, coalesce(nullif(p.participant->>'gaming',''), 'Missing')),
      ('gambling'::text, coalesce(nullif(p.participant->>'gambling',''), 'Missing')),
      ('prior_participation'::text, coalesce(nullif(p.participant->>'prior_participation',''), 'Missing'))
  ) x(field_name, field_value)
  group by p.group_name, x.field_name, x.field_value
),
context_field_json as (
  select
    group_name,
    field_name,
    jsonb_object_agg(field_value, participants order by field_value) as distribution
  from context_counts
  group by group_name, field_name
),
context_group_json as (
  select
    group_name,
    jsonb_object_agg(field_name, distribution order by field_name) as distributions
  from context_field_json
  group by group_name
),
social_profile_counts as (
  select
    p.group_name,
    jsonb_build_object(
      'physical_presence', coalesce(nullif(p.participant->>'physical_presence',''), 'Missing'),
      'observer_attention', coalesce(nullif(p.participant->>'observer_attention',''), 'Missing'),
      'alcohol_12h', coalesce(nullif(p.participant->>'alcohol_12h',''), 'Missing'),
      'psychoactive_12h', coalesce(nullif(p.participant->>'psychoactive_12h',''), 'Missing'),
      'attention_medication', coalesce(nullif(p.participant->>'attention_medication',''), 'Missing'),
      'caffeine_4h', coalesce(nullif(p.participant->>'caffeine_4h',''), 'Missing')
    ) as profile,
    count(*)::integer as participants
  from participant_expanded p
  group by p.group_name,
    p.participant->>'physical_presence', p.participant->>'observer_attention',
    p.participant->>'alcohol_12h', p.participant->>'psychoactive_12h',
    p.participant->>'attention_medication', p.participant->>'caffeine_4h'
),
social_profile_ranked as (
  select
    s.*,
    sum(s.participants) over (partition by s.group_name) as total_participants,
    row_number() over (partition by s.group_name order by s.participants desc, s.profile::text) as profile_rank
  from social_profile_counts s
),
social_profile_json as (
  select
    group_name,
    jsonb_agg(jsonb_build_object(
      'profile', profile,
      'participants', participants,
      'fraction', round(participants::numeric / nullif(total_participants, 0), 4)
    ) order by profile_rank) as top_profiles
  from social_profile_ranked
  where profile_rank <= 5
  group by group_name
),
state_profile_counts as (
  select
    p.group_name,
    jsonb_build_object(
      'sleep_quality', coalesce(nullif(p.participant->>'sleep_quality',''), 'Missing'),
      'alertness', coalesce(nullif(p.participant->>'alertness',''), 'Missing'),
      'prior_belief', coalesce(nullif(p.participant->>'prior_belief',''), 'Missing')
    ) as profile,
    count(*)::integer as participants
  from participant_expanded p
  group by p.group_name,
    p.participant->>'sleep_quality', p.participant->>'alertness', p.participant->>'prior_belief'
),
state_profile_ranked as (
  select
    s.*,
    sum(s.participants) over (partition by s.group_name) as total_participants,
    row_number() over (partition by s.group_name order by s.participants desc, s.profile::text) as profile_rank
  from state_profile_counts s
),
state_profile_json as (
  select
    group_name,
    jsonb_agg(jsonb_build_object(
      'profile', profile,
      'participants', participants,
      'fraction', round(participants::numeric / nullif(total_participants, 0), 4)
    ) order by profile_rank) as top_profiles
  from state_profile_ranked
  where profile_rank <= 5
  group by group_name
),
motif_counts as (
  select
    group_name,
    case
      when prediction[1] = prediction[2] and prediction[2] = prediction[3] then 'all_same'
      when prediction[1] = prediction[2] or prediction[1] = prediction[3] or prediction[2] = prediction[3] then 'one_pair'
      else 'all_different'
    end as motif,
    count(*)::integer as rounds
  from trial_expanded
  group by group_name, motif
),
motif_totals as (
  select group_name, sum(rounds)::integer as total_rounds
  from motif_counts group by group_name
),
motif_json as (
  select
    m.group_name,
    jsonb_agg(jsonb_build_object(
      'motif', m.motif,
      'rounds', m.rounds,
      'fraction', round(m.rounds::numeric / nullif(t.total_rounds, 0), 4)
    ) order by m.rounds desc, m.motif) as motifs
  from motif_counts m
  join motif_totals t using (group_name)
  group by m.group_name
),
triplet_counts as (
  select
    group_name,
    prediction,
    count(*)::integer as rounds
  from trial_expanded
  group by group_name, prediction
),
triplet_ranked as (
  select
    t.*,
    sum(t.rounds) over (partition by t.group_name) as total_rounds,
    row_number() over (partition by t.group_name order by t.rounds desc, t.prediction::text) as triplet_rank
  from triplet_counts t
),
triplet_json as (
  select
    group_name,
    jsonb_agg(jsonb_build_object(
      'symbol_indices', prediction,
      'symbol_names', array[
        (array['Nova','Gem','Moon','Flame','Oracle','Crown'])[prediction[1] + 1],
        (array['Nova','Gem','Moon','Flame','Oracle','Crown'])[prediction[2] + 1],
        (array['Nova','Gem','Moon','Flame','Oracle','Crown'])[prediction[3] + 1]
      ],
      'rounds', rounds,
      'fraction', round(rounds::numeric / nullif(total_rounds, 0), 4)
    ) order by triplet_rank) as top_triplets
  from triplet_ranked
  where triplet_rank <= 10
  group by group_name
),
symbol_counts as (
  select
    t.group_name,
    u.symbol_index,
    count(*)::integer as predictions
  from trial_expanded t
  cross join lateral unnest(t.prediction) u(symbol_index)
  group by t.group_name, u.symbol_index
),
symbol_ranked as (
  select
    s.*,
    sum(s.predictions) over (partition by s.group_name) as total_predictions
  from symbol_counts s
),
symbol_json as (
  select
    group_name,
    jsonb_agg(jsonb_build_object(
      'symbol_index', symbol_index,
      'symbol_name', (array['Nova','Gem','Moon','Flame','Oracle','Crown'])[symbol_index + 1],
      'predictions', predictions,
      'fraction', round(predictions::numeric / nullif(total_predictions, 0), 4)
    ) order by predictions desc, symbol_index) as preferences
  from symbol_ranked
  group by group_name
),
ordered_trials as (
  select
    t.*,
    lag(t.prediction) over (partition by t.group_name, t.session_id order by t.round_index) as previous_prediction,
    lag(t.match_count) over (partition by t.group_name, t.session_id order by t.round_index) as previous_match_count
  from trial_expanded t
),
transition_rows as (
  select
    o.*,
    ((o.prediction[1] = o.previous_prediction[1])::integer
      + (o.prediction[2] = o.previous_prediction[2])::integer
      + (o.prediction[3] = o.previous_prediction[3])::integer) as repeated_positions
  from ordered_trials o
  where o.previous_prediction is not null
),
transition_metrics as (
  select
    group_name,
    count(*)::integer as transitions,
    sum(repeated_positions)::integer as repeated_positions,
    round(sum(repeated_positions)::numeric / nullif(count(*) * 3, 0), 4) as repeat_same_reel_rate,
    round(
      (sum(repeated_positions) filter (where previous_match_count > 0))::numeric /
      nullif((count(*) filter (where previous_match_count > 0)) * 3, 0), 4
    ) as repeat_after_any_match_rate,
    round(
      (sum(repeated_positions) filter (where previous_match_count = 0))::numeric /
      nullif((count(*) filter (where previous_match_count = 0)) * 3, 0), 4
    ) as repeat_after_no_match_rate
  from transition_rows
  group by group_name
),
half_counts as (
  select
    group_name,
    case when round_index <= 20 then 'rounds_1_20' else 'rounds_21_40' end as half,
    sum(match_count)::integer as matches,
    (count(*) * 3)::integer as positions
  from trial_expanded
  group by group_name, half
),
half_json as (
  select
    group_name,
    jsonb_agg(jsonb_build_object(
      'half', half,
      'matches', matches,
      'positions', positions,
      'match_rate', round(matches::numeric / nullif(positions, 0), 4)
    ) order by half) as halves
  from half_counts
  group by group_name
),
response_metrics as (
  select
    group_name,
    round(percentile_cont(0.5) within group (order by response_ms)::numeric, 0) as median_response_ms
  from trial_expanded
  where response_ms is not null
  group by group_name
),
group_rows as (
  select
    g.group_name,
    g.group_label,
    coalesce(p.participant_count, 0) as participant_count,
    coalesce(s.session_count, 0) as session_count,
    coalesce(s.matches, 0) as matches,
    coalesce(s.positions, 0) as positions,
    c.distributions,
    sp.top_profiles as social_profiles,
    st.top_profiles as state_profiles,
    m.motifs,
    tr.top_triplets,
    sy.preferences,
    tm.transitions,
    tm.repeated_positions,
    tm.repeat_same_reel_rate,
    tm.repeat_after_any_match_rate,
    tm.repeat_after_no_match_rate,
    h.halves,
    r.median_response_ms
  from group_catalog g
  left join participant_totals p using (group_name)
  left join session_totals s using (group_name)
  left join context_group_json c using (group_name)
  left join social_profile_json sp using (group_name)
  left join state_profile_json st using (group_name)
  left join motif_json m using (group_name)
  left join triplet_json tr using (group_name)
  left join symbol_json sy using (group_name)
  left join transition_metrics tm using (group_name)
  left join half_json h using (group_name)
  left join response_metrics r using (group_name)
)
select jsonb_build_object(
  'schema', 'mind-jackpot-pattern-snapshot-2.0',
  'generated_at', statement_timestamp(),
  'symbol_legend', jsonb_build_object('0','Nova','1','Gem','2','Moon','3','Flame','4','Oracle','5','Crown'),
  'group_definitions', jsonb_build_object(
    'all_eligible', 'Every eligible protocol-2.0 participant; context uses one row per participant and behaviour uses all eligible sessions.',
    'prospectively_above_chance', 'Meets the prespecified prospective confirmation rule and Holm correction; this does not prove premonition.',
    'exploratory_candidate_unconfirmed', 'First-session screening candidate without prospective confirmation.',
    'no_evidence_above_chance', 'Does not meet an above-chance evidence rule; this is not evidence that premonition is absent.'
  ),
  'interpretation_rules', jsonb_build_object(
    'descriptive_only', true,
    'minimum_group_size_for_pattern_claim', 5,
    'small_group_rule', 'When participant_count < 5, report insufficient data for a group pattern; do not generalise from individuals.',
    'multiplicity_note', 'The pattern search is exploratory and may generate many comparisons; no pattern is confirmatory without a separate preregistration and independent data.',
    'causal_note', 'Alcohol, substances, company, sleep and other context associations are non-causal self-report descriptions.'
  ),
  'groups', coalesce(jsonb_agg(jsonb_build_object(
    'group', group_name,
    'label', group_label,
    'participant_count', participant_count,
    'session_count', session_count,
    'insufficient_for_group_pattern', participant_count < 5,
    'descriptive_performance', jsonb_build_object(
      'matches', matches,
      'positions', positions,
      'match_rate', case when positions = 0 then null else round(matches::numeric / positions, 4) end,
      'chance_rate', round((1.0/6.0)::numeric, 4),
      'by_session_half', coalesce(halves, '[]'::jsonb)
    ),
    'context_distributions', coalesce(distributions, '{}'::jsonb),
    'top_social_and_substance_profiles', coalesce(social_profiles, '[]'::jsonb),
    'top_state_profiles', coalesce(state_profiles, '[]'::jsonb),
    'prediction_motifs', coalesce(motifs, '[]'::jsonb),
    'top_prediction_triplets', coalesce(top_triplets, '[]'::jsonb),
    'symbol_preferences', coalesce(preferences, '[]'::jsonb),
    'sequential_choice', jsonb_build_object(
      'transitions', coalesce(transitions, 0),
      'repeated_positions', coalesce(repeated_positions, 0),
      'repeat_same_reel_rate', repeat_same_reel_rate,
      'repeat_after_any_match_rate', repeat_after_any_match_rate,
      'repeat_after_no_match_rate', repeat_after_no_match_rate
    ),
    'median_response_ms', median_response_ms
  ) order by case group_name
      when 'all_eligible' then 1
      when 'prospectively_above_chance' then 2
      when 'exploratory_candidate_unconfirmed' then 3
      else 4 end), '[]'::jsonb)
)
from group_rows;
$$;

revoke all on function public.mj_v2_pattern_snapshot() from public, anon, authenticated;
grant execute on function public.mj_v2_pattern_snapshot() to service_role;

comment on function public.mj_v2_pattern_snapshot() is
  'Privacy-minimised descriptive patterns for eligible v2 participants. Group comparisons are exploratory and do not prove the presence or absence of premonition.';
