create extension if not exists "pgcrypto";

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_category_assignments (
  product_id text not null,
  category_id uuid not null references public.categories(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (product_id, category_id)
);

create table if not exists public.hidden_products (
  product_id text primary key,
  created_at timestamptz not null default now()
);

create index if not exists product_category_assignments_product_id_idx
  on public.product_category_assignments(product_id);

alter table public.categories enable row level security;
alter table public.product_category_assignments enable row level security;
alter table public.hidden_products enable row level security;

-- The app reads/writes through Vercel API routes using the Supabase service role key.
-- No public RLS policies are needed for these tables.
