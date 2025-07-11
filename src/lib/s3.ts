import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";

if (!process.env.AWS_REGION) {
  throw new Error("Missing AWS_REGION environment variable");
}

if (!process.env.AWS_ACCESS_KEY_ID) {
  throw new Error("Missing AWS_ACCESS_KEY_ID environment variable");
}

if (!process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error("Missing AWS_SECRET_ACCESS_KEY environment variable");
}

if (!process.env.S3_BUCKET_NAME) {
  throw new Error("Missing S3_BUCKET_NAME environment variable");
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN;

export interface S3UploadResult {
  key: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
}

export async function uploadImageToS3(
  file: File,
  folder: string = "images",
): Promise<S3UploadResult> {
  const fileExtension = file.name.split(".").pop() || "jpg";
  const key = `${folder}/${Date.now()}-${nanoid()}.${fileExtension}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: file.type,
    ContentDisposition: "inline",
    CacheControl: "max-age=31536000",
    Metadata: {
      originalName: file.name,
      uploadDate: new Date().toISOString(),
    },
  });

  await s3Client.send(command);

  const url = generatePublicUrl(key);

  return {
    key,
    url,
    filename: file.name,
    mimeType: file.type,
    size: file.size,
  };
}

export async function uploadBase64ImageToS3(
  base64Data: string,
  mimeType: string,
  originalFilename: string,
  folder: string = "images",
): Promise<S3UploadResult> {
  const base64Match = base64Data.match(/^data:image\/[a-zA-Z]+;base64,(.+)$/);
  const base64String = base64Match ? base64Match[1] : base64Data;

  const buffer = Buffer.from(base64String, "base64");
  const fileExtension = mimeType.split("/")[1] || "jpg";
  const key = `${folder}/${Date.now()}-${nanoid()}.${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
    ContentDisposition: "inline",
    CacheControl: "max-age=31536000",
    Metadata: {
      originalName: originalFilename,
      uploadDate: new Date().toISOString(),
    },
  });

  await s3Client.send(command);

  const url = generatePublicUrl(key);

  return {
    key,
    url,
    filename: originalFilename,
    mimeType,
    size: buffer.length,
  };
}

export async function deleteImageFromS3(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
}

export function generatePublicUrl(key: string): string {
  if (CLOUDFRONT_DOMAIN) {
    return `${CLOUDFRONT_DOMAIN}/${key}`;
  }

  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

export function extractKeyFromUrl(url: string): string | null {
  if (CLOUDFRONT_DOMAIN && url.startsWith(CLOUDFRONT_DOMAIN)) {
    return url.replace(`${CLOUDFRONT_DOMAIN}/`, "");
  }

  const s3UrlPattern = new RegExp(
    `https://${BUCKET_NAME}\\.s3\\.${process.env.AWS_REGION}\\.amazonaws\\.com/(.+)`,
  );
  const match = url.match(s3UrlPattern);
  return match ? match[1] : null;
}

export async function checkImageExists(key: string): Promise<boolean> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error("Error checking image existence:", error);
    return false;
  }
}
