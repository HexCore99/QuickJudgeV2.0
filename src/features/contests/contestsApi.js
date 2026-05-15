import { mapProblemForStudent } from "../problems/problemsApi";

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

export async function getContestsApi() {
  const response = await fetch(`${API_URL}/api/contests`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return parseResponse(response);
}

export async function createContestApi(payload) {
  const response = await fetch(`${API_URL}/api/contests`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const json = await parseResponse(response);
  return json.item;
}

export async function registerUpcomingContestApi(contestId) {
  const response = await fetch(
    `${API_URL}/api/contests/${contestId}/register`,
    {
      method: "POST",
      headers: getAuthHeaders(),
    },
  );

  return parseResponse(response);
}

export async function verifyContestPasswordApi({ contestId, password }) {
  const response = await fetch(
    `${API_URL}/api/contests/${contestId}/verify-password`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ password }),
    },
  );

  return parseResponse(response);
}

export async function getContestDetailsApi(contestId) {
  const response = await fetch(`${API_URL}/api/contests/${contestId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return parseResponse(response);
}

export async function getContestProblemApi(contestId, problemCode) {
  const response = await fetch(
    `${API_URL}/api/contests/${contestId}/problems/${problemCode}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );
  const json = await parseResponse(response);
  const problem = mapProblemForStudent(json.item);
  const contestProblemCode =
    json.item?.contestProblemCode || json.item?.problemCode || problemCode;

  return {
    ...problem,
    id: contestProblemCode,
    problemId: json.item?.problemId || problem.problemId || null,
    problemBankId: json.item?.problemBankId || null,
    contestProblemCode,
    contestId: json.item?.contestId || contestId,
    contestTitle: json.item?.contestTitle || problem.contestTitle,
    contestStatus: json.item?.contestStatus || problem.contestStatus || null,
    contestStartTime:
      json.item?.contestStartTime || problem.contestStartTime || null,
    contestEndTime: json.item?.contestEndTime || problem.contestEndTime || null,
    contestDurationMinutes:
      json.item?.contestDurationMinutes ||
      problem.contestDurationMinutes ||
      null,
    points: json.item?.points ?? problem.points,
  };
}

export async function updateContestScheduleApi(contestId, payload) {
  const response = await fetch(
    `${API_URL}/api/contests/${contestId}/schedule`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    },
  );

  return parseResponse(response);
}

export async function deleteContestApi(contestId) {
  const response = await fetch(`${API_URL}/api/contests/${contestId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return parseResponse(response);
}

export async function getContestSubmissionsApi(contestId) {
  const response = await fetch(
    `${API_URL}/api/contests/${contestId}/submissions`,
    { method: "GET", headers: getAuthHeaders() },
  );
  const json = await parseResponse(response);
  return json.items;
}

export async function getContestLeaderboardApi(contestId) {
  const response = await fetch(
    `${API_URL}/api/contests/${contestId}/leaderboard`,
    { method: "GET", headers: getAuthHeaders() },
  );
  const json = await parseResponse(response);
  return json.items;
}

export async function getContestAnnouncementsApi(contestId) {
  const response = await fetch(
    `${API_URL}/api/contests/${contestId}/announcements`,
    { method: "GET", headers: getAuthHeaders() },
  );
  const json = await parseResponse(response);
  return json.items;
}

export async function createContestAnnouncementApi(contestId, payload) {
  const response = await fetch(
    `${API_URL}/api/contests/${contestId}/announcements`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    },
  );
  const json = await parseResponse(response);
  return json.item;
}

export async function updateContestAnnouncementApi(
  contestId,
  announcementId,
  payload,
) {
  const response = await fetch(
    `${API_URL}/api/contests/${contestId}/announcements/${announcementId}`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    },
  );
  const json = await parseResponse(response);
  return json.item;
}

export async function deleteContestAnnouncementApi(contestId, announcementId) {
  const response = await fetch(
    `${API_URL}/api/contests/${contestId}/announcements/${announcementId}`,
    { method: "DELETE", headers: getAuthHeaders() },
  );
  return parseResponse(response);
}

export async function getContestQueriesApi(contestId) {
  const response = await fetch(`${API_URL}/api/contests/${contestId}/queries`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const json = await parseResponse(response);
  return json.items;
}

export async function submitQueryApi(contestId, question) {
  const response = await fetch(`${API_URL}/api/contests/${contestId}/queries`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ question }),
  });
  const json = await parseResponse(response);
  return json.item;
}

export async function replyContestQueryApi(contestId, queryId, answer) {
  const response = await fetch(
    `${API_URL}/api/contests/${contestId}/queries/${queryId}/reply`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ answer }),
    },
  );
  const json = await parseResponse(response);
  return json.item;
}
