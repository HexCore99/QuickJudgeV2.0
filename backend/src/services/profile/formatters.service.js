import { getPublicId, getRatingTier, toDate } from "./shared.service.js";

export const DIFFICULTY_META = {
  Easy: { label: "Easy", color: "#16a34a", tw: "bg-green-600" },
  Medium: { label: "Medium", color: "#d97706", tw: "bg-amber-500" },
  Hard: { label: "Hard", color: "#dc2626", tw: "bg-red-600" },
};

function pad(value) {
  return String(value).padStart(2, "0");
}

export function formatDateTime(value) {
  if (!value) return "";

  const date = toDate(value);
  if (Number.isNaN(date.getTime())) return "";

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function formatDateOnly(value) {
  if (!value) return "";

  const date = toDate(value);
  if (Number.isNaN(date.getTime())) return "";

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatJoinedDate(value) {
  if (!value) return "";

  const date = toDate(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function formatRatingLabel(value) {
  if (!value) return "";

  const date = toDate(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", { month: "short" });
}

function formatSignedNumber(value) {
  const number = Number(value) || 0;
  return `${number >= 0 ? "+" : ""}${number}`;
}

function formatRuntime(runtimeMs) {
  if (runtimeMs === null || runtimeMs === undefined) return "--";

  const number = Number(runtimeMs);
  if (!Number.isFinite(number)) return "--";
  if (number < 1000) return `${number}ms`;

  return `${(number / 1000).toFixed(2)}s`;
}

function formatMemory(memoryKb) {
  if (memoryKb === null || memoryKb === undefined) return "--";

  const number = Number(memoryKb);
  if (!Number.isFinite(number)) return "--";
  if (number < 1024) return `${number} KB`;

  return `${(number / 1024).toFixed(1)} MB`;
}

function formatRelativeTime(value) {
  if (!value) return "";

  const date = toDate(value);
  if (Number.isNaN(date.getTime())) return "";

  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;

  return formatDateOnly(value);
}

function getVerdictFlag(verdict) {
  const normalized = String(verdict || "").toUpperCase();
  if (normalized === "AC") return "ac";
  if (normalized === "WA") return "wa";
  if (normalized === "TLE") return "tle";
  if (normalized === "RE") return "re";
  if (normalized === "CE") return "ce";
  return "other";
}

function buildSafeRatingSeries(rows) {
  if (!rows.length) return [];

  return rows.map((row) => ({
    l: row.label || formatRatingLabel(row.rating_date),
    v: Number(row.rating),
    date: toDate(row.rating_date),
  }));
}

export function buildRatingHistory(rows) {
  const allRows = buildSafeRatingSeries(rows);
  const datedRows = rows
    .map((row) => ({
      l: row.label || formatRatingLabel(row.rating_date),
      v: Number(row.rating),
      date: toDate(row.rating_date),
    }))
    .filter((row) => !Number.isNaN(row.date.getTime()));

  const now = new Date();
  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(now.getMonth() - 6);
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(now.getFullYear() - 1);

  const pickRange = (startDate) => {
    const items = datedRows
      .filter((row) => row.date >= startDate)
      .map(({ l, v }) => ({ l, v }));

    return items;
  };

  return {
    "6m": pickRange(sixMonthsAgo),
    "1y": pickRange(oneYearAgo),
    all: allRows.map(({ l, v }) => ({ l, v })),
  };
}

export function mapSubmission(row) {
  const displayId =
    row.problem_id ||
    row.contest_problem_code ||
    row.contest_id ||
    `SUB-${row.id}`;

  return {
    submissionId: row.id,
    problem: row.problem_title || "Untitled Problem",
    id: String(displayId),
    verdict: row.verdict,
    time: formatRuntime(row.runtime_ms),
    mem: formatMemory(row.memory_kb),
    lang: row.language,
    diff: "Medium",
    f: getVerdictFlag(row.verdict),
    at: formatDateTime(row.submitted_at),
    contest: row.contest_name || null,
    code: row.source_code || "",
    tc: row.test_case_note || "",
    isScored: Boolean(row.is_scored ?? true),
  };
}

export function mapContest(row) {
  return {
    id: row.contest_code,
    name: row.contest_name,
    date: formatDateOnly(row.contest_date),
    rank: row.rank_position || "--",
    total: Number(row.participants_count) || 0,
    solved: `${Number(row.solved_count) || 0}/${Number(row.total_problems) || 0}`,
    delta: Number(row.rating_delta) || 0,
    before: row.rating_before || "--",
    after: row.rating_after || "--",
    rated: Boolean(row.is_rated),
    private: Boolean(row.requires_password),
  };
}

export function getContestSortTime(row) {
  const date = toDate(row.contest_date);
  const time = date.getTime();

  return Number.isNaN(time) ? 0 : time;
}

export function mapActivity(row) {
  const base = {
    type: row.activity_type,
    time: formatRelativeTime(row.occurred_at),
  };

  if (row.activity_type === "solve" || row.activity_type === "fail") {
    return {
      ...base,
      problem: row.problem_title || row.title || "Untitled Problem",
      id: row.problem_code || `SUB-${row.related_submission_id || row.id}`,
      verdict: row.verdict || (row.activity_type === "solve" ? "AC" : "WA"),
    };
  }

  if (row.activity_type === "rating") {
    return {
      ...base,
      title: row.title || "Rating updated",
      change: formatSignedNumber(row.rating_change),
    };
  }

  if (row.activity_type === "contest") {
    return {
      ...base,
      title: row.contest_name || row.title || "Contest",
      result: row.result_text || "",
    };
  }

  return {
    ...base,
    title: row.title || "Profile activity",
  };
}

export function mapProfile(user, profile, submissionStats) {
  const rating = Number(profile.rating);
  const totalSubmissions =
    Number(submissionStats.total_submissions) ||
    Number(profile.total_submissions) ||
    0;
  const acceptedSubmissions = Number(submissionStats.accepted_submissions) || 0;
  const solvedCount =
    Number(submissionStats.solved_count) || Number(profile.solved_count) || 0;
  const acRate = totalSubmissions
    ? `${((acceptedSubmissions / totalSubmissions) * 100).toFixed(1)}%`
    : "0%";

  return {
    name: user.name,
    handle: user.userhandle || user.name,
    email: user.email,
    dept: profile.department || "",
    bio: profile.bio || "",
    git: profile.github_url || "",
    avatarUrl: profile.avatar_url || "",
    id: profile.public_id || getPublicId(user),
    joinedDate: formatJoinedDate(user.created_at),
    rating: Number.isFinite(rating) ? rating : 0,
    ratingDelta: formatSignedNumber(profile.rating_delta),
    ratingTier: profile.rating_tier || getRatingTier(rating),
    rank: profile.global_rank || "--",
    rankDelta: Number(profile.rank_delta) || 0,
    solved: solvedCount,
    solvedDelta: Number(profile.solved_delta) || 0,
    totalSubmissions,
    acRate,
    streak: Number(profile.current_streak) || 0,
    bestStreak: Number(profile.best_streak) || 0,
    contestCount: Number(profile.contest_count) || 0,
    ratedContests: Number(profile.rated_contest_count) || 0,
  };
}
