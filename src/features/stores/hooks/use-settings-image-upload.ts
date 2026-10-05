"use client";

import { useState, type ChangeEvent } from "react";
import { normalizeImageUrl } from "@/lib/image-url";
import { optimizeImage, readImageUploadResponse } from "@/lib/image-upload-client";

export type UploadKind = "logo" | "banner" | "promo";

type SettingsImageUploadOptions = {
  initialLogo: string | null;
  initialBanner: string | null;
  initialPromoImage: string | null;
};

function useSettingsImageUpload({
  initialLogo,
  initialBanner,
  initialPromoImage,
}: SettingsImageUploadOptions) {
  const [logo, setLogo] = useState(normalizeImageUrl(initialLogo));
  const [banner, setBanner] = useState(normalizeImageUrl(initialBanner));
  const [promoImage, setPromoImage] = useState(normalizeImageUrl(initialPromoImage));
  const [uploading, setUploading] = useState<UploadKind | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [crop, setCrop] = useState<{ file: File; kind: UploadKind } | null>(null);

  async function uploadImage(file: File, kind: UploadKind, tenantSlug: string, slug: string) {
    setUploadError("");
    setUploading(kind);
    try {
      const body = new FormData();
      body.set("file", await optimizeImage(file));
      body.set("tenantSlug", slug || tenantSlug);
      body.set("kind", kind);
      const response = await fetch("/api/images/upload", { method: "POST", body });
      const data = await readImageUploadResponse(response);
      if (!response.ok || !data.url) throw new Error(data.error || "Upload gambar gagal.");
      if (kind === "logo") setLogo(data.url);
      else if (kind === "banner") setBanner(data.url);
      else setPromoImage(data.url);
    } catch (caught) {
      setUploadError(caught instanceof Error ? caught.message : "Upload gambar gagal.");
    } finally {
      setUploading(null);
    }
  }

  function selectFile(event: ChangeEvent<HTMLInputElement>, kind: UploadKind) {
    const file = event.currentTarget.files?.[0];
    if (file) setCrop({ file, kind });
    event.currentTarget.value = "";
  }

  return {
    logo,
    setLogo,
    banner,
    setBanner,
    promoImage,
    setPromoImage,
    uploading,
    uploadError,
    crop,
    setCrop,
    uploadImage,
    selectFile,
  };
}

export default useSettingsImageUpload;
