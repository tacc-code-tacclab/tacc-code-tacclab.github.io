# Private digest

The public service has no email signup and no authenticated database access.
The administrator's explicitly requested report runs every three days through a
ChatGPT automation. It reads the national MUR professor index and original calls,
checks equivalent sector codes, saves a private audit record in the existing
Supabase research project, and **sends an actual email through the connected Gmail
account**. Supabase is the database, not the mail transport. No SMTP/Resend provider
or new paid project has been activated.

`002_private_digest.sql` documents the deployed schema. The allowed recipient and
criteria are set privately in `ateneo_private.digest_settings`. The automation
also pins the authorized address and checks `enabled` before sending. Browser
roles have neither schema access nor table policies. Project administration is
required to access these records.

The private alert checks both first-fascia (full professor) and second-fascia
(associate professor) calls in molecular biology OR genetics. It reads
`calls.json` and the national MUR professor list for both ranks; the separate
`professor-watch.json` file covers full professors only and must not be used to
exclude associate calls.

Email is sent **only for newly discovered, verified, still-open calls that have
not been notified before**. No email is sent for empty results, unchanged calls,
or source errors without confirmed new calls. Check outcomes and limitations are
recorded privately in `criteria.last_check`.

The `criteria.roles` and `criteria.notification_mode = new_calls_only` settings
control scope. After a successful Gmail send, `criteria.notified_calls` stores
stable call identities and alternate official URLs/IDs. The run date and Gmail
message ID prevent duplicate delivery; uncertain sends are checked in Sent before
retry. Audit runs are retained for 180 days; notification identities are retained
to avoid sending the same call again after log expiry. The existing game's schema
is untouched.

Pause by disabling the automation or setting `enabled=false` in the private row.
No public unsubscribe endpoint is needed because there is no public subscription.

## Weekly descriptive report

A separate Monday-morning automation sends the administrator a short statistical
report for the previous calendar week (Monday through Sunday, Europe/Rome),
covering all disciplines and all MUR categories. It sends every week, even when
there are no new personal alerts. Its private configuration and delivery log live
under `criteria.weekly_report`, separate from the personal alert's identities and
daily `digest_runs` records.

`../reports/weekly_stats.cjs` provides the deterministic aggregation. It selects by
publication date, includes subsequently closed calls, counts each MUR call once
(not each position), separates full and associate professors, and ranks normalized
GSDs and university institutions overall and per category. A multisector call
counts once per GSD, so sector percentages may sum above 100%. Other entities are
counted separately from universities. Missing publication dates cannot be assigned
to a week and are disclosed rather than guessed.

These describe the collected MUR index, not a census of all university notices.
The index started its current national collection on 12 September 2026; early
weeks are incomplete and historic rankings must be labelled accordingly. No
week-on-week trend is claimed without comparable collection coverage. The weekly
report checks source freshness and records delivery only after Gmail returns an ID.
