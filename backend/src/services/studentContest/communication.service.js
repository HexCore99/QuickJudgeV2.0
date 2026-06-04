import { pool } from "../../config/db.js";
import {
  createServiceError,
  ensureContestNotEnded,
  mapAnnouncementRow,
  mapQueryRow,
} from "../contest/contestShared.service.js";

export async function getContestAnnouncements(contestId) {
  // get announcements
  const [rows] = await pool.execute(
    `SELECT id, title, body, posted_at
     FROM contest_announcements
     WHERE contest_id = ?
     ORDER BY posted_at DESC`,
    [contestId],
  );

  return rows.map((row)=>mapAnnouncementRow(row));
}

export async function getContestQueries(contestId) {
  const [rows] = await pool.execute(
    `SELECT id, user_id, username, question, answer, status, created_at, answered_at
     FROM contest_queries
     WHERE contest_id = ?
     ORDER BY created_at DESC`,
    [contestId],
  );

  return rows.map(mapQueryRow);
}

export async function submitContestQuery(userId, contestId, question) {
  if (!question || !question.trim()) {
    throw createServiceError("Question cannot be empty.", 400);
  }

  await ensureContestNotEnded(
    contestId,
    "Contest has ended. Queries cannot be sent.",
  );

  const [contestRows] = await pool.execute(
    `SELECT id
     FROM contests
     WHERE id = ?
     LIMIT 1`,
    [contestId],
  );

  if (!contestRows.length) {
    throw createServiceError("Contest not found.", 404);
  }

  const [userRows] = await pool.execute(
    `SELECT name FROM users WHERE id = ? LIMIT 1`,
    [userId],
  );

  const username = userRows.length ? userRows[0].name : "Unknown";

  // insert into query table
  const [result] = await pool.execute(
    `INSERT INTO contest_queries (contest_id, user_id, username, question)
     VALUES (?, ?, ?, ?)`,
    [contestId, userId, username, question.trim()],
  );

  return {
    id: result.insertId,
    contestId,
    userId,
    username,
    question: question.trim(),
    answer: null,
    status: "pending",
    createdAt: new Date(),
    answeredAt: null,
  };
}
