export type ImageUploadResponse = { url?: string; error?: string };
export const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

export async function readImageUploadResponse(response: Response): Promise<ImageUploadResponse> {
  const raw = await response.text();
  try {
    return JSON.parse(raw) as ImageUploadResponse;
  } catch {
    throw new Error(
      response.status === 413
        ? "Ukuran gambar terlalu besar. Gunakan file maksimal 4 MB."
        : `Upload gambar gagal (server ${response.status}). Coba lagi.`,
    );
  }
}
