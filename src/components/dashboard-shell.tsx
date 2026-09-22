import Link from "next/link";
import {
  ExternalLink,
  LayoutDashboard,
  Layers3,
  Link2,
  MenuSquare,
  QrCode,
  Settings,
} from "lucide-react";
import { logoutAction } from "../app/(auth)/actions";
import Brand from "./brand";

type Active = "dashboard" | "menu" | "categories" | "links" | "publish";
type Tenant = { name: string; slug: string };

const links = [
  { key: "dashboard", href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "menu", href: "/dashboard/menu", label: "Menu", icon: MenuSquare },
  { key: "categories", href: "/dashboard/categories", label: "Kategori", icon: Layers3 },
  { key: "links", href: "/dashboard/links", label: "Links", icon: Link2 },
  { key: "publish", href: "/dashboard/publish", label: "Publikasi", icon: QrCode },
] as const;

export default function DashboardShell({
  tenant,
  active,
  title,
  children,
}: {
  tenant: Tenant;
  active: Active;
  title: string;
  children: React.ReactNode;
}) {
  const storeUrl = `/store/${tenant.slug}`;
  return (
    <main className="bg-paper min-h-dvh pb-24 lg:pb-0 lg:pl-72">
      <aside className="fixed inset-y-4 left-4 z-30 hidden w-64 flex-col rounded-3xl border border-white/10 bg-gradient-to-b from-[#2c2924] to-[#1d1b18] p-4 text-[#bdb5ac] shadow-2xl lg:flex">
        <div className="px-2 pb-6">
          <Brand inverse />
        </div>
        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.07] p-3">
          <div className="bg-brand grid size-10 shrink-0 place-items-center rounded-xl text-xs font-black text-white">
            {tenant.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <b className="block truncate text-sm text-white">{tenant.name}</b>
            <small className="block truncate text-[10px] text-[#aaa39a]">
              {tenant.slug}.menuku.id
            </small>
          </div>
        </div>
        <nav className="grid gap-1.5">
          {links.map(({ key, href, label, icon: Icon }) => (
            <Link
              key={key}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${active === key ? "bg-brand shadow-brand/20 font-extrabold text-white shadow-lg" : "hover:bg-white/[.08] hover:text-white"}`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-white/10 pt-4">
          <Link
            href="/dashboard/publish"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-white/[.08] hover:text-white"
          >
            <Settings size={18} />
            Pengaturan
          </Link>
          <form action={logoutAction}>
            <button className="px-3 py-2 text-xs font-bold text-[#f6aa94]">Keluar</button>
          </form>
        </div>
      </aside>

      <header className="border-line sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:h-[72px] lg:px-10">
        <div className="lg:hidden">
          <Brand href="/dashboard" compact />
        </div>
        <p className="text-muted hidden text-sm lg:block">
          Dashboard <span className="mx-2 text-[#b6afa6]">/</span> {title}
        </p>
        <Link
          href={storeUrl}
          target="_blank"
          className="border-line hover:border-brand/40 hover:text-brand ml-auto inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-xs font-extrabold transition"
        >
          Buka halaman <ExternalLink size={15} />
        </Link>
      </header>

      <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-10">{children}</div>

      <nav className="bg-charcoal/95 fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 rounded-2xl border border-white/10 p-1.5 text-white shadow-2xl backdrop-blur-xl lg:hidden">
        {links.map(({ key, href, label, icon: Icon }) => (
          <Link
            key={key}
            href={href}
            aria-label={label}
            className={`grid min-h-12 place-items-center rounded-xl transition ${active === key ? "bg-brand text-white" : "text-white/60"}`}
          >
            <Icon size={19} />
            <span className="text-[8px] font-bold">{label}</span>
          </Link>
        ))}
      </nav>
    </main>
  );
}
