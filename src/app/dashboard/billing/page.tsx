import { Check, CreditCard, Sparkles } from "lucide-react";
import DashboardShell from "../../../components/dashboard-shell";
import { getCurrentMerchant } from "../../../lib/merchant";
import { plans, rupiah, type PlanCode } from "../../../lib/plans";
import BillingButtons from "./billing-buttons";

export default async function BillingPage() {
  const { user, tenant, supabase } = await getCurrentMerchant();
  if (!user || !tenant) return null;
  const current = tenant.plan || "free";
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan,status,expires_at,amount")
    .eq("tenant_id", tenant.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (
    <DashboardShell tenant={tenant} active="settings" title="Paket & pembayaran">
      <section className="mb-7">
        <p className="text-brand mb-2 flex items-center gap-1.5 text-[10px] font-black tracking-[.14em]">
          <Sparkles size={14} /> PAKET MENUKU
        </p>
        <h1 className="display-font text-3xl font-black sm:text-4xl">
          Pilih paket untuk bisnismu.
        </h1>
        <p className="text-muted mt-2 text-sm">
          Naikkan paket kapan saja. Pembayaran dilakukan langsung melalui QRIS Menuku dan
          diverifikasi admin.
        </p>
        {subscription?.status === "active" && subscription.expires_at && (
          <p className="mt-3 w-fit rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
            Paket {subscription.plan} aktif sampai{" "}
            {new Date(subscription.expires_at).toLocaleDateString("id-ID")}
          </p>
        )}
      </section>
      <div className="grid gap-5 lg:grid-cols-3">
        {(Object.entries(plans) as [PlanCode, (typeof plans)[PlanCode]][]).map(([code, plan]) => {
          const active = current === code;
          return (
            <article
              key={code}
              className={`relative rounded-3xl border p-6 ${code === "premium" ? "border-brand bg-charcoal text-white shadow-xl" : "border-line bg-white"}`}
            >
              {code === "premium" && (
                <span className="bg-brand absolute -top-3 left-6 rounded-full px-3 py-1 text-[10px] font-black text-white">
                  PALING POPULER
                </span>
              )}
              <h2 className="display-font text-2xl font-black">{plan.name}</h2>
              <p className="text-muted mt-2 min-h-10 text-sm">{plan.description}</p>
              <strong className="mt-5 block text-3xl">
                {rupiah(plan.price)}
                {code !== "free" && (
                  <small className="text-muted text-xs font-normal"> / bulan</small>
                )}
              </strong>
              <ul className="my-6 grid gap-3 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check size={15} className="text-brand" />
                    {feature}
                  </li>
                ))}
              </ul>
              {active ? (
                <span className="border-line flex min-h-12 items-center justify-center gap-2 rounded-xl border text-sm font-extrabold">
                  <CreditCard size={16} /> Paket aktif
                </span>
              ) : code === "free" ? (
                <BillingButtons code={code} price={plan.price} />
              ) : (
                <BillingButtons code={code} price={plan.price} />
              )}
            </article>
          );
        })}
      </div>
    </DashboardShell>
  );
}
