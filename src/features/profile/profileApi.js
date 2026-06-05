const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

const emptyProfile = {
  name: "",
  handle: "",
  email: "",
  dept: "",
  bio: "",
  git: "",
  avatarUrl: "",
  id: "",
  joinedDate: "",
  rating: 0,
  ratingDelta: "+0",
  ratingTier: "UNRATED",
  rank: "--",
  rankDelta: 0,
  solved: 0,
  solvedDelta: 0,
  totalSubmissions: 0,
  acRate: "0%",
  streak: 0,
  bestStreak: 0,
  contestCount: 0,
  ratedContests: 0,
};

function getAuthHeaders() {
  const token = localStorage.getItem("qj_token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function parseResponse(response, fallbackMessage) {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    if (isJson) {
      throw new Error(data.message || fallbackMessage);
    }

    throw new Error(`Request failed with status ${response.status}`);
  }

  return data;
}

function buildQueryString(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    const normalizedValue = String(value).trim();

    if (!normalizedValue) {
      return;
    }

    searchParams.set(key, normalizedValue);
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

function getListPagination(payload, items) {
  return (
    payload.pagination || {
      page: 1,
      limit: items.length,
      totalItems: items.length,
      totalPages: 1,
      filter: "all",
    }
  );
}

function normalizeProfilePayload(payload = {}) {
  return {
    profile: { ...emptyProfile, ...(payload.profile || {}) },
    submissions: payload.submissions || [],
    contests: payload.contests || [],
    achievements: payload.achievements || [],
    ratingHistory: payload.ratingHistory || { "6m": [], "1y": [], all: [] },
    difficulties: payload.difficulties || [],
    activities: payload.activities || [],
    passwordChanged: Boolean(payload.passwordChanged),
  };
}

export async function getProfileApi() {
  const response = await fetch(`${API_URL}/api/profile`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return normalizeProfilePayload(
    await parseResponse(response, "Failed to fetch profile."),
  );
}

export async function getProfileSubmissionsApi(params = {}) {
  const response = await fetch(
    `${API_URL}/api/profile/submissions${buildQueryString(params)}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );
  const payload = await parseResponse(
    response,
    "Failed to fetch profile submissions.",
  );
  const items = payload.items || [];

  return {
    items,
    pagination: getListPagination(payload, items),
  };
}

export async function updateProfileApi(profileData) {
  const response = await fetch(`${API_URL}/api/profile`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  });

  return normalizeProfilePayload(
    await parseResponse(response, "Failed to update profile."),
  );
}

export async function uploadProfileAvatarApi(imageData) {
  const response = await fetch(`${API_URL}/api/profile/avatar`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ imageData }),
  });

  const payload = await parseResponse(
    response,
    "Failed to upload profile image.",
  );
  return { avatarUrl: payload.avatarUrl || "" };
}
