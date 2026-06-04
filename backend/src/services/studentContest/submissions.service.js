import { pool } from "../../config/db.js";
import {
  ensureAdminOwnsContest,
  isAdminRole,
} from "../contest/contestShared.service.js";

export async function getContestSubmissions(
  userId,
  contestId,
  userRole = "student",
) {
  const isAdmin = isAdminRole(userRole);

  if (isAdmin) {
    await ensureAdminOwnsContest(userId, contestId);
  }
  
  // get all the submission for required contest
  const [rows] = await pool.execute(
    `SELECT
       s.id,
       s.user_id,
       u.name AS username,
       s.problem_id,
       s.contest_problem_code,
       s.problem_title,
       s.language,
       s.source_code,
       s.verdict,
       s.runtime_ms,
       s.memory_kb,
       s.test_case_note,
       s.is_scored,
       s.submitted_at
     FROM submissions s
     LEFT JOIN users u ON u.id = s.user_id
     WHERE s.contest_id = ? ${isAdmin ? "" : "AND s.user_id = ?"}
     ORDER BY s.submitted_at DESC`,
    isAdmin ? [contestId] : [contestId, userId],
  );

  return rows.map((r) => ({
    id: r.id,
    userId: r.user_id,
    username: r.username || "Unknown",
    problemId: r.problem_id,
    problemCode: r.contest_problem_code,
    problemTitle: r.problem_title,
    language: r.language,
    verdict: r.verdict,
    sourceCode: r.source_code,
    runtimeMs: r.runtime_ms,
    memoryKb: r.memory_kb,
    testCaseNote: r.test_case_note,
    isScored: Boolean(r.is_scored ?? true),
    submittedAt: r.submitted_at,
  }));
}
