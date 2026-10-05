"use client";

import { LoaderCircle } from "lucide-react";

import type { ButtonHTMLAttributes } from "react";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  pendingLabel = "Menyimpan...",
  disabled,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      {...props}
      type="submit"
      disabled={disabled || pending}
      className={`bg-brand hover:bg-brand-dark inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 text-sm font-extrabold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {pending ? (
        <>
          <LoaderCircle size={16} className="animate-spin" />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}
