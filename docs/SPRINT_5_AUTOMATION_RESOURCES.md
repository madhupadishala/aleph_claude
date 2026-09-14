# Sprint 5 Automation And Resources Lock Notes

Sprint 5 owns report automation structure, downloadable report behavior, resource vault, and analytics event hooks.

## Locked Deliverables

- Report generator at `src/lib/aleph/report.ts`.
- Optional Resend email sender at `src/lib/email/resend.ts`.
- Lead API now attempts report email after successful lead save.
- Diagnostic report can be downloaded as a text report.
- Client analytics helper at `src/lib/analytics/events.ts`.
- Analytics events:
  - `diagnostic_completed`
  - `report_downloaded`
  - `lead_saved`
  - `lead_save_failed`
- Resource vault route at `/resources`.

## Deferred Credentials

Email sending remains inactive until these Vercel variables are configured:

- `RESEND_API_KEY`
- `ALEPH_FROM_EMAIL`

## Lock Rule

After Sprint 5 is locked, later sprints may improve observability, production QA, and domain setup, but should not rewrite the report text structure, resource categories, or analytics event names unless Madhu explicitly reopens Sprint 5.
