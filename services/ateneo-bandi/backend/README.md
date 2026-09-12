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
