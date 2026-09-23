"use client";

import { useEffect, useState } from "react";

export default function Countdown() {
  const [seconds, setSeconds] = useState(15 * 60);
  useEffect(() => {
    const timer = window.setInterval(() => setSeconds((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <strong className="mt-0.5 block text-lg text-orange-900">
      {String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}
    </strong>
  );
}
