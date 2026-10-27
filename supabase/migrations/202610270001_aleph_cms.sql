create table if not exists public.aleph_cms_content (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('page','blog')),
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null default '',
  summary text not null default '',
  body text not null default '',
  status text not null default 'draft' check (status in ('draft','published')),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  unique(kind,slug)
);
alter table public.aleph_cms_content enable row level security;
revoke all on public.aleph_cms_content from anon, authenticated;
create index if not exists aleph_cms_published_idx on public.aleph_cms_content (kind,status,published_at desc);
-- This table is accessed exclusively through server-side, authenticated admin routes.
