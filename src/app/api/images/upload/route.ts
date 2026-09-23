import { NextResponse } from "next/server";
import { MAX_IMAGE_SIZE } from "../../../../lib/image-upload";

const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
const albumByKind = {
  product: "IMGBB_ALBUM_PRODUCT",
  banner: "IMGBB_ALBUM_BACKGROUND",
  logo: "IMGBB_ALBUM_PROFILE",
} as const;

type ImgBBResult = {
  data?: { url?: string; display_url?: string; thumb?: { url?: string } };
  error?: { message?: string };
};

async function sendToImgBB(key: string, upload: FormData, albumId?: string) {
  const endpoint = new URL("https://api.imgbb.com/1/upload");
  endpoint.searchParams.set("key", key);
  if (albumId) endpoint.searchParams.set("album", albumId);
  return fetch(endpoint, { method: "POST", body: upload });
}

async function readImgBBResult(response: Response): Promise<ImgBBResult | null> {
  const raw = await response.text();
  try {
    return JSON.parse(raw) as ImgBBResult;
  } catch {
    return null;
  }
}

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
    upload.set("image", file);
    upload.set("name", `menuku--${tenantSlug}--${kind}--${Date.now()}.${extension}`);
    const albumEnvKey = albumByKind[kind as keyof typeof albumByKind];
    const albumId = albumEnvKey ? process.env[albumEnvKey] : undefined;
    if (albumId) upload.set("album", albumId);
    let response = await sendToImgBB(key, upload, albumId);
    let result = await readImgBBResult(response);
    let albumAttached = Boolean(albumId && response.ok && result?.data?.url);
    if (albumId && (!response.ok || !result?.data?.url)) {
      console.warn(`[images] ImgBB album upload failed for ${kind}; retrying without album`, {
        status: response.status,
        message: result?.error?.message,
      });
      const retryUpload = new FormData();
      retryUpload.set("image", file);
      retryUpload.set("name", `menuku--${tenantSlug}--${kind}--${Date.now()}.${extension}`);
      response = await sendToImgBB(key, retryUpload);
      result = await readImgBBResult(response);
    }
    if (!result)
      return NextResponse.json(
        { error: `Penyedia gambar mengembalikan respons tidak valid (${response.status}).` },
        { status: 502 },
      );
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
      albumAttached,
      albumWarning:
        albumId && !albumAttached
          ? "Gambar tersimpan, tetapi album ImgBB menolak album ID tersebut."
          : undefined,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload gambar gagal. Coba lagi." },
      { status: 502 },
    );
  }
}
