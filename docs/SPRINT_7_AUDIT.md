# Sprint 7: Production hardening and actionable diagnostic UX

Status: implemented locally; not release-locked or deployed.

## Verification

- `npm run lint`: passed with zero warnings.
- `npm run typecheck`: passed.
- `npm test`: all three authentication tests passed.
- `npm run build`: passed on Next.js 15.5.24; 17 static pages generated.
- Browser verification attempted but blocked by missing Playwright Chromium executable. No visual or end-to-end pass is claimed.

## Audit findings

- Critical: admin authentication stored the configured password verbatim in a browser cookie. Replaced with signed, random, expiring tokens. Existing password cookies are rejected.
- High: initial database migration did not enable RLS. Migration 002 enables RLS and removes public role access. Protection requires applying the migration.
- High: installed framework needed a security update. Updated Next.js and its ESLint configuration to 15.5.24.
- High: public lead submission trusts client-computed scores and has no distributed abuse protection. Still open: authoritative scoring, payload byte limits, rate limits and duplicate submission protection.
- High: no durable email outbox, retry worker, delivery reconciliation or unsubscribe workflow. Still open. The existing email call now has a timeout; this is not a complete automation system.
- Medium: interrupted requests stranded diagnostic and admin forms. Added recoverable errors and reset loading states.
- Medium: invalid JSON and unexpected field types could produce server failures or expose internal errors. Added guards and public-safe error responses.
- Medium: homepage pricing contained obsolete sprint placeholders. Now uses the shared package definitions.
- Medium: mobile navigation hid secondary routes. Added an accessible native disclosure menu.
- Medium: no automated quality workflow; lint command was incompatible with ESLint 9. Added ESLint configuration, session tests and GitHub Actions checks.

## UX delivered

- Diagnostic answer recovery within the browser session; no contact data stored in the draft.
- Personalized growth tasks selected from the weakest diagnostic dimension.
- Device-local checklist progress and calendar export. Calendar events require user import; they are not background notifications.
- Keyboard focus on question changes, progress semantics, status announcements and reduced-motion support.
- Honest self-assessment and delivery status wording.

## Release gates still open

1. Replace shared-password administration with individual accounts/MFA and audited access; add distributed login throttling.
2. Apply migration 002 and verify anonymous database access is denied.
3. Configure production secrets securely and test actual lead persistence/email delivery.
4. Build consent-aware durable email jobs, bounded retries, idempotency, suppression and unsubscribe handling before any nurture sequence.
5. Validate every public commercial claim, price, policy and service commitment with the owner.
6. Complete mobile/desktop browser and accessibility verification; replace sample hero scores with clearly labelled examples or actual results.
7. Complete the visual redesign with subject-relevant imagery, consistent navigation and genuine success stories. Do not fabricate testimonials.
8. Verify canonical domain and deployment status; this local pass does not establish that production has changed.

## Sprint boundary

Pre-existing Sprint 6 worktree changes were preserved. Sprint 7 explicitly fixes earlier defects but does not change diagnostic scoring weights or package contracts. It must not be described as a complete production-ready release until the remaining gates are verified.
