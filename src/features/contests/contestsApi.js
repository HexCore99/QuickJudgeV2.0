const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

export async function getContestsApi() {
  const response = await fetch(`${API_URL}/api/contests`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return parseResponse(response);
}

export async function registerUpcomingContestApi(contestId) {
  const response = await fetch(
    `${API_URL}/api/contests/${contestId}/register`,
    {
      method: "POST",
      headers: getAuthHeaders(),
    },
  );

  return parseResponse(response);
}

export async function verifyContestPasswordApi({ contestId, password }) {
  const response = await fetch(
    `${API_URL}/api/contests/${contestId}/verify-password`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ password }),
    },
  );

  return parseResponse(response);
}

export async function getContestDetailsApi(contestId) {
  const response = await fetch(`${API_URL}/api/contests/${contestId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return parseResponse(response);
}
