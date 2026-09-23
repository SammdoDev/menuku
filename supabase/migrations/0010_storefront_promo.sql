alter table public.tenants
  add column if not exists promo_enabled boolean not null default false,
  add column if not exists promo_title varchar(120),
  add column if not exists promo_description varchar(300),
  add column if not exists promo_image_url text,
  add column if not exists promo_link_url text;
