import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import Brand from "../components/brand";

export default function NotFound() {
  return (
    <main className="bg-paper relative grid min-h-dvh place-items-center overflow-hidden px-5 py-10 text-center">
      <div className="bg-brand/10 pointer-events-none absolute -top-32 -right-24 size-80 rounded-full blur-3xl" />
      <div className="bg-brand/10 pointer-events-none absolute -bottom-40 -left-24 size-96 rounded-full blur-3xl" />
      <section className="relative w-full max-w-lg">
        <div className="mb-10 flex justify-center">
          <Brand />
        </div>
        <div className="border-line mx-auto grid size-24 place-items-center rounded-[2rem] border bg-white shadow-xl">
          <Compass className="text-brand" size={42} strokeWidth={1.7} />
        </div>
        <p className="text-brand mt-8 text-[11px] font-black tracking-[.16em]">
          404 · HALAMAN HILANG
        </p>
        <h1 className="display-font mt-3 text-4xl font-black sm:text-5xl">Ups, nyasar sedikit.</h1>
        <p className="text-muted mx-auto mt-4 max-w-md text-sm leading-6">
          Halaman yang kamu cari tidak ada, sudah dipindahkan, atau alamatnya belum benar.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="bg-brand inline-flex min-h-12 items-center gap-2 rounded-xl px-5 text-sm font-extrabold text-white shadow-lg"
          >
            Kembali ke beranda
          </Link>
          <Link
            href="/login"
            className="border-line inline-flex min-h-12 items-center gap-2 rounded-xl border bg-white px-5 text-sm font-extrabold"
          >
            <ArrowLeft size={16} /> Masuk
          </Link>
        </div>
      </section>
    </main>
  );
}
