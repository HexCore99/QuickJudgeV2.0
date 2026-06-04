import bcrypt from "bcrypt";
import { pool } from "../config/db.js";
import { insertUserWithUniqueHandle } from "./userHandle.service.js";

function createServiceError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function toIsoString(value) {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function mapUserRow(row) {
  return {
    id: row.id,
    name: row.name,
    handle: row.userhandle || row.name,
    email: row.email,
    role: row.role,
    status: row.account_status || "active",
    joinedAt: toIsoString(row.created_at),
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
    suspendedUntil: toIsoString(row.suspended_until),
    suspendedReason: row.suspended_reason || "",
    bannedReason: row.banned_reason || "",
  };
}

async function expireTimedSuspensions(connection = pool) {
  await connection.execute(
    `UPDATE users
     SET account_status = 'active',
         suspended_until = NULL,
         suspended_reason = NULL
     WHERE account_status = 'suspended'
       AND suspended_until IS NOT NULL
       AND suspended_until <= NOW()`,
  );
}

async function getUserById(connection, userId) {
  const [rows] = await connection.execute(
    `SELECT id, name, userhandle, email, role, account_status, created_at, updated_at,
            suspended_until, suspended_reason, banned_reason
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

function ensureManageableUser(user) {
  if (user.role === "super_admin") {
    throw createServiceError("Super admin accounts are protected.", 403);
  }

  if (user.role !== "student" && user.role !== "admin") {
    throw createServiceError("This user role cannot be managed.", 400);
  }
}

export async function listAdminUsers() {
  await expireTimedSuspensions();

  const [rows] = await pool.execute(
    `SELECT id, name, userhandle, email, role, account_status, created_at, updated_at,
            suspended_until, suspended_reason, banned_reason
     FROM users
     ORDER BY
       CASE role
         WHEN 'super_admin' THEN 0
         WHEN 'admin' THEN 1
         ELSE 2
       END,
       id ASC`,
  );

  return rows.map(mapUserRow);
}

// creates a new admin account
export async function createAdminUser(payload) {
  const name = payload.name.trim();
  const email = payload.email.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(payload.password, 10);

  const [existingRows] = await pool.execute(
    `SELECT id FROM users WHERE email = ? LIMIT 1`,
    [email],
  );

  if (existingRows.length) {
    throw createServiceError("Email already exists.", 409);
  }

  const connection = await pool.getConnection();
  let result;

  try {
    await connection.beginTransaction();
    result = await insertUserWithUniqueHandle(connection, {
      name,
      email,
      passwordHash,
      role: "admin",
      accountStatus: "active",
    });
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  const row = await getUserById(pool, result.insertId);
  return mapUserRow(row);
}

export async function suspendUserAccount(userId, payload = {}) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await expireTimedSuspensions(connection);

    const user = await getUserById(connection, userId);
    ensureManageableUser(user);

    if (user.account_status === "banned") {
      throw createServiceError("Banned users cannot be suspended.", 400);
    }

    const suspendedUntil = payload.suspendedUntil
      ? new Date(payload.suspendedUntil)
      : null;

    await connection.execute(
      `UPDATE users
       SET account_status = 'suspended',
           suspended_until = ?,
           suspended_reason = ?,
           banned_reason = NULL
       WHERE id = ?`,
      [suspendedUntil, payload.reason?.trim() || null, userId],
    );

    await connection.commit();

    const row = await getUserById(pool, userId);
    return mapUserRow(row);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function unsuspendUserAccount(userId) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await expireTimedSuspensions(connection);

    const user = await getUserById(connection, userId);
    ensureManageableUser(user);

    if (user.account_status === "banned") {
      throw createServiceError("Banned users cannot be unsuspended.", 400);
    }

    await connection.execute(
      `UPDATE users
       SET account_status = 'active',
           suspended_until = NULL,
           suspended_reason = NULL
       WHERE id = ?`,
      [userId],
    );

    await connection.commit();

    const row = await getUserById(pool, userId);
    return mapUserRow(row);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function banUserAccount(userId, payload = {}) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await expireTimedSuspensions(connection);

    const user = await getUserById(connection, userId);
    ensureManageableUser(user);

    await connection.execute(
      `UPDATE users
       SET account_status = 'banned',
           suspended_until = NULL,
           suspended_reason = NULL,
           banned_reason = ?
       WHERE id = ?`,
      [payload.reason?.trim() || null, userId],
    );

    await connection.commit();

    const row = await getUserById(pool, userId);
    return mapUserRow(row);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// checks one user during login, and if their suspension time is over, it makes the account active again.
export async function activateExpiredSuspensionForLogin(user) {
  if (
    user.account_status !== "suspended" ||
    !user.suspended_until ||
    new Date(user.suspended_until).getTime() > Date.now()
  ) {
    return user;
  }

  await pool.execute(
    `UPDATE users
     SET account_status = 'active',
         suspended_until = NULL,
         suspended_reason = NULL
     WHERE id = ?`,
    [user.id],
  );

  return {
    ...user,
    account_status: "active",
    suspended_until: null,
    suspended_reason: null,
  };
}
