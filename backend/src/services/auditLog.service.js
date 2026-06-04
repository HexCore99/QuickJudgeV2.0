import { pool } from "../config/db.js";

const VALID_ROLES = new Set(["student", "admin", "super_admin"]);
const VALID_STATUSES = new Set(["success", "failed"]);
const DEFAULT_LIMIT = 200;

function normalizeRole(role) {
  return VALID_ROLES.has(role) ? role : null;
}

function normalizeStatus(status) {
  return status === "failed" ? "failed" : "success";
}

function toNullableString(value, maxLength) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return String(value).slice(0, maxLength);
}

function toNullableId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function serializeMetadata(metadata) {
  if (!metadata || typeof metadata !== "object") {
    return null;
  }

  try {
    return JSON.stringify(metadata);
  } catch {
    return null;
  }
}

function getClientIp(req) {
  const forwardedFor = req.headers?.["x-forwarded-for"];

  if (Array.isArray(forwardedFor) && forwardedFor.length) {
    return forwardedFor[0];
  }

  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.ip || req.socket?.remoteAddress || null;
}

function normalizeDateFilter(value) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? trimmed : null;
}

function normalizeLimit(value) {
  const limit = Number(value);

  if (!Number.isInteger(limit) || limit <= 0) {
    return DEFAULT_LIMIT;
  }

  return Math.min(limit, DEFAULT_LIMIT);
}

function mapAuditLogRow(row) {
  const actorEmail = row.actor_email || row.actor_current_email || "";
  const actorName = row.actor_name || "";
  const actorRole = row.actor_role || row.actor_current_role || "unknown";
  const targetEmail = row.target_email || row.target_current_email || "";
  const targetName = row.target_name || "";
  const targetLabel =
    row.target_label ||
    targetName ||
    targetEmail ||
    (row.target_id ? `${row.target_type || "target"} ${row.target_id}` : "");

  return {
    id: row.id,
    createdAt: row.created_at,
    actor: {
      id: row.actor_user_id,
      name: actorName,
      email: actorEmail,
      role: actorRole,
      label: actorName || actorEmail || "Unknown actor",
    },
    action: row.action,
    target: {
      type: row.target_type,
      id: row.target_id,
      userId: row.target_user_id,
      email: targetEmail,
      label: targetLabel || "Unknown target",
    },
    status: row.status,
    message: row.message || "",
    ipAddress: row.ip_address || "",
    userAgent: row.user_agent || "",
  };
}

// saves one audit log entry into the audit_logs table
export async function recordAuditLog(payload = {}) {
  try {
    const action = toNullableString(payload.action, 80) || "UNKNOWN_ACTION";

    await pool.execute(
      `INSERT INTO audit_logs
       (actor_user_id, actor_email, actor_role, action, target_type, target_id,
        target_label, target_user_id, target_email, status, message, metadata,
        ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        toNullableId(payload.actorUserId),
        toNullableString(payload.actorEmail, 150),
        normalizeRole(payload.actorRole),
        action,
        toNullableString(payload.targetType, 50),
        toNullableString(payload.targetId, 100),
        toNullableString(payload.targetLabel, 255),
        toNullableId(payload.targetUserId),
        toNullableString(payload.targetEmail, 150),
        normalizeStatus(payload.status),
        toNullableString(payload.message, 500),
        serializeMetadata(payload.metadata),
        toNullableString(payload.ipAddress, 64),
        toNullableString(payload.userAgent, 255),
      ],
    );
  } catch (error) {
    console.error("Audit log write error:", error);
  }
}

export async function recordAuditLogForRequest(req, payload = {}) {
  return recordAuditLog({
    ...payload,
    actorUserId: payload.actorUserId ?? req.user?.id,
    actorEmail: payload.actorEmail ?? req.user?.email,
    actorRole: payload.actorRole ?? req.user?.role,
    ipAddress: payload.ipAddress ?? getClientIp(req),
    userAgent: payload.userAgent ?? req.get?.("user-agent"),
  });
}

export async function listAuditLogs(filters = {}) {
  const conditions = [];
  const values = [];
  const search = typeof filters.search === "string" ? filters.search.trim() : "";
  const role = normalizeRole(filters.role);
  const status = VALID_STATUSES.has(filters.status) ? filters.status : null;
  const action =
    typeof filters.action === "string" && filters.action !== "all"
      ? filters.action.trim()
      : "";
  const dateFrom = normalizeDateFilter(filters.dateFrom);
  const dateTo = normalizeDateFilter(filters.dateTo);
  const limit = normalizeLimit(filters.limit);

  // l -> log table | au-> actor user table | tu->target user table
  if (search) {
    const likeSearch = `%${search}%`;
    conditions.push(
      `(l.actor_email LIKE ?
        OR au.name LIKE ?
        OR l.target_email LIKE ?
        OR tu.name LIKE ?
        OR l.target_label LIKE ?
        OR l.target_id LIKE ?
        OR l.action LIKE ?
        OR l.message LIKE ?)`,
    );
    values.push(
      likeSearch,
      likeSearch,
      likeSearch,
      likeSearch,
      likeSearch,
      likeSearch,
      likeSearch,
      likeSearch,
    );
  }

  if (role) {
    conditions.push("l.actor_role = ?");
    values.push(role);
  }

  if (action) {
    conditions.push("l.action = ?");
    values.push(action);
  }

  if (status) {
    conditions.push("l.status = ?");
    values.push(status);
  }

  if (dateFrom) {
    conditions.push("DATE(l.created_at) >= ?");
    values.push(dateFrom);
  }

  if (dateTo) {
    conditions.push("DATE(l.created_at) <= ?");
    values.push(dateTo);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const [rows] = await pool.execute(
    `SELECT
       l.id,
       l.actor_user_id,
       l.actor_email,
       l.actor_role,
       l.action,
       l.target_type,
       l.target_id,
       l.target_label,
       l.target_user_id,
       l.target_email,
       l.status,
       l.message,
       l.ip_address,
       l.user_agent,
       l.created_at,
       au.name AS actor_name,
       au.email AS actor_current_email,
       au.role AS actor_current_role,
       tu.name AS target_name,
       tu.email AS target_current_email
     FROM audit_logs l
     LEFT JOIN users au ON au.id = l.actor_user_id
     LEFT JOIN users tu ON tu.id = l.target_user_id
     ${whereClause}
     ORDER BY l.created_at DESC, l.id DESC
     LIMIT ?`,
    [...values, limit],
  );

  const [actionRows] = await pool.execute(
    `SELECT DISTINCT action
     FROM audit_logs
     ORDER BY action ASC`,
  );

  return {
    logs: rows.map(mapAuditLogRow),
    actions: actionRows.map((row) => row.action),
  };
}
