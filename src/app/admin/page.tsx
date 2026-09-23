import Link from "next/link";
import { Activity, ArrowUpRight, Eye, Store, Users } from "lucide-react";
import { getAdminContext } from "../../lib/admin";

type Tenant = {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  plan: string;
  is_published: boolean;
  is_active: boolean;
  created_at: string;
};
type Profile = { id: string; email: string; name: string | null; created_at: string };

const date = (value: string) =>
  new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(value));

export default async function AdminPage() {
  const admin = await getAdminContext();
  if (!admin) return null;
  const [{ data: tenants }, { data: profiles }, { data: events }] = await Promise.all([
    admin.supabase
      .from("tenants")
      .select("id,name,slug,owner_id,plan,is_published,is_active,created_at")
      .order("created_at", { ascending: false }),
    admin.supabase
      .from("profiles")
      .select("id,email,name,created_at")
      .order("created_at", { ascending: false }),
    admin.supabase
      .from("analytics_events")
      .select("event_type,created_at,tenant_id")
      .order("created_at", { ascending: false })
      .limit(1000),
  ]);
  const businesses = (tenants ?? []) as Tenant[];
  const users = (profiles ?? []) as Profile[];
  const activity = events ?? [];
  const today = new Date().toISOString().slice(0, 10);
  const todayEvents = activity.filter((event) => event.created_at.startsWith(today));
  const metrics = [
    ["Total user", users.length, "Akun terdaftar", Users],
    [
      "Total bisnis",
      businesses.length,
      `${businesses.filter((item) => item.is_active).length} aktif`,
      Store,
    ],
    [
      "Halaman publik",
      businesses.filter((item) => item.is_published).length,
      "Sudah dipublikasikan",
      Eye,
    ],
    ["Event hari ini", todayEvents.length, "Dari 1.000 event terbaru", Activity],
  ] as const;
  const ownerById = new Map(users.map((user) => [user.id, user]));
  return (
    <>
      <section className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-brand mb-2 text-[10px] font-black tracking-[.14em]">
            PLATFORM OVERVIEW
          </p>
          <h1 className="display-font text-3xl font-black sm:text-4xl">Pantau Menuku.</h1>
          <p className="text-muted mt-2 text-sm">
            Monitor pertumbuhan user, bisnis, dan aktivitas platform.
          </p>
        </div>
        <Link
          href="/admin/analytics"
          className="text-brand inline-flex items-center gap-1 text-sm font-extrabold"
        >
          Lihat analytics <ArrowUpRight size={16} />
        </Link>
      </section>
      <section className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {metrics.map(([label, value, note, Icon]) => (
          <article
            key={label}
            className="border-line rounded-2xl border bg-white p-4 shadow-sm sm:p-5"
          >
            <Icon className="text-brand mb-4" size={20} />
            <small className="text-muted block text-xs">{label}</small>
            <strong className="display-font my-2 block text-3xl font-black">{value}</strong>
            <span className="text-muted text-[10px]">{note}</span>
          </article>
        ))}
      </section>
      <section className="border-line overflow-hidden rounded-2xl border bg-white shadow-sm">
        <header className="flex items-center justify-between p-5 sm:p-6">
          <div>
            <p className="text-brand mb-1 text-[10px] font-black tracking-[.14em]">
              TENANT TERBARU
            </p>
            <h2 className="display-font text-xl font-black">Bisnis terdaftar</h2>
          </div>
          <span className="text-muted text-xs">{businesses.length} bisnis</span>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-[#faf8f4] text-[10px] font-black tracking-[.1em] text-[#8f877c] uppercase">
              <tr>
                <th className="px-5 py-3">Bisnis</th>
                <th className="px-5 py-3">Pemilik</th>
                <th className="px-5 py-3">Plan</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Daftar</th>
              </tr>
            </thead>
            <tbody>
              {businesses.slice(0, 20).map((tenant) => {
                const owner = ownerById.get(tenant.owner_id);
                return (
                  <tr key={tenant.id} className="border-line border-t">
                    <td className="px-5 py-4">
                      <b className="block">{tenant.name}</b>
                      <span className="text-muted text-xs">/store/{tenant.slug}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="block">{owner?.name || "-"}</span>
                      <span className="text-muted text-xs">{owner?.email || "-"}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-700 capitalize">
                        {tenant.plan}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${tenant.is_active && tenant.is_published ? "bg-emerald-50 text-emerald-700" : tenant.is_active ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"}`}
                      >
                        {!tenant.is_active ? "Suspended" : tenant.is_published ? "Publik" : "Draft"}
                      </span>
                    </td>
                    <td className="text-muted px-5 py-4 text-xs">{date(tenant.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
