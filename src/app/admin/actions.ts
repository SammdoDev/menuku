"use server";

import { revalidatePath } from "next/cache";
import { getAdminContext } from "../../lib/admin";
import { sendEmail } from "../../lib/email";

export async function approveSubscriptionAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  const admin = await getAdminContext();
  if (!admin || !id) return;
  const { data: subscription } = await admin.supabase
    .from("subscriptions")
    .select("tenant_id,plan,amount,expires_at")
    .eq("id", id)
    .maybeSingle();
  if (!subscription) return;
  const expiresAt = subscription.expires_at ? new Date(subscription.expires_at) : new Date();
  if (!subscription.expires_at) expiresAt.setDate(expiresAt.getDate() + 30);
  await admin.supabase
    .from("subscriptions")
    .update({
      status: "active",
      paid_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
    })
    .eq("id", id);
  await admin.supabase
    .from("tenants")
    .update({ plan: subscription.plan })
    .eq("id", subscription.tenant_id);
  const [{ data: owner }, { data: tenant }] = await Promise.all([
    admin.supabase
      .from("profiles")
      .select("email,name")
      .eq(
        "id",
        (
          await admin.supabase
            .from("tenants")
            .select("owner_id")
            .eq("id", subscription.tenant_id)
            .single()
        ).data?.owner_id || "",
      )
      .maybeSingle(),
    admin.supabase.from("tenants").select("name").eq("id", subscription.tenant_id).maybeSingle(),
  ]);
  if (owner?.email)
    await sendEmail({
      to: owner.email,
      subject: `Invoice Menuku - ${subscription.plan}`,
      html: `<h2>Pembayaran Menuku berhasil diverifikasi</h2><p>Halo ${owner.name || ""}, paket <b>${subscription.plan}</b> untuk ${tenant?.name || "bisnis kamu"} aktif sampai <b>${expiresAt.toLocaleDateString("id-ID")}</b>.</p><p>Nominal: Rp${Number(subscription.amount).toLocaleString("id-ID")}</p>`,
    });
  revalidatePath("/admin");
}

export async function remindSubscriptionAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  const admin = await getAdminContext();
  if (!admin || !id) return;
  const { data: subscription } = await admin.supabase
    .from("subscriptions")
    .select("tenant_id,plan,expires_at")
    .eq("id", id)
    .maybeSingle();
  if (!subscription?.expires_at) return;
  const { data: tenant } = await admin.supabase
    .from("tenants")
    .select("name,owner_id")
    .eq("id", subscription.tenant_id)
    .maybeSingle();
  const { data: owner } = tenant?.owner_id
    ? await admin.supabase
        .from("profiles")
        .select("email,name")
        .eq("id", tenant.owner_id)
        .maybeSingle()
    : { data: null };
  if (owner?.email)
    await sendEmail({
      to: owner.email,
      subject: `Paket ${subscription.plan} Menuku segera berakhir`,
      html: `<h2>Pengingat masa aktif Menuku</h2><p>Halo ${owner.name || ""}, paket ${subscription.plan} untuk ${tenant?.name || "bisnis kamu"} berakhir pada ${new Date(subscription.expires_at).toLocaleDateString("id-ID")}.</p><p>Silakan perpanjang dari menu Paket & pembayaran.</p>`,
    });
  await admin.supabase
    .from("subscriptions")
    .update({ reminder_sent_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/admin");
}

export async function toggleCommunityVisibilityAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  const visible = formData.get("visible") === "true";
  const admin = await getAdminContext();
  if (!admin || !id) return;

  await admin.supabase
    .from("tenants")
    .update({ is_community_visible: !visible })
    .eq("id", id);

  revalidatePath("/admin");
  revalidatePath("/community");
}
