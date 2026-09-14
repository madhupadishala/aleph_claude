# Sprint 6 Production QA Lock Notes

Sprint 6 owns production hardening, SEO, accessibility guardrails, and deployment verification.

## Locked Deliverables

- Route-specific metadata for commercial pages.
- `sitemap.xml` generated from production routes.
- `robots.txt` blocking admin and API routes.
- Admin section no-index metadata.
- Production security headers in `next.config.ts`.
- Local verification:
  - `npm run typecheck`
  - `npm run build`

## Lock Rule

After Sprint 6 is locked, further changes should be release fixes, domain configuration, environment variable setup, or explicitly approved new product scope.
