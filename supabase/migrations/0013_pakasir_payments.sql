alter table public.subscriptions
  add column if not exists payment_provider varchar(20),
  add column if not exists pakasir_txn_id varchar(80);

update public.subscriptions
set payment_provider = case
  when payment_method = 'manual' then 'manual'
  when payment_method is not null then 'legacy'
  else payment_provider
end
where payment_provider is null;

create unique index if not exists subscriptions_pakasir_txn_id_key
  on public.subscriptions (pakasir_txn_id)
  where pakasir_txn_id is not null;
