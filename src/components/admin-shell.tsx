import Link from "next/link";
import { Activity, ExternalLink, LayoutDashboard, LogOut, Store } from "lucide-react";
import { logoutAction } from "../app/(auth)/actions";
import Brand from "./brand";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-paper min-h-dvh lg:pl-72">
      <aside className="fixed inset-y-4 left-4 z-30 hidden w-64 flex-col rounded-3xl bg-[#211f1b] p-4 text-[#bdb5ac] shadow-2xl lg:flex">
        <div className="px-2 pb-8">
          <Brand inverse />
        </div>
        <div className="mb-5 rounded-2xl border border-white/10 bg-white/[.07] p-4">
          <p className="text-[10px] font-black tracking-[.14em] text-[#ff9c79]">ADMIN CONSOLE</p>
          <p className="mt-2 text-sm font-bold text-white">Pusat kendali Menuku</p>
        </div>
        <nav className="grid gap-1.5">
          <Link
            href="/admin"
            className="bg-brand flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-extrabold text-white shadow-lg"
          >
            <LayoutDashboard size={18} /> Ringkasan
          </Link>
          <Link
            href="/admin/analytics"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition hover:bg-white/[.08] hover:text-white"
          >
            <Activity size={18} /> Analytics platform
          </Link>
        </nav>
        <div className="mt-auto grid gap-2 border-t border-white/10 pt-4 text-sm">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-white/[.08] hover:text-white"
          >
            <Store size={18} /> Dashboard merchant
          </Link>
          <form action={logoutAction}>
            <button className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-[#f6aa94]">
              <LogOut size={16} /> Keluar
            </button>
          </form>
        </div>
      </aside>
      <header className="border-line sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:h-[72px] lg:px-10">
        <div className="lg:hidden">
          <Brand href="/admin" compact />
        </div>
        <p className="text-muted hidden text-sm lg:block">
          Admin Console <span className="mx-2 text-[#b6afa6]">/</span> Monitoring
        </p>
        <Link
          href="/"
          target="_blank"
          className="border-line ml-auto inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-xs font-extrabold"
        >
          <span className="hidden sm:inline">Landing page</span>
          <ExternalLink size={15} />
        </Link>
      </header>
      <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-10">{children}</div>
    </main>
  );
}
