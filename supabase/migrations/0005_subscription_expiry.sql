alter table public.subscriptions add column if not exists expires_at timestamptz;
alter table public.subscriptions add column if not exists reminder_sent_at timestamptz;
