import bcrypt from "bcrypt";
import { pool } from "../../config/db.js";
import { createServiceError } from "../contest/contestShared.service.js";

// insert user to the registration table if alredy not.
export async function registerUserForUpcomingContest(userId, contestId) {
  // find contest
  const [contestRows] = await pool.execute(
    `SELECT id, status
     FROM contests
     WHERE id = ?
     LIMIT 1`,
    [contestId],
  );

  if (!contestRows.length) {
    throw createServiceError("Contest not found.", 404);
  }

  const contest = contestRows[0];

  if (contest.status !== "upcoming") {
    throw createServiceError("Only upcoming contests can be registered.", 400);
  }
  // update contest_registration table with userId
  await pool.execute(
    `INSERT INTO contest_registrations (user_id, contest_id)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE contest_id = contest_id`,
    [userId, contestId],
  );

  return {
    contestId,
  };
}

export async function verifyContestPasswordAccess(userId, contestId, password) {
  const [contestRows] = await pool.execute(
    `SELECT id, requires_password, password_hash
     FROM contests
     WHERE id = ?
     LIMIT 1`,
    [contestId],
  );

  if (!contestRows.length) {
    throw createServiceError("Contest not found.", 404);
  }

  const contest = contestRows[0];

  if (!contest.requires_password) {
    return {
      contestId,
    };
  }

  const isMatched = await bcrypt.compare(password, contest.password_hash || ""); //check password validity

  if (!isMatched) {
    throw createServiceError("Incorrect contest password.", 401);
  }

  // if correct password, then insert user entry
  await pool.execute(
    `INSERT INTO contest_access (user_id, contest_id)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE granted_at = CURRENT_TIMESTAMP`,
    [userId, contestId],
  );

  return {
    contestId,
  };
}
