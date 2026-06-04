import { pool } from "../config/db.js";

function normalizeContextValue(value) {
  return value ? String(value).trim() : "";
}

function normalizeDraftContext({ problemId, contestId, contestProblemCode }) {
  return {
    problemId: Number(problemId),
    contestId: normalizeContextValue(contestId),
    contestProblemCode: normalizeContextValue(contestProblemCode),
  };
}

function mapDraftRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    userId: row.user_id,
    problemId: row.problem_id,
    contestId: row.contest_id || null,
    contestProblemCode: row.contest_problem_code || null,
    language: row.language,
    sourceCode: row.source_code,
    customInput: row.custom_input || "",
    updatedAt: row.updated_at,
  };
}

export async function getCodeDraft(userId, context) {
  const { problemId, contestId, contestProblemCode } =
    normalizeDraftContext(context);
  const [rows] = await pool.execute(
    `SELECT id, user_id, problem_id, contest_id, contest_problem_code,
            language, source_code, custom_input, updated_at
     FROM code_drafts
     WHERE user_id = ?
       AND problem_id = ?
       AND contest_id = ?
       AND contest_problem_code = ?
     LIMIT 1`,
    [userId, problemId, contestId, contestProblemCode],
  );

  return mapDraftRow(rows[0]);
}
// saves a user’s code draft, or updates the existing draft for the same problem/contest context
export async function saveCodeDraft(userId, payload) {
  const { problemId, contestId, contestProblemCode } =
    normalizeDraftContext(payload);

  await pool.execute(
    `INSERT INTO code_drafts
       (user_id, problem_id, contest_id, contest_problem_code, language,
        source_code, custom_input)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       language = VALUES(language),
       source_code = VALUES(source_code),
       custom_input = VALUES(custom_input),
       updated_at = CURRENT_TIMESTAMP`,
    [
      userId,
      problemId,
      contestId,
      contestProblemCode,
      payload.language,
      payload.sourceCode,
      payload.customInput || "",
    ],
  );

  return getCodeDraft(userId, { problemId, contestId, contestProblemCode });
}

export async function deleteCodeDraft(userId, context) {
  const { problemId, contestId, contestProblemCode } =
    normalizeDraftContext(context);

  await pool.execute(
    `DELETE FROM code_drafts
     WHERE user_id = ?
       AND problem_id = ?
       AND contest_id = ?
       AND contest_problem_code = ?`,
    [userId, problemId, contestId, contestProblemCode],
  );
}
