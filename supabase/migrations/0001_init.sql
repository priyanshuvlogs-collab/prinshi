-- Prinshi Trades, Phase 1 schema.
-- Run with: supabase db push   (or paste into the SQL editor)

create table if not exists drops (
  id text primary key,
  slug text unique not null,
  name text not null,
  category text not null check (category in ('Tee','Hoodie','Knit','Jogger')),
  colour text not null,
  design text not null default '',
  print_type text check (print_type in ('Puff','Screen','Embroidery','Wash')),
  placement text check (placement in ('Front','Back','Front and back')),
  fabric text,
  gsm integer,
  fit text,
  care text,
  made_in text not null default 'Ludhiana, India',
  price_inr integer,
  price_cad integer,
  stock_state text not null default 'coming_soon' check (stock_state in ('in_stock','sold_out','coming_soon')),
  sizes jsonb not null default '[]'::jsonb,
  size_chart jsonb not null default '[]'::jsonb,
  model_height_cm integer,
  model_size text,
  expected_month text,
  images jsonb not null default '[]'::jsonb,
  sample boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists signups (
  id text primary key,
  email text not null,
  whatsapp text,
  product_id text not null references drops(id) on delete cascade,
  size text not null,
  country text not null check (country in ('IN','CA')),
  utm_source text,
  utm_medium text,
  utm_campaign text,
  consent_email boolean not null default false,
  consent_email_at timestamptz,
  consent_whatsapp boolean not null default false,
  consent_whatsapp_at timestamptz,
  email_confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now()
);
create unique index if not exists signups_email_product on signups (lower(email), product_id);
create index if not exists signups_product_created on signups (product_id, created_at);

create table if not exists polls (
  id text primary key,
  title text not null,
  options jsonb not null default '[]'::jsonb,
  closes_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists votes (
  id text primary key,
  poll_id text not null references polls(id) on delete cascade,
  option_id text not null,
  email text not null,
  created_at timestamptz not null default now()
);
create unique index if not exists votes_one_per_email on votes (poll_id, lower(email));

-- Service role only. No anon access: the site talks to the DB from the server.
alter table drops enable row level security;
alter table signups enable row level security;
alter table polls enable row level security;
alter table votes enable row level security;
