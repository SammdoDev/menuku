"use client";

import { useState } from "react";
import type { PlanCode } from "../../../lib/plans";

export default function BillingButtons({ code, price }: { code: PlanCode; price: number }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function pay() {
    if (code === "free") return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/payments/manual", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan: code }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Pembayaran belum dapat dibuat.");
      window.location.assign(
        `/dashboard/billing/confirmation?order=${encodeURIComponent(data.orderId)}&plan=${code}`,
      );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Pembayaran gagal dibuat.");
      setLoading(false);
    }
  }
  return (
    <div>
      {code !== "free" && (
        <div className="mb-5 rounded-2xl bg-[#faf8f4] p-4 text-center">
          <img
            src="/qris.jpeg"
            alt="QRIS pembayaran Menuku"
            className="mx-auto size-48 rounded-xl object-contain"
          />
          <p className="text-muted mt-2 text-[11px]">
            Scan QRIS lalu transfer sesuai nominal paket.
          </p>
        </div>
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
            : "Saya sudah transfer"}
      </button>
      {error && <p className="mt-2 text-xs text-emerald-700">{error}</p>}
    </div>
  );
}
