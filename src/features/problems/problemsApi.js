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

function splitLines(value) {
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatTimeLimit(seconds) {
  const value = Number(seconds);
  if (!Number.isFinite(value)) return "1 second";

  return `${value} ${value === 1 ? "second" : "seconds"}`;
}

export function mapProblemForStudent(problem = {}) {
  return {
    ...problem,
    id: problem.id,
    title: problem.title || "Untitled Problem",
    difficulty: problem.difficulty || "Medium",
    tags: problem.tags || [],
    hasEditorial: Boolean(problem.hasEditorial),
    description: problem.statement || problem.description || "",
    inputSpec: problem.inputFormat || problem.inputSpec || "",
    outputSpec: problem.outputFormat || problem.outputSpec || "",
    constraints: Array.isArray(problem.constraints)
      ? problem.constraints
      : splitLines(problem.constraints),
    timeLimit: formatTimeLimit(problem.timeLimitSeconds),
    memoryLimit: `${Number(problem.memoryLimitMb) || 256} MB`,
    isPublished: Boolean(problem.isPublished),
    samples: (problem.testCases || []).map((testCase) => ({
      input: testCase.input,
      output: testCase.output,
    })),
  };
}

export async function getProblemBankApi() {
  const response = await fetch(`${API_URL}/api/problems/bank`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const json = await parseResponse(response);
  return (json.items || []).map(mapProblemForStudent);
}

export async function getProblemBankProblemApi(problemId) {
  const response = await fetch(`${API_URL}/api/problems/bank/${problemId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const json = await parseResponse(response);
  return mapProblemForStudent(json.item);
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

export async function getProblemCloneSourceApi(problemId) {
  const response = await fetch(
    `${API_URL}/api/problems/clone-sources/${problemId}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );
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

export async function updateProblemPublicationApi(problemId, isPublished) {
  const response = await fetch(
    `${API_URL}/api/problems/${problemId}/publication`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ isPublished }),
    },
  );
  const json = await parseResponse(response);
  return json.item;
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
