alter table public.subscriptions
  add column if not exists payment_url text,
  add column if not exists duitku_reference varchar(80),
  add column if not exists payment_method varchar(8);
