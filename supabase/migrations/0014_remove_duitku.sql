-- Stop pending invoices created by the removed Duitku integration.
update public.subscriptions
set status = 'failed',
    payment_url = null
where payment_provider in ('duitku', 'legacy')
  and status = 'pending';

-- Keep completed legacy rows as history without retaining a live provider label.
update public.subscriptions
set payment_provider = 'legacy'
where payment_provider = 'duitku';

alter table public.subscriptions
  drop column if exists duitku_reference;
