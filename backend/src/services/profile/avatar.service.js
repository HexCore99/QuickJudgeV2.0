import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServiceError, getUserRow } from "./shared.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_ROOT = path.resolve(__dirname, "../../../uploads");
const AVATAR_UPLOAD_DIR = path.join(UPLOAD_ROOT, "avatars");
const AVATAR_UPLOAD_URL_PREFIX = "/uploads/avatars/";
const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024;
const AVATAR_EXTENSION_BY_MIME = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

// alidates an uploaded avatar data URL, converts it into binary image data
function parseAvatarImageData(imageData) {
  // this checks whether imageData is a valid base64 image string
  const match = String(imageData || "").match(
    /^data:(image\/(?:jpeg|png|webp|gif));base64,([A-Za-z0-9+/=]+)$/i,
  );

  if (!match) {
    throw createServiceError("Upload a valid JPG, PNG, WEBP, or GIF image.");
  }

  const mimeType = match[1].toLowerCase();
  const extension = AVATAR_EXTENSION_BY_MIME[mimeType];
  const buffer = Buffer.from(match[2], "base64");

  if (!extension || !buffer.length) {
    throw createServiceError("Upload a valid image file.");
  }

  if (buffer.length > MAX_AVATAR_SIZE_BYTES) {
    throw createServiceError("Profile image must be 2 MB or smaller.");
  }

  return { buffer, extension };
}
// safely converts a local avatar URL into an actual filesystem path
export function getAvatarFilePathFromUrl(avatarUrl) {
  const cleanedUrl = String(avatarUrl || "")
    .trim()
    .split(/[?#]/)[0];

  if (!cleanedUrl.startsWith(AVATAR_UPLOAD_URL_PREFIX)) {
    return null;
  }

  const fileName = cleanedUrl.slice(AVATAR_UPLOAD_URL_PREFIX.length);
  const safeFileName = path.basename(fileName);

  if (
    !fileName ||
    safeFileName !== fileName ||
    !/^avatar-\d+-[0-9a-f-]+\.(?:jpg|png|webp|gif)$/i.test(safeFileName)
  ) {
    return null;
  }

  const filePath = path.resolve(AVATAR_UPLOAD_DIR, safeFileName);
  const relativePath = path.relative(AVATAR_UPLOAD_DIR, filePath);

  if (relativePath.startsWith("..")) {
    return null;
  }

  return filePath;
}

export async function deleteAvatarFileSafely(avatarUrl) {
  const filePath = getAvatarFilePathFromUrl(avatarUrl);

  if (!filePath) {
    return;
  }

  try {
    await unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Delete avatar file error:", error);
    }
  }
}

export async function saveProfileAvatarForUser(userId, imageData) {
  await getUserRow(userId);

  const { buffer, extension } = parseAvatarImageData(imageData);
  await mkdir(AVATAR_UPLOAD_DIR, { recursive: true });

  const fileName = `avatar-${userId}-${randomUUID()}.${extension}`;
  const filePath = path.join(AVATAR_UPLOAD_DIR, fileName);
  await writeFile(filePath, buffer);

  const avatarUrl = `${AVATAR_UPLOAD_URL_PREFIX}${fileName}`;

  return { avatarUrl };
}
