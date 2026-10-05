import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

const control =
  "w-full rounded-xl border border-line bg-white px-3.5 text-sm text-ink outline-none transition placeholder:text-[#aaa39a] focus:border-brand/60 focus:ring-4 focus:ring-brand/10 disabled:cursor-not-allowed disabled:opacity-60";

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const visual =
    props.type === "hidden" || props.type === "file" || props.type === "checkbox"
      ? ""
      : `${control} h-12`;
  return <input {...props} className={`${visual} ${className}`} />;
}

export function SlugInput({
  prefix,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { prefix: string }) {
  return (
    <div className="border-line focus-within:border-brand/60 focus-within:ring-brand/10 flex overflow-hidden rounded-xl border bg-white focus-within:ring-4">
      <span className="text-muted border-line flex shrink-0 items-center border-r bg-[#faf8f5] px-2 text-[9px] sm:px-3 sm:text-xs">
        {prefix}
      </span>
      <Input {...props} className={`rounded-none border-0 focus:ring-0 ${className}`} />
    </div>
  );
}

export function Textarea({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${control} min-h-24 resize-y py-3 ${className}`} />;
}
