import { NextResponse } from "next/server";
import { MAX_IMAGE_SIZE } from "../../../../lib/image-upload";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";

const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
const bucket = process.env.SUPABASE_STORAGE_BUCKET || "images";

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Sesi login sudah berakhir." }, { status: 401 });
    const body = await request.formData();
    const file = body.get("file");
    const tenantSlug =
      String(body.get("tenantSlug") ?? "draft")
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 30) || "draft";
    const requestedKind = String(body.get("kind"));
    const kind = ["logo", "banner", "promo", "product"].includes(requestedKind)
      ? requestedKind
      : "product";
    if (kind === "promo") {
      const { data: tenant } = await supabase
        .from("tenants")
        .select("plan")
        .eq("owner_id", user.id)
        .maybeSingle();
      if (tenant?.plan === "free")
        return NextResponse.json(
          { error: "Event & Promo tersedia mulai paket Premium." },
          { status: 403 },
        );
    }
    if (!(file instanceof File))
      return NextResponse.json({ error: "File gambar tidak ditemukan." }, { status: 400 });
    if (!allowed.has(file.type))
      return NextResponse.json({ error: "Gunakan JPG, PNG, atau WebP." }, { status: 400 });
    if (file.size > MAX_IMAGE_SIZE)
      return NextResponse.json({ error: "Ukuran gambar maksimal 2 MB." }, { status: 400 });
    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase()
        .replace(/[^a-z0-9]/g, "") || "jpg";
    const path = `${user.id}/${kind}/${tenantSlug}-${Date.now()}.${extension}`;
    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { cacheControl: "31536000", contentType: file.type, upsert: false });
    if (error)
      return NextResponse.json({ error: error.message || "Upload gambar gagal." }, { status: 502 });
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return NextResponse.json({
      url: data.publicUrl,
      displayUrl: data.publicUrl,
      thumbnailUrl: data.publicUrl,
      storagePath: path,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload gambar gagal. Coba lagi." },
      { status: 502 },
    );
  }
}
