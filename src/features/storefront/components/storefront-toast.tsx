export default function StorefrontToast({ message }: { message: string }) {
  return (
    <div
      role="status"
      className={`bg-charcoal fixed bottom-24 left-1/2 z-[60] max-w-[calc(100%-32px)] -translate-x-1/2 rounded-xl px-4 py-3 text-center text-xs text-white shadow-2xl transition ${message ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}
    >
      {message}
    </div>
  );
}
