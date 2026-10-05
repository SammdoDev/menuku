import { SlugInput } from "@/components/ui/text-input";

type StoreUrlSectionProps = {
  siteOrigin: string;
  slug: string;
  onSlugChange: (slug: string) => void;
};

function StoreUrlSection({ siteOrigin, slug, onSlugChange }: StoreUrlSectionProps) {
  const fieldClassName = "grid gap-2 text-sm font-bold";

  return (
    <section className="border-line rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-5">
        <p className="text-brand text-[10px] font-black tracking-[.12em] uppercase">
          Alamat halaman
        </p>
        <h2 className="display-font mt-1 text-xl font-black">URL publik</h2>
        <p className="text-muted mt-1 text-xs">
          Mengubah URL membuat link lama tidak dapat digunakan lagi.
        </p>
      </div>
      <label className={fieldClassName}>
        Slug halaman
        <SlugInput
          prefix={`${siteOrigin}/`}
          name="slug"
          value={slug}
          onChange={(event) =>
            onSlugChange(event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
          }
          required
          minLength={3}
          maxLength={30}
        />
      </label>
      <p className="text-muted mt-3 rounded-xl bg-[#f6f3ef] p-3 text-xs break-all">
        URL baru:{" "}
        <b className="text-ink">
          {siteOrigin}/{slug || "alamat-bisnis"}
        </b>
      </p>
    </section>
  );
}

export default StoreUrlSection;
