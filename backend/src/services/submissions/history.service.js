import { pool } from "../../config/db.js";

function mapSubmissionRow(row) {
  return {
    id: row.id,
    userId: row.user_id,
    problemId: row.problem_id,
    contestId: row.contest_id,
    contestProblemCode: row.contest_problem_code,
    problemTitle: row.problem_title,
    contestName: row.contest_name,
    language: row.language,
    sourceCode: row.source_code,
    verdict: row.verdict,
    runtimeMs: row.runtime_ms,
    memoryKb: row.memory_kb,
    testCaseNote: row.test_case_note,
    isScored: Boolean(row.is_scored ?? true),
    submittedAt: row.submitted_at,
  };
}

// fetches the latest submissions by one user for a specific problem
export async function getSubmissionsForProblem(
  userId,
  { problemId, contestId = null, contestProblemCode = null },
) {
  const params = [userId, problemId];
  let filter = "user_id = ? AND problem_id = ?";

  if (contestId) {
    filter += " AND contest_id = ?";
    params.push(contestId);
  }

  if (contestProblemCode) {
    filter += " AND contest_problem_code = ?";
    params.push(contestProblemCode);
  }

  const [rows] = await pool.execute(
    `SELECT id, user_id, problem_id, contest_id, contest_problem_code,
            problem_title, contest_name, language, source_code, verdict,
            runtime_ms, memory_kb, test_case_note, is_scored, submitted_at
     FROM submissions
     WHERE ${filter}
     ORDER BY submitted_at DESC, id DESC
     LIMIT 50`,
    params,
  );

  return rows.map(mapSubmissionRow);
}
