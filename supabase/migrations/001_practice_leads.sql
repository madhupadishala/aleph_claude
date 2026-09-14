create table if not exists practice_leads (
  id uuid default gen_random_uuid() primary key,
  name text,
  email text not null,
  specialty text not null,
  overall_score int not null,
  visibility_score int not null,
  trust_score int not null,
  pricing_score int not null,
  retention_score int not null,
  authority_score int not null,
  weakest_area text not null,
  package_fit text not null,
  status text not null default 'New',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists practice_leads_created_at_idx on practice_leads (created_at desc);
create index if not exists practice_leads_status_idx on practice_leads (status);
create index if not exists practice_leads_package_fit_idx on practice_leads (package_fit);
