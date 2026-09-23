-- Repair accounts created before the profile trigger/migration was installed.
insert into public.profiles (id, email, name)
select u.id, u.email, coalesce(u.raw_user_meta_data ->> 'name', '')
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles(id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'name', ''))
  on conflict (id) do update set email = excluded.email, name = excluded.name;
  return new;
end;
$$;
