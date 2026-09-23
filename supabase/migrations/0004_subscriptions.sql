create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(), tenant_id uuid not null references public.tenants(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade, plan varchar(16) not null,
  amount integer not null, order_id varchar(80) not null unique, status varchar(20) not null default 'pending',
  paid_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint subscription_plan_valid check (plan in ('premium', 'business'))
);
alter table public.subscriptions enable row level security;
create policy "subscriptions: owner read" on public.subscriptions for select to authenticated using (owner_id = (select auth.uid()));
create policy "subscriptions: owner insert" on public.subscriptions for insert to authenticated with check (owner_id = (select auth.uid()) and exists (select 1 from public.tenants where id = tenant_id and owner_id = (select auth.uid())));
