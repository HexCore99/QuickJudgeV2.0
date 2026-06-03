export function createServiceError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

export function normalizeDifficulty(difficulty) {
  const normalized = String(difficulty || "Medium")
    .trim()
    .toLowerCase();

  if (normalized === "easy") return "Easy";
  if (normalized === "hard") return "Hard";
  return "Medium";
}

// "Hello   \r\nWorld\n\n" --> "Hello\nWorld"
export function normalizeOutput(value) {
  return String(value || "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}
// return first available judge result object
export function getOutput(result) {
  return (
    result.stdout ||
    result.stderr ||
    result.compile_output ||
    result.message ||
    ""
  );
}

export function getRuntimeMs(result) {
  const timeSeconds = Number(result.time);

  if (!Number.isFinite(timeSeconds)) {
    return null;
  }

  return Math.round(timeSeconds * 1000);
}

export function getMemoryKb(result) {
  const memoryKb = Number(result.memory);

  if (!Number.isFinite(memoryKb)) {
    return null;
  }

  return Math.round(memoryKb);
}

export function mapJudge0StatusToVerdict(result) {
  const statusId = Number(result.status?.id);
  const description = result.status?.description || "";

  if (statusId === 3) return "AC";
  if (statusId === 4) return "WA";
  if (statusId === 5) return "TLE";
  if (statusId === 6) return "CE";
  if (/memory/i.test(description)) return "MLE";
  if (statusId >= 7 && statusId <= 14) return "RE";
  return "RE";
}

export function mapVerdictCodeToLabel(verdict) {
  const labels = {
    AC: "Accepted",
    WA: "Wrong Answer",
    TLE: "Time Limit Exceeded",
    RE: "Runtime Error",
    CE: "Compilation Error",
    MLE: "Runtime Error",
    PE: "Wrong Answer",
  };

  return labels[verdict] || "Runtime Error";
}
