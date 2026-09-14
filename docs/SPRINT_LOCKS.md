# Aleph Sprint Lock Ledger

This file is the product build contract. Once a sprint is marked locked, its scope should not be edited in later sprints unless Madhu explicitly reopens it.

| Sprint | Scope | Status | Lock Rule |
|---|---|---|---|
| Sprint 0 | Production foundation, repository structure, design tokens, metadata, app shell | Locked | Only critical build break fixes allowed |
| Sprint 1 | Homepage narrative, navigation, initial Aleph visual language, core conversion flow | Locked | No copy/design rewrites without explicit reopen |
| Sprint 2 | Diagnostic engine, scoring model, report route | Locked | Backend connection only in Sprint 3 |
| Sprint 3 | Lead capture, Supabase schema, admin lead dashboard | Not started | Pending Sprint 2 lock |
| Sprint 4 | Solution pages, clinician segment pages, pricing architecture | Not started | Pending Sprint 3 lock |
| Sprint 5 | Email/report automation, resources, analytics events | Not started | Pending Sprint 4 lock |
| Sprint 6 | SEO, performance, accessibility, deployment hardening | Not started | Pending Sprint 5 lock |

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
