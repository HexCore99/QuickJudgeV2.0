import { pool } from "../../config/db.js";
import { ensureProblemTables } from "../problem.service.js";
import {
  createServiceError,
  normalizeDifficulty,
} from "./shared.service.js";

async function ensureContestAccess(userId, contest) {
  if (!contest?.requires_password) {
    return;
  }

  const [accessRows] = await pool.execute(
    `SELECT 1
     FROM contest_access
     WHERE user_id = ? AND contest_id = ?
     LIMIT 1`,
    [userId, contest.id],
  );

  if (!accessRows.length) {
    throw createServiceError("Contest password required.", 403);
  }
}

// checks whether a submission happened before, during, or after a contest
// then decides if it should count for scoring.
export async function getContestSubmissionTiming(
  executor,
  contestId,
  submittedAt = new Date(),
) {
  if (!contestId) {
    return { isBeforeStart: false, isScored: true };
  }

  const [rows] = await executor.execute(
    `SELECT
       CASE
         WHEN ? < start_time THEN 'before'
         WHEN ? >= DATE_ADD(start_time, INTERVAL duration_minutes MINUTE) THEN 'after'
         ELSE 'live'
       END AS submission_status
     FROM contests
     WHERE id = ?
     LIMIT 1`,
    [submittedAt, submittedAt, contestId],
  );

  if (!rows.length) {
    throw createServiceError("Contest not found.", 404);
  }

  const status = rows[0].submission_status;

  return {
    isBeforeStart: status === "before",
    isScored: status === "live",
  };
}

// finds the correct problem metadata for a submission,handling both contest and problem bank
export async function resolveProblemForSubmission({
  userId,
  problemId,
  contestId = null,
  contestProblemCode = null,
}) {
  await ensureProblemTables();

  // If contestId exists, this is a contest submission.
  if (contestId) {
    const [rows] = await pool.execute(
      `SELECT
         c.id AS contest_id,
         c.name AS contest_name,
         c.created_by AS contest_owner_id,
         c.requires_password,
         cp.id AS contest_problem_id,
         cp.problem_id,
         cp.problem_code,
         cp.title,
         cp.difficulty,
         cp.points,
         cp.time_limit_seconds,
         cp.memory_limit_mb,
         p.title AS source_title,
         p.difficulty AS source_difficulty,
         p.time_limit_seconds AS source_time_limit_seconds,
         p.memory_limit_mb AS source_memory_limit_mb
       FROM contests c
       INNER JOIN contest_problems cp ON cp.contest_id = c.id
       LEFT JOIN problems p ON p.id = cp.problem_id
       WHERE c.id = ?
         AND (cp.problem_id = ? OR cp.id = ? OR cp.problem_code = ?)
       LIMIT 1`,
      [
        contestId,
        Number(problemId),
        Number(problemId),
        contestProblemCode || String(problemId),
      ],
    );

    if (!rows.length) {
      throw createServiceError("Contest problem not found.", 404);
    }

    const row = rows[0];
    await ensureContestAccess(userId, {
      id: row.contest_id,
      requires_password: Boolean(row.requires_password),
    });

    return {
      problemId: row.problem_id || row.contest_problem_id,
      problemSourceId: row.problem_id || null,
      contestProblemId: row.contest_problem_id,
      problemCode: row.problem_code,
      problemTitle: row.title || row.source_title,
      contestId: row.contest_id,
      contestName: row.contest_name,
      contestOwnerId: row.contest_owner_id,
      difficulty: normalizeDifficulty(row.difficulty || row.source_difficulty),
      points: row.points,
      timeLimitSeconds:
        Number(row.time_limit_seconds) ||
        Number(row.source_time_limit_seconds) ||
        1,
      memoryLimitMb:
        Number(row.memory_limit_mb) ||
        Number(row.source_memory_limit_mb) ||
        256,
    };
  }

  // otherwise problembank submission
  const [rows] = await pool.execute(
    `SELECT id, title, difficulty, time_limit_seconds, memory_limit_mb
     FROM problems
     WHERE id = ? AND (is_published = 1 OR author_id = ?)
     LIMIT 1`,
    [problemId, userId],
  );

  if (!rows.length) {
    throw createServiceError("Problem not found.", 404);
  }

  const row = rows[0];

  return {
    problemId: row.id,
    problemCode: String(row.id),
    problemTitle: row.title,
    contestId: null,
    contestName: null,
    contestOwnerId: null,
    difficulty: normalizeDifficulty(row.difficulty),
    points: null,
    timeLimitSeconds: Number(row.time_limit_seconds) || 1,
    memoryLimitMb: Number(row.memory_limit_mb) || 256,
  };
}
