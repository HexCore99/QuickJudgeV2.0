import {
  achievements,
  activities,
  contests,
  difficulties,
  profileUser,
  ratingHistory,
  submissions,
} from "./profileMockData";

const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:5000";
const USE_MOCK_PROFILE_DATA =
  import.meta.env?.VITE_USE_PROFILE_MOCK_DATA !== "false";

function cloneMockData(data) {
  return JSON.parse(JSON.stringify(data));
}

function getMockProfileData() {
  return cloneMockData({
    user: profileUser,
    submissions,
    contests,
    achievements,
    activities,
    difficulties,
    ratingHistory,
  });
}

async function parseResponse(resp) {
  const contentType = resp.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await resp.json() : await resp.text();

  if (!resp.ok) {
    if (isJson) {
      throw new Error(data.message || "Something went wrong");
    }

    throw new Error(`Request failed with status ${resp.status}`);
  }

  return data;
}

function getAuthHeaders() {
  const token = localStorage.getItem("qj_token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getProfileApi() {
  if (USE_MOCK_PROFILE_DATA) {
    return getMockProfileData();
  }

  const response = await fetch(`${API_URL}/api/profile`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return parseResponse(response);
}

export async function updateProfileApi(profileData) {
  if (USE_MOCK_PROFILE_DATA) {
    return cloneMockData({
      user: {
        ...profileUser,
        ...profileData,
      },
    });
  }

  const response = await fetch(`${API_URL}/api/profile`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  });

  return parseResponse(response);
}
