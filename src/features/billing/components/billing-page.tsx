import { Check, CreditCard, Sparkles } from "lucide-react";
import Link from "next/link";
import DashboardShell from "@/features/dashboard/components/dashboard-shell";
import { getCurrentMerchant } from "@/features/stores/queries/current-merchant";
import { plans, type PlanCode } from "../plans";
import { formatRupiah } from "@/lib/format";
import { billingConfirmationUrl } from "../invoice-data";
import { getPendingInvoice } from "../pending-invoice-query";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import BillingButtons from "./billing-buttons";
import InvoiceEmailButton from "./invoice-email-button";

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
  const pendingInvoice = await getPendingInvoice(createSupabaseAdminClient(), tenant.id);
  return (
    <DashboardShell tenant={tenant} active="billing" title="Paket & pembayaran">
      <section className="mb-7">
        <p className="text-brand mb-2 flex items-center gap-1.5 text-[10px] font-black tracking-[.14em]">
          <Sparkles size={14} /> PAKET MENUKU
        </p>
        <h1 className="display-font text-3xl font-black sm:text-4xl">
          Pilih paket untuk bisnismu.
        </h1>
        <p className="text-muted mt-2 text-sm">
          Pilih transfer manual sesuai nominal invoice atau bayar otomatis dengan QRIS Pakasir.
        </p>
        {subscription?.status === "active" && subscription.expires_at && (
          <p className="mt-3 w-fit rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
            Paket {subscription.plan} aktif sampai{" "}
            {new Date(subscription.expires_at).toLocaleDateString("id-ID")}
          </p>
        )}
        {pendingInvoice?.status === "pending" && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
            <p className="font-extrabold">Selesaikan invoice yang masih menunggu</p>
            <p className="mt-1 text-xs leading-5">
              Invoice {pendingInvoice.order_id} untuk paket {pendingInvoice.plan} sebesar{" "}
              {formatRupiah(pendingInvoice.amount)} masih aktif. Kamu bisa membuat invoice baru
              setelah pembayaran ini selesai atau dibatalkan.
            </p>
            {pendingInvoice.payment_url ? (
              <a
                href={pendingInvoice.payment_url}
                className="mt-3 inline-flex min-h-10 items-center rounded-xl bg-amber-950 px-4 text-xs font-extrabold text-white"
              >
                Lanjutkan pembayaran
              </a>
            ) : (
              <Link
                href={billingConfirmationUrl(pendingInvoice.order_id, pendingInvoice.plan)}
                className="mt-3 inline-flex min-h-10 items-center rounded-xl bg-amber-950 px-4 text-xs font-extrabold text-white"
              >
                Lihat invoice
              </Link>
            )}
            {pendingInvoice.invoice_email_sent_at ? (
              <p className="mt-3 text-xs font-bold text-emerald-800">
                Instruksi pembayaran sudah dikirim ke email akun.
              </p>
            ) : (
              <InvoiceEmailButton />
            )}
          </div>
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
                {formatRupiah(plan.price)}
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
                <BillingButtons
                  code={code}
                  price={plan.price}
                  currentPlan={current}
                  currentExpiresAt={subscription?.expires_at}
                  blockedByPending={Boolean(pendingInvoice?.status === "pending")}
                />
              ) : (
                <BillingButtons
                  code={code}
                  price={plan.price}
                  currentPlan={current}
                  currentExpiresAt={subscription?.expires_at}
                  blockedByPending={Boolean(pendingInvoice?.status === "pending")}
                />
              )}
            </article>
          );
        })}
      </div>
    </DashboardShell>
  );
}
