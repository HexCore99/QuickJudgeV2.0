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

function buildQueryString(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (key === "withPagination" || value === undefined || value === null) {
      return;
    }

    const normalizedValue = String(value).trim();

    if (!normalizedValue || normalizedValue === "All") {
      return;
    }

    searchParams.set(key, normalizedValue);
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

function getListPagination(json, items) {
  return (
    json.pagination || {
      page: 1,
      limit: items.length,
      totalItems: items.length,
      totalPages: 1,
    }
  );
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

export async function getProblemBankApi(params = {}) {
  const response = await fetch(
    `${API_URL}/api/problems/bank${buildQueryString(params)}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );
  const json = await parseResponse(response);
  const items = (json.items || []).map(mapProblemForStudent);

  if (params.withPagination) {
    return {
      items,
      pagination: getListPagination(json, items),
    };
  }

  return items;
}

export async function getProblemBankProblemApi(problemId) {
  const response = await fetch(`${API_URL}/api/problems/bank/${problemId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const json = await parseResponse(response);
  return mapProblemForStudent(json.item);
}

export async function getMyProblemsApi(params = {}) {
  const response = await fetch(
    `${API_URL}/api/problems/mine${buildQueryString(params)}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );
  const json = await parseResponse(response);
  const items = json.items || [];

  if (params.withPagination) {
    return {
      items,
      pagination: getListPagination(json, items),
    };
  }

  return items;
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
