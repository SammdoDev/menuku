import Link from "next/link";
import Brand from "../../components/brand";

export default function AuthShell({
  eyebrow,
  title,
  intro,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  intro: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="grid min-h-dvh place-items-center bg-[#f7f6f2] bg-[image:radial-gradient(circle_at_15%_10%,#ffe3d8_0,transparent_30%),radial-gradient(circle_at_85%_90%,#e2eee9_0,transparent_30%)] p-4 sm:p-6">
      <section className="border-line w-full max-w-md rounded-3xl border bg-white p-6 shadow-[0_24px_70px_#3f322016] sm:p-9">
        <div className="mb-9">
          <Brand />
        </div>
        <p className="text-brand mb-2 text-[11px] font-black tracking-[.12em] uppercase">
          {eyebrow}
        </p>
        <h1 className="display-font mb-2 text-3xl font-black">{title}</h1>
        <div className="text-muted mb-6 text-sm leading-6">{intro}</div>
        {children}
        {footer && <div className="text-muted mt-6 text-center text-sm">{footer}</div>}
        <Link
          href="/"
          className="text-muted hover:text-brand mt-4 block text-center text-xs font-bold"
        >
          Kembali ke beranda
        </Link>
      </section>
    </main>
  );
}
