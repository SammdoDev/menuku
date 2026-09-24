alter table public.tenants
  add column if not exists is_community_visible boolean not null default true;

comment on column public.tenants.is_community_visible is
  'Controls whether a published active tenant appears on the public Community directory.';
