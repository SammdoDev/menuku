alter table public.subscriptions
  add column if not exists invoice_email_attempted_at timestamptz,
  add column if not exists invoice_email_sent_at timestamptz,
  add column if not exists pakasir_status_checked_at timestamptz,
  add column if not exists billing_pending_lock boolean not null default false;

-- Existing open invoices remain valid; only the newest one holds the creation lock.
with ranked_pending as (
  select id,
         row_number() over (partition by tenant_id order by created_at desc, id desc) as position
  from public.subscriptions
  where status = 'pending'
)
update public.subscriptions as subscriptions
set billing_pending_lock = ranked_pending.position = 1
from ranked_pending
where subscriptions.id = ranked_pending.id;

create unique index if not exists subscriptions_one_pending_per_tenant_key
  on public.subscriptions (tenant_id)
  where status = 'pending' and billing_pending_lock;
