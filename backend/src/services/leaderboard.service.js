import { pool } from "../config/db.js";

const DEFAULT_LIMIT = 100;

function normalizeLimit(limit) {
  const numberValue = Number(limit);

  if (!Number.isInteger(numberValue) || numberValue <= 0) {
    return DEFAULT_LIMIT;
  }

  return Math.min(numberValue, DEFAULT_LIMIT);
}

// fetches top student users, calculates their rating and solved count, sorts them, and returns leaderboard rows with ranks.
export async function getGlobalLeaderboard({ limit } = {}) {
  const safeLimit = normalizeLimit(limit);

  const [rows] = await pool.execute(
    `SELECT
       u.id AS user_id,
       u.name AS username,
       COALESCE(p.rating, 0) AS rating,
       COALESCE(s.solved_count, p.solved_count, 0) AS total_solved
     FROM users u
     LEFT JOIN user_profiles p ON p.user_id = u.id
     LEFT JOIN (
       SELECT
         user_id,
         COUNT(DISTINCT CASE
           WHEN problem_id IS NOT NULL THEN CONCAT('problem:', problem_id)
           WHEN contest_id IS NOT NULL THEN CONCAT('contest:', contest_id, ':', contest_problem_code)
           ELSE problem_title
         END) AS solved_count
       FROM submissions
       WHERE verdict = 'AC'
         AND is_scored = 1
       GROUP BY user_id
     ) s ON s.user_id = u.id
     WHERE u.role = 'student'
     ORDER BY rating DESC, total_solved DESC, u.id ASC
     LIMIT ${safeLimit}`,
  );

  return rows.map((row, index) => ({
    rank: index + 1,
    userId: row.user_id,
    username: row.username,
    rating: Number(row.rating) || 0,
    totalSolved: Number(row.total_solved) || 0,
  }));
}


/*(
  big SQL is doing 4 smaller jobs.
  1. Get Students
  SELECT
  u.id AS user_id,
  u.name AS username
FROM users u
WHERE u.role = 'student'

2. Get Profile Rating
LEFT JOIN user_profiles p ON p.user_id = u.id

3.Count Accepted Solves
SELECT
  user_id,
  COUNT(DISTINCT ...) AS solved_count
FROM submissions
WHERE verdict = 'AC'
  AND is_scored = 1
GROUP BY user_id

4. Join Solved Count To Users
LEFT JOIN (...) s ON s.user_id = u.id
*/