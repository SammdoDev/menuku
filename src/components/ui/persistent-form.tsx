"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type FormAction = (formData: FormData) => void | Promise<void>;

function readValues(form: HTMLFormElement) {
  const values: Record<string, string | boolean> = {};
  for (const element of Array.from(form.elements)) {
    if (!(
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement ||
      element instanceof HTMLSelectElement
    ))
      continue;
    if (!element.name || element.type === "file") continue;
    values[element.name] =
      element instanceof HTMLInputElement && element.type === "checkbox"
        ? element.checked
        : element.value;
  }
  return values;
}

export default function PersistentForm({
  storageKey,
  action,
  children,
  className,
  onRestore,
}: {
  storageKey: string;
  action: FormAction;
  children: React.ReactNode;
  className?: string;
  onRestore?: (values: Record<string, string | boolean>) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasError = Boolean(searchParams.get("error"));

  useEffect(() => {
    const raw = hasError ? sessionStorage.getItem(storageKey) : null;
    if (!raw || !formRef.current) return;
    try {
      const values = JSON.parse(raw) as Record<string, string | boolean>;
      onRestore?.(values);
      for (const element of Array.from(formRef.current.elements)) {
        if (!(
          element instanceof HTMLInputElement ||
          element instanceof HTMLTextAreaElement ||
          element instanceof HTMLSelectElement
        ))
          continue;
        const value = values[element.name];
        if (value === undefined) continue;
        if (element instanceof HTMLInputElement && element.type === "checkbox")
          element.checked = Boolean(value);
        else if (typeof value === "string") element.value = value;
      }
    } catch {
      sessionStorage.removeItem(storageKey);
    }
  }, [hasError, onRestore, storageKey]);

  useEffect(() => {
    if (!hasError) sessionStorage.removeItem(storageKey);
  }, [hasError, pathname, storageKey]);

  return (
    <form
      ref={formRef}
      action={action}
      className={className}
      onSubmit={() =>
        sessionStorage.setItem(storageKey, JSON.stringify(readValues(formRef.current!)))
      }
    >
      {children}
    </form>
  );
}
