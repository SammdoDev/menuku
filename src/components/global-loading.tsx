"use client";

import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ComponentProps,
} from "react";
import { usePathname } from "next/navigation";

type LoadingContextValue = { startLoading: () => void; stopLoading: () => void };
const LoadingContext = createContext<LoadingContextValue | null>(null);

export function GlobalLoadingProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const startLoading = useCallback(() => setLoading(true), []);
  const stopLoading = useCallback(() => setLoading(false), []);

  useEffect(() => {
    stopLoading();
  }, [pathname, stopLoading]);

  useEffect(() => {
    if (!loading) return;
    const timeout = window.setTimeout(stopLoading, 12000);
    return () => window.clearTimeout(timeout);
  }, [loading, stopLoading]);

  return (
    <LoadingContext.Provider value={{ startLoading, stopLoading }}>
      {children}
      {loading && (
        <div className="pointer-events-auto fixed inset-0 z-[100] grid place-items-center bg-white/35 backdrop-blur-[2px]">
          <div
            className="border-line text-ink flex items-center gap-3 rounded-2xl border bg-white/95 px-5 py-4 text-sm font-extrabold shadow-2xl"
            role="status"
            aria-live="polite"
          >
            <LoaderCircle className="text-brand animate-spin" size={21} />
            Memuat halaman...
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
}

export function useGlobalLoading() {
  const context = useContext(LoadingContext);
  if (!context) throw new Error("useGlobalLoading harus dipakai di dalam GlobalLoadingProvider.");
  return context;
}

export function LoadingLink({ onClick, target, ...props }: ComponentProps<typeof Link>) {
  const { startLoading } = useGlobalLoading();
  return (
    <Link
      {...props}
      target={target}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          target === "_blank" ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          event.button !== 0
        )
          return;
        startLoading();
      }}
    />
  );
}
