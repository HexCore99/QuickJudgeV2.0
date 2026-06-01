import { pool } from "../../config/db.js";

export function createServiceError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

export function toDate(value) {
  return value instanceof Date ? value : new Date(value);
}

export function getPublicId(user) {
  const year = user.created_at
    ? toDate(user.created_at).getFullYear()
    : new Date().getFullYear();
  return `QJ-${year}-${String(user.id).padStart(4, "0")}`;
}

export function getRatingTier(rating) {
  if (rating <= 0) return "UNRATED";
  if (rating >= 2400) return "MASTER";
  if (rating >= 2000) return "ELITE";
  if (rating >= 1600) return "EXPERT";
  if (rating >= 1200) return "PUPIL";
  return "NEWBIE";
}

export async function getUserRow(userId) {
  const [rows] = await pool.execute(
    `SELECT id, name, userhandle, email, password_hash, role, created_at
     FROM users
     WHERE id = ?
     LIMIT 1`,
    [userId],
  );

  if (!rows.length) {
    throw createServiceError("User not found.", 404);
  }

  return rows[0];
}

export async function ensureProfileRow(user) {
  await pool.execute(
    `INSERT INTO user_profiles (user_id, public_id, rating, rating_tier)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE user_id = user_id`,
    [user.id, getPublicId(user), 0, "UNRATED"],
  );
}

export async function getProfileRow(userId) {
  const [rows] = await pool.execute(
    `SELECT user_id, public_id, department, bio, github_url, avatar_url,
            rating, rating_delta, rating_tier, global_rank, rank_delta,
            solved_count, solved_delta, total_submissions, current_streak,
            best_streak, contest_count, rated_contest_count, created_at, updated_at
     FROM user_profiles
     WHERE user_id = ?
     LIMIT 1`,
    [userId],
  );

  return rows[0] || null;
}
