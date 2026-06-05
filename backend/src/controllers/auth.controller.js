import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto, { randomUUID } from "node:crypto";
import { pool } from "../config/db.js";
import { activateExpiredSuspensionForLogin } from "../services/adminUsers.service.js";
import { recordAuditLogForRequest } from "../services/auditLog.service.js";
import { ensureUserSessionSchema } from "../services/userSession.service.js";
import { insertUserWithUniqueHandle } from "../services/userHandle.service.js";
import sendPasswordResetEmail from "../utils/mailer.js";
import { validateStrongPassword } from "../validators/password.validator.js";

const PASSWORD_RESET_SUCCESS_MESSAGE =
  "If that email exists, a reset link has been sent.";
const PASSWORD_RESET_WINDOW_MINUTES = 15;

function hashResetToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function getFrontendUrl() {
  return (process.env.FRONTEND_URL || "http://localhost:5173").replace(
    /\/+$/,
    "",
  );
}

function createToken(user, sessionId) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      sessionId,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
}

function formatSuspendedUntil(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getSuspendedLoginMessage(user) {
  const formattedUntil = user.suspended_until
    ? formatSuspendedUntil(user.suspended_until)
    : null;

  if (formattedUntil) {
    return `This account is temporarily suspended. You can log back in after ${formattedUntil}.`;
  }

  return "This account is suspended. No restore time is scheduled.";
}

export async function signup(req, res) {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const email =
    typeof req.body?.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";
  const password = req.body?.password;

  try {
    // save signup error log
    if (!name || !email || !password) {
      await recordAuditLogForRequest(req, {
        actorEmail: email || null,
        actorRole: "student",
        action: "CREATE_ACCOUNT",
        targetType: "user",
        targetEmail: email || null,
        targetLabel: name || email || "Signup attempt",
        status: "failed",
        message: "Name, email and password are required",
      });
      return res.status(400).json({
        success: false,
        message: "Name,email and password are required",
      });
    }
    const passwordError = validateStrongPassword(password);

    if (passwordError) {
      await recordAuditLogForRequest(req, {
        actorEmail: email,
        actorRole: "student",
        action: "CREATE_ACCOUNT",
        targetType: "user",
        targetEmail: email,
        targetLabel: name,
        status: "failed",
        message: passwordError,
      });
      return res.status(400).json({
        success: false,
        message: passwordError,
      });
    }

    await ensureUserSessionSchema();

    const [existingUsers] = await pool.execute(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );

    // save email already exist log
    if (existingUsers.length > 0) {
      await recordAuditLogForRequest(req, {
        actorEmail: email,
        actorRole: "student",
        action: "CREATE_ACCOUNT",
        targetType: "user",
        targetEmail: email,
        targetLabel: name,
        status: "failed",
        message: "Email already exists",
      });
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const sessionId = randomUUID();
    const connection = await pool.getConnection();
    let result;

    try {
      await connection.beginTransaction();
      result = await insertUserWithUniqueHandle(connection, {
        name,
        email,
        passwordHash,
        role: "student",
      });
      // saves the newly created login session ID
      await connection.execute(
        `UPDATE users
         SET active_session_id = ?
         WHERE id = ?`,
        [sessionId, result.insertId],
      );
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

    const user = {
      id: result.insertId,
      name,
      handle: result.userhandle,
      email,
      role: "student",
      accountStatus: "active",
    };
    const token = createToken(user, sessionId);

    // record successful account created log
    await recordAuditLogForRequest(req, {
      actorUserId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      action: "CREATE_ACCOUNT",
      targetType: "user",
      targetId: user.id,
      targetUserId: user.id,
      targetEmail: user.email,
      targetLabel: user.handle || user.name,
      status: "success",
      message: "Student account created",
    });

    return res.status(201).json({
      success: true,
      message: "Signup Successful",
      user,
      token,
    });
  } catch (err) {
    console.error("Signup error: ", err);
    await recordAuditLogForRequest(req, {
      actorEmail: email || null,
      actorRole: "student",
      action: "CREATE_ACCOUNT",
      targetType: "user",
      targetEmail: email || null,
      targetLabel: name || email || "Signup attempt",
      status: "failed",
      message: err.message || "Signup failed",
    });

    return res.status(500).json({
      success: false,
      message: "Signup failed",
    });
  }
}

export async function login(req, res) {
  const email =
    typeof req.body?.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";
  const password = req.body?.password;

  try {
    if (!email || !password) {
      await recordAuditLogForRequest(req, {
        actorEmail: email || null,
        action: "LOGIN",
        targetType: "user",
        targetEmail: email || null,
        targetLabel: email || "Login attempt",
        status: "failed",
        message: "Email and password are required",
      });
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    await ensureUserSessionSchema();

    const [users] = await pool.execute(
      `SELECT id, name, userhandle, email, password_hash, role, account_status,
              suspended_until
       FROM users
       WHERE email = ?`,
      [email],
    );

    if (users.length === 0) {
      await recordAuditLogForRequest(req, {
        actorEmail: email,
        action: "LOGIN",
        targetType: "user",
        targetEmail: email,
        targetLabel: email,
        status: "failed",
        message: "Invalid email or password",
      });
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const foundUser = await activateExpiredSuspensionForLogin(users[0]);
    const isPasswordMatched = await bcrypt.compare(
      password,
      foundUser.password_hash,
    );
    if (!isPasswordMatched) {
      await recordAuditLogForRequest(req, {
        actorUserId: foundUser.id,
        actorEmail: foundUser.email,
        actorRole: foundUser.role,
        action: "LOGIN",
        targetType: "user",
        targetId: foundUser.id,
        targetUserId: foundUser.id,
        targetEmail: foundUser.email,
        targetLabel: foundUser.userhandle || foundUser.name,
        status: "failed",
        message: "Invalid email or password",
      });
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (foundUser.account_status === "banned") {
      await recordAuditLogForRequest(req, {
        actorUserId: foundUser.id,
        actorEmail: foundUser.email,
        actorRole: foundUser.role,
        action: "LOGIN",
        targetType: "user",
        targetId: foundUser.id,
        targetUserId: foundUser.id,
        targetEmail: foundUser.email,
        targetLabel: foundUser.userhandle || foundUser.name,
        status: "failed",
        message: "This account is banned.",
      });
      return res.status(403).json({
        success: false,
        message: "This account is banned.",
      });
    }

    if (foundUser.account_status === "suspended") {
      const suspendedMessage = getSuspendedLoginMessage(foundUser);

      await recordAuditLogForRequest(req, {
        actorUserId: foundUser.id,
        actorEmail: foundUser.email,
        actorRole: foundUser.role,
        action: "LOGIN",
        targetType: "user",
        targetId: foundUser.id,
        targetUserId: foundUser.id,
        targetEmail: foundUser.email,
        targetLabel: foundUser.userhandle || foundUser.name,
        status: "failed",
        message: suspendedMessage,
      });
      return res.status(403).json({
        success: false,
        message: suspendedMessage,
      });
    }

    // successfull login part
    const user = {
      id: foundUser.id,
      name: foundUser.name,
      handle: foundUser.userhandle || foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
      accountStatus: foundUser.account_status || "active",
    };
    const sessionId = randomUUID();

    await pool.execute(
      `UPDATE users
       SET active_session_id = ?
       WHERE id = ?`,
      [sessionId, user.id],
    );

    const token = createToken(user, sessionId);

    await recordAuditLogForRequest(req, {
      actorUserId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      action: "LOGIN",
      targetType: "user",
      targetId: user.id,
      targetUserId: user.id,
      targetEmail: user.email,
      targetLabel: user.handle || user.name,
      status: "success",
      message: "Login successful",
    });

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      user,
      token,
    });
  } catch (err) {
    console.error("Login Error: ", err);
    await recordAuditLogForRequest(req, {
      actorEmail: email || null,
      action: "LOGIN",
      targetType: "user",
      targetEmail: email || null,
      targetLabel: email || "Login attempt",
      status: "failed",
      message: err.message || "Login failed",
    });

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
}

export async function forgotPassword(req, res) {
  const email =
    typeof req.body?.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";

  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const [users] = await pool.execute(
      "SELECT id, email FROM users WHERE email = ? LIMIT 1",
      [email],
    );

    // creates a secure password reset token
    if (users.length > 0) {
      const user = users[0];
      const rawToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = hashResetToken(rawToken);

      await pool.execute(
        `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
         VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? MINUTE))`,
        [user.id, tokenHash, PASSWORD_RESET_WINDOW_MINUTES],
      );

      const resetLink = `${getFrontendUrl()}/reset-password/${rawToken}`;

      try {
        await sendPasswordResetEmail(user.email, resetLink);
      } catch (mailError) {
        console.error("Password reset email error: ", mailError);
      }
    }

    return res.status(200).json({
      success: true,
      message: PASSWORD_RESET_SUCCESS_MESSAGE,
    });
  } catch (err) {
    console.error("Forgot password error: ", err);
    return res.status(500).json({
      success: false,
      message: "Failed to process password reset request",
    });
  }
}

export async function resetPassword(req, res) {
  const token =
    typeof req.body?.token === "string" ? req.body.token.trim() : "";
  const password = req.body?.password;

  try {
    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and password are required",
      });
    }

    const passwordError = validateStrongPassword(password);

    if (passwordError) {
      return res.status(400).json({
        success: false,
        message: passwordError,
      });
    }

    const tokenHash = hashResetToken(token);

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [tokens] = await connection.execute(
        `SELECT id, user_id
         FROM password_reset_tokens
         WHERE token_hash = ?
           AND used_at IS NULL
           AND expires_at > NOW()
         LIMIT 1`,
        [tokenHash],
      );

      if (tokens.length === 0) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: "Invalid or expired reset token",
        });
      }

      const resetToken = tokens[0];
      const passwordHash = await bcrypt.hash(password, 10);

      await connection.execute(
        `UPDATE users
         SET password_hash = ?
         WHERE id = ?`,
        [passwordHash, resetToken.user_id],
      );

      const [tokenUpdate] = await connection.execute(
        `UPDATE password_reset_tokens
         SET used_at = NOW()
         WHERE id = ?
           AND used_at IS NULL`,
        [resetToken.id],
      );

      if (tokenUpdate.affectedRows === 0) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: "Invalid or expired reset token",
        });
      }

      await connection.commit();

      return res.status(200).json({
        success: true,
        message: "Password reset successful",
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("Reset password error: ", err);
    return res.status(500).json({
      success: false,
      message: "Password reset failed",
    });
  }
}

/*
:resp
return res.status(400).json({
  success: false,
  message: "",
});

*/
