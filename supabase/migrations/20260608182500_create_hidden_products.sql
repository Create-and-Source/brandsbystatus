create table if not exists public.hidden_products (
  product_id text primary key,
  created_at timestamptz not null default now()
);

alter table public.hidden_products enable row level security;
