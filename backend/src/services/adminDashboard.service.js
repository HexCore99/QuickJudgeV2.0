import { pool } from "../config/db.js";

const STAT_ACCENTS = {
  contests: "amber",
  problems: "blue",
  active: "emerald",
  upcoming: "violet",
};

function formatCountDelta(count, suffix) {
  const safeCount = Number(count) || 0;
  const sign = safeCount > 0 ? "+" : "";
  return `${sign}${safeCount} ${suffix}`;
}

function formatDate(value) {
  if (!value) {
    return "Not scheduled";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

// calculates how much time is left before a contest ends and returns a string like "2h 15m left".
function formatTimeLeft(startTime, durationMinutes) {
  const startsAt = new Date(startTime);
  const durationMs = (Number(durationMinutes) || 0) * 60 * 1000;
  const endsAt = new Date(startsAt.getTime() + durationMs);
  const remainingMs = endsAt.getTime() - Date.now();

  if (remainingMs <= 0) {
    return "Ending soon";
  }

  const hours = Math.floor(remainingMs / (60 * 60 * 1000));
  const minutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));

  if (hours <= 0) {
    return `${minutes}m left`;
  }

  return `${hours}h ${minutes}m left`;
}

function formatStartsIn(startTime) {
  const startsAt = new Date(startTime);
  const remainingMs = startsAt.getTime() - Date.now();

  if (remainingMs <= 0) {
    return "Starting soon";
  }

  const days = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
  const hours = Math.floor(
    (remainingMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000),
  );

  if (days > 0) {
    return `Starts in ${days}d ${hours}h`;
  }

  return `Starts in ${Math.max(hours, 1)}h`;
}

function mapContest(row) {
  const status = row.status === "live" ? "Running" : "Upcoming";

  return {
    id: row.id,
    title: row.name,
    status,
    participants: Number(row.participants_count) || 0,
    problems: Number(row.problems_count) || 0,
    date: formatDate(row.start_time),
    time:
      row.status === "live"
        ? formatTimeLeft(row.start_time, row.duration_minutes)
        : formatStartsIn(row.start_time),
  };
}

function mapProblem(row) {
  return {
    id: row.id,
    title: row.title,
    difficulty: row.difficulty,
    tag: row.tag || "General",
    hasEditorial: Boolean(row.has_editorial),
  };
}

async function getCount(sql, params) {
  const [[row]] = await pool.execute(sql, params);
  return Number(row.count) || 0;
}

export async function getAdminDashboard(adminId) {
  const totalContests = await getCount(
    `SELECT COUNT(*) AS count
     FROM contests
     WHERE created_by = ?`,
    [adminId],
  );

  const totalProblems = await getCount(
    `SELECT COUNT(*) AS count
     FROM problems
     WHERE author_id = ?`,
    [adminId],
  );

  const activeContests = await getCount(
    `SELECT COUNT(*) AS count
     FROM contests
     WHERE created_by = ?
       AND status = 'live'`,
    [adminId],
  );

  const upcomingContests = await getCount(
    `SELECT COUNT(*) AS count
     FROM contests
     WHERE created_by = ?
       AND status = 'upcoming'
       AND start_time >= NOW()
       AND start_time < DATE_ADD(NOW(), INTERVAL 7 DAY)`,
    [adminId],
  );

  const contestsThisMonth = await getCount(
    `SELECT COUNT(*) AS count
     FROM contests
     WHERE created_by = ?
       AND created_at >= DATE_FORMAT(CURRENT_DATE(), '%Y-%m-01')`,
    [adminId],
  );

  const problemsThisMonth = await getCount(
    `SELECT COUNT(*) AS count
     FROM problems
     WHERE author_id = ?
       AND created_at >= DATE_FORMAT(CURRENT_DATE(), '%Y-%m-01')`,
    [adminId],
  );

  const [contestRows] = await pool.execute(
    `
    SELECT
      id,
      name,
      status,
      participants_count,
      problems_count,
      start_time,
      duration_minutes
    FROM contests
    WHERE created_by = ? AND status IN ('live', 'upcoming')
    ORDER BY
      CASE status WHEN 'live' THEN 0 ELSE 1 END,
      start_time ASC
    LIMIT 5
  `,
    [adminId],
  );

  //fetches the latest 5 problems
  const [problemRows] = await pool.execute(
    `
    SELECT
      p.id,
      p.title,
      p.difficulty,
      p.has_editorial,
      (
        SELECT pt.tag_name
        FROM problem_tags pt
        WHERE pt.problem_id = p.id
        ORDER BY pt.id ASC
        LIMIT 1
      ) AS tag
    FROM problems p
    WHERE p.author_id = ?
    ORDER BY p.created_at DESC, p.id DESC
    LIMIT 5
  `,
    [adminId],
  );

  return {
    stats: [
      {
        key: "totalContests",
        label: "Total Contests",
        value: totalContests,
        delta: formatCountDelta(contestsThisMonth, "this month"),
        accent: STAT_ACCENTS.contests,
      },
      {
        key: "totalProblems",
        label: "Total Problems",
        value: totalProblems,
        delta: formatCountDelta(problemsThisMonth, "this month"),
        accent: STAT_ACCENTS.problems,
      },
      {
        key: "activeContests",
        label: "Active Contests",
        value: activeContests,
        delta: "Running now",
        accent: STAT_ACCENTS.active,
      },
      {
        key: "upcomingContests",
        label: "Upcoming",
        value: upcomingContests,
        delta: "Next 7 days",
        accent: STAT_ACCENTS.upcoming,
      },
    ],
    contests: contestRows.map(mapContest),
    problems: problemRows.map(mapProblem),
  };
}
