"use client";

import { ChevronDown, LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";
import type { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import styles from "./form-controls.module.css";

export type SelectOption = { label: string; value: string; disabled?: boolean };

export function GlobalInput({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${styles.input} ${className}`} />;
}

export function GlobalTextarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${styles.textarea} ${className}`} />;
}

export function GlobalAutocomplete({ options, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { options: SelectOption[] }) {
  return <span className={styles.select}><select {...props}>{options.map(option => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}</select><ChevronDown size={17} aria-hidden="true" /></span>;
}

export function NumericInput({ prefix = "Rp", onInput, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { prefix?: string }) {
  return <span className={styles.number}><span>{prefix}</span><GlobalInput {...props} type="text" inputMode="numeric" pattern="[0-9]*" onInput={event => { event.currentTarget.value = event.currentTarget.value.replace(/\D/g, ""); onInput?.(event); }} /></span>;
}

export function SubmitButton({ children, pendingLabel = "Menyimpan...", disabled, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return <button {...props} className={className} type="submit" disabled={disabled || pending}>{pending ? <span className={styles.pending}><LoaderCircle size={16} />{pendingLabel}</span> : children}</button>;
}
