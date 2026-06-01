import { pool } from "../../config/db.js";

export const CONTEST_FILTERS = [
  { key: "all", label: "All" },
  { key: "live", label: "Live" },
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
];

export function createServiceError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

export function isAdminRole(role) {
  return role === "admin" || role === "super_admin";
}

export function pad(value) {
  return String(value).padStart(2, "0");
}

//format to -> May 24, 2026
export function formatDate(dateValue) {
  const date = new Date(dateValue);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatTime(dateValue) {
  const date = new Date(dateValue);
  return `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())} UTC`;
}

// 90 minutes -> 1h 30m
export function formatDuration(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours && minutes) return `${hours}h ${minutes}m`;
  if (hours) return `${hours}h`;
  return `${minutes}m`;
}

// 9:00 + 90m -> 10:30
export function addMinutes(dateValue, minutes) {
  const date = new Date(dateValue);
  return new Date(date.getTime() + minutes * 60 * 1000);
}
// 2026-05-24T09:05:07 -> 2026-05-24 09:05:07
export function formatSqlDateTime(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

// Weekly Programming Contest -> WPC
function getContestIdPrefix(title) {
  const prefix = String(title || "")
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 6);

  return prefix || "QJ";
}
// Generates a unique contest ID using the contest title, current time, and random text.
export async function generateContestId(connection, title) {
  const prefix = getContestIdPrefix(title);

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const stamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).slice(2, 6).toUpperCase();
    const contestId = `${prefix}-${stamp}${random}`.slice(0, 30); //WPC-MB2K9ZAB3F

    const [rows] = await connection.execute(
      `SELECT id
       FROM contests
       WHERE id = ?
       LIMIT 1`,
      [contestId],
    );

    if (!rows.length) {
      return contestId;
    }
  }

  throw createServiceError("Could not generate a unique contest id.", 500);
}

export function getContestStatus(startDate, endDate) {
  const now = Date.now();

  if (endDate.getTime() <= now) {
    return "past";
  }

  if (startDate.getTime() <= now) {
    return "live";
  }

  return "upcoming";
}

// Updates each contest status to past, live, or upcoming
export async function refreshContestStatuses() {
  const now = formatSqlDateTime(new Date());

  await pool.execute(
    `UPDATE contests
     SET status = CASE
       WHEN DATE_ADD(start_time, INTERVAL duration_minutes MINUTE) <= ? THEN 'past'
       WHEN start_time <= ? THEN 'live'
       ELSE 'upcoming'
     END
     WHERE status <> CASE
       WHEN DATE_ADD(start_time, INTERVAL duration_minutes MINUTE) <= ? THEN 'past'
       WHEN start_time <= ? THEN 'live'
       ELSE 'upcoming'
     END`,
    [now, now, now, now],
  );
}

// Returns a map of contest IDs to their tag names.
export async function getTagsMap(contestIds) {
  if (!contestIds.length) {
    return {};
  }

  const placeholders = contestIds.map(() => "?").join(",");

  const [rows] = await pool.execute(
    `SELECT contest_id, tag_name
     FROM contest_tags
     WHERE contest_id IN (${placeholders})
     ORDER BY id ASC`,
    contestIds,
  );

  return rows.reduce((acc, row) => {
    if (!acc[row.contest_id]) {
      acc[row.contest_id] = [];
    }

    acc[row.contest_id].push(row.tag_name);
    return acc;
  }, {});// {"contest-1": ["DP", "Graph"]}
}

// Checks whether a user has access to a specific contest.
export async function hasContestAccess(userId, contestId) {
  const [rows] = await pool.execute(
    `SELECT 1
     FROM contest_access
     WHERE user_id = ? AND contest_id = ?
     LIMIT 1`,
    [userId, contestId],
  );

  return rows.length > 0;
}

// check If admin has access to specific contest
export async function ensureAdminOwnsContest(adminId, contestId) {
  const [rows] = await pool.execute(
    `SELECT id
     FROM contests
     WHERE id = ? AND created_by = ?
     LIMIT 1`,
    [contestId, adminId],
  );

  if (!rows.length) {
    throw createServiceError("Contest not found.", 404);
  }
}

// Check if contest is editable with STATUS
export async function ensureAdminCanChangeContest(adminId, contestId) {
  const [rows] = await pool.execute(
    `SELECT id, start_time, duration_minutes
     FROM contests
     WHERE id = ? AND created_by = ?
     LIMIT 1`,
    [contestId, adminId],
  );

  if (!rows.length) {
    throw createServiceError("Contest not found.", 404);
  }

  const contest = rows[0];
  const endDate = addMinutes(contest.start_time, contest.duration_minutes);
  const currentStatus = getContestStatus(new Date(contest.start_time), endDate);

  if (currentStatus === "past") {
    throw createServiceError("Ended contests cannot be edited.", 400);
  }
}

// check whether the contest ended or not
export async function ensureContestNotEnded(contestId, message) {
  const [rows] = await pool.execute(
    `SELECT
       CASE
         WHEN NOW() >= DATE_ADD(start_time, INTERVAL duration_minutes MINUTE) THEN 1
         ELSE 0
       END AS has_ended
     FROM contests
     WHERE id = ?
     LIMIT 1`,
    [contestId],
  );

  if (!rows.length) {
    throw createServiceError("Contest not found.", 404);
  }

  if (Number(rows[0].has_ended)) {
    throw createServiceError(message, 403);
  }
}

export function mapAnnouncementRow(row) {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    postedAt: row.posted_at,
  };
}

export function mapQueryRow(row) {
  return {
    id: row.id,
    userId: row.user_id,
    username: row.username,
    question: row.question,
    answer: row.answer,
    status: row.status,
    createdAt: row.created_at,
    answeredAt: row.answered_at,
  };
}
