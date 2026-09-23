alter table public.subscriptions
add column if not exists months integer not null default 1;

alter table public.subscriptions
add column if not exists previous_plan varchar(16);

alter table public.subscriptions
alter column order_id type varchar(160);