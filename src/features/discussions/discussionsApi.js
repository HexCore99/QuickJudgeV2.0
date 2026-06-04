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

export async function getDiscussionsApi() {
  const response = await fetch(`${API_URL}/api/discussions`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const json = await parseResponse(response);
  return json.items || [];
}

export async function createDiscussionApi(payload) {
  const response = await fetch(`${API_URL}/api/discussions`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const json = await parseResponse(response);
  return json.item;
}

export async function updateDiscussionApi(discussionId, payload) {
  const response = await fetch(`${API_URL}/api/discussions/${discussionId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const json = await parseResponse(response);
  return json.item;
}

export async function deleteDiscussionApi(discussionId) {
  const response = await fetch(`${API_URL}/api/discussions/${discussionId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return parseResponse(response);
}

export async function createReplyApi(discussionId, payload) {
  const response = await fetch(
    `${API_URL}/api/discussions/${discussionId}/replies`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    },
  );
  const json = await parseResponse(response);
  return json.item;
}

export async function updateReplyApi(discussionId, replyId, payload) {
  const response = await fetch(
    `${API_URL}/api/discussions/${discussionId}/replies/${replyId}`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    },
  );
  const json = await parseResponse(response);
  return json.item;
}

export async function deleteReplyApi(discussionId, replyId) {
  const response = await fetch(
    `${API_URL}/api/discussions/${discussionId}/replies/${replyId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );
  const json = await parseResponse(response);
  return json.item;
}
