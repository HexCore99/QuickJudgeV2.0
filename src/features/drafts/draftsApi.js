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

function toPositiveInteger(value) {
  const numberValue = Number(value);

  return Number.isInteger(numberValue) && numberValue > 0 ? numberValue : null;
}

function buildDraftParams({ problemId, contestId, contestProblemCode }) {
  const params = new URLSearchParams({
    problemId: String(problemId),
  });

  if (contestId) {
    params.set("contestId", contestId);
  }

  if (contestProblemCode) {
    params.set("contestProblemCode", contestProblemCode);
  }

  return params;
}

function buildDraftPayload({
  problemId,
  contestId,
  contestProblemCode,
  language,
  sourceCode,
  customInput,
}) {
  return {
    problemId: toPositiveInteger(problemId),
    contestId: contestId || null,
    contestProblemCode: contestProblemCode || null,
    language,
    sourceCode,
    customInput: customInput || "",
  };
}

export async function getDraftApi({
  problemId,
  contestId,
  contestProblemCode,
}) {
  const params = buildDraftParams({
    problemId,
    contestId,
    contestProblemCode,
  });

  const response = await fetch(`${API_URL}/api/drafts?${params}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const json = await parseResponse(response);
  return json.item;
}

export async function saveDraftApi(payload) {
  const response = await fetch(`${API_URL}/api/drafts`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(buildDraftPayload(payload)),
  });
  const json = await parseResponse(response);
  return json.item;
}

export async function deleteDraftApi({
  problemId,
  contestId,
  contestProblemCode,
}) {
  const params = buildDraftParams({
    problemId,
    contestId,
    contestProblemCode,
  });

  const response = await fetch(`${API_URL}/api/drafts?${params}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return parseResponse(response);
}
