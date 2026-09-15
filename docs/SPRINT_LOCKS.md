# Aleph Sprint Lock Ledger

This file is the product build contract. Once a sprint is marked locked, its scope should not be edited in later sprints unless Madhu explicitly reopens it.

| Sprint | Scope | Status | Lock Rule |
|---|---|---|---|
| Sprint 0 | Production foundation, repository structure, design tokens, metadata, app shell | Locked | Only critical build break fixes allowed |
| Sprint 1 | Homepage narrative, navigation, initial Aleph visual language, core conversion flow | Locked | No copy/design rewrites without explicit reopen |
| Sprint 2 | Diagnostic engine, scoring model, report route | Locked | Backend connection only in Sprint 3 |
| Sprint 3 | Lead capture, Supabase schema, admin lead dashboard | Locked | Email automation/status editing only in later sprints |
| Sprint 4 | Solution pages, clinician segment pages, pricing architecture | Locked | Analytics/compliance copy only in later sprints |
| Sprint 5 | Email/report automation, resources, analytics events | Locked | Production QA/domain work only in Sprint 6 |
| Sprint 6 | SEO, performance, accessibility, deployment hardening | Locked | Release fixes and domain/env setup only |
| Sprint 7 | Production UX, durable automation, consent, security, and approved brand restoration | Locked | No visual, copy, layout, workflow, or architecture changes without Madhu explicitly reopening the relevant scope |

## Current Locked Baseline

- Stack: Next.js, React, TypeScript, Tailwind CSS.
- Positioning: Practice Growth Intelligence for independent clinicians.
- Visual direction: clinical green, ivory, gold, terracotta accents.
- Homepage flow: hero, pain mirror, diagnostic CTA, Aleph method, solutions, pricing placeholder, footer.

## Verification

- GitHub Actions build check added after Sprint 1 lock to run install, typecheck, and production build on every push.

## Sprint 2 Locked Baseline

- Diagnostic route: `/diagnostic`.
- Seven decision signals produce a five-dimension practice growth scorecard.
- Report screen identifies weakest area and recommends Aleph package fit.

## Sprint 3 Locked Baseline

- Lead API route: `/api/leads`.
- Admin login route: `/admin/login`.
- Admin leads dashboard: `/admin/leads`.
- Database migration: `supabase/migrations/001_practice_leads.sql`.
- Environment contract: `.env.example`.

## Sprint 4 Locked Baseline

- Solutions route: `/solutions`.
- Segment routes: `/for/doctors`, `/for/therapists`, `/for/clinics`.
- Pricing route: `/pricing`.
- Package architecture: Starter, Growth, Authority, Concierge.


## Sprint 5 Locked Baseline

- Resource vault route: `/resources`.
- Report generator: `src/lib/aleph/report.ts`.
- Optional Resend sender: `src/lib/email/resend.ts`.
- Analytics helper: `src/lib/analytics/events.ts`.
- Diagnostic report download and lead-save tracking are active.

## Sprint 6 Locked Baseline

- Sitemap route: `/sitemap.xml`.
- Robots route: `/robots.txt`.
- Admin routes are excluded from indexing.
- Production security headers are configured.
- Route-level metadata is present for commercial pages.

## Sprint 7 Final Visual Lock

Approved by the client and locked on 15 September 2026.

- Headline font: Instrument Serif.
- Body and label font: Plus Jakarta Sans.
- Main background — Warm Ivory: `#FBF8F1`.
- Primary text and dark sections — Botanical Forest Green: `#123629`.
- Progress bars and secondary accents — Clinical Teal: `#0F766E`.
- Highlight buttons and labels — Muted Gold: `#C59A3D`.
- Main CTA — Warm Terracotta: `#C86745`.
- Secondary text — Natural Sage: `#8FA69A`.
- Pale green sections — Soft Mint Mist: `#EDF4F1`.
- Borders and dividers — Sage Grey: `#DCE6E1`.
- Cards — Clean White: `#FFFFFF`.
- Elevated warm surfaces — Soft White: `#FDFCF9`.
- Current responsive layouts, content hierarchy, interactions, diagnostic experience, resource tools, and production architecture are the approved baseline.
- Future work may fix defects, accessibility failures, security issues, or operational configuration without changing the approved appearance.
- Any other visual change requires Madhu to explicitly reopen this lock.
