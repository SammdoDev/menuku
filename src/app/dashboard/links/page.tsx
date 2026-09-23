import { ExternalLink, Link2, Tags } from "lucide-react";
import DashboardShell from "../../../components/dashboard-shell";
import {
  GlobalAutocomplete,
  GlobalInput,
  SubmitButton,
} from "../../../components/ui/form-controls";
import { getCurrentMerchant } from "../../../lib/merchant";
import { createLinkAction, deleteLinkAction, toggleLinkAction } from "../actions";
import AuthToast from "../../(auth)/auth-toast";
import PersistentForm from "../../../components/ui/persistent-form";

type Props = { searchParams: Promise<{ error?: string }> };
const types = [
  "whatsapp",
  "instagram",
  "tiktok",
  "maps",
  "website",
  "marketplace",
  "reservation",
  "custom",
] as const;
const labels: Record<(typeof types)[number], string> = {
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  tiktok: "TikTok",
  maps: "Google Maps",
  website: "Website",
  marketplace: "Marketplace",
  reservation: "Reservasi",
  custom: "Link custom",
};
export default async function LinksPage({ searchParams }: Props) {
  const { tenant, supabase } = await getCurrentMerchant();
  if (!tenant) return null;
  const [{ data: links }, { error }] = await Promise.all([
    supabase
      .from("custom_links")
      .select("id,title,url,link_type,is_active")
      .eq("tenant_id", tenant.id)
      .order("sort_order"),
    searchParams,
  ]);
  const card = "rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6";
  return (
    <DashboardShell tenant={tenant} active="links" title="Links">
      <header className="mb-7">
        <h1 className="display-font text-3xl font-black">Link bisnis</h1>
        <p className="text-muted mt-2 text-sm">
          Kumpulkan WhatsApp, sosial media, lokasi, dan tautan penting.
        </p>
      </header>
      <AuthToast error={error} />
      <div className="grid items-start gap-5 xl:grid-cols-[380px_1fr]">
        <article className={card}>
          <h2 className="display-font text-xl font-black">Tambah link</h2>
          <p className="text-muted mt-1 mb-5 text-xs">
            Gunakan URL lengkap agar dapat dibuka dengan aman.
          </p>
          <PersistentForm
            storageKey="menuku-link-create"
            className="grid gap-4"
            action={createLinkAction}
          >
            <div className="grid gap-2 text-sm font-bold">
              <label htmlFor="link-type">Jenis link</label>
              <GlobalAutocomplete
                id="link-type"
                name="linkType"
                defaultValue="whatsapp"
                inline
                searchable={false}
                options={types.map((type) => ({ value: type, label: labels[type] }))}
              />
            </div>
            <label className="grid gap-2 text-sm font-bold">
              Judul link
              <GlobalInput
                name="title"
                required
                maxLength={100}
                placeholder="Contoh: Chat kami di WhatsApp"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold">
              URL tujuan
              <GlobalInput name="url" type="url" required placeholder="https://..." />
            </label>
            <SubmitButton pendingLabel="Menambahkan link...">Simpan link</SubmitButton>
          </PersistentForm>
        </article>
        <article className={card}>
          <h2 className="display-font text-xl font-black">Daftar link</h2>
          <p className="text-muted mt-1 mb-5 text-xs">{links?.length ?? 0} link tersimpan</p>
          {links?.length ? (
            <div className="grid gap-2">
              {links.map((item) => (
                <div
                  className="border-line flex flex-wrap items-center gap-3 rounded-xl border p-3 sm:flex-nowrap"
                  key={item.id}
                >
                  <span className="text-brand grid size-10 shrink-0 place-items-center rounded-xl bg-orange-50">
                    <Link2 size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <b className="block truncate text-sm">{item.title}</b>
                    <small className="text-muted block truncate text-xs">{item.url}</small>
                    <span
                      className={`text-[10px] font-extrabold ${item.is_active ? "text-emerald-700" : "text-amber-700"}`}
                    >
                      {item.is_active
                        ? labels[item.link_type as keyof typeof labels] || "Aktif"
                        : "Disembunyikan"}
                    </span>
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-line grid size-8 place-items-center rounded-lg border"
                  >
                    <ExternalLink size={14} />
                  </a>
                  <div className="flex gap-2">
                    <form action={toggleLinkAction}>
                      <GlobalInput type="hidden" name="id" value={item.id} />
                      <GlobalInput type="hidden" name="active" value={String(item.is_active)} />
                      <button className="border-line rounded-lg border px-3 py-2 text-[10px] font-bold">
                        {item.is_active ? "Sembunyikan" : "Tampilkan"}
                      </button>
                    </form>
                    <form action={deleteLinkAction}>
                      <GlobalInput type="hidden" name="id" value={item.id} />
                      <button className="rounded-lg border border-red-200 px-3 py-2 text-[10px] font-bold text-red-600">
                        Hapus
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-line text-muted rounded-xl border border-dashed p-10 text-center text-sm">
              <Tags className="mx-auto mb-2" />
              <p>Belum ada link.</p>
            </div>
          )}
        </article>
      </div>
    </DashboardShell>
  );
}
