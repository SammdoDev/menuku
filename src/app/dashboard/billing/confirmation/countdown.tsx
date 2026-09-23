"use client";

import { useEffect, useState } from "react";

export default function Countdown({ startedAt }: { startedAt?: string }) {
  const expiry = startedAt
    ? new Date(startedAt).getTime() + 60 * 60 * 1000
    : Date.now() + 60 * 60 * 1000;
  const [seconds, setSeconds] = useState(() =>
    Math.max(0, Math.ceil((expiry - Date.now()) / 1000)),
  );
  useEffect(() => {
    const timer = window.setInterval(
      () => setSeconds(Math.max(0, Math.ceil((expiry - Date.now()) / 1000))),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [expiry]);
  return (
    <strong className="mt-0.5 block text-lg text-orange-900">
      {String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}
    </strong>
  );
}
