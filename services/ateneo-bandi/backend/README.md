# Ateneo Bandi alerts backend

The public search is static and does not handle personal data. Email alerts are a separate Supabase deployment and must not be pointed at an unrelated project.

## Security model

- double opt-in with a one-hour, single-use random token stored only as SHA-256;
- RLS enabled with no client policies, so browser keys cannot read email addresses;
- service-role and mail-provider keys live only in Edge Function secrets;
- exact-origin CORS, a honeypot, bounded payloads, provider rate limits and CAPTCHA before public launch;
- unique delivery records prevent the same call being mailed twice;
- every digest must carry a one-click unsubscribe URL;
- retention job should erase unconfirmed rows after 48 hours and unsubscribed rows after 30 days.

## Activation checklist

1. Create a dedicated Supabase project after confirming organization and any quoted cost.
2. Apply `migrations/001_alerts.sql` and run the Supabase security advisors.
3. Verify a sending domain with an email provider such as Resend; set `RESEND_API_KEY`, `ALERT_FROM` and `PUBLIC_SITE_ORIGIN` as function secrets.
4. Deploy `subscribe-alert`, `verify-alert`, `unsubscribe-alert` and `send-digest` before enabling the public form.
5. Add Turnstile, rate limiting, an Italian privacy notice, a processing register and a retention schedule.
6. Test email scanners: the landing page should require a final button before consuming a single-use token.

Required secrets: `RESEND_API_KEY`, `ALERT_FROM`, `PUBLIC_SITE_ORIGIN`, `UNSUBSCRIBE_SECRET` and `CRON_SECRET`. Schedule `send-digest` from Supabase Cron with the last secret in the Authorization header. Deploy `subscribe-alert` without JWT verification only after adding CAPTCHA or equivalent edge rate limiting.

The UI remains visibly disabled until all six steps are complete. This prevents collecting addresses into a non-operational system. Once deployed, set the public function URL in the front-end configuration and enable the form.
