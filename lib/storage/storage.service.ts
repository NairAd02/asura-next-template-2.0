import "server-only";

// ─── Storage stub ─────────────────────────────────────────────────────────────
// Replace with a real storage provider (e.g. AWS S3, Cloudflare R2)
// when adding file storage to a project derived from this template.

export async function upload(
  _file: File,
  _folder: string,
): Promise<{ key: string; url: string }> {
  throw new Error("Storage is not configured in this template.");
}

export async function deleteObject(_key: string): Promise<void> {
  throw new Error("Storage is not configured in this template.");
}

export function getPublicUrl(_key: string): string {
  return "";
}
