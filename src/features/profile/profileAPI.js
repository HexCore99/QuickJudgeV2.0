const API_URL = import.meta.env.VITE_API_URL || "";

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
  const response = await fetch(`${API_URL}/api/profile`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return parseResponse(response);
}

export async function updateProfileApi(payload) {
  const response = await fetch(`${API_URL}/api/profile`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export async function uploadProfileAvatarApi(imageData) {
  const response = await fetch(`${API_URL}/api/profile/avatar`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ imageData }),
  });

  return parseResponse(response);
}
