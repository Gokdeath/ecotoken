import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp"
};

export async function saveEvidenceImage(file: File) {
  const extension = extensions[file.type] ?? "jpg";
  const filename = `evidence/${randomUUID()}.${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(filename, bytes, {
      access: "public",
      contentType: file.type
    });
    return blob.url;
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  const localFilename = `${randomUUID()}.${extension}`;
  await writeFile(path.join(uploadDir, localFilename), bytes);
  return `/uploads/${localFilename}`;
}
