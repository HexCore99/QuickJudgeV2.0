import bcrypt from "bcrypt";
import { pool } from "../../config/db.js";
import {
  assignUserHandleFromName,
  ensureUserHandleSchema,
} from "../userHandle.service.js";
import {
  deleteAvatarFileSafely,
  getAvatarFilePathFromUrl,
} from "./avatar.service.js";
import { getProfileForUser } from "./read.service.js";
import {
  createServiceError,
  ensureProfileRow,
  getPublicId,
  getUserRow,
} from "./shared.service.js";

export async function updateProfileForUser(userId, payload) {
  await ensureUserHandleSchema();

  const user = await getUserRow(userId);
  await ensureProfileRow(user);

  const connection = await pool.getConnection();
  let previousAvatarUrl = "";
  let shouldDeletePreviousAvatar = false;
  const name = payload.name.trim();
  const email = payload.email?.trim().toLowerCase() || user.email;
  const department = payload.dept?.trim() || null;
  const bio = payload.bio?.trim() || null;
  const githubUrl = payload.git?.trim() || null;
  const avatarUrl = payload.avatarUrl?.trim() || null;
  const currentPassword = payload.currentPassword || "";
  const newPassword = payload.newPassword || "";
  const isEmailChanging = email !== user.email;
  const isPasswordChanging = Boolean(newPassword);

  try {
    await connection.beginTransaction();

    const [profileRows] = await connection.execute(
      `SELECT avatar_url
       FROM user_profiles
       WHERE user_id = ?
       LIMIT 1`,
      [userId],
    );
    previousAvatarUrl = profileRows[0]?.avatar_url || "";

    if (isEmailChanging || isPasswordChanging) {
      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password_hash || "",
      );

      if (!isCurrentPasswordValid) {
        throw createServiceError("Current password is incorrect.", 401);
      }
    }

    if (isEmailChanging) {
      const [existingUsers] = await connection.execute(
        `SELECT id
         FROM users
         WHERE email = ? AND id <> ?
         LIMIT 1`,
        [email, userId],
      );

      if (existingUsers.length) {
        throw createServiceError("Email already exists.", 409);
      }
    }

    if (isPasswordChanging) {
      const passwordHash = await bcrypt.hash(newPassword, 10);
      await connection.execute(
        `UPDATE users
         SET name = ?, email = ?, password_hash = ?
         WHERE id = ?`,
        [name, email, passwordHash, userId],
      );
    } else {
      await connection.execute(
        `UPDATE users
         SET name = ?, email = ?
         WHERE id = ?`,
        [name, email, userId],
      );
    }

    await assignUserHandleFromName(connection, userId, name);

    await connection.execute(
      `INSERT INTO user_profiles
       (user_id, public_id, department, bio, github_url, avatar_url)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         department = VALUES(department),
         bio = VALUES(bio),
         github_url = VALUES(github_url),
         avatar_url = VALUES(avatar_url),
         updated_at = CURRENT_TIMESTAMP`,
      [userId, getPublicId(user), department, bio, githubUrl, avatarUrl],
    );

    await connection.commit();
    shouldDeletePreviousAvatar = Boolean(
      previousAvatarUrl &&
      avatarUrl &&
      previousAvatarUrl !== avatarUrl &&
      getAvatarFilePathFromUrl(previousAvatarUrl),
    );
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  if (shouldDeletePreviousAvatar) {
    await deleteAvatarFileSafely(previousAvatarUrl);
  }

  return {
    ...(await getProfileForUser(userId)),
    passwordChanged: isPasswordChanging,
  };
}
