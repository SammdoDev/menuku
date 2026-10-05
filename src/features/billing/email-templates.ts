import "server-only";

import { plans } from "@/features/billing/plans";
import { billingConfirmationUrl, pakasirInvoiceExpiresAt } from "@/features/billing/invoice-data";
import type { PendingInvoice } from "@/features/billing/types";
import { formatRupiah } from "@/lib/format";
import { PUBLIC_SITE_URL, supportWhatsAppUrl } from "@/config/site";

function escapeHtml(value: string) {
  return value.replace(/[&<>\"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function formatJakartaDate(date: Date) {
  return (
    new Intl.DateTimeFormat("id-ID", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "Asia/Jakarta",
    }).format(date) + " WIB"
  );
}

function planFeaturesHtml(planCode: string) {
  const plan = plans[planCode as "premium" | "business"];
  return [
    '<div style="margin-top:18px"><b>Fitur utama paket</b><ul style="padding-left:20px">',
    ...plan.features.map((feature) => `<li>${escapeHtml(feature)}</li>`),
    "</ul></div>",
  ].join("");
}

export function buildInvoiceExpiredEmail(invoice: PendingInvoice) {
  const planName = plans[invoice.plan as "premium" | "business"].name;
  const billingUrl = new URL("/dashboard/billing", PUBLIC_SITE_URL).toString();
  const supportUrl = supportWhatsAppUrl(
    `Halo admin Digimenu, invoice ${invoice.order_id} kedaluwarsa/dibatalkan. Saya ingin bantuan membuat invoice baru.`,
  );

  return [
    '<div style="font-family:Arial,sans-serif;max-width:620px;color:#29251f;line-height:1.6">',
    '<p style="color:#e45d32;font-size:12px;font-weight:bold;letter-spacing:2px">DIGIMENU</p>',
    '<h1 style="font-size:24px">Invoice sudah kedaluwarsa</h1>',
    "<p>Transaksi Pakasir untuk invoice ini sudah ditutup dan belum tercatat sebagai pembayaran berhasil. Paket belum diaktifkan.</p>",
    '<table style="width:100%;border-collapse:collapse;background:#faf8f4;border-radius:12px">',
    `<tr><td style="padding:10px">Nomor invoice</td><td style="padding:10px;text-align:right"><b>${escapeHtml(invoice.order_id)}</b></td></tr>`,
    `<tr><td style="padding:10px">Paket</td><td style="padding:10px;text-align:right"><b>${escapeHtml(planName)}</b></td></tr>`,
    `<tr><td style="padding:10px">Harga paket per bulan</td><td style="padding:10px;text-align:right"><b>${formatRupiah(plans[invoice.plan as "premium" | "business"].price)}</b></td></tr>`,
    `<tr><td style="padding:10px">Total</td><td style="padding:10px;text-align:right"><b>Rp${Number(invoice.amount).toLocaleString("id-ID")}</b></td></tr>`,
    `<tr><td style="padding:10px">Batas pembayaran</td><td style="padding:10px;text-align:right"><b>${escapeHtml(formatJakartaDate(pakasirInvoiceExpiresAt(invoice.created_at)))}</b></td></tr>`,
    "</table>",
    planFeaturesHtml(invoice.plan),
    `<p style="margin:24px 0"><a href="${escapeHtml(billingUrl)}" style="background:#e45d32;border-radius:10px;color:white;padding:12px 18px;text-decoration:none;font-weight:bold">Buat invoice baru</a></p>`,
    `<p>Kalau kamu sudah membayar sebelum invoice ditutup, <a href="${escapeHtml(supportUrl)}">hubungi admin Digimenu</a> dan sertakan nomor invoice ini.</p>`,
    "<p>Tim Digimenu</p></div>",
  ].join("");
}

export function buildPaymentReceiptEmail(invoice: PendingInvoice) {
  const paidAt = new Date().toISOString();
  const planName = plans[invoice.plan as "premium" | "business"].name;
  const receiptUrl = billingConfirmationUrl(invoice.order_id, invoice.plan);
  const supportUrl = supportWhatsAppUrl(
    `Halo admin Digimenu, saya ingin menanyakan pembayaran invoice ${invoice.order_id}.`,
  );

  return [
    '<div style="font-family:Arial,sans-serif;max-width:620px;color:#29251f;line-height:1.6">',
    '<p style="color:#e45d32;font-size:12px;font-weight:bold;letter-spacing:2px">DIGIMENU</p>',
    '<h1 style="font-size:24px">Pembayaran berhasil</h1>',
    "<p>Pembayaran sudah terkonfirmasi dan paket kamu telah diaktifkan. Simpan email ini sebagai bukti pembayaran.</p>",
    '<table style="width:100%;border-collapse:collapse;background:#faf8f4;border-radius:12px">',
    `<tr><td style="padding:10px">Nomor invoice</td><td style="padding:10px;text-align:right"><b>${escapeHtml(invoice.order_id)}</b></td></tr>`,
    `<tr><td style="padding:10px">Paket</td><td style="padding:10px;text-align:right"><b>${escapeHtml(planName)}</b></td></tr>`,
    `<tr><td style="padding:10px">Harga paket per bulan</td><td style="padding:10px;text-align:right"><b>${formatRupiah(plans[invoice.plan as "premium" | "business"].price)}</b></td></tr>`,
    `<tr><td style="padding:10px">Durasi</td><td style="padding:10px;text-align:right"><b>${Number(invoice.months || 1)} bulan</b></td></tr>`,
    `<tr><td style="padding:10px">Metode pembayaran</td><td style="padding:10px;text-align:right"><b>${invoice.payment_method === "qris" ? "QRIS Pakasir" : "Pakasir"}</b></td></tr>`,
    `<tr><td style="padding:10px">Total dibayar</td><td style="padding:10px;text-align:right"><b>Rp${Number(invoice.amount).toLocaleString("id-ID")}</b></td></tr>`,
    `<tr><td style="padding:10px">Waktu konfirmasi</td><td style="padding:10px;text-align:right"><b>${escapeHtml(formatJakartaDate(new Date(paidAt)))}</b></td></tr>`,
    "</table>",
    planFeaturesHtml(invoice.plan),
    `<p style="margin:24px 0"><a href="${escapeHtml(receiptUrl)}" style="background:#e45d32;border-radius:10px;color:white;padding:12px 18px;text-decoration:none;font-weight:bold">Lihat status paket</a></p>`,
    `<p>Butuh bantuan? <a href="${escapeHtml(supportUrl)}">Hubungi admin Digimenu</a>.</p>`,
    "<p>Terima kasih telah menggunakan Digimenu.</p></div>",
  ].join("");
}

export function buildBillingInvoiceEmail(invoice: PendingInvoice, paymentUrl?: string | null) {
  const isManual = invoice.payment_method === "manual";
  const detailUrl = billingConfirmationUrl(invoice.order_id, invoice.plan);
  const payUrl = paymentUrl || invoice.payment_url;
  const expiry = pakasirInvoiceExpiresAt(invoice.created_at);
  const supportUrl = supportWhatsAppUrl(
    `Halo admin Digimenu, saya ingin menanyakan pembayaran invoice ${invoice.order_id}.`,
  );
  const planName = plans[invoice.plan as "premium" | "business"].name;
  const paymentInstructions = isManual
    ? "Hubungi admin melalui WhatsApp untuk meminta detail rekening, lalu transfer sesuai total invoice."
    : "Bayar dengan QRIS di halaman Pakasir. Paket akan aktif otomatis setelah pembayaran terkonfirmasi.";
  const deadline = isManual
    ? ""
    : `<p style="background:#fff3e7;border-radius:10px;padding:14px"><b>Batas pembayaran:</b> invoice ini berlaku selama 24 jam, sampai <b>${escapeHtml(formatJakartaDate(expiry))}</b>. Sisa waktu berjalan dapat dilihat di halaman detail invoice. Setelah batas waktu, transaksi akan dibatalkan otomatis dan kamu bisa membuat invoice baru.</p>`;
  const paymentCta =
    !isManual && payUrl
      ? `<p style="margin:12px 0"><a href="${escapeHtml(payUrl)}" style="background:#e45d32;border-radius:10px;color:white;padding:12px 18px;text-decoration:none;font-weight:bold">Bayar sekarang via Pakasir</a></p>`
      : "";

  return [
    '<div style="font-family:Arial,sans-serif;max-width:620px;color:#29251f;line-height:1.6">',
    '<p style="color:#e45d32;font-size:12px;font-weight:bold;letter-spacing:2px">DIGIMENU</p>',
    '<h1 style="font-size:24px">Invoice pembayaran siap</h1>',
    `<p>${paymentInstructions}</p>`,
    deadline,
    '<table style="width:100%;border-collapse:collapse;background:#faf8f4;border-radius:12px">',
    `<tr><td style="padding:10px">Nomor invoice</td><td style="padding:10px;text-align:right"><b>${escapeHtml(invoice.order_id)}</b></td></tr>`,
    `<tr><td style="padding:10px">Paket</td><td style="padding:10px;text-align:right"><b>${escapeHtml(planName)}</b></td></tr>`,
    `<tr><td style="padding:10px">Harga paket per bulan</td><td style="padding:10px;text-align:right"><b>${formatRupiah(plans[invoice.plan as "premium" | "business"].price)}</b></td></tr>`,
    `<tr><td style="padding:10px">Durasi</td><td style="padding:10px;text-align:right"><b>${Number(invoice.months || 1)} bulan</b></td></tr>`,
    `<tr><td style="padding:10px">Metode</td><td style="padding:10px;text-align:right"><b>${isManual ? "Transfer manual" : "QRIS Pakasir"}</b></td></tr>`,
    `<tr><td style="padding:10px">Total tagihan</td><td style="padding:10px;text-align:right"><b>Rp${Number(invoice.amount).toLocaleString("id-ID")}</b></td></tr>`,
    "</table>",
    planFeaturesHtml(invoice.plan),
    paymentCta,
    `<p style="margin:24px 0"><a href="${escapeHtml(detailUrl)}" style="border:1px solid #ded8ce;border-radius:10px;color:#29251f;padding:11px 16px;text-decoration:none;font-weight:bold">Lihat detail invoice</a></p>`,
    `<p>Jika pembayaran sudah berhasil tetapi status belum berubah, buka detail invoice beberapa saat lagi. Bantuan tersedia melalui <a href="${escapeHtml(supportUrl)}">WhatsApp admin</a>.</p>`,
    "<p>Terima kasih,<br>Tim Digimenu</p></div>",
  ].join("");
}
