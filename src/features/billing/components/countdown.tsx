"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const INVOICE_TTL_MS = 24 * 60 * 60 * 1000;
const STATUS_POLL_MS = 10 * 1000;

function formatDeadline(timestamp: number) {
  return (
    new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Jakarta",
    }).format(timestamp) + " WIB"
  );
}

export default function Countdown({
  startedAt,
  orderId,
  showCountdown,
}: {
  startedAt?: string;
  orderId: string;
  showCountdown: boolean;
}) {
  const router = useRouter();
  const expiry = startedAt ? new Date(startedAt).getTime() + INVOICE_TTL_MS : Number.NaN;
  const [receiptSent, setReceiptSent] = useState<boolean | null>(null);
  const [seconds, setSeconds] = useState(() =>
    Number.isFinite(expiry) ? Math.max(0, Math.ceil((expiry - Date.now()) / 1000)) : 0,
  );

  useEffect(() => {
    const updateCountdown = () => {
      if (Number.isFinite(expiry)) {
        setSeconds(Math.max(0, Math.ceil((expiry - Date.now()) / 1000)));
      }
    };
    updateCountdown();
    const countdownTimer = window.setInterval(updateCountdown, 1000);

    let finished = false;
    let refreshedAfterPayment = false;
    const checkPayment = async () => {
      try {
        const response = await fetch(
          `/api/payments/pakasir/status?order=${encodeURIComponent(orderId)}`,
          { cache: "no-store" },
        );
        if (!response.ok) return;
        const data = (await response.json()) as {
          status?: string;
          receiptEmailSent?: boolean;
        };
        if (data.status === "active") {
          setReceiptSent(Boolean(data.receiptEmailSent));
          if (!refreshedAfterPayment) {
            refreshedAfterPayment = true;
            router.refresh();
          }
          if (data.receiptEmailSent) finished = true;
        } else if (data.status === "failed") {
          finished = true;
          router.refresh();
        }
      } catch {
        // The next scheduled check retries transient network or provider errors.
      }
    };

    void checkPayment();
    const statusTimer = window.setInterval(() => {
      if (finished) {
        window.clearInterval(statusTimer);
        return;
      }
      void checkPayment();
    }, STATUS_POLL_MS);

    return () => {
      window.clearInterval(countdownTimer);
      window.clearInterval(statusTimer);
    };
  }, [expiry, orderId, router]);

  if (!showCountdown) {
    return (
      <span className="text-muted mt-1 block text-[11px] leading-4">
        {receiptSent
          ? "Bukti pembayaran sudah dikirim ke email akun."
          : "Pembayaran tercatat. Bukti pembayaran sedang dikirim ke email akun."}
      </span>
    );
  }

  if (!Number.isFinite(expiry)) {
    return (
      <strong className="mt-0.5 block text-lg text-orange-900">Memuat batas pembayaran...</strong>
    );
  }

  return (
    <>
      <strong className="mt-0.5 block text-lg text-orange-900">
        {String(Math.floor(seconds / 3600)).padStart(2, "0")}:
        {String(Math.floor((seconds % 3600) / 60)).padStart(2, "0")}:
        {String(seconds % 60).padStart(2, "0")}
      </strong>
      <span className="mt-1 block text-[11px] leading-4 text-orange-900">
        {seconds > 0
          ? `Bayar sebelum ${formatDeadline(expiry)}. Status diperbarui otomatis.`
          : "Batas waktu lewat. Status transaksi sedang diperiksa dan invoice akan ditutup."}
      </span>
    </>
  );
}
