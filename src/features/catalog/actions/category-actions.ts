"use server";

import { revalidatePath } from "next/cache";

import { redirect } from "next/navigation";

import { z } from "zod";

import { getCurrentMerchant } from "@/features/stores/queries/current-merchant";

import { getPlanRules } from "@/features/billing/plans";

import { getStorefrontPath, RESERVED_STORE_SLUGS } from "@/features/stores/store-paths";

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
  revalidatePath(getStorefrontPath(tenant!.slug));
  revalidatePath("/sitemap.xml");
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
  revalidatePath(getStorefrontPath(tenant!.slug));
  revalidatePath("/sitemap.xml");
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
  revalidatePath(getStorefrontPath(tenant!.slug));
  revalidatePath("/sitemap.xml");
}

export async function deleteCategoryAction(formData: FormData) {
  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) return;
  const { tenant, supabase } = await requireTenant();
  await supabase.from("categories").delete().eq("id", id.data!).eq("tenant_id", tenant!.id);
  revalidatePath("/dashboard/categories");
  revalidatePath("/dashboard/menu");
  revalidatePath(getStorefrontPath(tenant!.slug));
  revalidatePath("/sitemap.xml");
}
