-- Keep the parent storefront timestamp current when public catalog content changes.
-- This also records deletions, which cannot be inferred from the remaining child rows.
create or replace function public.touch_tenant_public_content_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  affected_tenant_id uuid;
begin
  if tg_op = 'DELETE' then
    affected_tenant_id := old.tenant_id;
  else
    affected_tenant_id := new.tenant_id;
  end if;

  update public.tenants
  set updated_at = transaction_timestamp()
  where id = affected_tenant_id;

  if tg_op = 'UPDATE' and old.tenant_id is distinct from new.tenant_id then
    update public.tenants
    set updated_at = transaction_timestamp()
    where id = old.tenant_id;
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;

create trigger products_touch_storefront_updated_at
after insert or update or delete on public.products
for each row execute function public.touch_tenant_public_content_updated_at();

create trigger categories_touch_storefront_updated_at
after insert or update or delete on public.categories
for each row execute function public.touch_tenant_public_content_updated_at();

create trigger custom_links_touch_storefront_updated_at
after insert or update or delete on public.custom_links
for each row execute function public.touch_tenant_public_content_updated_at();
