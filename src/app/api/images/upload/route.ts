import { NextResponse } from "next/server";
import { MAX_IMAGE_SIZE } from "../../../../lib/image-upload";

const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
const albumByKind = {
  product: "IMGBB_ALBUM_PRODUCT",
  banner: "IMGBB_ALBUM_BACKGROUND",
  logo: "IMGBB_ALBUM_PROFILE",
} as const;

export async function POST(request: Request) {
  try {
    const key = process.env.IMGBB_API_KEY;
    if (!key)
      return NextResponse.json(
        { error: "IMGBB_API_KEY belum diatur di .env.local." },
        { status: 503 },
      );
    const body = await request.formData();
    const file = body.get("file");
    const tenantSlug =
      String(body.get("tenantSlug") ?? "draft")
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 30) || "draft";
    const kind = ["logo", "banner", "product"].includes(String(body.get("kind")))
      ? String(body.get("kind"))
      : "image";
    if (!(file instanceof File))
      return NextResponse.json({ error: "File gambar tidak ditemukan." }, { status: 400 });
    if (!allowed.has(file.type))
      return NextResponse.json({ error: "Gunakan JPG, PNG, atau WebP." }, { status: 400 });
    if (file.size > MAX_IMAGE_SIZE)
      return NextResponse.json({ error: "Ukuran gambar maksimal 4 MB." }, { status: 400 });
    const upload = new FormData();
    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase()
        .replace(/[^a-z0-9]/g, "") || "image";
    upload.set("key", key);
    upload.set("image", file);
    upload.set("name", `menuku--${tenantSlug}--${kind}--${Date.now()}.${extension}`);
    const albumEnvKey = albumByKind[kind as keyof typeof albumByKind];
    const albumId = albumEnvKey ? process.env[albumEnvKey] : undefined;
    if (albumId) upload.set("album", albumId);
    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: upload,
    });
    const raw = await response.text();
    let result: {
      data?: { url?: string; display_url?: string; thumb?: { url?: string } };
      error?: { message?: string };
    };
    try {
      result = JSON.parse(raw) as typeof result;
    } catch {
      return NextResponse.json(
        { error: `Penyedia gambar mengembalikan respons tidak valid (${response.status}).` },
        { status: 502 },
      );
    }
    if (!response.ok)
      return NextResponse.json(
        { error: result.error?.message || "Upload gambar gagal. Coba lagi." },
        { status: 502 },
      );
    if (!result.data?.url)
      return NextResponse.json({ error: "ImgBB tidak mengembalikan URL gambar." }, { status: 502 });
    return NextResponse.json({
      url: result.data.url,
      displayUrl: result.data.display_url,
      thumbnailUrl: result.data.thumb?.url,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload gambar gagal. Coba lagi." },
      { status: 502 },
    );
  }
}
