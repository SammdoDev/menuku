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
        <div className="pointer-events-none fixed inset-0 z-[100]">
          <div className="bg-brand absolute top-0 left-0 h-1 w-full animate-pulse" />
          <div
            className="border-line text-ink pointer-events-auto fixed top-4 right-4 flex items-center gap-2 rounded-xl border bg-white/95 px-3 py-2.5 text-xs font-extrabold shadow-xl"
            role="status"
            aria-live="polite"
          >
            <LoaderCircle className="text-brand animate-spin" size={17} />
            Memuat...
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
