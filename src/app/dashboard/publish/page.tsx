import Link from "next/link";
import { ExternalLink, Globe2, ShieldCheck } from "lucide-react";
import DashboardShell from "../../../components/dashboard-shell";
import { GlobalInput, SubmitButton } from "../../../components/ui/form-controls";
import { getCurrentMerchant } from "../../../lib/merchant";
import { publicStoreUrl } from "../../../lib/site";
import { togglePublishAction } from "../actions";

export default async function PublishPage() {
  const { tenant } = await getCurrentMerchant();
  if (!tenant) return null;
  const url = publicStoreUrl(tenant.slug);
  const card = "rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6";
  return (
    <DashboardShell tenant={tenant} active="publish" title="Publikasi">
      <header className="mb-7">
        <h1 className="display-font text-3xl font-black">Publikasi halaman</h1>
        <p className="text-muted mt-2 text-sm">
          Atur kapan katalog {tenant.name} dapat dilihat pelanggan.
        </p>
      </header>
      <div className="grid items-start gap-5 xl:grid-cols-[.9fr_1.1fr]">
        <article className={card}>
          <h2 className="display-font text-xl font-black">
            {tenant.is_published ? "Halaman sedang publik" : "Halaman masih draft"}
          </h2>
          <p className="text-muted my-4 text-sm leading-6">
            {tenant.is_published
              ? "Pelanggan dapat membuka halaman menu melalui link berikut."
              : "Saat dipublikasikan, pengunjung tanpa login dapat membuka katalog dan menu kamu."}
          </p>
          <div className="border-line mb-4 rounded-xl border border-dashed p-8 text-center">
            <Globe2 className="text-brand mx-auto mb-2" />
            <b className="text-sm break-all">www.digimenu.my.id/store/{tenant.slug}</b>
          </div>
          <form className="grid" action={togglePublishAction}>
            <GlobalInput type="hidden" name="published" value={String(tenant.is_published)} />
            <SubmitButton pendingLabel="Memperbarui status...">
              {tenant.is_published ? "Jadikan draft" : "Publikasikan halaman"}
            </SubmitButton>
          </form>
          {tenant.is_published && (
            <Link
              href={url}
              target="_blank"
              className="border-line mt-3 flex min-h-12 items-center justify-center gap-2 rounded-xl border text-sm font-extrabold"
            >
              Buka halaman publik <ExternalLink size={16} />
            </Link>
          )}
        </article>
        <article className={card}>
          <h2 className="display-font text-xl font-black">Sebelum dibagikan</h2>
          <p className="text-muted mt-1 mb-5 text-xs">
            Periksa hal berikut agar pengalaman pelanggan tetap baik.
          </p>
          <div className="grid gap-2">
            <div className="border-line flex items-center gap-3 rounded-xl border p-3">
              <span className="text-brand grid size-10 place-items-center rounded-xl bg-orange-50">
                <ShieldCheck size={18} />
              </span>
              <div>
                <b className="block text-sm">Nama dan alamat halaman</b>
                <small className="text-muted text-xs">
                  {tenant.name} · www.digimenu.my.id/store/{tenant.slug}
                </small>
              </div>
            </div>
            <div className="border-line flex items-center gap-3 rounded-xl border p-3">
              <span className="text-brand grid size-10 place-items-center rounded-xl bg-orange-50 text-xs font-black">
                02
              </span>
              <div>
                <b className="block text-sm">Isi menu</b>
                <small className="text-muted text-xs">
                  Tambahkan menu sebelum membagikan link.
                </small>
              </div>
            </div>
          </div>
        </article>
      </div>
    </DashboardShell>
  );
}
