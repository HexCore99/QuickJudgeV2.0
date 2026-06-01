import { pool } from "../../config/db.js";
import { ensureProblemTables } from "../problem.service.js";
import { ensureUserHandleSchema } from "../userHandle.service.js";
import {
  DIFFICULTY_META,
  buildRatingHistory,
  getContestSortTime,
  mapActivity,
  mapContest,
  mapProfile,
  mapSubmission,
} from "./formatters.service.js";
import {
  ensureProfileRow,
  getProfileRow,
  getUserRow,
} from "./shared.service.js";

async function getSubmissionStats(userId) {
  const [rows] = await pool.execute(
    `SELECT
       COUNT(*) AS total_submissions,
       COALESCE(SUM(CASE WHEN verdict = 'AC' AND is_scored = 1 THEN 1 ELSE 0 END), 0) AS accepted_submissions,
       COUNT(DISTINCT CASE
         WHEN verdict != 'AC' THEN NULL
         WHEN is_scored != 1 THEN NULL
         WHEN problem_id IS NOT NULL THEN CONCAT('problem:', problem_id)
         WHEN contest_id IS NOT NULL THEN CONCAT('contest:', contest_id, ':', contest_problem_code)
         ELSE problem_title
       END) AS solved_count
     FROM submissions
     WHERE user_id = ?`,
    [userId],
  );

  return (
    rows[0] || {
      total_submissions: 0,
      accepted_submissions: 0,
      solved_count: 0,
    }
  );
}

async function getSubmissions(userId) {
  const [rows] = await pool.execute(
    `SELECT id, problem_id, contest_id, contest_problem_code, problem_title,
            contest_name, language, source_code, verdict, runtime_ms,
            memory_kb, test_case_note, is_scored, submitted_at
     FROM submissions
     WHERE user_id = ?
     ORDER BY submitted_at DESC, id DESC
     LIMIT 50`,
    [userId],
  );

  return rows.map(mapSubmission);
}

function getPlaceholders(values) {
  return values.map(() => "?").join(",");
}

function getPositiveNumber(value) {
  const number = Number(value);
  return number > 0 ? number : null;
}

function getNullableNumber(value) {
  if (value === null || value === undefined) {
    return null;
  }

  return Number(value) || 0;
}

function mapCountRows(rows, valueKey) {
  return rows.reduce((map, row) => {
    map.set(row.contest_id, Number(row[valueKey]) || 0);
    return map;
  }, new Map());
}

async function getParticipatedContestIds(userId) {
  const [rows] = await pool.execute(
    `SELECT contest_id
     FROM submissions
     WHERE user_id = ? AND contest_id IS NOT NULL AND is_scored = 1
     UNION
     SELECT contest_id
     FROM contest_submissions
     WHERE user_id = ? AND is_scored = 1`,
    [userId, userId],
  );

  return rows.map((row) => row.contest_id).filter(Boolean);
}

async function getContestRowsByIds(contestIds, userId) {
  if (!contestIds.length) {
    return [];
  }

  const placeholders = getPlaceholders(contestIds);
  const [rows] = await pool.execute(
    `SELECT
       c.id AS contest_code,
       c.name AS contest_name,
       c.start_time AS contest_date,
       c.participants_count AS contest_participants_count,
       c.problems_count AS contest_problems_count,
       c.is_rated,
       c.requires_password,
       cr.rank_position,
       cr.total_participants,
       cr.solved_count AS result_solved_count
     FROM contests c
     LEFT JOIN contest_results cr
       ON cr.contest_id = c.id
      AND cr.user_id = ?
      AND cr.participated = 1
     WHERE c.id IN (${placeholders})
     ORDER BY c.start_time DESC, c.id DESC`,
    [userId, ...contestIds],
  );

  return rows;
}

async function getParticipantCountsByContestIds(contestIds) {
  if (!contestIds.length) {
    return new Map();
  }

  const placeholders = getPlaceholders(contestIds);
  const [rows] = await pool.execute(
    `SELECT contest_id, COUNT(DISTINCT user_id) AS total_participants
     FROM (
       SELECT contest_id, user_id
       FROM submissions
       WHERE contest_id IN (${placeholders}) AND is_scored = 1
       UNION
       SELECT contest_id, user_id
       FROM contest_submissions
       WHERE contest_id IN (${placeholders}) AND is_scored = 1
     ) participant_source
     GROUP BY contest_id`,
    [...contestIds, ...contestIds],
  );

  return mapCountRows(rows, "total_participants");
}

async function getSolvedCountsByContestIds(userId, contestIds) {
  if (!contestIds.length) {
    return new Map();
  }

  const placeholders = getPlaceholders(contestIds);
  const [rows] = await pool.execute(
    `SELECT contest_id, COUNT(DISTINCT problem_code) AS solved_count
     FROM (
       SELECT contest_id, contest_problem_code AS problem_code
       FROM submissions
       WHERE user_id = ?
         AND contest_id IN (${placeholders})
         AND verdict = 'AC'
         AND is_scored = 1
       UNION
       SELECT contest_id, problem_code
       FROM contest_submissions
       WHERE user_id = ?
         AND contest_id IN (${placeholders})
         AND verdict = 'Accepted'
         AND is_scored = 1
     ) solved_source
     WHERE problem_code IS NOT NULL
     GROUP BY contest_id`,
    [userId, ...contestIds, userId, ...contestIds],
  );

  return mapCountRows(rows, "solved_count");
}

async function getProblemCountsByContestIds(contestIds) {
  if (!contestIds.length) {
    return new Map();
  }

  const placeholders = getPlaceholders(contestIds);
  const [rows] = await pool.execute(
    `SELECT contest_id, COUNT(*) AS total_problems
     FROM contest_problems
     WHERE contest_id IN (${placeholders})
     GROUP BY contest_id`,
    contestIds,
  );

  return mapCountRows(rows, "total_problems");
}

async function getContests(userId) {
  const [historyRows] = await pool.execute(
    `SELECT id, contest_code, contest_name, contest_date, rank_position,
            participants_count, solved_count, total_problems, rating_delta,
            rating_before, rating_after, is_rated, 0 AS requires_password
     FROM user_contests
     WHERE user_id = ?
     ORDER BY contest_date DESC, id DESC`,
    [userId],
  );

  const participatedContestIds = await getParticipatedContestIds(userId);
  const [
    contestRows,
    participantCounts,
    solvedCounts,
    problemCounts,
  ] = await Promise.all([
    getContestRowsByIds(participatedContestIds, userId),
    getParticipantCountsByContestIds(participatedContestIds),
    getSolvedCountsByContestIds(userId, participatedContestIds),
    getProblemCountsByContestIds(participatedContestIds),
  ]);
  const participationRows = contestRows.map((row) => {
    const contestCode = row.contest_code;

    return {
      contest_code: contestCode,
      contest_name: row.contest_name,
      contest_date: row.contest_date,
      rank_position: row.rank_position,
      participants_count:
        getPositiveNumber(row.total_participants) ??
        getPositiveNumber(row.contest_participants_count) ??
        participantCounts.get(contestCode) ??
        0,
      solved_count:
        getNullableNumber(row.result_solved_count) ??
        solvedCounts.get(contestCode) ??
        0,
      total_problems:
        getPositiveNumber(row.contest_problems_count) ??
        problemCounts.get(contestCode) ??
        0,
      rating_delta: 0,
      rating_before: null,
      rating_after: null,
      is_rated: row.is_rated,
      requires_password: row.requires_password,
    };
  });

  const rowsByContestCode = new Map();

  for (const row of participationRows) {
    rowsByContestCode.set(row.contest_code, row);
  }

  for (const row of historyRows) {
    rowsByContestCode.set(row.contest_code, row);
  }

  return [...rowsByContestCode.values()]
    .sort(
      (a, b) =>
        getContestSortTime(b) - getContestSortTime(a) ||
        String(b.contest_code).localeCompare(String(a.contest_code)),
    )
    .map(mapContest);
}

async function getRatingHistory(userId) {
  const [rows] = await pool.execute(
    `SELECT rating_date, rating, label
     FROM user_rating_history
     WHERE user_id = ?
     ORDER BY rating_date ASC, id ASC`,
    [userId],
  );

  return buildRatingHistory(rows);
}

async function getDifficultyStats(userId) {
  await ensureProblemTables();

  const [rows] = await pool.execute(
    `SELECT
       p.difficulty,
       COUNT(DISTINCT p.id) AS total_count,
       COUNT(DISTINCT CASE
         WHEN s.id IS NOT NULL THEN p.id
         ELSE NULL
       END) AS solved_count
     FROM problems p
     LEFT JOIN submissions s
       ON s.problem_id = p.id
      AND s.user_id = ?
      AND s.verdict = 'AC'
      AND s.is_scored = 1
     WHERE p.is_published = 1
     GROUP BY p.difficulty`,
    [userId],
  );

  const rowMap = rows.reduce((acc, row) => {
    acc[row.difficulty] = row;
    return acc;
  }, {});

  return ["Easy", "Medium", "Hard"].map((difficulty) => {
    const row = rowMap[difficulty] || {};
    const meta = DIFFICULTY_META[difficulty];

    return {
      ...meta,
      solved: Number(row.solved_count) || 0,
      total: Number(row.total_count) || 0,
    };
  });
}

async function getActivities(userId) {
  const [rows] = await pool.execute(
    `SELECT id, activity_type, title, problem_code, problem_title, verdict,
            rating_change, contest_code, contest_name, result_text,
            related_submission_id, related_achievement_code, occurred_at
     FROM user_activities
     WHERE user_id = ?
     ORDER BY occurred_at DESC, id DESC
     LIMIT 30`,
    [userId],
  );

  return rows.map(mapActivity);
}

export async function getProfileForUser(userId) {
  await ensureUserHandleSchema();

  const user = await getUserRow(userId);
  await ensureProfileRow(user);

  const profileRow = await getProfileRow(userId);
  const submissionStats = await getSubmissionStats(userId);
  const profile = mapProfile(user, profileRow, submissionStats);

  const [
    submissions,
    contests,
    achievements,
    ratingHistory,
    difficulties,
    activities,
  ] = await Promise.all([
    getSubmissions(userId),
    getContests(userId),
    getRatingHistory(userId),
    getDifficultyStats(userId),
    getActivities(userId),
  ]);

  return {
    profile,
    submissions,
    contests,
    achievements,
    ratingHistory,
    difficulties,
    activities,
  };
}
