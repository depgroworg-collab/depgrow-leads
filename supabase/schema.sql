-- ================================================================
-- Depgrow Smart Lead Capture SaaS — Supabase Schema
-- Run this entire file in: Supabase → SQL Editor → Run
-- ================================================================

create extension if not exists "pgcrypto";

-- ── Profiles (extends auth.users) ────────────────────────────────────────
create table public.profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  email               text not null,
  name                text not null default '',
  business_name       text not null default '',
  plan                text not null default 'free' check (plan in ('free','pro')),
  whatsapp_number     text,
  razorpay_payment_id text,
  created_at          timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Form configs ──────────────────────────────────────────────────────────
create table public.form_configs (
  id                uuid primary key default gen_random_uuid(),
  customer_id       uuid not null references public.profiles(id) on delete cascade,
  title             text not null default 'Get a Free Quote',
  subtitle          text not null default 'Tell us about your project and we''ll get back to you within 24 hours.',
  logo_url          text,
  primary_color     text not null default '#7C3AED',
  bg_color          text not null default '#ffffff',
  text_color        text not null default '#111827',
  button_text       text not null default 'Get My Free Quote →',
  thank_you_title   text not null default '🎉 Thank you!',
  thank_you_message text not null default 'We''ve received your details and will reach out within 24 hours.',
  services          text[] not null default array['Web Design','SEO','Social Media','Paid Ads','Branding','Other'],
  whatsapp_number   text not null default '',
  is_active         boolean not null default true,
  embed_type        text not null default 'floating' check (embed_type in ('floating','inline')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Auto-create a default form config when a profile is created
create or replace function public.handle_new_profile()
returns trigger language plpgsql security definer as $$
begin
  insert into public.form_configs (customer_id)
  values (new.id);
  return new;
end;
$$;

create trigger on_profile_created
  after insert on public.profiles
  for each row execute function public.handle_new_profile();

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end;
$$;

create trigger form_configs_updated_at
  before update on public.form_configs
  for each row execute function set_updated_at();

-- ── Leads ─────────────────────────────────────────────────────────────────
create table public.leads (
  id           uuid primary key default gen_random_uuid(),
  customer_id  uuid not null references public.profiles(id) on delete cascade,
  form_id      uuid not null references public.form_configs(id) on delete cascade,
  name         text not null,
  phone        text not null,
  email        text not null,
  budget       text not null,
  service      text not null,
  urgency      text not null,
  message      text,
  segment      text not null check (segment in ('Hot','Warm','Cold')),
  score        integer not null default 0,
  referrer     text,
  device       text not null default 'desktop' check (device in ('mobile','tablet','desktop')),
  notified     boolean not null default false,
  created_at   timestamptz not null default now()
);

-- Indexes for fast queries
create index idx_leads_customer_id  on public.leads(customer_id);
create index idx_leads_segment      on public.leads(customer_id, segment);
create index idx_leads_created_at   on public.leads(customer_id, created_at desc);

-- ── Row Level Security ────────────────────────────────────────────────────
alter table public.profiles     enable row level security;
alter table public.form_configs enable row level security;
alter table public.leads        enable row level security;

create policy "profiles: own row"
  on public.profiles for all using (auth.uid() = id);

create policy "form_configs: own rows"
  on public.form_configs for all using (auth.uid() = customer_id);

create policy "leads: owner access"
  on public.leads for all using (auth.uid() = customer_id);

-- ── Analytics view ─────────────────────────────────────────────────────────
create or replace view public.lead_stats as
select
  customer_id,
  count(*)                                                                 as total,
  count(*) filter (where segment = 'Hot')                                  as hot,
  count(*) filter (where segment = 'Warm')                                 as warm,
  count(*) filter (where segment = 'Cold')                                 as cold,
  count(*) filter (where created_at >= now() - interval '1 day')           as today,
  count(*) filter (where created_at >= now() - interval '7 days')          as this_week,
  count(*) filter (where created_at >= now() - interval '30 days')         as this_month
from public.leads
group by customer_id;
