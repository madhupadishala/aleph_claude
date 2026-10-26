# Aleph Medico — client ownership and CMS handover

## Verified source and infrastructure (26 October 2026)
- Source repository: `madhupadishala/aleph_claude`, default `main`.
- Hosting project: Vercel `aleph-claude` (`prj_8CVTUV866gsX7p037R4uNhWTtMRm`).
- Verified Vercel domains: `alephmedico.com`, `www.alephmedico.com`; www redirects to apex.
- Framework: Next.js 15, React 19, TypeScript, Tailwind.
- Blog content currently resides in `src/lib/aleph/blogs.ts` and is code-managed.
- Existing `/admin/login` uses shared `ALEPH_ADMIN_PASSWORD` and a signed session cookie. This is not a multi-user CMS.
- Existing `/admin/leads` and `/admin/operations` should remain functional after migration.
- Production Supabase project **not established** from connected account. Do not assume or modify another project.

## Target ownership
1. GitHub: client-owned organization/repository; preserve full Git history and default branch. Invite vendor as collaborator only if desired.
2. Vercel: transfer or redeploy into the client's Vercel team; map and verify both custom domains, then remove old project bindings after validation.
3. Supabase: client-owned project for Auth, Postgres and Storage, with migration of relevant data and policies after production source is identified.
4. Domain: transfer registrar account/domain to client or confirm their existing registrar control; use DNS verification and avoid cutting over prematurely.
5. CMS: client super-admin, editor and author accounts with least-privilege access; no shared passwords or credentials inside Git.
6. Secrets: client generates fresh secrets for destination; revoke old tokens and vendor access after sign-off.

## CMS specification
- Routes: `/admin/login`, `/admin/content/blogs`, `/admin/content/pages`, `/admin/content/media`, `/admin/users`.
- Server-validated role enforcement: `super_admin`, `editor`, `author`; author only drafts own posts, editor reviews/publishes, super-admin manages users.
- Content states: `draft -> in_review -> published -> archived`, with published/scheduled timestamps and immutable audit records.
- Tables: `cms_profiles`, `cms_posts`, `cms_post_revisions`, `cms_pages`, `cms_media`, `cms_audit_events`; enable RLS with role and ownership checks.
- Public pages query published content only; sanitize rich text, validate uploads and protect mutating endpoints; keep SEO metadata and sitemap in sync.
- Existing static blogs are imported idempotently using their unique slugs.
- Logout invalidates client auth session; sensitive operations validate identity and authorization on the server.

## Transfer acceptance criteria
- Client demonstrably controls GitHub repo, hosting project, domain DNS/registrar and any database/media assets.
- Client super-admin can sign in/out; editor can publish; author cannot publish; unauthenticated requests cannot mutate content.
- Existing site, lead forms, email workflows, blog URLs, sitemap and redirects pass production regression checks.
- Domain resolves over HTTPS after cutover; data backup and restoration tested.
- Historical deployment secrets rotated; vendor access reviewed with client.

## Client identifiers required for ownership transfer
- GitHub client username or organization.
- Vercel destination team/account.
- Supabase destination organization/project (or authorization to create a client-owned project).
- Registrar account holder/contact for domain transfer, plus confirmation of whether domain already belongs to client.
- Client super-admin email for invitation (never request their password).

No transfer should be marked complete until destination ownership is confirmed.
