import Link from "next/link";
import Brand from "../../../components/brand";

export default function StoreUnavailable() {
  return (
    <main className="bg-paper grid min-h-dvh place-items-center p-6 text-center">
      <section>
        <div className="mb-6 flex justify-center">
          <Brand />
        </div>
        <p className="text-brand text-[11px] font-black tracking-[.12em]">HALAMAN TIDAK TERSEDIA</p>
        <h1 className="display-font my-3 text-3xl font-black">Toko tidak dapat dibuka</h1>
        <p className="text-muted mx-auto max-w-sm text-sm leading-6">
          Toko mungkin belum dipublikasikan, dinonaktifkan, atau alamatnya salah.
        </p>
        <Link
          href="/"
          className="bg-brand mt-5 inline-flex rounded-xl px-4 py-3 text-sm font-extrabold text-white"
        >
          Kembali ke Menuku
        </Link>
      </section>
    </main>
  );
}
