"use server";

import { revalidatePath } from "next/cache";

import { redirect } from "next/navigation";

import { z } from "zod";

import { getCurrentMerchant } from "@/features/stores/queries/current-merchant";

import { getPlanRules } from "@/features/billing/plans";

import { RESERVED_STORE_SLUGS } from "@/features/stores/store-paths";

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
  revalidatePath(`/${tenant!.slug}`);
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
