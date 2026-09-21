-- Menuku core schema. Apply in Supabase SQL Editor before enabling the app.
create extension if not exists "pgcrypto";

create type public.analytics_event_type as enum ('page_view','product_view','category_click','link_click','whatsapp_click','instagram_click','maps_click','share_click');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email varchar(255) not null,
  name varchar(120),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.themes (
  id uuid primary key default gen_random_uuid(), name varchar(80) not null, code varchar(40) not null unique,
  config_json jsonb not null default '{}', created_at timestamptz not null default now()
);
create table public.tenants (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references public.profiles(id) on delete cascade,
  name varchar(120) not null, slug varchar(30) not null unique, description varchar(300), business_type varchar(60),
  logo_url text, banner_url text, whatsapp varchar(30), instagram varchar(100), address text, maps_url text,
  opening_hours jsonb not null default '{}', theme_id uuid references public.themes(id) on delete set null,
  primary_color varchar(7) not null default '#FF6534', background_color varchar(7) not null default '#F7F6F2',
  plan varchar(16) not null default 'free',
  layout_type varchar(16) not null default 'grid', show_price boolean not null default true, show_address boolean not null default true,
  show_opening_hours boolean not null default true, is_published boolean not null default false, is_active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint tenant_slug_format check (slug = lower(slug) and slug ~ '^[a-z0-9]([a-z0-9-]{1,28})[a-z0-9]$'),
  constraint tenant_slug_reserved check (slug not in ('www','app','admin','api','dashboard','login','register','support','help','pricing','settings')),
  constraint tenant_plan check (plan in ('free','premium','business')),
  constraint tenant_layout_type check (layout_type in ('grid','list'))
);
create table public.categories (
  id uuid primary key default gen_random_uuid(), tenant_id uuid not null references public.tenants(id) on delete cascade,
  name varchar(80) not null, slug varchar(80) not null, description varchar(200), sort_order integer not null default 0,
  is_active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(tenant_id, slug)
);
create table public.products (
  id uuid primary key default gen_random_uuid(), tenant_id uuid not null references public.tenants(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null, name varchar(120) not null, slug varchar(140) not null,
  description text, price integer not null, discount_price integer, image_url text, image_thumbnail_url text, imgbb_image_id varchar(100),
  is_featured boolean not null default false, is_available boolean not null default true, is_active boolean not null default true,
  sort_order integer not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(tenant_id, slug), constraint product_price_valid check (price >= 0 and (discount_price is null or (discount_price >= 0 and discount_price <= price)))
);
create table public.custom_links (
  id uuid primary key default gen_random_uuid(), tenant_id uuid not null references public.tenants(id) on delete cascade,
  title varchar(100) not null, url text not null, icon varchar(40), link_type varchar(30) not null default 'custom', sort_order integer not null default 0,
  is_active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint custom_link_url_valid check (url ~* '^https?://')
);
create table public.analytics_events (
  id uuid primary key default gen_random_uuid(), tenant_id uuid not null references public.tenants(id) on delete cascade,
  event_type public.analytics_event_type not null, product_id uuid references public.products(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null, link_id uuid references public.custom_links(id) on delete set null,
  session_id varchar(80) not null, referrer text, device_type varchar(16), browser varchar(40), created_at timestamptz not null default now()
);
create table public.analytics_daily (
  id uuid primary key default gen_random_uuid(), tenant_id uuid not null references public.tenants(id) on delete cascade,
  event_date date not null, page_views integer not null default 0, unique_visitors integer not null default 0, product_views integer not null default 0,
  category_clicks integer not null default 0, link_clicks integer not null default 0, whatsapp_clicks integer not null default 0,
  maps_clicks integer not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(tenant_id, event_date)
);

create index tenants_owner_id_idx on public.tenants(owner_id);
create index categories_tenant_sort_idx on public.categories(tenant_id,sort_order);
create index products_tenant_category_idx on public.products(tenant_id,category_id);
create index products_tenant_active_idx on public.products(tenant_id,is_active);
create index products_tenant_featured_idx on public.products(tenant_id,is_featured);
create index products_tenant_sort_idx on public.products(tenant_id,sort_order);
create index custom_links_tenant_sort_idx on public.custom_links(tenant_id,sort_order);
create index analytics_events_tenant_created_idx on public.analytics_events(tenant_id,created_at);
create index analytics_events_tenant_event_created_idx on public.analytics_events(tenant_id,event_type,created_at);
create index analytics_events_tenant_product_created_idx on public.analytics_events(tenant_id,product_id,created_at);

create or replace function public.set_updated_at() returns trigger language plpgsql security invoker set search_path = '' as $$
begin new.updated_at = now(); return new; end; $$;
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger tenants_updated_at before update on public.tenants for each row execute function public.set_updated_at();
create trigger categories_updated_at before update on public.categories for each row execute function public.set_updated_at();
create trigger products_updated_at before update on public.products for each row execute function public.set_updated_at();
create trigger custom_links_updated_at before update on public.custom_links for each row execute function public.set_updated_at();
create trigger analytics_daily_updated_at before update on public.analytics_daily for each row execute function public.set_updated_at();

-- A profile is provisioned automatically after Supabase Auth registration.
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin insert into public.profiles(id,email,name) values (new.id,new.email,coalesce(new.raw_user_meta_data ->> 'name','')); return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.themes enable row level security;
alter table public.tenants enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.custom_links enable row level security;
alter table public.analytics_events enable row level security;
alter table public.analytics_daily enable row level security;

create policy "profiles: select own" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "profiles: update own" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "themes: readable" on public.themes for select using (true);

create policy "tenants: owner access" on public.tenants for all to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy "tenants: public storefront" on public.tenants for select to anon, authenticated using (is_published and is_active);

create policy "categories: owner access" on public.categories for all to authenticated using (exists (select 1 from public.tenants t where t.id = tenant_id and t.owner_id = (select auth.uid()))) with check (exists (select 1 from public.tenants t where t.id = tenant_id and t.owner_id = (select auth.uid())));
create policy "categories: public storefront" on public.categories for select to anon, authenticated using (is_active and exists (select 1 from public.tenants t where t.id = tenant_id and t.is_published and t.is_active));

create policy "products: owner access" on public.products for all to authenticated using (exists (select 1 from public.tenants t where t.id = tenant_id and t.owner_id = (select auth.uid()))) with check (exists (select 1 from public.tenants t where t.id = tenant_id and t.owner_id = (select auth.uid())));
create policy "products: public storefront" on public.products for select to anon, authenticated using (is_active and exists (select 1 from public.tenants t where t.id = tenant_id and t.is_published and t.is_active));

create policy "links: owner access" on public.custom_links for all to authenticated using (exists (select 1 from public.tenants t where t.id = tenant_id and t.owner_id = (select auth.uid()))) with check (exists (select 1 from public.tenants t where t.id = tenant_id and t.owner_id = (select auth.uid())));
create policy "links: public storefront" on public.custom_links for select to anon, authenticated using (is_active and exists (select 1 from public.tenants t where t.id = tenant_id and t.is_published and t.is_active));

create policy "events: owner read" on public.analytics_events for select to authenticated using (exists (select 1 from public.tenants t where t.id = tenant_id and t.owner_id = (select auth.uid())));
create policy "events: public insert" on public.analytics_events for insert to anon, authenticated with check (exists (select 1 from public.tenants t where t.id = tenant_id and t.is_published and t.is_active));
create policy "daily: owner access" on public.analytics_daily for all to authenticated using (exists (select 1 from public.tenants t where t.id = tenant_id and t.owner_id = (select auth.uid()))) with check (exists (select 1 from public.tenants t where t.id = tenant_id and t.owner_id = (select auth.uid())));

insert into public.themes(name,code,config_json) values
  ('Clean','clean','{"primaryColor":"#FF6534","backgroundColor":"#F7F6F2"}'),
  ('Dark Cafe','dark-cafe','{"primaryColor":"#E89C5D","backgroundColor":"#24211D"}'),
  ('Colorful Food','colorful-food','{"primaryColor":"#E64A48","backgroundColor":"#FFF7E7"}')
on conflict (code) do nothing;
