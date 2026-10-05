import { NextResponse } from "next/server";
import { getCurrentMerchant } from "../../../../lib/merchant";
import { getPendingInvoice, sendBillingInvoiceEmail } from "../../../../lib/billing-invoices";
import { createSupabaseAdminClient } from "../../../../lib/supabase/admin";

export async function POST() {
  const { user, tenant } = await getCurrentMerchant();
  if (!user || !tenant) {
    return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
  }

  const admin = createSupabaseAdminClient();
  const invoice = await getPendingInvoice(admin, tenant.id);
  if (!invoice || invoice.status !== "pending") {
    return NextResponse.json({ error: "Tidak ada invoice pending yang bisa dikirim." }, { status: 404 });
  }

  const emailSent = await sendBillingInvoiceEmail({
    admin,
    invoice,
    email: user.email,
    paymentUrl: invoice.payment_url,
  });
  return NextResponse.json(
    {
      ok: emailSent,
      emailSent,
      message: emailSent
        ? "Instruksi pembayaran terkirim ke email akun."
        : "Email belum terkirim. Periksa konfigurasi email atau coba lagi beberapa menit lagi.",
    },
    { status: emailSent ? 200 : 503 },
  );
}
