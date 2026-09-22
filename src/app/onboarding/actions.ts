"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "../../lib/supabase/server";

const reserved = [
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
];
const schema = z.object({
  name: z.string().trim().min(2, "Nama bisnis minimal 2 karakter.").max(120),
  businessType: z.string().trim().min(2, "Pilih jenis bisnis."),
  description: z.string().trim().max(300).optional(),
  whatsapp: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]*$/, "Nomor WhatsApp tidak valid.")
    .max(30)
    .optional(),
  logoUrl: z.string().url().optional(),
  bannerUrl: z.string().url().optional(),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(
      /^[a-z0-9]([a-z0-9-]{1,28})[a-z0-9]$/,
      "Slug harus 3–30 karakter: huruf kecil, angka, atau tanda hubung.",
    ),
});
const fail = (message: string): never =>
  redirect(`/onboarding?error=${encodeURIComponent(message)}`);

export async function createTenantAction(formData: FormData) {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    businessType: formData.get("businessType"),
    description: formData.get("description") || undefined,
    whatsapp: formData.get("whatsapp") || undefined,
    logoUrl: formData.get("logoUrl") || undefined,
    bannerUrl: formData.get("bannerUrl") || undefined,
    slug: formData.get("slug"),
  });
  if (!parsed.success) fail(parsed.error.issues[0].message);
  const value = parsed.data!;
  if (reserved.includes(value.slug)) fail("Alamat tersebut tidak dapat digunakan.");
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: existing } = await supabase
    .from("tenants")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();
  if (existing) redirect("/dashboard");
  const { error } = await supabase.from("tenants").insert({
    owner_id: user.id,
    name: value.name,
    slug: value.slug,
    business_type: value.businessType,
    description: value.description || null,
    whatsapp: value.whatsapp || null,
    logo_url: value.logoUrl || null,
    banner_url: value.bannerUrl || null,
  });
  if (error?.code === "23505") fail("Alamat tersebut sudah dipakai. Coba yang lain.");
  if (error) fail("Bisnis belum dapat dibuat. Coba lagi.");
  redirect("/dashboard");
}
