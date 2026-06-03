import { pool } from "../../config/db.js";
import { judgeAllTestCases } from "./judging.service.js";
import {
  getContestSubmissionTiming,
  resolveProblemForSubmission,
} from "./problemResolver.service.js";
import {
  createServiceError,
  mapVerdictCodeToLabel,
} from "./shared.service.js";

// prevents a user from submitting the exact same code twice in a row
async function ensureSubmissionChangedSinceLastSubmit({
  userId,
  problem,
  language,
  sourceCode,
}) {
  const params = [userId, problem.problemId];
  let contextFilter = "user_id = ? AND problem_id = ?";

  if (problem.contestId) {
    contextFilter += " AND contest_id = ? AND contest_problem_code = ?";
    params.push(problem.contestId, problem.problemCode);
  } else {
    contextFilter += " AND contest_id IS NULL AND contest_problem_code IS NULL";
  }

  const [rows] = await pool.execute(
    `SELECT language, source_code
     FROM submissions
     WHERE ${contextFilter}
     ORDER BY submitted_at DESC, id DESC
     LIMIT 1`,
    params,
  );

  const previousSubmission = rows[0];

  if (
    previousSubmission &&
    previousSubmission.language === language &&
    previousSubmission.source_code === sourceCode
  ) {
    throw createServiceError(
      "No changes detected since your last submission. Edit your code before submitting again.",
      409,
    );
  }
}
// saves a judged submission into several tables and updates the user’s profile stats
async function insertSubmission({
  userId,
  problem,
  language,
  sourceCode,
  result,
  submittedAt,
}) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const scoring = await getContestSubmissionTiming(
      connection,
      problem.contestId,
      submittedAt,
    );

    if (scoring.isBeforeStart) {
      throw createServiceError("Contest has not started yet.", 403);
    }

    const isScored = scoring.isScored; //should submission count?

    const [submissionResult] = await connection.execute(
      `INSERT INTO submissions
       (user_id, problem_id, contest_id, contest_problem_code, problem_title,
        contest_name, language, source_code, verdict, runtime_ms, memory_kb,
        test_case_note, is_scored, submitted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        problem.problemId,
        problem.contestId,
        problem.contestId ? problem.problemCode : null,
        problem.problemTitle,
        problem.contestName,
        language,
        sourceCode,
        result.verdict,
        result.runtimeMs,
        result.memoryKb,
        result.testCaseNote,
        isScored ? 1 : 0,
        submittedAt,
      ],
    );
    const submissionId = submissionResult.insertId;

    await connection.execute(
      `INSERT INTO user_submissions
       (user_id, problem_code, problem_title, contest_code, contest_name,
        language, verdict, runtime_ms, memory_kb, difficulty, source_code,
        test_case_note)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        problem.problemCode,
        problem.problemTitle,
        problem.contestId,
        problem.contestName,
        language,
        result.verdict,
        result.runtimeMs,
        result.memoryKb,
        problem.difficulty,
        sourceCode,
        result.testCaseNote,
      ],
    );

    if (problem.contestId) {
      await connection.execute(
        `INSERT INTO contest_submissions
         (contest_id, user_id, problem_id, problem_code, language, verdict, is_scored, submitted_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          problem.contestId,
          userId,
          problem.problemId,
          problem.problemCode,
          language,
          mapVerdictCodeToLabel(result.verdict),
          isScored ? 1 : 0,
          submittedAt,
        ],
      );
    }

    if (isScored) {
      await connection.execute(
        `INSERT INTO user_activities
         (user_id, activity_type, title, problem_code, problem_title, verdict,
          contest_code, contest_name, related_submission_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          result.verdict === "AC" ? "solve" : "fail",
          result.verdict === "AC"
            ? `Solved ${problem.problemTitle}`
            : `Submitted ${problem.problemTitle}`,
          problem.problemCode,
          problem.problemTitle,
          result.verdict,
          problem.contestId,
          problem.contestName,
          submissionId,
        ],
      );
    }

    // If the profile does not exist, create it.
    await connection.execute(
      `INSERT INTO user_profiles (user_id, public_id)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE user_id = user_id`,
      [userId, `QJ-${String(userId).padStart(4, "0")}`],
    );

    // update profile stats
    await connection.execute(
      `UPDATE user_profiles
       SET total_submissions = total_submissions + 1,
           solved_count = solved_count + ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = ?`,
      [result.verdict === "AC" && isScored ? 1 : 0, userId],
    );

    await connection.commit();

    return { submissionId, isScored };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function submitCodeForProblem(userId, payload) {
  const submittedAt = new Date();

  // normalizing problem
  const problem = await resolveProblemForSubmission({
    userId,
    problemId: payload.problemId,
    contestId: payload.contestId,
    contestProblemCode: payload.contestProblemCode,
  });

  // can submit? submit during contest? should submission count?
  const scoring = await getContestSubmissionTiming(
    pool,
    problem.contestId,
    submittedAt,
  );

  if (scoring.isBeforeStart) {
    throw createServiceError("Contest has not started yet.", 403);
  }

  await ensureSubmissionChangedSinceLastSubmit({
    userId,
    problem,
    language: payload.language,
    sourceCode: payload.sourceCode,
  });

  const result = await judgeAllTestCases({
    problem,
    language: payload.language,
    sourceCode: payload.sourceCode,
  });
  const { submissionId, isScored } = await insertSubmission({
    userId,
    problem,
    language: payload.language,
    sourceCode: payload.sourceCode,
    result,
    submittedAt,
  });

  return {
    id: submissionId,
    ...result,
    verdictLabel: mapVerdictCodeToLabel(result.verdict),
    problemId: problem.problemId,
    contestId: problem.contestId,
    contestProblemCode: problem.contestId ? problem.problemCode : null,
    problemTitle: problem.problemTitle,
    contestName: problem.contestName,
    language: payload.language,
    sourceCode: payload.sourceCode,
    isScored,
    submittedAt,
  };
}
