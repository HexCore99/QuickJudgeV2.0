import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "";
const DEFAULT_GRAVATAR_HASH =
  "0000000000000000000000000000000000000000000000000000000000000000";

function buildGravatarUrl(hash = DEFAULT_GRAVATAR_HASH, size = 300) {
  const params = new URLSearchParams({
    s: String(size),
    d: "identicon",
    r: "g",
  });

  return `https://www.gravatar.com/avatar/${hash}?${params.toString()}`;
}

export const DEFAULT_PROFILE_AVATAR_URL = buildGravatarUrl();

function resolveAvatarUrl(avatarUrl) {
  const trimmedUrl = String(avatarUrl || "").trim();

  if (trimmedUrl.startsWith("/uploads")) {
    return `${API_URL}${trimmedUrl}`;
  }

  return trimmedUrl;
}

function getHexFromBuffer(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function getProfileAvatarUrl(avatarUrl, size = 300) {
  const trimmedUrl = resolveAvatarUrl(avatarUrl);

  return trimmedUrl || buildGravatarUrl(DEFAULT_GRAVATAR_HASH, size);
}

export async function getAdminAvatarUrl(email, size = 96) {
  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();

  if (!normalizedEmail || !globalThis.crypto?.subtle) {
    return buildGravatarUrl(DEFAULT_GRAVATAR_HASH, size);
  }

  const digest = await globalThis.crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(normalizedEmail),
  );
  return buildGravatarUrl(getHexFromBuffer(digest), size);
}

export function useProfileAvatarUrl(avatarUrl, email, size = 300) {
  const trimmedUrl = resolveAvatarUrl(avatarUrl);
  const [gravatarUrl, setGravatarUrl] = useState(() =>
    buildGravatarUrl(DEFAULT_GRAVATAR_HASH, size),
  );

  useEffect(() => {
    let isCurrent = true;

    if (trimmedUrl) return undefined;

    getAdminAvatarUrl(email, size).then((gravatarUrl) => {
      if (isCurrent) {
        setGravatarUrl(gravatarUrl);
      }
    });

    return () => {
      isCurrent = false;
    };
  }, [email, size, trimmedUrl]);

  return trimmedUrl || gravatarUrl;
}
