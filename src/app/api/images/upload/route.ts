import { NextResponse } from "next/server";

const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
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
  if (file.size > 5 * 1024 * 1024)
    return NextResponse.json({ error: "Ukuran gambar maksimal 5 MB." }, { status: 400 });
  const image = Buffer.from(await file.arrayBuffer()).toString("base64");
  const upload = new FormData();
  const extension =
    file.name
      .split(".")
      .pop()
      ?.toLowerCase()
      .replace(/[^a-z0-9]/g, "") || "image";
  upload.set("key", key);
  upload.set("image", image);
  upload.set("name", `menuku--${tenantSlug}--${kind}--${Date.now()}.${extension}`);
  const response = await fetch("https://api.imgbb.com/1/upload", { method: "POST", body: upload });
  if (!response.ok)
    return NextResponse.json({ error: "Upload gambar gagal. Coba lagi." }, { status: 502 });
  const result = (await response.json()) as {
    data?: { url?: string; display_url?: string; thumb?: { url?: string } };
  };
  if (!result.data?.url)
    return NextResponse.json({ error: "ImgBB tidak mengembalikan URL gambar." }, { status: 502 });
  return NextResponse.json({
    url: result.data.url,
    displayUrl: result.data.display_url,
    thumbnailUrl: result.data.thumb?.url,
  });
}
