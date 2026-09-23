"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getCurrentMerchant } from "../../lib/merchant";
import { getPlanRules } from "../../lib/plans";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
async function requireTenant() {
  const merchant = await getCurrentMerchant();
  if (!merchant.user) redirect("/login");
  if (!merchant.tenant) redirect("/onboarding");
  return merchant;
}

export async function createCategoryAction(formData: FormData) {
  const parsed = z
    .object({
      name: z.string().trim().min(2, "Nama kategori minimal 2 karakter.").max(80),
      description: z.string().trim().max(200).optional(),
    })
    .safeParse({
      name: formData.get("name"),
      description: formData.get("description") || undefined,
    });
  if (!parsed.success)
    redirect(`/dashboard/categories?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  const { tenant, supabase } = await requireTenant();
  const rules = getPlanRules(tenant!.plan);
  const { count: categoryCount } = await supabase
    .from("categories")
    .select("id", { count: "exact", head: true })
    .eq("tenant_id", tenant!.id);
  if ((categoryCount || 0) >= rules.categories)
    redirect(
      "/dashboard/categories?error=Paket+Free+Demo+dibatasi+2+kategori.+Upgrade+untuk+menambah+lebih+banyak.",
    );
  const value = parsed.data!;
  const { error } = await supabase.from("categories").insert({
    tenant_id: tenant!.id,
    name: value.name,
    slug: slugify(value.name),
    description: value.description || null,
  });
  if (error?.code === "23505")
    redirect("/dashboard/categories?error=Kategori+dengan+nama+tersebut+sudah+ada.");
  if (error) redirect("/dashboard/categories?error=Kategori+belum+dapat+disimpan.");
  revalidatePath("/dashboard/categories");
}
export async function updateCategoryAction(formData: FormData) {
  const parsed = z
    .object({
      id: z.string().uuid(),
      name: z.string().trim().min(2, "Nama kategori minimal 2 karakter.").max(80),
      description: z.string().trim().max(200).optional(),
    })
    .safeParse({
      id: formData.get("id"),
      name: formData.get("name"),
      description: formData.get("description") || undefined,
    });
  if (!parsed.success)
    redirect(`/dashboard/categories?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  const { tenant, supabase } = await requireTenant();
  const value = parsed.data!;
  const { error } = await supabase
    .from("categories")
    .update({
      name: value.name,
      slug: slugify(value.name),
      description: value.description || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", value.id)
    .eq("tenant_id", tenant!.id);
  if (error?.code === "23505")
    redirect("/dashboard/categories?error=Kategori+dengan+nama+tersebut+sudah+ada.");
  if (error) redirect("/dashboard/categories?error=Kategori+belum+dapat+diperbarui.");
  revalidatePath("/dashboard/categories");
  revalidatePath("/dashboard/menu");
  revalidatePath(`/store/${tenant!.slug}`);
}
export async function toggleCategoryAction(formData: FormData) {
  const id = z.string().uuid().safeParse(formData.get("id"));
  const active = formData.get("active") === "true";
  if (!id.success) return;
  const { tenant, supabase } = await requireTenant();
  await supabase
    .from("categories")
    .update({ is_active: !active })
    .eq("id", id.data!)
    .eq("tenant_id", tenant!.id);
  revalidatePath("/dashboard/categories");
  revalidatePath("/dashboard/menu");
}
export async function deleteCategoryAction(formData: FormData) {
  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) return;
  const { tenant, supabase } = await requireTenant();
  await supabase.from("categories").delete().eq("id", id.data!).eq("tenant_id", tenant!.id);
  revalidatePath("/dashboard/categories");
  revalidatePath("/dashboard/menu");
}

export async function createProductAction(formData: FormData) {
  const parsed = z
    .object({
      name: z.string().trim().min(2, "Nama menu minimal 2 karakter.").max(120),
      description: z.string().trim().max(1000).optional(),
      imageUrl: z.string().url().optional(),
      categoryId: z.string().uuid().optional(),
      price: z.coerce.number().int().min(0, "Harga tidak valid."),
      discountPrice: z.preprocess(
        (v) => (v === "" ? undefined : v),
        z.coerce.number().int().min(0).optional(),
      ),
      featured: z.boolean().optional(),
    })
    .safeParse({
      name: formData.get("name"),
      description: formData.get("description") || undefined,
      imageUrl: formData.get("imageUrl") || undefined,
      categoryId: formData.get("categoryId") || undefined,
      price: formData.get("price"),
      discountPrice: formData.get("discountPrice"),
      featured: formData.get("featured") === "on",
    });
  if (!parsed.success)
    redirect(`/dashboard/menu?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  const value = parsed.data!;
  if (value.discountPrice !== undefined && value.discountPrice > value.price)
    redirect("/dashboard/menu?error=Harga+promo+tidak+boleh+lebih+besar+dari+harga+normal.");
  const { tenant, supabase } = await requireTenant();
  const rules = getPlanRules(tenant!.plan);
  const { count: productCount } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("tenant_id", tenant!.id);
  if ((productCount || 0) >= rules.products)
    redirect(
      "/dashboard/menu?error=Paket+Free+Demo+dibatasi+4+produk.+Upgrade+untuk+menambah+lebih+banyak.",
    );
  if (value.categoryId) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("id", value.categoryId)
      .eq("tenant_id", tenant!.id)
      .maybeSingle();
    if (!category) redirect("/dashboard/menu?error=Kategori+tidak+valid.");
  }
  const { error } = await supabase.from("products").insert({
    tenant_id: tenant!.id,
    category_id: value.categoryId || null,
    name: value.name,
    slug: slugify(value.name),
    description: value.description || null,
    image_url: value.imageUrl || null,
    price: value.price,
    discount_price: value.discountPrice ?? null,
    is_featured: value.featured ?? false,
  });
  if (error?.code === "23505") redirect("/dashboard/menu?error=Nama+menu+tersebut+sudah+ada.");
  if (error) redirect("/dashboard/menu?error=Menu+belum+dapat+disimpan.");
  revalidatePath("/dashboard/menu");
  revalidatePath("/dashboard");
}
export async function updateProductAction(formData: FormData) {
  const parsed = z
    .object({
      id: z.string().uuid(),
      name: z.string().trim().min(2, "Nama menu minimal 2 karakter.").max(120),
      description: z.string().trim().max(1000).optional(),
      imageUrl: z.string().url().optional(),
      categoryId: z.string().uuid().optional(),
      price: z.coerce.number().int().min(0, "Harga tidak valid."),
      discountPrice: z.preprocess(
        (v) => (v === "" ? undefined : v),
        z.coerce.number().int().min(0).optional(),
      ),
      featured: z.boolean().optional(),
    })
    .safeParse({
      id: formData.get("id"),
      name: formData.get("name"),
      description: formData.get("description") || undefined,
      imageUrl: formData.get("imageUrl") || undefined,
      categoryId: formData.get("categoryId") || undefined,
      price: formData.get("price"),
      discountPrice: formData.get("discountPrice"),
      featured: formData.get("featured") === "on",
    });
  if (!parsed.success)
    redirect(`/dashboard/menu?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  const value = parsed.data!;
  if (value.discountPrice !== undefined && value.discountPrice > value.price)
    redirect("/dashboard/menu?error=Harga+promo+tidak+boleh+lebih+besar+dari+harga+normal.");
  const { tenant, supabase } = await requireTenant();
  if (value.categoryId) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("id", value.categoryId)
      .eq("tenant_id", tenant!.id)
      .maybeSingle();
    if (!category) redirect("/dashboard/menu?error=Kategori+tidak+valid.");
  }
  const { error } = await supabase
    .from("products")
    .update({
      category_id: value.categoryId || null,
      name: value.name,
      slug: slugify(value.name),
      description: value.description || null,
      image_url: value.imageUrl || null,
      price: value.price,
      discount_price: value.discountPrice ?? null,
      is_featured: value.featured ?? false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", value.id)
    .eq("tenant_id", tenant!.id);
  if (error?.code === "23505") redirect("/dashboard/menu?error=Nama+menu+tersebut+sudah+ada.");
  if (error) redirect("/dashboard/menu?error=Menu+belum+dapat+diperbarui.");
  revalidatePath("/dashboard/menu");
  revalidatePath("/dashboard");
  revalidatePath(`/store/${tenant!.slug}`);
}
export async function toggleProductAction(formData: FormData) {
  const id = z.string().uuid().safeParse(formData.get("id"));
  const field = formData.get("field");
  const value = formData.get("value") === "true";
  if (!id.success || (field !== "is_active" && field !== "is_available" && field !== "is_featured"))
    return;
  const { tenant, supabase } = await requireTenant();
  await supabase
    .from("products")
    .update({ [field]: !value })
    .eq("id", id.data!)
    .eq("tenant_id", tenant!.id);
  revalidatePath("/dashboard/menu");
  revalidatePath("/dashboard");
}
export async function deleteProductAction(formData: FormData) {
  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) return;
  const { tenant, supabase } = await requireTenant();
  await supabase.from("products").delete().eq("id", id.data!).eq("tenant_id", tenant!.id);
  revalidatePath("/dashboard/menu");
  revalidatePath("/dashboard");
}

export async function createLinkAction(formData: FormData) {
  const parsed = z
    .object({
      title: z.string().trim().min(2, "Judul link minimal 2 karakter.").max(100),
      url: z
        .string()
        .trim()
        .url("Masukkan URL yang valid, misalnya https://instagram.com/namabisnis."),
      linkType: z.enum([
        "whatsapp",
        "instagram",
        "tiktok",
        "maps",
        "website",
        "marketplace",
        "reservation",
        "custom",
      ]),
    })
    .safeParse({
      title: formData.get("title"),
      url: formData.get("url"),
      linkType: formData.get("linkType"),
    });
  if (!parsed.success)
    redirect(`/dashboard/links?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  const { tenant, supabase } = await requireTenant();
  if (getPlanRules(tenant!.plan).links === 0)
    redirect("/dashboard/links?error=Custom+link+tersedia+mulai+paket+Premium.");
  const value = parsed.data!;
  const { error } = await supabase.from("custom_links").insert({
    tenant_id: tenant!.id,
    title: value.title,
    url: value.url,
    link_type: value.linkType,
  });
  if (error) redirect("/dashboard/links?error=Link+belum+dapat+disimpan.");
  revalidatePath("/dashboard/links");
  revalidatePath(`/store/${tenant!.slug}`);
  revalidatePath("/dashboard");
}
export async function toggleLinkAction(formData: FormData) {
  const id = z.string().uuid().safeParse(formData.get("id"));
  const active = formData.get("active") === "true";
  if (!id.success) return;
  const { tenant, supabase } = await requireTenant();
  await supabase
    .from("custom_links")
    .update({ is_active: !active })
    .eq("id", id.data!)
    .eq("tenant_id", tenant!.id);
  revalidatePath("/dashboard/links");
  revalidatePath(`/store/${tenant!.slug}`);
}
export async function deleteLinkAction(formData: FormData) {
  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) return;
  const { tenant, supabase } = await requireTenant();
  await supabase.from("custom_links").delete().eq("id", id.data!).eq("tenant_id", tenant!.id);
  revalidatePath("/dashboard/links");
  revalidatePath(`/store/${tenant!.slug}`);
  revalidatePath("/dashboard");
}

export async function togglePublishAction(formData: FormData) {
  const published = formData.get("published") === "true";
  const { tenant, supabase } = await requireTenant();
  await supabase
    .from("tenants")
    .update({ is_published: !published })
    .eq("id", tenant!.id)
    .eq("owner_id", tenant!.owner_id);
  revalidatePath("/dashboard");
  revalidatePath(`/store/${tenant!.slug}`);
  revalidatePath("/dashboard/publish");
}

const reservedSlugs = new Set([
  "www",
  "app",
  "admin",
  "api",
  "dashboard",
  "login",
  "register",
  "support",
  "help",
  "pricing",
  "settings",
]);

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
  if (reservedSlugs.has(value.slug)) fail("Alamat tersebut tidak dapat digunakan.");

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
      updated_at: new Date().toISOString(),
    })
    .eq("id", tenant!.id)
    .eq("owner_id", tenant!.owner_id);
  if (error?.code === "23505") fail("Alamat tersebut sudah digunakan bisnis lain.");
  if (error) fail("Pengaturan belum dapat disimpan. Coba lagi.");

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  revalidatePath(`/store/${previousSlug}`);
  revalidatePath(`/store/${value.slug}`);
  redirect("/dashboard/settings?success=Pengaturan+berhasil+disimpan.");
}
