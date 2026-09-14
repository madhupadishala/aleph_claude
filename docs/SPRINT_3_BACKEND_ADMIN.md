# Sprint 3 Backend And Admin Lock Notes

Sprint 3 owns lead capture and admin lead visibility.

## Locked Deliverables

- Supabase admin client.
- Practice lead SQL migration.
- Lead capture API route at `/api/leads`.
- Diagnostic report form submission into `practice_leads`.
- Lightweight admin login at `/admin/login`.
- Admin leads table at `/admin/leads`.
- Lead temperature classification for follow-up.

## Required Vercel Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ALEPH_ADMIN_PASSWORD`

## Lock Rule

After Sprint 3 is locked, later sprints can extend lead status management and email automation, but should not change the core lead schema or diagnostic submission contract unless Madhu explicitly reopens Sprint 3.
