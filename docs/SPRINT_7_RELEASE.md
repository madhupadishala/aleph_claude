# Sprint 7 release

Implemented: redesigned public site and diagnostic; working resource tools; signed admin sessions; server scoring; bounded request parsing; distributed keyed rate limits; RLS; atomic lead/outbox capture; double opt-in; one-click unsubscribe; suppression; signed delivery webhooks; leased workers; frozen provider requests; retry and review states; operations view; CI.

## Verification

- Six tests passed, including actual PostgreSQL execution through PGlite of all migrations and queue/consent/rate-limit behavior.
- Next.js production build passed (22 generated pages).
- This is not evidence of a connected live Supabase or Resend account.

## Activation checklist

1. In the Aleph Supabase project apply migrations 001, 002, 003 in order. Migration 003 is transactional; do not rerun it after success.
2. Configure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Aleph's Vercel production environment. The browser does not need the anon key.
3. Set ALEPH_ADMIN_PASSWORD, ALEPH_RATE_LIMIT_SECRET and CRON_SECRET using independent securely generated values. At least 32 random bytes for the latter two. Do not put real values in GitHub source or chat.
4. Verify a sender domain in Resend, add its required DNS records, then configure RESEND_API_KEY and ALEPH_FROM_EMAIL. Never use an unverified sender address.
5. Register the HTTPS /api/email/webhook endpoint for email.delivered, email.bounced, email.complained and email.suppressed. Store its signing secret as RESEND_WEBHOOK_SECRET.
6. Set NEXT_PUBLIC_SITE_URL to the exact deployed origin. Default: https://aleph-claude.vercel.app.
7. Put the same CRON_SECRET value in the GitHub repository secret ALEPH_CRON_SECRET. GitHub processes four jobs per run every 15 minutes (scheduling may be delayed). Vercel provides a daily fallback sweep. Neither scheduler guarantees exact send times.
8. Redeploy after setting environment values. Open /admin/operations to check configuration presence and queue status, then verify a report and double opt-in with a controlled mailbox.

## Delivery semantics

- Reports are attempted after capture, with the durable row committed first.
- Educational lessons are scheduled over five days only after explicit email confirmation.
- Pending lessons are cancelled on unsubscribe. A provider request already in flight cannot be recalled.
- Provider idempotency keys and immutable request bodies protect retries. After 23 hours from the first attempt, ambiguous jobs go to review instead of risking a duplicate beyond Resend's 24-hour window.
- Review/failed jobs require provider reconciliation. The admin page does not offer an unsafe blind resend button.
- Request hashes expire and are purged by the worker. No raw IPs are stored in request_limits.
- Accounts use a shared administrator password with signed expiring sessions and distributed throttling. Individual identity/MFA is a separate future upgrade.
- Artwork is generated illustrative photography, not a patient testimonial or a claim about a real Aleph client.

## Current connection boundary

Connected Vercel tools expose project/deployment inspection, but no environment-variable write action. No Vercel, Supabase or Resend credentials were available in the workspace during implementation. Live configuration and actual email delivery cannot be asserted until those setup steps are completed.
