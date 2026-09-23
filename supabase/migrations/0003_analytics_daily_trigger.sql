-- Keep dashboard aggregates in sync with raw storefront events.
create or replace function public.aggregate_analytics_event()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  event_day date := (new.created_at at time zone 'Asia/Jakarta')::date;
begin
  insert into public.analytics_daily (tenant_id, event_date, page_views, unique_visitors, product_views, category_clicks, link_clicks, whatsapp_clicks, maps_clicks)
  values (new.tenant_id, event_day,
    case when new.event_type = 'page_view' then 1 else 0 end,
    case when new.event_type = 'page_view' then 1 else 0 end,
    case when new.event_type = 'product_view' then 1 else 0 end,
    case when new.event_type = 'category_click' then 1 else 0 end,
    case when new.event_type = 'link_click' then 1 else 0 end,
    case when new.event_type = 'whatsapp_click' then 1 else 0 end,
    case when new.event_type = 'maps_click' then 1 else 0 end)
  on conflict (tenant_id, event_date) do update set
    page_views = analytics_daily.page_views + excluded.page_views,
    product_views = analytics_daily.product_views + excluded.product_views,
    category_clicks = analytics_daily.category_clicks + excluded.category_clicks,
    link_clicks = analytics_daily.link_clicks + excluded.link_clicks,
    whatsapp_clicks = analytics_daily.whatsapp_clicks + excluded.whatsapp_clicks,
    maps_clicks = analytics_daily.maps_clicks + excluded.maps_clicks,
    unique_visitors = (select count(distinct session_id) from public.analytics_events where tenant_id = new.tenant_id and event_type = 'page_view' and (created_at at time zone 'Asia/Jakarta')::date = event_day),
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists analytics_event_daily_trigger on public.analytics_events;
create trigger analytics_event_daily_trigger after insert on public.analytics_events for each row execute function public.aggregate_analytics_event();
