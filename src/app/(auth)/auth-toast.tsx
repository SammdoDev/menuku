"use client";

import { useEffect, useState } from "react";
import styles from "./auth.module.css";

type AuthToastProps = {
  error?: string;
  message?: string;
};

export default function AuthToast({ error, message }: AuthToastProps) {
  const [visible, setVisible] = useState(Boolean(error || message));
  const text = error || message;

  useEffect(() => {
    if (!text) return;
    setVisible(true);
    const timeout = window.setTimeout(() => setVisible(false), 5000);
    return () => window.clearTimeout(timeout);
  }, [text]);

  if (!text || !visible) return null;

  return (
    <div className={`${styles.toast} ${error ? styles.toastError : styles.toastSuccess}`} role="status" aria-live="polite">
      <span>{text}</span>
      <button type="button" aria-label="Tutup notifikasi" onClick={() => setVisible(false)}>×</button>
    </div>
  );
}
