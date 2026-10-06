"use server";

import { revalidatePath } from "next/cache";

import { redirect } from "next/navigation";

import { z } from "zod";

import { getCurrentMerchant } from "../queries/current-merchant";

import { getPlanRules } from "@/features/billing/plans";
import { getStorefrontPath } from "@/features/stores/store-paths";

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

export async function togglePublishAction(formData: FormData) {
  const published = formData.get("published") === "true";
  const { tenant, supabase } = await requireTenant();
  const { error } = await supabase
    .from("tenants")
    .update({ is_published: !published })
    .eq("id", tenant!.id)
    .eq("owner_id", tenant!.owner_id);
  if (error) throw new Error("Failed to update storefront publication status.", { cause: error });
  revalidatePath("/dashboard");
  revalidatePath(getStorefrontPath(tenant!.slug));
  revalidatePath("/dashboard/publish");
  revalidatePath("/sitemap.xml");
}
