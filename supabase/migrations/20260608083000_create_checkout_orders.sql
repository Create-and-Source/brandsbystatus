create table if not exists public.checkout_orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique,
  status text not null default 'pending_payment',
  cart jsonb not null default '[]'::jsonb,
  customer jsonb not null default '{}'::jsonb,
  printify_order jsonb not null default '{}'::jsonb,
  printify_order_id text,
  amount_total integer,
  currency text not null default 'usd',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists checkout_orders_status_idx
  on public.checkout_orders(status);

create index if not exists checkout_orders_stripe_session_id_idx
  on public.checkout_orders(stripe_session_id);

alter table public.checkout_orders enable row level security;

-- The app reads/writes checkout state through Vercel API routes using the Supabase service role key.
-- No public RLS policies are needed for this table.
