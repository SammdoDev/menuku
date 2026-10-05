import type { InputHTMLAttributes } from "react";

import { Input } from "@/components/ui/text-input";

export function NumericInput({
  prefix = "Rp",
  onInput,
  className = "",
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { prefix?: string }) {
  return (
    <span className="border-line focus-within:border-brand/60 focus-within:ring-brand/10 hover:border-brand/35 flex h-14 w-full min-w-0 items-center gap-2 overflow-hidden rounded-2xl border bg-white px-2 shadow-sm transition duration-200 focus-within:ring-4 hover:shadow-md">
      <span className="bg-brand/10 text-brand grid h-10 min-w-11 shrink-0 place-items-center rounded-xl px-2 text-xs font-black tracking-wide">
        {prefix}
      </span>
      <Input
        {...props}
        className={`h-full min-w-0 flex-1 rounded-xl border-0 bg-transparent px-2 text-right text-base font-bold tabular-nums shadow-none placeholder:text-[#bbb5ad] focus:border-0 focus:ring-0 ${className}`}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="off"
        onInput={(event) => {
          event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "");
          onInput?.(event);
        }}
      />
    </span>
  );
}
