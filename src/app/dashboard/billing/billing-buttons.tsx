"use client";

import { useState } from "react";
import type { PlanCode } from "../../../lib/plans";
import { GlobalAutocomplete } from "../../../components/ui/form-controls";

export default function BillingButtons({
  code,
  price,
  currentPlan,
}: {
  code: PlanCode;
  price: number;
  currentPlan: PlanCode;
  currentExpiresAt?: string | null;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [months, setMonths] = useState("1");
  async function pay() {
    if (code === "free") return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/payments/duitku?months=${months}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan: code }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Pembayaran belum dapat dibuat.");
      window.location.assign(data.paymentUrl);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Pembayaran gagal dibuat.");
      setLoading(false);
    }
  }
  return (
    <div>
      {code !== "free" && (
        <div className="mb-5 rounded-2xl bg-[#faf8f4] p-4 text-center">
          <p className="text-muted mt-2 text-[11px]">
            Kamu akan diarahkan ke checkout Duitku untuk memilih metode pembayaran.
          </p>
        </div>
      )}
      {code !== "free" && currentPlan !== "business" && (
        <label className="mb-4 grid gap-2 text-xs font-bold">
          Durasi paket
          <GlobalAutocomplete
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
        disabled={loading}
        className="bg-brand flex min-h-12 w-full items-center justify-center rounded-xl text-sm font-extrabold text-white disabled:opacity-60"
      >
        {loading
          ? "Mengirim konfirmasi..."
          : code === "free"
            ? "Pilih Free Demo"
            : currentPlan === "business"
              ? "Sudah termasuk Business"
            : currentPlan === "premium" && code === "premium"
                ? "Perpanjang Premium"
                : currentPlan === "premium"
                  ? "Upgrade prorata ke Business"
                  : "Bayar dengan Duitku"}
      </button>
      {error && <p className="mt-2 text-xs text-red-700">{error}</p>}
    </div>
  );
}
