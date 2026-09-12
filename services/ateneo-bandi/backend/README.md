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

Every run contains the entire set of still-active calls, even if unchanged. It
sends an empty-result report only after the source checks succeed. Failed or
ambiguous checks produce an incomplete-check message. The run date and Gmail
message ID prevent duplicate delivery; uncertain sends are checked in Sent before
retry. Logs are retained for 180 days. The existing game's schema is untouched.

Pause by disabling the automation or setting `enabled=false` in the private row.
No public unsubscribe endpoint is needed because there is no public subscription.
