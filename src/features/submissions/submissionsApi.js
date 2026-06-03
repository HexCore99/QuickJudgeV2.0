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

function buildProblemPayload({
  problemId,
  contestId,
  contestProblemCode,
  language,
  sourceCode,
  stdin,
}) {
  return {
    problemId: toPositiveInteger(problemId),
    contestId: contestId || null,
    contestProblemCode: contestProblemCode || null,
    language,
    sourceCode,
    stdin: stdin || "",
  };
}

export async function runCodeApi(payload) {
  const response = await fetch(`${API_URL}/api/submissions/run`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(buildProblemPayload(payload)),
  });
  const json = await parseResponse(response);
  return json.result;
}

export async function submitCodeApi(payload) {
  const response = await fetch(`${API_URL}/api/submissions/submit`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(buildProblemPayload(payload)),
  });
  const json = await parseResponse(response);
  return json.item;
}

export async function getProblemSubmissionsApi({
  problemId,
  contestId,
  contestProblemCode,
}) {
  const params = new URLSearchParams({
    problemId: String(problemId),
  });

  if (contestId) {
    params.set("contestId", contestId);
  }

  if (contestProblemCode) {
    params.set("contestProblemCode", contestProblemCode);
  }

  const response = await fetch(`${API_URL}/api/submissions?${params}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const json = await parseResponse(response);
  return json.items || [];
}
