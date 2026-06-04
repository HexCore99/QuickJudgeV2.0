import { pool } from "../config/db.js";

let userSessionSchemaPromise = null;

async function ensureUserSessionSchemaInternal() {
  const [rows] = await pool.execute(
    `SELECT COLUMN_NAME
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'users'
       AND COLUMN_NAME = 'active_session_id'
     LIMIT 1`,
  );

  if (!rows.length) {
    await pool.execute(
      `ALTER TABLE users
       ADD COLUMN active_session_id VARCHAR(64) NULL AFTER banned_reason`,
    );
  }
}

export async function ensureUserSessionSchema() {
  if (!userSessionSchemaPromise) {
    userSessionSchemaPromise = ensureUserSessionSchemaInternal().catch(
      (error) => {
        userSessionSchemaPromise = null;
        throw error;
      },
    );
  }

  return userSessionSchemaPromise;
}
