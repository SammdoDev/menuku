import { Autocomplete } from "@/components/ui/autocomplete";
import { Input, Textarea } from "@/components/ui/text-input";
import type { Tenant } from "../../types";

type StoreDetailsSectionProps = { tenant: Tenant };

const businessTypes = [
  "Kedai kopi",
  "Restoran",
  "Warung makan",
  "Bakery",
  "Food truck",
  "Hotel atau penginapan",
  "Home business",
].map((value) => ({ value, label: value }));

function StoreDetailsSection({ tenant }: StoreDetailsSectionProps) {
  const fieldClassName = "grid gap-2 text-sm font-bold";
  const availableBusinessTypes = tenant.business_type
    ? businessTypes.some((item) => item.value === tenant.business_type)
      ? businessTypes
      : [{ value: tenant.business_type, label: tenant.business_type }, ...businessTypes]
    : businessTypes;
  const businessOptions = [
    { value: "", label: "Pilih jenis bisnis", disabled: true },
    ...availableBusinessTypes,
  ];

  return (
    <section className="border-line rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-5">
        <p className="text-brand text-[10px] font-black tracking-[.12em] uppercase">Informasi</p>
        <h2 className="display-font mt-1 text-xl font-black">Detail bisnis</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={fieldClassName}>
          Nama bisnis
          <Input name="name" defaultValue={tenant.name} required maxLength={120} />
        </label>
        <div className={fieldClassName}>
          <label htmlFor="settings-business-type">Jenis bisnis</label>
          <Autocomplete
            id="settings-business-type"
            name="businessType"
            defaultValue={tenant.business_type || ""}
            options={businessOptions}
          />
        </div>
        <label className={`${fieldClassName} sm:col-span-2`}>
          Deskripsi singkat
          <Textarea
            name="description"
            defaultValue={tenant.description || ""}
            maxLength={300}
            placeholder="Ceritakan bisnis kamu secara singkat"
          />
        </label>
        <label className={fieldClassName}>
          Nomor WhatsApp
          <Input
            name="whatsapp"
            inputMode="tel"
            defaultValue={tenant.whatsapp || ""}
            placeholder="081234567890"
          />
        </label>
        <label className={fieldClassName}>
          Username Instagram
          <Input name="instagram" defaultValue={tenant.instagram || ""} placeholder="@ruangrasa" />
        </label>
        <label className={`${fieldClassName} sm:col-span-2`}>
          Alamat bisnis
          <Textarea
            name="address"
            defaultValue={tenant.address || ""}
            placeholder="Alamat yang tampil di halaman publik"
          />
        </label>
        <label className={`${fieldClassName} sm:col-span-2`}>
          Link Google Maps
          <Input
            name="mapsUrl"
            type="url"
            defaultValue={tenant.maps_url || ""}
            placeholder="https://maps.google.com/..."
          />
        </label>
      </div>
    </section>
  );
}

export default StoreDetailsSection;
