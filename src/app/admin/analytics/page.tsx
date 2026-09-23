import { getAdminContext } from "../../../lib/admin";

export default async function AdminAnalyticsPage() {
  const admin = await getAdminContext();
  if (!admin) return null;
  const { data: events } = await admin.supabase
    .from("analytics_events")
    .select("event_type,device_type,created_at")
    .order("created_at", { ascending: false })
    .limit(5000);
  const rows = events ?? [];
  const byType = new Map<string, number>();
  const byDevice = new Map<string, number>();
  rows.forEach((event) => {
    byType.set(event.event_type, (byType.get(event.event_type) ?? 0) + 1);
    byDevice.set(
      event.device_type || "unknown",
      (byDevice.get(event.device_type || "unknown") ?? 0) + 1,
    );
  });
  return (
    <>
      <div className="mb-7">
        <p className="text-brand mb-2 text-[10px] font-black tracking-[.14em]">
          ANALYTICS PLATFORM
        </p>
        <h1 className="display-font text-3xl font-black">Aktivitas pengunjung</h1>
        <p className="text-muted mt-2 text-sm">
          Ringkasan event yang sudah tercatat dari seluruh storefront.
        </p>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <article className="border-line rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="display-font mb-5 text-xl font-black">Event berdasarkan tipe</h2>
          {[...byType.entries()]
            .sort((a, b) => b[1] - a[1])
            .map(([type, count]) => (
              <div
                key={type}
                className="border-line flex items-center justify-between border-t py-3 text-sm"
              >
                <span className="capitalize">{type.replaceAll("_", " ")}</span>
                <b>{count}</b>
              </div>
            ))}
          {!rows.length && <p className="text-muted text-sm">Belum ada event.</p>}
        </article>
        <article className="border-line rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="display-font mb-5 text-xl font-black">Perangkat</h2>
          {[...byDevice.entries()]
            .sort((a, b) => b[1] - a[1])
            .map(([type, count]) => (
              <div
                key={type}
                className="border-line flex items-center justify-between border-t py-3 text-sm"
              >
                <span className="capitalize">{type}</span>
                <b>{count}</b>
              </div>
            ))}
        </article>
      </div>
    </>
  );
}
