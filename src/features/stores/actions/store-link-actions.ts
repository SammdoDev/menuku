"use server";

import { revalidatePath } from "next/cache";

import { redirect } from "next/navigation";

import { z } from "zod";

import { getCurrentMerchant } from "../queries/current-merchant";

import { getPlanRules } from "@/features/billing/plans";

import { RESERVED_STORE_SLUGS } from "../store-paths";

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
  revalidatePath(`/${tenant!.slug}`);
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
  revalidatePath(`/${tenant!.slug}`);
}

export async function deleteLinkAction(formData: FormData) {
  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) return;
  const { tenant, supabase } = await requireTenant();
  await supabase.from("custom_links").delete().eq("id", id.data!).eq("tenant_id", tenant!.id);
  revalidatePath("/dashboard/links");
  revalidatePath(`/${tenant!.slug}`);
  revalidatePath("/dashboard");
}
