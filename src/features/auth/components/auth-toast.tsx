"use client";

import { CircleCheck, CircleX, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function AuthToast({ error, message }: { error?: string; message?: string }) {
  const text = error || message;
  const [visible, setVisible] = useState(Boolean(text));
  useEffect(() => {
    if (!text) return;
    setVisible(true);
    const timeout = window.setTimeout(() => setVisible(false), 5000);
    return () => window.clearTimeout(timeout);
  }, [text]);
  if (!text || !visible) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-4 right-4 z-50 flex w-[min(390px,calc(100vw-32px))] items-start gap-3 rounded-2xl border p-4 text-sm shadow-2xl ${error ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}
    >
      {error ? (
        <CircleX size={19} className="mt-0.5 shrink-0" />
      ) : (
        <CircleCheck size={19} className="mt-0.5 shrink-0" />
      )}
      <span className="flex-1 leading-5">{text}</span>
      <button type="button" aria-label="Tutup notifikasi" onClick={() => setVisible(false)}>
        <X size={17} />
      </button>
    </div>
  );
}
