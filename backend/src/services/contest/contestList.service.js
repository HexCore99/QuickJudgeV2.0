import { pool } from "../../config/db.js";
import {
  CONTEST_FILTERS,
  addMinutes,
  formatDate,
  formatDuration,
  formatTime,
  getTagsMap,
  isAdminRole,
  refreshContestStatuses,
} from "./contestShared.service.js";

export async function getContestsForUser(userId, userRole = "student") {
  await refreshContestStatuses();

  const shouldScopeToAdmin = isAdminRole(userRole);
  const adminScopeClause = shouldScopeToAdmin ? "AND c.created_by = ?" : "";
  const publicPastContestClause = shouldScopeToAdmin
    ? ""
    : "AND c.requires_password = 0";

    // Get live contest.
  const [liveRows] = await pool.execute(
    `SELECT
       c.id,
       c.name,
       c.description,
       c.start_time,
       c.duration_minutes,
       c.problems_count,
       c.participants_count,
       c.requires_password
     FROM contests c
     WHERE c.status = 'live'
       ${adminScopeClause}
     ORDER BY c.start_time ASC`,
    shouldScopeToAdmin ? [userId] : [],
  );

  // Get upcoming contestsl. Sort by registered first
  const [upcomingRows] = await pool.execute(
    `SELECT
       c.id,
       c.name,
       c.description,
       c.start_time,
       c.duration_minutes,
       c.problems_count,
       c.participants_count,
       c.requires_password,
       EXISTS(
         SELECT 1
         FROM contest_registrations cr
         WHERE cr.contest_id = c.id AND cr.user_id = ?
       ) AS registered
     FROM contests c
     WHERE c.status = 'upcoming'
       ${adminScopeClause}
     ORDER BY registered DESC, c.start_time ASC`,
    shouldScopeToAdmin ? [userId, userId] : [userId],
  );

  // Get past contests
  const [pastRows] = await pool.execute(
    `SELECT
       c.id,
       c.name,
       c.start_time,
       c.duration_minutes,
       c.contest_type,
       c.problems_count,
       c.is_rated,
       c.participants_count,
       COALESCE(r.participated, 0) AS participated,
       r.rank_position,
       COALESCE(r.total_participants, c.participants_count) AS total_participants
     FROM contests c
     LEFT JOIN contest_results r
       ON r.contest_id = c.id AND r.user_id = ?
     WHERE c.status = 'past'
       ${adminScopeClause}
       ${publicPastContestClause}
     ORDER BY c.start_time DESC`,
    shouldScopeToAdmin ? [userId, userId] : [userId],
  );

  const allContestIds = [
    ...liveRows.map((row) => row.id),
    ...upcomingRows.map((row) => row.id),
    ...pastRows.map((row) => row.id),
  ];

  // get each contest with list of tags e.g,{"c1:["DP"]}
  const tagsMap = await getTagsMap(allContestIds); 

  // format and return
  return {
    filters: CONTEST_FILTERS,
    live: liveRows.map((row) => ({
      id: row.id,
      name: row.name,
      desc: row.description || "",
      startTime: row.start_time,
      endTime: addMinutes(row.start_time, row.duration_minutes),
      date: formatDate(row.start_time),
      time: formatTime(row.start_time),
      duration: formatDuration(row.duration_minutes),
      durationMinutes: row.duration_minutes,
      problems: row.problems_count,
      participants: row.participants_count,
      requiresPassword: Boolean(row.requires_password),
      tags: tagsMap[row.id] || [],
    })),
    upcoming: upcomingRows.map((row) => ({
      id: row.id,
      name: row.name,
      desc: row.description || "",
      startTime: row.start_time,
      endTime: addMinutes(row.start_time, row.duration_minutes),
      date: formatDate(row.start_time),
      time: formatTime(row.start_time),
      duration: formatDuration(row.duration_minutes),
      durationMinutes: row.duration_minutes,
      problems: row.problems_count,
      participants: row.participants_count || 0,
      registered: Boolean(row.registered),
      tags: tagsMap[row.id] || [],
    })),
    past: pastRows.map((row) => ({
      id: row.id,
      name: row.name,
      startTime: row.start_time,
      endTime: addMinutes(row.start_time, row.duration_minutes),
      date: formatDate(row.start_time),
      durationMinutes: row.duration_minutes,
      type: row.contest_type || "Contest",
      participated: Boolean(row.participated),
      rank: row.participated ? row.rank_position : null,
      total: row.total_participants || 0,
      questions: row.problems_count || 0,
      rated: Boolean(row.is_rated),
      tags: tagsMap[row.id] || [],
    })),
  };
}
