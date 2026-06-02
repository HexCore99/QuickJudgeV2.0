import { pool } from "../../config/db.js";
import { createServiceError } from "../contest/contestShared.service.js";
import { buildContestStandings } from "../contest/contestStandings.service.js";

export async function getContestLeaderboard(contestId, currentUserId) {
  // get contest by id
  const [contestRows] = await pool.execute(
    `SELECT id, start_time
     FROM contests
     WHERE id = ?
     LIMIT 1`,
    [contestId],
  );

  if (!contestRows.length) {
    throw createServiceError("Contest not found.", 404);
  }

  /*
   * get submission for a specific contest
   * is_scored -> only track submissions during contest
   */
  const [submissionRows] = await pool.execute(
    `SELECT
       s.user_id,
       u.name AS username,
       s.problem_code,
       COALESCE(cp.points, 0) AS points,
       s.verdict,
       s.submitted_at
     FROM contest_submissions s
     LEFT JOIN users u ON u.id = s.user_id
     LEFT JOIN contest_problems cp
       ON cp.contest_id = s.contest_id
      AND cp.problem_code = s.problem_code
     WHERE s.contest_id = ?
       AND s.problem_code IS NOT NULL
       AND s.is_scored = 1
     ORDER BY s.user_id ASC, s.problem_code ASC, s.submitted_at ASC, s.id ASC`,
    [contestId],
  );

  return buildContestStandings(
    submissionRows,
    contestRows[0].start_time,
    currentUserId,
  );
}
