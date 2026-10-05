alter table public.subscriptions
  add column if not exists payment_receipt_email_attempted_at timestamptz,
  add column if not exists payment_receipt_email_sent_at timestamptz,
  add column if not exists invoice_expired_email_attempted_at timestamptz,
  add column if not exists invoice_expired_email_sent_at timestamptz;
