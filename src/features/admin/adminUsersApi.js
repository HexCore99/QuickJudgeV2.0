const API_URL = import.meta.env.VITE_API_URL || "";

async function parseResponse(resp) {
  const contentType = resp.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await resp.json() : await resp.text();

  if (!resp.ok) {
    if (isJson) {
      throw new Error(data.message || "Request failed.");
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

export async function getAdminUsersApi() {
  const response = await fetch(`${API_URL}/api/admin/users`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const json = await parseResponse(response);
  return json.users || [];
}

export async function createAdminUserApi(payload) {
  const response = await fetch(`${API_URL}/api/admin/users/admin`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const json = await parseResponse(response);
  return json.user;
}

export async function suspendAdminUserApi({ userId, suspendedUntil, reason }) {
  const response = await fetch(`${API_URL}/api/admin/users/${userId}/suspend`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ suspendedUntil, reason }),
  });

  const json = await parseResponse(response);
  return json.user;
}

export async function unsuspendAdminUserApi(userId) {
  const response = await fetch(
    `${API_URL}/api/admin/users/${userId}/unsuspend`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
    },
  );

  const json = await parseResponse(response);
  return json.user;
}

export async function banAdminUserApi({ userId, reason }) {
  const response = await fetch(`${API_URL}/api/admin/users/${userId}/ban`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ reason }),
  });

  const json = await parseResponse(response);
  return json.user;
}
