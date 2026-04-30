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

export async function getMyProblemsApi() {
  const response = await fetch(`${API_URL}/api/problems/mine`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const json = await parseResponse(response);
  return json.items;
}

export async function getMyProblemApi(problemId) {
  const response = await fetch(`${API_URL}/api/problems/${problemId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const json = await parseResponse(response);
  return json.item;
}

export async function createProblemApi(payload) {
  const response = await fetch(`${API_URL}/api/problems`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const json = await parseResponse(response);
  return json.item;
}

export async function updateProblemApi(problemId, payload) {
  const response = await fetch(`${API_URL}/api/problems/${problemId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const json = await parseResponse(response);
  return json.item;
}

export async function deleteProblemApi(problemId) {
  const response = await fetch(`${API_URL}/api/problems/${problemId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return parseResponse(response);
}

export async function getProblemEditorialApi(problemId) {
  const response = await fetch(
    `${API_URL}/api/problems/${problemId}/editorial`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );
  const json = await parseResponse(response);
  return json.item;
}

export async function saveProblemEditorialApi(problemId, payload) {
  const response = await fetch(
    `${API_URL}/api/problems/${problemId}/editorial`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    },
  );
  const json = await parseResponse(response);
  return json.item;
}
