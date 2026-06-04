import { randomUUID } from "node:crypto";
import { pool } from "../config/db.js";

const USER_HANDLE_MAX_LENGTH = 150;
const USER_HANDLE_INDEX_NAME = "uniq_users_userhandle";

function getHandleBase(name) {
  return String(name || "").trim() || "user";
}

// this function shortens the base handle if needed, then adds a suffix at the end.
function fitHandleWithSuffix(base, suffix) {
  const suffixText = String(suffix);
  const maxBaseLength = Math.max(USER_HANDLE_MAX_LENGTH - suffixText.length, 1);
  return `${base.slice(0, maxBaseLength)}${suffixText}`;
}

function createPendingHandle() {
  return `__pending_${randomUUID()}`.slice(0, USER_HANDLE_MAX_LENGTH);
}

// checks whether a userhandle already belongs to another user.
async function isUserHandleTaken(connection, userhandle, excludeUserId = null) {
  const params = [userhandle];
  let sql = `SELECT id FROM users WHERE userhandle = ?`;

  if (excludeUserId) {
    sql += ` AND id <> ?`;
    params.push(excludeUserId);
  }

  sql += ` LIMIT 1`;

  const [rows] = await connection.execute(sql, params);
  return rows.length > 0;
}
// creates a unique alternative handle by adding the user ID, and if needed, extra attempt numbers.
async function getFallbackHandle(connection, base, userId) {
  let suffix = String(userId);
  let candidate = fitHandleWithSuffix(base, suffix);
  let attempt = 1;

  while (await isUserHandleTaken(connection, candidate, userId)) {
    suffix = `${userId}${attempt}`;
    candidate = fitHandleWithSuffix(base, suffix);
    attempt += 1;
  }

  return candidate;
}

export async function assignUserHandleFromName(connection, userId, name) {
  const base = getHandleBase(name);
  const userhandle = (await isUserHandleTaken(connection, base, userId))
    ? await getFallbackHandle(connection, base, userId)
    : base;

  await connection.execute(`UPDATE users SET userhandle = ? WHERE id = ?`, [
    userhandle,
    userId,
  ]);

  return userhandle;
}

async function insertUser(connection, payload, userhandle) {
  const columns = ["name", "userhandle", "email", "password_hash", "role"];
  const placeholders = ["?", "?", "?", "?", "?"];
  const values = [
    payload.name,
    userhandle,
    payload.email,
    payload.passwordHash,
    payload.role,
  ];

  // accoutnStatus = active,suspended,banned
  if (payload.accountStatus) {
    columns.push("account_status");
    placeholders.push("?");
    values.push(payload.accountStatus);
  }

  const [result] = await connection.execute(
    `INSERT INTO users (${columns.join(", ")})
     VALUES (${placeholders.join(", ")})`,
    values,
  );

  return result;
}

// checks whether a database error happened because the userhandle unique index was duplicated.
function isDuplicateUserHandleError(error) {
  if (error?.code !== "ER_DUP_ENTRY" && error?.errno !== 1062) {
    return false;
  }

  return String(error.sqlMessage || error.message || "").includes(
    USER_HANDLE_INDEX_NAME,
  );
}

export async function insertUserWithUniqueHandle(connection, payload) {
  const base = getHandleBase(payload.name);
  const baseHandleIsTaken = await isUserHandleTaken(connection, base);
  const initialHandle = baseHandleIsTaken ? createPendingHandle() : base;
  let result;
  let shouldApplyFallback = baseHandleIsTaken; //replace the temporary handle with a better fallback handle?

  try {
    result = await insertUser(connection, payload, initialHandle);
  } catch (error) {
    if (baseHandleIsTaken || !isDuplicateUserHandleError(error)) {
      throw error;
    }

    result = await insertUser(connection, payload, createPendingHandle());
    shouldApplyFallback = true;
  }

  if (!shouldApplyFallback) {
    return {
      insertId: result.insertId,
      userhandle: initialHandle,
    };
  }

  const userhandle = await assignUserHandleFromName(
    connection,
    result.insertId,
    payload.name,
  );

  return {
    insertId: result.insertId,
    userhandle,
  };
}
