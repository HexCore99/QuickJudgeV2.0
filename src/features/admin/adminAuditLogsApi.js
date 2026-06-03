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

export async function getAdminAuditLogsApi(filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== "all") {
      params.set(key, value);
    }
  });

  const queryString = params.toString();
  const response = await fetch(
    `${API_URL}/api/admin/logs${queryString ? `?${queryString}` : ""}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );

  const json = await parseResponse(response);

  return {
    logs: json.logs || [],
    actions: json.actions || [],
  };
}
