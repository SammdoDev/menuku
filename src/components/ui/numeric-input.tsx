import type { InputHTMLAttributes } from "react";

import { Input } from "@/components/ui/text-input";

export function NumericInput({
  prefix = "Rp",
  onInput,
  className = "",
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { prefix?: string }) {
  return (
    <span className="border-line focus-within:border-brand/60 focus-within:ring-brand/10 flex h-12 overflow-hidden rounded-xl border bg-white transition focus-within:ring-4">
      <span className="border-line text-brand-dark grid place-items-center border-r px-3 text-xs font-extrabold">
        {prefix}
      </span>
      <Input
        {...props}
        className={`h-full flex-1 rounded-none border-0 shadow-none ring-0 focus:ring-0 ${className}`}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        onInput={(event) => {
          event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "");
          onInput?.(event);
        }}
      />
    </span>
  );
}
