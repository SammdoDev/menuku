"use client";

import { useState } from "react";

export default function InvoiceEmailButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  async function sendAgain() {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/payments/invoice-email", { method: "POST" });
      const data = await response.json();
      setSent(Boolean(data.emailSent));
      setMessage(data.message || "Email belum dapat dikirim.");
    } catch {
      setMessage("Email belum dapat dikirim. Coba lagi sebentar lagi.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return <p className="mt-3 text-xs font-bold text-emerald-700">Instruksi pembayaran sudah terkirim.</p>;
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => void sendAgain()}
        disabled={loading}
        className="min-h-9 rounded-lg border border-amber-300 px-3 text-xs font-bold disabled:opacity-60"
      >
        {loading ? "Mengirim email..." : "Kirim instruksi ke email"}
      </button>
      {message && <p className="mt-2 text-xs leading-5">{message}</p>}
    </div>
  );
}
