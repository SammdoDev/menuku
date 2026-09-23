export type ImageUploadResponse = { url?: string; error?: string };
export const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

export async function optimizeImage(file: File) {
  if (file.size <= MAX_IMAGE_SIZE || typeof createImageBitmap === "undefined") return file;
  const bitmap = await createImageBitmap(file);
  const maxDimension = 1600;
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) return file;
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  for (const quality of [0.82, 0.7, 0.58, 0.46, 0.4]) {
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality),
    );
    if (blob && blob.size <= MAX_IMAGE_SIZE)
      return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.jpg`, { type: "image/jpeg" });
  }
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.35),
  );
  return blob
    ? new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.jpg`, { type: "image/jpeg" })
    : file;
}

export async function readImageUploadResponse(response: Response): Promise<ImageUploadResponse> {
  const raw = await response.text();
  try {
    return JSON.parse(raw) as ImageUploadResponse;
  } catch {
    throw new Error(
      response.status === 413
        ? "Ukuran gambar terlalu besar. Gunakan file maksimal 2 MB."
        : `Upload gambar gagal (server ${response.status}). Coba lagi.`,
    );
  }
}
