import { pool } from "../../config/db.js";

function createServiceError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function toNullableString(value, maxLength) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return String(value).slice(0, maxLength);
}

function getClientIp(req) {
  const forwardedFor = req.headers?.["x-forwarded-for"];

  if (Array.isArray(forwardedFor) && forwardedFor.length) {
    return forwardedFor[0];
  }

  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.ip || req.socket?.remoteAddress || null;
}

function getContestStatus(contest) {
  if (Number(contest.has_ended)) {
    return "ended";
  }

  if (Number(contest.has_started)) {
    return "live";
  }

  return "upcoming";
}

function mapIpHistoryRow(row) {
  return {
    ipAddress: row.ip_address || "",
    firstSeenAt: row.first_seen_at,
    lastSeenAt: row.last_seen_at,
    seenCount: Number(row.seen_count) || 0,
  };
}

function getFallbackIpHistory(row) {
  const seen = new Set();
  const history = [];

  for (const ipAddress of [row.first_ip, row.last_ip]) {
    if (!ipAddress || seen.has(ipAddress)) {
      continue;
    }

    seen.add(ipAddress);
    history.push({
      ipAddress,
      firstSeenAt: row.first_seen_at,
      lastSeenAt: row.last_seen_at,
      seenCount: 0,
    });
  }

  return history;
}

function mapLogRow(row, ipHistory = []) {
  return {
    userId: row.user_id,
    studentName: row.student_name || row.current_name || "Unknown student",
    studentEmail: row.student_email || row.current_email || "",
    studentHandle: row.student_handle || row.current_handle || "",
    firstIp: row.first_ip || "",
    lastIp: row.last_ip || "",
    userAgent: row.user_agent || "",
    firstSeenAt: row.first_seen_at,
    lastSeenAt: row.last_seen_at,
    loginCount: Number(row.login_count) || 0,
    ipChangeCount: Number(row.ip_change_count) || 0,
    browserChangeCount: Number(row.browser_change_count) || 0,
    isFrozen: Boolean(row.is_frozen),
    ipHistory,
  };
}

export async function ensureContestSessionLogsTable() {
  return true;
}

async function getContestTiming(contestId) {
  const [rows] = await pool.execute(
    `SELECT
       id,
       created_by,
       start_time,
       duration_minutes,
       CASE WHEN NOW() >= start_time THEN 1 ELSE 0 END AS has_started,
       CASE
         WHEN NOW() >= DATE_ADD(start_time, INTERVAL duration_minutes MINUTE)
         THEN 1
         ELSE 0
       END AS has_ended
     FROM contests
     WHERE id = ?
     LIMIT 1`,
    [contestId],
  );

  return rows[0] || null;
}

function ensureAdminCanViewContestLogs(contest, adminId, userRole) {
  if (userRole === "super_admin") {
    return;
  }

  if (Number(contest.created_by) === Number(adminId)) {
    return;
  }

  throw createServiceError("Contest not found.", 404);
}

export async function freezeContestSessionLogsIfEnded(contestId) {
  await ensureContestSessionLogsTable();

  await pool.execute(
    `UPDATE contest_session_logs l
     INNER JOIN contests c ON c.id = l.contest_id
     SET l.is_frozen = 1
     WHERE l.contest_id = ?
       AND l.is_frozen = 0
       AND NOW() >= DATE_ADD(c.start_time, INTERVAL c.duration_minutes MINUTE)`,
    [contestId],
  );
}

export async function recordContestSessionActivity(
  req,
  { contestId, userId = req.user?.id, eventType = "activity" } = {},
) {
  try {
    if (!contestId || !userId || req.user?.role !== "student") {
      return;
    }

    await ensureContestSessionLogsTable();

    const contest = await getContestTiming(contestId);

    if (!contest) {
      return;
    }

    const contestStatus = getContestStatus(contest);

    if (contestStatus === "ended") {
      await freezeContestSessionLogsIfEnded(contestId);
      return;
    }

    if (contestStatus !== "live") {
      return;
    }

    const [userRows] = await pool.execute(
      `SELECT id, name, email, userhandle, role
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [userId],
    );

    const user = userRows[0];

    if (!user || user.role !== "student") {
      return;
    }

    const ipAddress = toNullableString(getClientIp(req), 64);
    const userAgent = toNullableString(req.get?.("user-agent"), 255);
    const sessionId = toNullableString(req.user?.sessionId, 64);
    const sessionEvent = eventType === "session_start" ? "session_start" : "activity";

    await pool.execute(
      `INSERT INTO contest_session_logs
       (contest_id, user_id, session_id, student_name, student_email,
        student_handle, first_ip, last_ip, user_agent, first_seen_at,
        last_seen_at, login_count)
       SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), 1
       FROM contests c
       WHERE c.id = ?
         AND NOW() >= c.start_time
         AND NOW() < DATE_ADD(c.start_time, INTERVAL c.duration_minutes MINUTE)
       ON DUPLICATE KEY UPDATE
         ip_change_count = IF(
           is_frozen = 0
             AND COALESCE(last_ip, '') <> COALESCE(VALUES(last_ip), ''),
           ip_change_count + 1,
           ip_change_count
         ),
         browser_change_count = IF(
           is_frozen = 0
             AND COALESCE(user_agent, '') <> COALESCE(VALUES(user_agent), ''),
           browser_change_count + 1,
           browser_change_count
         ),
         login_count = IF(
           is_frozen = 0 AND ? = 'session_start',
           login_count + 1,
           login_count
         ),
         session_id = IF(is_frozen = 0, VALUES(session_id), session_id),
         student_name = IF(is_frozen = 0, VALUES(student_name), student_name),
         student_email = IF(is_frozen = 0, VALUES(student_email), student_email),
         student_handle = IF(is_frozen = 0, VALUES(student_handle), student_handle),
         last_ip = IF(is_frozen = 0, VALUES(last_ip), last_ip),
         user_agent = IF(is_frozen = 0, VALUES(user_agent), user_agent),
         last_seen_at = IF(is_frozen = 0, NOW(), last_seen_at)`,
      [
        contestId,
        user.id,
        sessionId,
        toNullableString(user.name, 150),
        toNullableString(user.email, 150),
        toNullableString(user.userhandle, 100),
        ipAddress,
        ipAddress,
        userAgent,
        contestId,
        sessionEvent,
      ],
    );

    if (ipAddress) {
      await pool.execute(
        `INSERT INTO contest_session_log_ips
         (contest_id, user_id, ip_address, first_seen_at, last_seen_at, seen_count)
         SELECT ?, ?, ?, NOW(), NOW(), 1
         FROM contests c
         WHERE c.id = ?
           AND NOW() >= c.start_time
           AND NOW() < DATE_ADD(c.start_time, INTERVAL c.duration_minutes MINUTE)
         ON DUPLICATE KEY UPDATE
           last_seen_at = NOW(),
           seen_count = seen_count + 1`,
        [contestId, user.id, ipAddress, contestId],
      );
    }
  } catch (error) {
    console.error("Contest session activity log error:", error);
  }
}

export async function getContestSessionLogsForAdmin(
  contestId,
  adminId,
  userRole,
) {
  await ensureContestSessionLogsTable();

  const contest = await getContestTiming(contestId);

  if (!contest) {
    throw createServiceError("Contest not found.", 404);
  }

  ensureAdminCanViewContestLogs(contest, adminId, userRole);

  await freezeContestSessionLogsIfEnded(contestId);

  const currentContest = await getContestTiming(contestId);
  const contestStatus = getContestStatus(currentContest);

  const [rows] = await pool.execute(
    `SELECT
       l.user_id,
       l.student_name,
       l.student_email,
       l.student_handle,
       l.first_ip,
       l.last_ip,
       l.user_agent,
       l.first_seen_at,
       l.last_seen_at,
       l.login_count,
       l.ip_change_count,
       l.browser_change_count,
       l.is_frozen,
       u.name AS current_name,
       u.email AS current_email,
       u.userhandle AS current_handle
     FROM contest_session_logs l
     LEFT JOIN users u ON u.id = l.user_id
     WHERE l.contest_id = ?
     ORDER BY l.last_seen_at DESC, l.student_name ASC`,
    [contestId],
  );

  const [ipRows] = await pool.execute(
    `SELECT user_id, ip_address, first_seen_at, last_seen_at, seen_count
     FROM contest_session_log_ips
     WHERE contest_id = ?
     ORDER BY user_id ASC, first_seen_at ASC, id ASC`,
    [contestId],
  );
  const ipHistoryByUser = ipRows.reduce((map, row) => {
    const userId = Number(row.user_id);
    const currentHistory = map.get(userId) || [];
    currentHistory.push(mapIpHistoryRow(row));
    map.set(userId, currentHistory);
    return map;
  }, new Map());

  return {
    contestId,
    isFrozen: contestStatus === "ended",
    contestStatus,
    logs: rows.map((row) =>
      mapLogRow(
        row,
        ipHistoryByUser.get(Number(row.user_id)) || getFallbackIpHistory(row),
      ),
    ),
  };
}
