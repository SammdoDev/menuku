"use client";

import { Check, ChevronDown, LoaderCircle, Search, X } from "lucide-react";
import type {
  ButtonHTMLAttributes,
  CSSProperties,
  InputHTMLAttributes,
  KeyboardEvent,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal, useFormStatus } from "react-dom";

export type SelectOption = { label: string; value: string; disabled?: boolean };
const control =
  "w-full rounded-xl border border-line bg-white px-3.5 text-sm text-ink outline-none transition placeholder:text-[#aaa39a] focus:border-brand/60 focus:ring-4 focus:ring-brand/10 disabled:cursor-not-allowed disabled:opacity-60";

export function GlobalInput({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const visual =
    props.type === "hidden" || props.type === "file" || props.type === "checkbox"
      ? ""
      : `${control} h-12`;
  return <input {...props} className={`${visual} ${className}`} />;
}

export function GlobalTextarea({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${control} min-h-24 resize-y py-3 ${className}`} />;
}

export function GlobalAutocomplete({
  options,
  className = "",
  defaultValue,
  value,
  disabled,
  id,
  onChange,
  onValueChange,
  inline = false,
  searchable,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  options: SelectOption[];
  onValueChange?: (value: string) => void;
  inline?: boolean;
  searchable?: boolean;
}) {
  const generatedId = useId();
  const controlId = id || `global-autocomplete-${generatedId.replace(/:/g, "")}`;
  const listboxId = `${controlId}-listbox`;
  const initialValue = String(defaultValue ?? options[0]?.value ?? "");
  const controlledValue = Array.isArray(value) ? undefined : value;
  const [internalValue, setInternalValue] = useState(initialValue);
  const selectedValue = controlledValue === undefined ? internalValue : String(controlledValue);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  const selectedOption = options.find((option) => option.value === selectedValue);
  const selectableOptions = useMemo(
    () =>
      options.filter(
        (option) =>
          !option.disabled &&
          option.label.toLocaleLowerCase("id").includes(query.toLocaleLowerCase("id")),
      ),
    [options, query],
  );
  const showSearch = searchable ?? options.filter((option) => !option.disabled).length > 5;

  function updatePosition() {
    const trigger = buttonRef.current;
    if (!trigger) return;
    if (inline) {
      setMobile(false);
      return;
    }
    const isMobile = window.innerWidth < 640;
    setMobile(isMobile);
    if (isMobile) return;
    const rect = trigger.getBoundingClientRect();
    const width = Math.min(Math.max(rect.width, 280), window.innerWidth - 24);
    const left = Math.min(Math.max(12, rect.left), window.innerWidth - width - 12);
    const spaceBelow = window.innerHeight - rect.bottom;
    const openAbove = spaceBelow < 300 && rect.top > spaceBelow;
    setMenuStyle({
      left,
      width,
      ...(openAbove ? { bottom: window.innerHeight - rect.top + 8 } : { top: rect.bottom + 8 }),
    });
  }

  function closeDropdown(focusTrigger = false) {
    setOpen(false);
    setQuery("");
    if (focusTrigger) requestAnimationFrame(() => buttonRef.current?.focus());
  }

  function selectOption(option: SelectOption) {
    if (option.disabled) return;
    if (controlledValue === undefined) setInternalValue(option.value);
    const nativeSelect = selectRef.current;
    if (nativeSelect) {
      const valueSetter = Object.getOwnPropertyDescriptor(
        HTMLSelectElement.prototype,
        "value",
      )?.set;
      valueSetter?.call(nativeSelect, option.value);
      nativeSelect.dispatchEvent(new Event("change", { bubbles: true }));
    }
    onValueChange?.(option.value);
    closeDropdown(true);
  }

  function moveActive(direction: 1 | -1) {
    if (!selectableOptions.length) return;
    setActiveIndex(
      (current) => (current + direction + selectableOptions.length) % selectableOptions.length,
    );
  }

  function handleKeyboard(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeDropdown(true);
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) setOpen(true);
      else moveActive(event.key === "ArrowDown" ? 1 : -1);
      return;
    }
    if (event.key === "Enter" && open) {
      event.preventDefault();
      const option = selectableOptions[activeIndex];
      if (option) selectOption(option);
    }
  }

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    updatePosition();
    const selectedIndex = selectableOptions.findIndex((option) => option.value === selectedValue);
    setActiveIndex(Math.max(0, selectedIndex));
    if (showSearch) requestAnimationFrame(() => searchRef.current?.focus());

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (!buttonRef.current?.contains(target) && !menuRef.current?.contains(target))
        closeDropdown();
    }
    function handleViewportChange(event: Event) {
      if (menuRef.current?.contains(event.target as Node)) return;
      updatePosition();
    }
    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", handleViewportChange, true);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [open, selectedValue, showSearch]);

  useEffect(() => {
    if (!open) return;
    const selectedIndex = selectableOptions.findIndex((option) => option.value === selectedValue);
    setActiveIndex(Math.max(0, selectedIndex));
  }, [query]);

  const dropdown = open && mounted && (
    <>
      {!inline && (
        <button
          type="button"
          aria-label="Tutup pilihan"
          className="fixed inset-0 z-[70] cursor-default bg-black/25 backdrop-blur-[1px] sm:hidden"
          onClick={() => closeDropdown(true)}
        />
      )}
      <div
        ref={menuRef}
        id={listboxId}
        role="listbox"
        aria-label={props.name ? `Pilihan ${props.name}` : "Daftar pilihan"}
        className={`z-[80] overflow-hidden border border-[#e5ddd4] bg-white shadow-[0_24px_70px_rgba(43,36,29,.24)] sm:rounded-2xl ${
          inline
            ? "absolute top-full right-0 left-0 mt-2 rounded-2xl"
            : `fixed ${mobile ? "inset-x-3 bottom-3 rounded-3xl" : ""}`
        }`}
        style={inline || mobile ? undefined : menuStyle}
      >
        <div className="flex items-center justify-between border-b border-[#eee8e1] px-4 py-3 sm:hidden">
          <div>
            <p className="text-[10px] font-black tracking-[.14em] text-[#a59b91] uppercase">
              Pilih opsi
            </p>
            <p className="text-ink mt-0.5 text-sm font-extrabold">
              {selectedOption?.label || "Belum dipilih"}
            </p>
          </div>
          <button
            type="button"
            className="text-muted grid size-9 place-items-center rounded-full bg-[#f4f0eb] text-lg"
            onClick={() => closeDropdown(true)}
            aria-label="Tutup"
          >
            <X size={17} />
          </button>
        </div>
        {showSearch && (
          <div className="border-b border-[#eee8e1] p-2.5 sm:p-3">
            <div className="ring-brand/15 flex h-11 items-center gap-2 rounded-xl bg-[#f6f3ef] px-3 focus-within:ring-4">
              <Search size={16} className="text-brand shrink-0" />
              <input
                ref={searchRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleKeyboard}
                placeholder="Cari pilihan..."
                className="text-ink h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#aaa39a]"
              />
            </div>
          </div>
        )}
        <div className="no-scrollbar max-h-[min(360px,55dvh)] overflow-y-auto p-2">
          {selectableOptions.length ? (
            selectableOptions.map((option, index) => {
              const selected = option.value === selectedValue;
              const active = index === activeIndex;
              return (
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  key={option.value}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectOption(option)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                    selected
                      ? "text-brand-dark bg-orange-50 font-extrabold"
                      : active
                        ? "text-ink bg-[#f6f3ef] font-bold"
                        : "text-[#625a52] hover:bg-[#f8f5f1]"
                  }`}
                >
                  <span
                    className={`grid size-8 shrink-0 place-items-center rounded-lg text-xs font-black ${
                      selected ? "bg-brand text-white" : "bg-[#eee9e3] text-[#91867b]"
                    }`}
                  >
                    {option.label.trim().charAt(0).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                  {selected && <Check size={17} className="text-brand shrink-0" strokeWidth={3} />}
                </button>
              );
            })
          ) : (
            <div className="px-4 py-8 text-center">
              <Search className="mx-auto mb-2 text-[#c7beb5]" size={24} />
              <p className="text-ink text-sm font-bold">Pilihan tidak ditemukan</p>
              <p className="text-muted mt-1 text-xs">Coba kata kunci lainnya.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="relative block">
      <select
        {...props}
        ref={selectRef}
        value={selectedValue}
        disabled={disabled}
        onChange={(event) => onChange?.(event)}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      <button
        ref={buttonRef}
        id={controlId}
        type="button"
        role="combobox"
        aria-controls={listboxId}
        aria-expanded={open}
        aria-haspopup="listbox"
        disabled={disabled}
        onClick={() => {
          if (!open) {
            setQuery("");
            updatePosition();
          }
          setOpen((current) => !current);
        }}
        onKeyDown={handleKeyboard}
        className={`${control} flex h-12 items-center gap-3 pr-11 text-left ${
          selectedOption?.disabled || !selectedOption ? "text-[#aaa39a]" : "font-semibold"
        } ${open ? "border-brand/60 ring-brand/10 ring-4" : ""} ${className}`}
      >
        <span
          className={`size-2 shrink-0 rounded-full ${selectedOption?.disabled ? "bg-[#c8c0b8]" : "bg-brand"}`}
        />
        <span className="min-w-0 flex-1 truncate">{selectedOption?.label || "Pilih opsi"}</span>
      </button>
      <ChevronDown
        size={17}
        className={`text-brand pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 transition ${open ? "rotate-180" : ""}`}
      />
      {dropdown && (inline ? dropdown : createPortal(dropdown, document.body))}
    </div>
  );
}

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
      <GlobalInput
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
