"use server";

import { revalidatePath } from "next/cache";

import { redirect } from "next/navigation";

import { z } from "zod";

import { getCurrentMerchant } from "../queries/current-merchant";

import { getPlanRules } from "@/features/billing/plans";

import { getStorefrontPath, RESERVED_STORE_SLUGS } from "../store-paths";
import { isValidOpeningTime, openingHourDays, type OpeningHours } from "../opening-hours";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

async function requireTenant() {
  const merchant = await getCurrentMerchant();
  if (!merchant.user) redirect("/login");
  if (!merchant.tenant) redirect("/onboarding");
  return merchant;
}

const optionalUrl = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().url("URL harus diawali http:// atau https://.").optional(),
);

export async function updateStoreSettingsAction(formData: FormData) {
  const parsed = z
    .object({
      name: z.string().trim().min(2, "Nama bisnis minimal 2 karakter.").max(120),
      slug: z
        .string()
        .trim()
        .toLowerCase()
        .regex(
          /^[a-z0-9]([a-z0-9-]{1,28})[a-z0-9]$/,
          "Alamat harus 3-30 karakter: huruf kecil, angka, atau tanda hubung.",
        ),
      businessType: z.string().trim().max(60).optional(),
      description: z.string().trim().max(300).optional(),
      whatsapp: z
        .string()
        .trim()
        .regex(/^[0-9+\-\s()]*$/, "Nomor WhatsApp tidak valid.")
        .max(30)
        .optional(),
      instagram: z.string().trim().max(100).optional(),
      address: z.string().trim().max(500).optional(),
      mapsUrl: optionalUrl,
      logoUrl: optionalUrl,
      bannerUrl: optionalUrl,
      promoEnabled: z.boolean().optional(),
      promoTitle: z.string().trim().max(120).optional(),
      promoDescription: z.string().trim().max(300).optional(),
      promoImageUrl: optionalUrl,
      promoLinkUrl: optionalUrl,
      primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Warna utama tidak valid."),
      backgroundColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Warna latar tidak valid."),
      layoutType: z.enum(["grid", "list"]),
    })
    .safeParse({
      name: formData.get("name"),
      slug: formData.get("slug"),
      businessType: formData.get("businessType") || undefined,
      description: formData.get("description") || undefined,
      whatsapp: formData.get("whatsapp") || undefined,
      instagram: formData.get("instagram") || undefined,
      address: formData.get("address") || undefined,
      mapsUrl: formData.get("mapsUrl") || undefined,
      logoUrl: formData.get("logoUrl") || undefined,
      bannerUrl: formData.get("bannerUrl") || undefined,
      promoEnabled: formData.get("promoEnabled") === "on",
      promoTitle: formData.get("promoTitle") || undefined,
      promoDescription: formData.get("promoDescription") || undefined,
      promoImageUrl: formData.get("promoImageUrl") || undefined,
      promoLinkUrl: formData.get("promoLinkUrl") || undefined,
      primaryColor: formData.get("primaryColor"),
      backgroundColor: formData.get("backgroundColor"),
      layoutType: formData.get("layoutType"),
    });
  const fail = (message: string): never =>
    redirect(`/dashboard/settings?error=${encodeURIComponent(message)}`);
  if (!parsed.success) fail(parsed.error.issues[0].message);
  const value = parsed.data!;
  if (RESERVED_STORE_SLUGS.has(value.slug)) fail("Alamat tersebut tidak dapat digunakan.");

  const openingHours: OpeningHours = {};
  for (const { key, label } of openingHourDays) {
    const closed = formData.get(`openingHours_${key}_closed`) === "on";
    const open = String(formData.get(`openingHours_${key}_open`) || "");
    const close = String(formData.get(`openingHours_${key}_close`) || "");

    if (closed) {
      openingHours[key] = { closed: true };
      continue;
    }
    if (!open && !close) continue;
    if (!isValidOpeningTime(open) || !isValidOpeningTime(close)) {
      fail(`Lengkapi jam buka dan tutup untuk hari ${label}.`);
    }

    openingHours[key] = { open, close };
  }

  const { tenant, supabase } = await requireTenant();
  const rules = getPlanRules(tenant!.plan);
  const promoAllowed = tenant!.plan !== "free";
  const previousSlug = tenant!.slug;
  const { error } = await supabase
    .from("tenants")
    .update({
      name: value.name,
      slug: value.slug,
      business_type: value.businessType || null,
      description: value.description || null,
      whatsapp: value.whatsapp || null,
      instagram: value.instagram?.replace(/^@/, "") || null,
      address: value.address || null,
      maps_url: value.mapsUrl || null,
      logo_url: value.logoUrl || null,
      banner_url: value.bannerUrl || null,
      promo_enabled: promoAllowed ? (value.promoEnabled ?? false) : false,
      promo_title: promoAllowed ? value.promoTitle || null : tenant!.promo_title,
      promo_description: promoAllowed ? value.promoDescription || null : tenant!.promo_description,
      promo_image_url: promoAllowed ? value.promoImageUrl || null : tenant!.promo_image_url,
      promo_link_url: promoAllowed ? value.promoLinkUrl || null : tenant!.promo_link_url,
      primary_color: rules.customStyle ? value.primaryColor.toUpperCase() : "#FF6534",
      background_color: rules.customStyle ? value.backgroundColor.toUpperCase() : "#F7F6F2",
      layout_type: rules.customStyle ? value.layoutType : "grid",
      show_price: formData.get("showPrice") === "on",
      show_address: formData.get("showAddress") === "on",
      show_opening_hours: formData.get("showOpeningHours") === "on",
      opening_hours: openingHours,
      updated_at: new Date().toISOString(),
    })
    .eq("id", tenant!.id)
    .eq("owner_id", tenant!.owner_id);
  if (error?.code === "23505") fail("Alamat tersebut sudah digunakan bisnis lain.");
  if (error) fail("Pengaturan belum dapat disimpan. Coba lagi.");

  revalidatePath("/dashboard/settings");
  revalidatePath(getStorefrontPath(previousSlug));
  revalidatePath(getStorefrontPath(value.slug));
  revalidatePath("/sitemap.xml");
  redirect("/dashboard/settings?success=Pengaturan+berhasil+disimpan.");
}
