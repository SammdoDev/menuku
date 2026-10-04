import Link from "next/link";
import { AlertCircle, ArrowLeft, CheckCircle2, Clock3, Copy, FileText } from "lucide-react";
import { getCurrentMerchant } from "../../../../lib/merchant";
import { plans, rupiah, type PlanCode } from "../../../../lib/plans";
import { supportWhatsAppUrl } from "../../../../lib/site";
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
    .select("order_id,plan,previous_plan,months,amount,status,created_at,payment_url,payment_method")
    .eq("tenant_id", tenant.id)
    .eq("order_id", order)
    .maybeSingle();
  const selectedPlan = (invoice?.plan || plan) as PlanCode;
  const amount = invoice?.amount || plans[selectedPlan].price;
  const paid = invoice?.status === "active";
  const failed = invoice?.status === "failed";
  const manual = invoice?.payment_method === "manual";
  const StatusIcon = paid ? CheckCircle2 : failed ? AlertCircle : Clock3;
  const statusClass = paid ? "text-emerald-600" : failed ? "text-red-600" : "text-amber-600";
  return (
    <main className="bg-paper grid min-h-dvh place-items-center p-4 sm:p-8">
      <section className="border-line w-full max-w-lg rounded-3xl border bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-7 flex items-start justify-between">
          <div>
            <p className="text-brand mb-2 text-[10px] font-black tracking-[.14em]">
              INVOICE MENUKU
            </p>
            <h1 className="display-font text-3xl font-black">
              {paid ? "Pembayaran diterima" : failed ? "Pembayaran gagal" : "Menunggu pembayaran"}
            </h1>
          </div>
          <FileText className="text-brand" size={28} />
        </div>
        {!manual && !paid && !failed && (
          <div className="rounded-2xl bg-orange-50 p-5">
            <div className="flex items-center gap-3">
              <Clock3 className="text-brand" size={22} />
              <div>
                <p className="text-xs font-bold text-orange-900">Selesaikan pembayaran dalam</p>
                <Countdown startedAt={invoice?.created_at} />
              </div>
            </div>
          </div>
        )}
        <div className="my-6 rounded-2xl bg-[#faf8f4] p-4 text-center">
          <p className="mb-3 text-xs font-bold">{manual ? "Transfer manual sesuai nominal invoice" : "Pembayaran QRIS otomatis melalui Duitku"}</p>
          <p className="text-muted mt-2 text-[11px]">
            {manual
              ? "Transfer tepat sesuai total invoice. Hubungi admin untuk detail rekening dan verifikasi pembayaran."
              : "Bayar dengan QRIS di halaman Duitku. Status paket diperbarui otomatis setelah callback pembayaran diterima."}
          </p>
          {!manual && !paid && !failed && invoice?.payment_url && (
            <a
              href={invoice.payment_url}
              target="_blank"
              rel="noreferrer"
              className="bg-brand mt-4 inline-flex min-h-11 items-center justify-center rounded-xl px-5 text-sm font-extrabold text-white"
            >
              Buka QRIS Duitku
            </a>
          )}
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
            <StatusIcon className={statusClass} size={18} />
            {paid ? "Pembayaran berhasil" : failed ? "Transaksi gagal" : manual ? "Invoice transfer siap" : "QRIS Duitku siap dibayar"}
          </p>
          <p className="text-muted leading-6">
            {invoice?.status === "active"
              ? "Paket kamu sudah aktif. Invoice juga dikirim ke email akun."
              : failed
                ? "Transaksi ini gagal atau kedaluwarsa. Kembali ke billing untuk membuat invoice baru."
                : manual
                  ? "Setelah transfer, admin akan mencocokkan nominal dan mengaktifkan paketmu."
                  : "Selesaikan pembayaran di halaman Duitku. Status paket akan diperbarui otomatis setelah callback pembayaran diterima."}
          </p>
        </div>
        <a
          href={supportWhatsAppUrl(
            manual && !paid
              ? `Halo admin Menuku, saya ingin transfer manual untuk invoice ${invoice?.order_id || order} sebesar ${rupiah(amount)}. Mohon kirim detail rekeningnya.`
              : "Halo admin Menuku, saya butuh bantuan terkait pembayaran invoice.",
          )}
          target="_blank"
          rel="noreferrer"
          className="mt-5 flex min-h-11 items-center justify-center rounded-xl bg-emerald-600 px-4 text-center text-sm font-extrabold text-white"
        >
          {manual && !paid ? "Minta detail rekening lewat WhatsApp" : "Butuh bantuan pembayaran? Chat admin"}
        </a>
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
