import { uploadImageToS3 } from "./s3";
import { nanoid } from "nanoid";

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || "10485760"); // 10MB
const ALLOWED_TYPES = (
  process.env.ALLOWED_IMAGE_TYPES || "image/jpeg,image/png,image/webp,image/gif"
).split(",");

export interface ProcessedImage {
  id: string;
  filename: string;
  mimeType: string;
  s3Key: string;
  url: string;
  size: number;
  width?: number;
  height?: number;
}

export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  if (!file) {
    return { valid: false, error: "No file provided" };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`,
    };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} not allowed. Allowed types: ${ALLOWED_TYPES.join(", ")}`,
    };
  }

  return { valid: true };
}

export async function processAndUploadImage(
  file: File,
): Promise<ProcessedImage> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const s3Result = await uploadImageToS3(file, "recipe-images");

  return {
    id: nanoid(),
    filename: s3Result.filename,
    mimeType: s3Result.mimeType,
    s3Key: s3Result.key,
    url: s3Result.url,
    size: s3Result.size,
    width: undefined,
    height: undefined,
  };
}

export function getImageDisplayUrl(url: string): string {
  return url;
}

export function isValidImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return (
      urlObj.protocol === "https:" &&
      (urlObj.hostname.includes("amazonaws.com") ||
        urlObj.hostname.includes("cloudfront.net") ||
        (process.env.CLOUDFRONT_DOMAIN
          ? urlObj.hostname === new URL(process.env.CLOUDFRONT_DOMAIN).hostname
          : false))
    );
  } catch {
    return false;
  }
}
