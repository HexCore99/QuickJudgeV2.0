import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
import { ensureUserSessionSchema } from "../services/userSession.service.js";

const ADMIN_ROLES = ["admin", "super_admin"];
const SESSION_EXPIRED_MESSAGE =
  "Session expired because this account logged in somewhere else.";

async function getActiveUserFromToken(decoded) {
  await ensureUserSessionSchema();

  const [rows] = await pool.execute(
    `SELECT id, email, role, account_status, suspended_until, active_session_id
     FROM users
     WHERE id = ?
     LIMIT 1`,
    [decoded.id],
  );

  if (!rows.length) {
    return null;
  }

  const user = rows[0];

  if (
    user.account_status === "suspended" &&
    user.suspended_until &&
    new Date(user.suspended_until).getTime() <= Date.now()
  ) {
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
    };
  }

  return user;
}

export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.sessionId) {
      return res.status(401).json({
        success: false,
        message: SESSION_EXPIRED_MESSAGE,
      });
    }

    const user = await getActiveUserFromToken(decoded);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    if (user.account_status === "banned") {
      return res.status(403).json({
        success: false,
        message: "This account is banned.",
      });
    }

    if (user.account_status === "suspended") {
      return res.status(403).json({
        success: false,
        message: user.suspended_until
          ? "This account is temporarily suspended."
          : "This account is suspended.",
      });
    }

    if (decoded.sessionId !== user.active_session_id) {
      return res.status(401).json({
        success: false,
        message: SESSION_EXPIRED_MESSAGE,
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      sessionId: decoded.sessionId,
    };

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || !ADMIN_ROLES.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
}

export function requireSuperAdmin(req, res, next) {
  if (!req.user || req.user.role !== "super_admin") {
    return res.status(403).json({
      success: false,
      message: "Super admin access required",
    });
  }

  next();
}
