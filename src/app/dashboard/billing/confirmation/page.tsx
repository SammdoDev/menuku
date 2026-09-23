import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock3, Copy, FileText } from "lucide-react";
import { getCurrentMerchant } from "../../../../lib/merchant";
import { plans, rupiah, type PlanCode } from "../../../../lib/plans";
import Countdown from "./countdown";

export default async function BillingConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; plan?: string }>;
}) {
  const { user, tenant, supabase } = await getCurrentMerchant();
  if (!user || !tenant) return null;
  const params = await searchParams;
  const order = params.order || "";
  const plan = params.plan === "premium" || params.plan === "business" ? params.plan : "premium";
  const { data: invoice } = await supabase
    .from("subscriptions")
    .select("order_id,plan,previous_plan,months,amount,status,created_at")
    .eq("tenant_id", tenant.id)
    .eq("order_id", order)
    .maybeSingle();
  const selectedPlan = (invoice?.plan || plan) as PlanCode;
  const amount = invoice?.amount || plans[selectedPlan].price;
  return (
    <main className="bg-paper grid min-h-dvh place-items-center p-4 sm:p-8">
      <section className="border-line w-full max-w-lg rounded-3xl border bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-7 flex items-start justify-between">
          <div>
            <p className="text-brand mb-2 text-[10px] font-black tracking-[.14em]">
              INVOICE MENUKU
            </p>
            <h1 className="display-font text-3xl font-black">Menunggu pembayaran</h1>
          </div>
          <FileText className="text-brand" size={28} />
        </div>
        <div className="rounded-2xl bg-orange-50 p-5">
          <div className="flex items-center gap-3">
            <Clock3 className="text-brand" size={22} />
            <div>
              <p className="text-xs font-bold text-orange-900">Selesaikan pembayaran dalam</p>
              <Countdown startedAt={invoice?.created_at} />
            </div>
          </div>
        </div>
        <div className="my-6 rounded-2xl bg-[#faf8f4] p-4 text-center">
          <p className="mb-3 text-xs font-bold">Scan QRIS untuk menyelesaikan pembayaran</p>
          <img
            src="/qris.jpeg"
            alt="QRIS pembayaran Menuku"
            className="mx-auto size-56 rounded-xl object-contain"
          />
          <p className="text-muted mt-2 text-[11px]">
            Pastikan nominal transfer sesuai total invoice.
          </p>
        </div>
        <div className="border-line grid gap-3 border-y py-5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Nomor invoice</span>
            <b className="flex items-center gap-1 text-xs">
              <span>{invoice?.order_id || order || "-"}</span>
              <Copy size={13} />
            </b>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Paket</span>
            <b className="capitalize">{plans[selectedPlan].name}</b>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Durasi</span>
            <b>
              {invoice?.months || 1} bulan{invoice?.previous_plan ? " · upgrade prorata" : ""}
            </b>
          </div>
          <div className="flex justify-between text-base">
            <span className="font-bold">Total</span>
            <strong className="text-brand">{rupiah(amount)}</strong>
          </div>
        </div>
        <div className="grid gap-3 text-sm">
          <p className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="text-emerald-600" size={18} /> Konfirmasi pembayaran tercatat
          </p>
          <p className="text-muted leading-6">
            Setelah transfer, admin akan memeriksa pembayaran dan mengaktifkan paket kamu. Invoice
            juga akan dikirim ke email akun.
          </p>
        </div>
        <Link
          href="/dashboard/billing"
          className="border-line mt-7 flex min-h-12 items-center justify-center gap-2 rounded-xl border text-sm font-extrabold"
        >
          <ArrowLeft size={16} /> Kembali ke billing
        </Link>
      </section>
    </main>
  );
}
