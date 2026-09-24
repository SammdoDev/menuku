import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Clock3, Mail, MessageCircle, Store, UsersRound } from "lucide-react";
import { getAdminContext } from "../../../lib/admin";
import { supportWhatsAppUrl } from "../../../lib/site";

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
type Event = { tenant_id: string; event_type: string; created_at: string };
type Subscription = { tenant_id: string; plan: string; status: string; expires_at: string | null };

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(value));

export default async function AdminCustomersPage() {
  const admin = await getAdminContext();
  if (!admin) return null;

  const [{ data: tenantRows }, { data: profileRows }, { data: eventRows }, { data: subscriptionRows }] =
    await Promise.all([
      admin.supabase.from("tenants").select("id,name,slug,owner_id,plan,is_published,is_active,created_at").order("created_at", { ascending: false }),
      admin.supabase.from("profiles").select("id,email,name,created_at").order("created_at", { ascending: false }),
      admin.supabase.from("analytics_events").select("tenant_id,event_type,created_at").order("created_at", { ascending: false }).limit(5000),
      admin.supabase.from("subscriptions").select("tenant_id,plan,status,expires_at").in("status", ["active", "pending"]).order("created_at", { ascending: false }),
    ]);

  const tenants = (tenantRows ?? []) as Tenant[];
  const profiles = (profileRows ?? []) as Profile[];
  const events = (eventRows ?? []) as Event[];
  const subscriptions = (subscriptionRows ?? []) as Subscription[];
  const ownerById = new Map(profiles.map((profile) => [profile.id, profile]));
  const latestSubscription = new Map<string, Subscription>();
  subscriptions.forEach((subscription) => {
    if (!latestSubscription.has(subscription.tenant_id)) latestSubscription.set(subscription.tenant_id, subscription);
  });
  const eventsByTenant = new Map<string, Event[]>();
  events.forEach((event) => eventsByTenant.set(event.tenant_id, [...(eventsByTenant.get(event.tenant_id) ?? []), event]));
  const activePaid = tenants.filter((tenant) => ["premium", "business"].includes(tenant.plan));
  const published = tenants.filter((tenant) => tenant.is_published && tenant.is_active);
  const needsAttention = tenants.filter((tenant) => !tenant.is_published || !tenant.is_active || !(eventsByTenant.get(tenant.id)?.length));

  return (
    <>
      <section className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-brand mb-2 text-[10px] font-black tracking-[.14em]">CUSTOMER RELATIONSHIP</p>
          <h1 className="display-font text-3xl font-black sm:text-4xl">CRM & retensi</h1>
          <p className="text-muted mt-2 max-w-2xl text-sm">Satu tempat untuk melihat siapa yang perlu disapa, dibantu publish, atau diarahkan upgrade.</p>
        </div>
        <Link href="/admin" className="text-brand inline-flex items-center gap-1 text-sm font-extrabold">Kembali ke ringkasan <ArrowUpRight size={16} /></Link>
      </section>

      <section className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {([
          ["Total pelanggan", tenants.length, "Bisnis terdaftar", UsersRound],
          ["Pelanggan berbayar", activePaid.length, "Premium + Business", CheckCircle2],
          ["Sudah live", published.length, "Storefront aktif", Store],
          ["Perlu follow-up", needsAttention.length, "Belum aktif optimal", Clock3],
        ] as const).map(([label, value, note, Icon]) => (
          <article key={label as string} className="border-line rounded-2xl border bg-white p-4 shadow-sm sm:p-5">
            <Icon className="text-brand mb-4" size={20} />
            <small className="text-muted block text-xs">{label as string}</small>
            <strong className="display-font my-2 block text-3xl font-black">{value as number}</strong>
            <span className="text-muted text-[10px]">{note as string}</span>
          </article>
        ))}
      </section>

      <section className="mb-6 grid gap-5 lg:grid-cols-[1.4fr_.6fr]">
        <article className="border-line overflow-hidden rounded-2xl border bg-white shadow-sm">
          <header className="flex items-center justify-between p-5 sm:p-6">
            <div><p className="text-brand mb-1 text-[10px] font-black tracking-[.14em]">ACTION QUEUE</p><h2 className="display-font text-xl font-black">Pelanggan yang perlu disapa</h2></div>
            <span className="text-muted text-xs">{needsAttention.length} akun</span>
          </header>
          <div className="grid gap-2 px-5 pb-5">
            {needsAttention.slice(0, 6).map((tenant) => {
              const owner = ownerById.get(tenant.owner_id);
              const tenantEvents = eventsByTenant.get(tenant.id) ?? [];
              const reason = !tenant.is_active ? "Akun suspended" : !tenant.is_published ? "Belum publish" : "Belum ada kunjungan";
              return <div key={tenant.id} className="border-line flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center">
                <div className="bg-orange-50 text-brand grid size-10 shrink-0 place-items-center rounded-xl text-xs font-black">{tenant.name.slice(0, 2).toUpperCase()}</div>
                <div className="min-w-0 flex-1"><b className="block truncate">{tenant.name}</b><span className="text-muted block truncate text-xs">{owner?.email ?? "Email tidak tersedia"} · {reason}</span></div>
                <span className="text-muted text-xs">{tenantEvents.length} event</span>
                {owner?.email && <a className="border-line inline-flex items-center justify-center rounded-lg border p-2 text-[#716d65] hover:text-brand" href={`mailto:${owner.email}`} title="Email pelanggan"><Mail size={15} /></a>}
                <Link className="bg-brand inline-flex items-center justify-center rounded-lg p-2 text-white" href={`/store/${tenant.slug}`} target="_blank" title="Buka storefront"><ArrowUpRight size={15} /></Link>
              </div>;
            })}
            {!needsAttention.length && <p className="text-muted rounded-xl bg-emerald-50 p-4 text-sm">Semua pelanggan sudah aktif optimal.</p>}
          </div>
        </article>
        <article className="bg-charcoal rounded-2xl p-6 text-white shadow-sm">
          <p className="mb-2 text-[10px] font-black tracking-[.14em] text-[#ff9c79]">QUICK PLAYBOOK</p>
          <h2 className="display-font text-2xl font-black">Follow-up yang terasa personal.</h2>
          <p className="mt-3 text-sm leading-6 text-white/60">Mulai dari pelanggan yang belum publish, lalu bantu mereka menyelesaikan menu pertama.</p>
          <a href={supportWhatsAppUrl("Halo admin Menuku, saya ingin follow-up pelanggan.")} target="_blank" rel="noreferrer" className="bg-brand mt-6 inline-flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-extrabold"><MessageCircle size={16} /> Buka WhatsApp</a>
        </article>
      </section>

      <section className="border-line overflow-hidden rounded-2xl border bg-white shadow-sm">
        <header className="p-5 sm:p-6"><p className="text-brand mb-1 text-[10px] font-black tracking-[.14em]">CUSTOMER DIRECTORY</p><h2 className="display-font text-xl font-black">Semua pelanggan</h2></header>
        <div className="overflow-x-auto"><table className="w-full min-w-[820px] text-left text-sm"><thead className="bg-[#faf8f4] text-[10px] font-black tracking-[.1em] text-[#8f877c] uppercase"><tr><th className="px-5 py-3">Bisnis & pemilik</th><th className="px-5 py-3">Plan</th><th className="px-5 py-3">Aktivitas</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Daftar</th></tr></thead><tbody>
          {tenants.map((tenant) => { const owner = ownerById.get(tenant.owner_id); const tenantEvents = eventsByTenant.get(tenant.id) ?? []; const subscription = latestSubscription.get(tenant.id); return <tr key={tenant.id} className="border-line border-t"><td className="px-5 py-4"><b className="block">{tenant.name}</b><span className="text-muted text-xs">{owner?.name || owner?.email || "-"}</span></td><td className="px-5 py-4"><span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-700 capitalize">{subscription?.plan || tenant.plan}</span></td><td className="px-5 py-4"><span className="font-bold">{tenantEvents.length}</span><span className="text-muted ml-1 text-xs">event</span></td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${tenant.is_active && tenant.is_published ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{!tenant.is_active ? "Suspended" : tenant.is_published ? "Live" : "Onboarding"}</span></td><td className="text-muted px-5 py-4 text-xs">{formatDate(tenant.created_at)}</td></tr>; })}
        </tbody></table></div>
      </section>
    </>
  );
}
