const DEFAULT_JUDGE0_BASE_URL = "https://ce.judge0.com";
const LANGUAGE_IDS = {
  c: 50,
  cpp: 54,
  java: 62,
  python: 71,
  rust: 73,
};
const TEXT_RESULT_FIELDS = ["stdout", "stderr", "compile_output", "message"];

function encodeBase64(value) {
  return Buffer.from(String(value || ""), "utf8").toString("base64");
}

function decodeBase64(value) {
  if (typeof value !== "string" || value.length === 0) {
    return value;
  }

  return Buffer.from(value, "base64").toString("utf8");
}

// takes a Judge0 result object and decodes its base64 text fields like stdout, stderr, and compile_output
function decodeJudge0TextFields(result) {
  if (!result || typeof result !== "object") {
    return result;
  }

  return TEXT_RESULT_FIELDS.reduce(
    (acc, field) => ({
      ...acc,
      [field]: decodeBase64(acc[field]),
    }),
    { ...result },
  );
}

function getJudge0BaseUrl() {
  return (process.env.JUDGE0_BASE_URL || DEFAULT_JUDGE0_BASE_URL).replace(
    /\/+$/,
    "",
  );
}

function getJudge0Headers() {
  const headers = {
    "Content-Type": "application/json",
  };

  if (process.env.JUDGE0_AUTH_TOKEN) {
    headers["X-Auth-Token"] = process.env.JUDGE0_AUTH_TOKEN;
  }

  if (process.env.JUDGE0_RAPIDAPI_KEY) {
    headers["X-RapidAPI-Key"] = process.env.JUDGE0_RAPIDAPI_KEY;
    headers["X-RapidAPI-Host"] =
      process.env.JUDGE0_RAPIDAPI_HOST || "judge0-ce.p.rapidapi.com";
  }

  return headers;
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function parseJudge0Response(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      data?.error ||
      data?.message ||
      `Judge0 request failed with status ${response.status}.`;
    throw new Error(message);
  }

  return data;
}

export function getLanguageId(language) {
  return LANGUAGE_IDS[language] || null;
}

// sends code to Judge0, waits until Judge0 finishes judging it, then returns the decoded result
export async function runJudge0Submission({
  language,
  sourceCode,
  stdin = "",
  timeLimitSeconds = 1,
  memoryLimitMb = 256,
}) {
  const languageId = getLanguageId(language);

  if (!languageId) {
    throw new Error("Unsupported language.");
  }

  const baseUrl = getJudge0BaseUrl();
  const headers = getJudge0Headers();
  const createResponse = await fetch(
    `${baseUrl}/submissions?base64_encoded=true&wait=false`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        language_id: languageId,
        source_code: encodeBase64(sourceCode),
        stdin: encodeBase64(stdin),
        cpu_time_limit: Number(timeLimitSeconds) || 1,
        memory_limit: (Number(memoryLimitMb) || 256) * 1024,
      }),
    },
  );
  const created = await parseJudge0Response(createResponse); 
  if (!created.token) {
    return decodeJudge0TextFields(created);
  }

  for (let attempt = 0; attempt < 25; attempt += 1) {
    await wait(attempt < 3 ? 500 : 1000);

    const resultResponse = await fetch(
      `${baseUrl}/submissions/${created.token}?base64_encoded=true`,
      { headers },
    );
    const result = await parseJudge0Response(resultResponse);
    const statusId = Number(result.status?.id);

    if (statusId && statusId > 2) {
      return decodeJudge0TextFields(result);
    }
  }

  throw new Error("Judge0 submission timed out while waiting for a result.");
}
