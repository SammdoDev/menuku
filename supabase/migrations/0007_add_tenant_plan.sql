alter table public.tenants
add column if not exists plan varchar(16) not null default 'free';

alter table public.tenants drop constraint if exists tenant_plan;
alter table public.tenants
add constraint tenant_plan check (plan in ('free', 'premium', 'business'));
