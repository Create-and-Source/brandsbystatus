create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_collection_assignments (
  product_id text not null,
  collection_id uuid not null references public.collections(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (product_id, collection_id)
);

create table if not exists public.collection_images (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.collections(id) on delete cascade,
  orientation text not null check (orientation in ('horizontal', 'portrait_4x5')),
  url text not null,
  storage_path text,
  alt text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists product_collection_assignments_product_id_idx
  on public.product_collection_assignments(product_id);

create index if not exists collection_images_collection_id_orientation_idx
  on public.collection_images(collection_id, orientation, sort_order);

insert into storage.buckets (id, name, public)
values ('collection-images', 'collection-images', true)
on conflict (id) do update set public = excluded.public;

alter table public.collections enable row level security;
alter table public.product_collection_assignments enable row level security;
alter table public.collection_images enable row level security;

-- The app reads/writes through Vercel API routes using the Supabase service role key.
-- No public RLS policies are needed for these tables.
