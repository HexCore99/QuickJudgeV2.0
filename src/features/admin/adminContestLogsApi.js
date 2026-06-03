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

export async function getAdminContestLogsApi(contestId, options = {}) {
  const response = await fetch(
    `${API_URL}/api/admin/contests/${encodeURIComponent(contestId)}/logs`,
    {
      method: "GET",
      headers: getAuthHeaders(),
      signal: options.signal,
    },
  );

  const json = await parseResponse(response);

  return {
    contestId: json.contestId || contestId,
    isFrozen: Boolean(json.isFrozen),
    contestStatus: json.contestStatus || "upcoming",
    logs: Array.isArray(json.logs) ? json.logs : [],
  };
}
