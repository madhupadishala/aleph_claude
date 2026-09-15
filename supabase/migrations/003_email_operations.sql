begin;

alter table public.practice_leads add column if not exists request_id uuid unique;
alter table public.practice_leads add column if not exists consent_version text;
alter table public.practice_leads add column if not exists consent_at timestamptz;

create table public.email_subscribers (
  email text primary key,
  token uuid not null unique default gen_random_uuid(),
  consent_state text not null default 'pending' check (consent_state in ('pending','subscribed','unsubscribed')),
  consent_version text not null,
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  suppressed_at timestamptz,
  created_at timestamptz not null default now()
);
create table public.email_jobs (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.practice_leads(id) on delete cascade,
  email text not null,
  kind text not null check (kind in ('report','lesson')),
  lesson int not null default 0,
  payload jsonb not null,
  delivery_body jsonb,
  status text not null default 'pending' check (status in ('pending','processing','sent','delivered','failed','cancelled','review')),
  attempts int not null default 0,
  available_at timestamptz not null default now(),
  lease_until timestamptz,
  lease_token uuid,
  first_attempt_at timestamptz,
  provider_id text unique,
  last_error text,
  created_at timestamptz not null default now(),
  unique(lead_id, kind, lesson)
);
create index email_jobs_due on public.email_jobs(status, available_at);
create table public.email_events (id text primary key, kind text not null, provider_id text not null, created_at timestamptz not null default now());
create table public.request_limits (key text primary key, count int not null, expires_at timestamptz not null);

alter table public.email_subscribers enable row level security;
alter table public.email_jobs enable row level security;
alter table public.email_events enable row level security;
alter table public.request_limits enable row level security;
revoke all on public.email_subscribers, public.email_jobs, public.email_events, public.request_limits from anon, authenticated;
grant all on public.email_subscribers, public.email_jobs, public.email_events, public.request_limits to service_role;

create function public.aleph_rate_limit(p_key text, p_max int, p_seconds int) returns boolean
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  insert into request_limits(key,count,expires_at) values (p_key,1,now()+make_interval(secs=>p_seconds))
  on conflict(key) do update set count=case when request_limits.expires_at<=now() then 1 else request_limits.count+1 end,
    expires_at=case when request_limits.expires_at<=now() then excluded.expires_at else request_limits.expires_at end
  returning count into n;
  return n <= p_max;
end $$;

create function public.aleph_capture(p_lead jsonb, p_request uuid, p_marketing boolean, p_version text) returns uuid
language plpgsql security definer set search_path = public as $$
declare lead_uuid uuid; recipient_token uuid;
begin
  insert into practice_leads(name,email,specialty,overall_score,visibility_score,trust_score,pricing_score,retention_score,authority_score,weakest_area,package_fit,request_id,consent_version,consent_at)
  values(p_lead->>'name',p_lead->>'email',p_lead->>'specialty',(p_lead->>'overall_score')::int,(p_lead->>'visibility_score')::int,(p_lead->>'trust_score')::int,(p_lead->>'pricing_score')::int,(p_lead->>'retention_score')::int,(p_lead->>'authority_score')::int,p_lead->>'weakest_area',p_lead->>'package_fit',p_request,p_version,now())
  on conflict(request_id) do nothing returning id into lead_uuid;
  if lead_uuid is null then return null; end if;
  if p_marketing then
    insert into email_subscribers(email,consent_version) values(p_lead->>'email',p_version)
    on conflict(email) do update set consent_state='pending',token=gen_random_uuid(),consent_version=excluded.consent_version,
      created_at=now(),confirmed_at=null,unsubscribed_at=null
    where email_subscribers.suppressed_at is null and (email_subscribers.consent_state='unsubscribed' or
      (email_subscribers.consent_state='pending' and email_subscribers.created_at < now()-interval '7 days'));
    select token into recipient_token from email_subscribers where email=p_lead->>'email' and consent_state='pending' and suppressed_at is null;
  end if;
  insert into email_jobs(lead_id,email,kind,payload) values(lead_uuid,p_lead->>'email','report',p_lead || jsonb_build_object('confirm_token',recipient_token));
  return lead_uuid;
end $$;

create function public.aleph_consent(p_token uuid, p_action text) returns boolean
language plpgsql security definer set search_path = public as $$
declare s email_subscribers; l practice_leads;
begin
  select * into s from email_subscribers where token=p_token for update;
  if not found then return false; end if;
  if p_action='unsubscribe' then
    update email_subscribers set consent_state='unsubscribed',unsubscribed_at=now() where email=s.email;
    update email_jobs set status='cancelled',lease_token=null where email=s.email and kind='lesson' and status in ('pending','processing','review');
    return true;
  end if;
  if p_action <> 'confirm' or s.suppressed_at is not null or s.consent_state='unsubscribed' then return false; end if;
  if s.consent_state='subscribed' then return true; end if;
  if s.created_at < now()-interval '7 days' then return false; end if;
  update email_subscribers set consent_state='subscribed',confirmed_at=now() where email=s.email;
  select * into l from practice_leads where email=s.email order by created_at desc limit 1;
  insert into email_jobs(lead_id,email,kind,lesson,payload,available_at)
  select l.id,s.email,'lesson',i,jsonb_build_object('name',l.name,'unsubscribe_token',s.token),now()+make_interval(days=>i)
  from generate_series(1,5) i on conflict do nothing;
  return true;
end $$;

create function public.aleph_claim_email(p_lead uuid default null) returns setof public.email_jobs
language plpgsql security definer set search_path = public as $$
begin
  -- Never resend an ambiguous request outside the provider's 24-hour deduplication window.
  update email_jobs set status='review',last_error='Delivery requires reconciliation before retry'
  where status in ('pending','processing') and first_attempt_at < now()-interval '23 hours';
  update email_jobs j set status='cancelled' where j.status in ('pending','processing') and exists
    (select 1 from email_subscribers s where s.email=j.email and (s.suppressed_at is not null or (j.kind='lesson' and s.consent_state<>'subscribed')));
  return query
  with candidate as (
    select id from email_jobs where (p_lead is null or lead_id=p_lead)
      and available_at<=now() and attempts<5
      and (status='pending' or (status='processing' and lease_until<now()))
    order by available_at for update skip locked limit 1
  )
  update email_jobs j set status='processing',attempts=j.attempts+1,lease_until=now()+interval '2 minutes',lease_token=gen_random_uuid(),first_attempt_at=coalesce(j.first_attempt_at,now())
  from candidate c where j.id=c.id returning j.*;
end $$;

create function public.aleph_email_event(p_id text, p_kind text, p_provider text) returns void
language plpgsql security definer set search_path = public as $$
declare target email_jobs;
begin
  insert into email_events(id,kind,provider_id) values(p_id,p_kind,p_provider) on conflict do nothing;
  select * into target from email_jobs where provider_id=p_provider;
  if not found then return; end if;
  if p_kind in ('email.bounced','email.complained','email.suppressed') then
    insert into email_subscribers(email,consent_version,suppressed_at) values(target.email,'provider-event',now())
    on conflict(email) do update set suppressed_at=now();
    update email_jobs set status='cancelled' where email=target.email and status in ('pending','processing','review');
    update email_jobs set status='failed',last_error=p_kind where id=target.id;
  elsif p_kind='email.delivered' then
    update email_jobs set status='delivered' where id=target.id and status<>'failed';
  end if;
end $$;

revoke all on function public.aleph_rate_limit(text,int,int), public.aleph_capture(jsonb,uuid,boolean,text), public.aleph_consent(uuid,text), public.aleph_claim_email(uuid), public.aleph_email_event(text,text,text) from public, anon, authenticated;
grant execute on function public.aleph_rate_limit(text,int,int), public.aleph_capture(jsonb,uuid,boolean,text), public.aleph_consent(uuid,text), public.aleph_claim_email(uuid), public.aleph_email_event(text,text,text) to service_role;
commit;
