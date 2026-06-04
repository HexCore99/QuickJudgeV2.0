import { pool } from "../../config/db.js";
import {
  addMinutes,
  createServiceError,
  formatDuration,
  hasContestAccess,
  isAdminRole,
} from "../contest/contestShared.service.js";
import {
  getContestProblemTags,
  getPublicContestProblemTestCases,
  getPublicSourceProblemTestCases,
  getSourceProblemTags,
  normalizeDisplayDifficulty,
} from "../contest/contestProblemSnapshot.service.js";

export async function getContestDetailsById(
  userId,
  contestId,
  userRole = "student",
) {
  const [contestRows] = await pool.execute(
    `SELECT
       id,
       name,
       status,
       start_time,
       duration_minutes,
       requires_password,
       created_by
     FROM contests
     WHERE id = ?
     LIMIT 1`,
    [contestId],
  );

  if (!contestRows.length) {
    throw createServiceError("Contest not found.", 404);
  }

  const contest = contestRows[0];

  if (isAdminRole(userRole) && Number(contest.created_by) !== Number(userId)) {
    throw createServiceError("Contest not found.", 404);
  }

  if (
    !isAdminRole(userRole) &&
    contest.requires_password &&
    !(await hasContestAccess(userId, contestId))
  ) {
    throw createServiceError("Contest password required.", 403);
  }

  const [problemRows] = await pool.execute(
    `SELECT
       problem_id,
       problem_code,
       title,
       difficulty,
       points
     FROM contest_problems
     WHERE contest_id = ?
     ORDER BY sort_order ASC, problem_code ASC`,
    [contestId],
  );

  return {
    id: contest.id,
    title: `QuickJudge ${contest.name}`,
    statusText: String(contest.status).toUpperCase(),
    startTime: contest.start_time,
    endTime: addMinutes(contest.start_time, contest.duration_minutes),
    duration: formatDuration(contest.duration_minutes),
    durationMinutes: contest.duration_minutes,
    problems: problemRows.map((problem) => ({
      id: problem.problem_code,
      problemId: problem.problem_id,
      title: problem.title,
      difficulty: problem.difficulty,
      points: problem.points,
    })),
  };
}

export async function getContestProblemDetailByCode(
  userId,
  contestId,
  problemCode,
  userRole = "student",
) {
  // get contest
  const [contestRows] = await pool.execute(
    `SELECT id, name, status, start_time, duration_minutes,
            requires_password, created_by
     FROM contests
     WHERE id = ?
     LIMIT 1`,
    [contestId],
  );

  if (!contestRows.length) {
    throw createServiceError("Contest not found.", 404);
  }

  const contest = contestRows[0];

  if (isAdminRole(userRole) && Number(contest.created_by) !== Number(userId)) {
    throw createServiceError("Contest not found.", 404);
  }

  if (
    !isAdminRole(userRole) &&
    contest.requires_password &&
    !(await hasContestAccess(userId, contestId))
  ) {
    throw createServiceError("Contest password required.", 403);
  }

  // fetch problem des and use <problems> table as a fallback.
  const [rows] = await pool.execute(
    `SELECT
       cp.id AS contest_problem_id,
       cp.problem_id,
       cp.problem_code,
       cp.title,
       cp.statement,
       cp.input_format,
       cp.output_format,
       cp.constraints_text,
       cp.difficulty,
       cp.points,
       cp.time_limit_seconds,
       cp.memory_limit_mb,
       p.title AS source_title,
       p.statement AS source_statement,
       p.input_format AS source_input_format,
       p.output_format AS source_output_format,
       p.constraints_text AS source_constraints_text,
       p.difficulty AS source_difficulty,
       p.points AS source_points,
       p.time_limit_seconds AS source_time_limit_seconds,
       p.memory_limit_mb AS source_memory_limit_mb,
       p.created_at,
       p.updated_at
     FROM contest_problems cp
     LEFT JOIN problems p ON p.id = cp.problem_id
     WHERE cp.contest_id = ? AND cp.problem_code = ?
     LIMIT 1`,
    [contestId, problemCode],
  );

  if (!rows.length) {
    throw createServiceError("Contest problem not found.", 404);
  }

  const row = rows[0];
  const problemId = row.problem_id || null;
  const contestTags = await getContestProblemTags(row.contest_problem_id);
  const contestTestCases = await getPublicContestProblemTestCases( //get visible test cases as fallback
    row.contest_problem_id,
  );
  const tags = contestTags.length
    ? contestTags
    : await getSourceProblemTags(problemId);
  const testCases = contestTestCases.length
    ? contestTestCases
    : await getPublicSourceProblemTestCases(problemId);

  // format return problem details for specific contest
  return {
    id: row.problem_code,
    problemId: row.contest_problem_id,
    problemBankId: problemId,
    contestId,
    contestTitle: `QuickJudge ${contest.name}`,
    contestStatus: contest.status,
    contestStartTime: contest.start_time,
    contestEndTime: addMinutes(contest.start_time, contest.duration_minutes),
    contestDurationMinutes: contest.duration_minutes,
    contestProblemCode: row.problem_code,
    title: row.title || row.source_title,
    statement: row.statement || row.source_statement || "",
    inputFormat: row.input_format || row.source_input_format || "",
    outputFormat: row.output_format || row.source_output_format || "",
    constraints: row.constraints_text || row.source_constraints_text || "",
    difficulty: normalizeDisplayDifficulty(row.difficulty || row.source_difficulty),
    points: row.points ?? row.source_points ?? 0,
    timeLimitSeconds:
      Number(row.time_limit_seconds) ||
      Number(row.source_time_limit_seconds) ||
      1,
    memoryLimitMb: row.memory_limit_mb || row.source_memory_limit_mb || 256,
    hasEditorial: false,
    tags,
    testCases,
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}
