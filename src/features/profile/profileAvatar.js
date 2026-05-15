import { useMemo } from "react";

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const LOCAL_UPLOAD_PREFIX = "/uploads/";

function getInitials(seed) {
  const value = String(seed || "QuickJudge User").trim();
  const source = value.includes("@") ? value.split("@")[0] : value;
  const parts = source
    .replace(/[^a-zA-Z0-9_\s-]/g, " ")
    .split(/[\s_-]+/)
    .filter(Boolean);

  if (!parts.length) return "QJ";

  return parts
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function getFallbackAvatarUrl(seed, size) {
  const initials = getInitials(seed);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <rect width="100%" height="100%" rx="${size / 2}" fill="#f59e0b"/>
      <text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle"
        font-family="Inter, Arial, sans-serif" font-size="${Math.max(18, size * 0.34)}"
        font-weight="700" fill="#ffffff">${initials}</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function getProfileAvatarUrl(src, fallbackSeed, size = 96) {
  const value = String(src || "").trim();

  if (value.startsWith("data:image/") || /^https?:\/\//i.test(value)) {
    return value;
  }

  if (value.startsWith(LOCAL_UPLOAD_PREFIX)) {
    return API_URL ? `${API_URL}${value}` : value;
  }

  return getFallbackAvatarUrl(fallbackSeed, size);
}

export function useProfileAvatarUrl(src, fallbackSeed, size = 96) {
  return useMemo(
    () => getProfileAvatarUrl(src, fallbackSeed, size),
    [fallbackSeed, size, src],
  );
}
