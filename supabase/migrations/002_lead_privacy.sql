-- Only the server-side service role may access clinician contact records.
alter table public.practice_leads enable row level security;
revoke all on table public.practice_leads from anon, authenticated;
