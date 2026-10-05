"use client";

import { useState } from "react";
import { Banknote, QrCode } from "lucide-react";
import type { PlanCode } from "@/features/billing/plans";
import { Autocomplete } from "@/components/ui/autocomplete";

export default function BillingButtons({
  code,
  price,
  currentPlan,
  blockedByPending = false,
}: {
  code: PlanCode;
  price: number;
  currentPlan: PlanCode;
  currentExpiresAt?: string | null;
  blockedByPending?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [months, setMonths] = useState("1");
  const [paymentMethod, setPaymentMethod] = useState<"manual" | "qris">("qris");
  async function pay() {
    if (code === "free") return;
    setLoading(true);
    setError("");
    try {
      const endpoint =
        paymentMethod === "manual" ? "/api/payments/manual" : "/api/payments/pakasir";
      const response = await fetch(`${endpoint}?months=${months}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan: code }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Pembayaran belum dapat dibuat.");
      window.location.assign(data.confirmationUrl || data.paymentUrl);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Pembayaran gagal dibuat.");
      setLoading(false);
    }
  }
  const buttonLabel = blockedByPending
    ? "Selesaikan invoice yang masih aktif"
    : loading
      ? paymentMethod === "manual"
        ? "Membuat invoice..."
        : "Membuka checkout Pakasir..."
      : code === "free"
        ? "Pilih Free Demo"
        : currentPlan === "business"
          ? "Sudah termasuk Business"
          : currentPlan === "premium" && code === "premium"
            ? "Perpanjang Premium"
            : currentPlan === "premium"
              ? "Upgrade prorata ke Business"
              : paymentMethod === "manual"
                ? "Lanjut ke transfer manual"
                : "Bayar otomatis dengan QRIS";

  return (
    <div>
      {code !== "free" && (
        <div
          className="mb-5 grid gap-2 sm:grid-cols-2"
          role="group"
          aria-label="Pilih cara pembayaran"
        >
          <button
            type="button"
            aria-pressed={paymentMethod === "manual"}
            onClick={() => setPaymentMethod("manual")}
            className={`rounded-2xl border p-3 text-left transition ${paymentMethod === "manual" ? "border-brand ring-brand/15 bg-orange-50 ring-2" : "border-line bg-white hover:bg-[#faf8f4]"}`}
          >
            <span className="flex items-center gap-2 text-xs font-extrabold">
              <Banknote className="text-brand" size={17} /> Transfer manual
            </span>
            <span className="text-muted mt-1 block text-[10px] leading-4">
              Nominal pas, diverifikasi admin.
            </span>
          </button>
          <button
            type="button"
            aria-pressed={paymentMethod === "qris"}
            onClick={() => setPaymentMethod("qris")}
            className={`rounded-2xl border p-3 text-left transition ${paymentMethod === "qris" ? "border-brand ring-brand/15 bg-orange-50 ring-2" : "border-line bg-white hover:bg-[#faf8f4]"}`}
          >
            <span className="flex items-center gap-2 text-xs font-extrabold">
              <QrCode className="text-brand" size={17} /> QRIS otomatis
            </span>
            <span className="text-muted mt-1 block text-[10px] leading-4">
              Bayar lewat Pakasir, status otomatis.
            </span>
          </button>
        </div>
      )}
      {code !== "free" && currentPlan !== "business" && (
        <label className="mb-4 grid gap-2 text-xs font-bold">
          Durasi paket
          <Autocomplete
            value={months}
            onValueChange={setMonths}
            options={[
              { value: "1", label: "1 bulan" },
              { value: "3", label: "3 bulan" },
              { value: "6", label: "6 bulan" },
              { value: "12", label: "12 bulan" },
            ]}
          />
        </label>
      )}
      <button
        type="button"
        onClick={() => void pay()}
        disabled={loading || blockedByPending}
        className="bg-brand flex min-h-12 w-full items-center justify-center rounded-xl text-sm font-extrabold text-white disabled:opacity-60"
      >
        {buttonLabel}
      </button>
      {error && <p className="mt-2 text-xs text-red-700">{error}</p>}
    </div>
  );
}
