import json
import logging
import re

from flask import current_app, has_app_context

from config.db import execute_write, fetch_all

VALID_ROLES = {"student", "admin", "super_admin"}
VALID_STATUSES = {"success", "failed"}
DEFAULT_LIMIT = 200

_audit_logs_table_checked = False


def _normalize_role(role):
    return role if role in VALID_ROLES else None


def _normalize_status(status):
    return "failed" if status == "failed" else "success"


def _to_nullable_string(value, max_length):
    if value is None or value == "":
        return None

    return str(value)[:max_length]


def _to_nullable_id(value):
    try:
        numeric_id = int(value)
    except (TypeError, ValueError):
        return None

    return numeric_id if numeric_id > 0 else None


def _serialize_metadata(metadata):
    if not isinstance(metadata, dict):
        return None

    try:
        return json.dumps(metadata)
    except (TypeError, ValueError):
        return None


def _get_payload_value(payload, snake_key, camel_key):
    value = payload.get(snake_key)
    return payload.get(camel_key) if value is None else value


def _get_client_ip(req):
    forwarded_for = req.headers.get("X-Forwarded-For", "")

    if forwarded_for:
        return forwarded_for.split(",", 1)[0].strip()

    return req.remote_addr


def _normalize_date_filter(value):
    if not isinstance(value, str):
        return None

    trimmed = value.strip()
    return trimmed if re.match(r"^\d{4}-\d{2}-\d{2}$", trimmed) else None


def _normalize_limit(value):
    try:
        limit = int(value)
    except (TypeError, ValueError):
        return DEFAULT_LIMIT

    if limit <= 0:
        return DEFAULT_LIMIT

    return min(limit, DEFAULT_LIMIT)


def _map_audit_log_row(row):
    actor_email = row.get("actor_email") or row.get("actor_current_email") or ""
    actor_name = row.get("actor_name") or ""
    actor_role = row.get("actor_role") or row.get("actor_current_role") or "unknown"
    target_email = row.get("target_email") or row.get("target_current_email") or ""
    target_name = row.get("target_name") or ""
    target_label = (
        row.get("target_label")
        or target_name
        or target_email
        or (
            f"{row.get('target_type') or 'target'} {row.get('target_id')}"
            if row.get("target_id")
            else ""
        )
    )

    return {
        "id": row.get("id"),
        "createdAt": (
            row.get("created_at").isoformat()
            if hasattr(row.get("created_at"), "isoformat")
            else row.get("created_at")
        ),
        "actor": {
            "id": row.get("actor_user_id"),
            "name": actor_name,
            "email": actor_email,
            "role": actor_role,
            "label": actor_name or actor_email or "Unknown actor",
        },
        "action": row.get("action"),
        "target": {
            "type": row.get("target_type"),
            "id": row.get("target_id"),
            "userId": row.get("target_user_id"),
            "email": target_email,
            "label": target_label or "Unknown target",
        },
        "status": row.get("status"),
        "message": row.get("message") or "",
        "ipAddress": row.get("ip_address") or "",
        "userAgent": row.get("user_agent") or "",
    }


def _log_audit_error():
    if has_app_context():
        current_app.logger.exception("Audit log write error")
    else:
        logging.exception("Audit log write error")


def ensure_audit_logs_table():
    global _audit_logs_table_checked

    if _audit_logs_table_checked:
        return

    execute_write(
        """
        CREATE TABLE IF NOT EXISTS audit_logs (
          id BIGINT NOT NULL AUTO_INCREMENT,
          actor_user_id INT NULL,
          actor_email VARCHAR(150) NULL,
          actor_role VARCHAR(30) NULL,
          action VARCHAR(80) NOT NULL,
          target_type VARCHAR(50) NULL,
          target_id VARCHAR(100) NULL,
          target_label VARCHAR(255) NULL,
          target_user_id INT NULL,
          target_email VARCHAR(150) NULL,
          status ENUM('success', 'failed') NOT NULL DEFAULT 'success',
          message VARCHAR(500) NULL,
          metadata LONGTEXT NULL,
          ip_address VARCHAR(64) NULL,
          user_agent VARCHAR(255) NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          KEY idx_audit_logs_created_at (created_at),
          KEY idx_audit_logs_actor_role (actor_role),
          KEY idx_audit_logs_action (action),
          KEY idx_audit_logs_status (status),
          KEY idx_audit_logs_actor_user (actor_user_id),
          KEY idx_audit_logs_target_user (target_user_id),
          CONSTRAINT fk_audit_logs_actor
            FOREIGN KEY (actor_user_id) REFERENCES users (id)
            ON DELETE SET NULL,
          CONSTRAINT fk_audit_logs_target_user
            FOREIGN KEY (target_user_id) REFERENCES users (id)
            ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
        """,
    )

    _audit_logs_table_checked = True


def record_audit_log(payload=None):
    payload = payload or {}

    try:
        ensure_audit_logs_table()

        action = (
            _to_nullable_string(
                _get_payload_value(payload, "action", "action"),
                80,
            )
            or "UNKNOWN_ACTION"
        )

        execute_write(
            """
            INSERT INTO audit_logs
              (actor_user_id, actor_email, actor_role, action, target_type,
               target_id, target_label, target_user_id, target_email, status,
               message, metadata, ip_address, user_agent)
            VALUES
              (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                _to_nullable_id(
                    _get_payload_value(payload, "actor_user_id", "actorUserId"),
                ),
                _to_nullable_string(
                    _get_payload_value(payload, "actor_email", "actorEmail"),
                    150,
                ),
                _normalize_role(
                    _get_payload_value(payload, "actor_role", "actorRole"),
                ),
                action,
                _to_nullable_string(
                    _get_payload_value(payload, "target_type", "targetType"),
                    50,
                ),
                _to_nullable_string(
                    _get_payload_value(payload, "target_id", "targetId"),
                    100,
                ),
                _to_nullable_string(
                    _get_payload_value(payload, "target_label", "targetLabel"),
                    255,
                ),
                _to_nullable_id(
                    _get_payload_value(payload, "target_user_id", "targetUserId"),
                ),
                _to_nullable_string(
                    _get_payload_value(payload, "target_email", "targetEmail"),
                    150,
                ),
                _normalize_status(
                    _get_payload_value(payload, "status", "status"),
                ),
                _to_nullable_string(
                    _get_payload_value(payload, "message", "message"),
                    500,
                ),
                _serialize_metadata(
                    _get_payload_value(payload, "metadata", "metadata"),
                ),
                _to_nullable_string(
                    _get_payload_value(payload, "ip_address", "ipAddress"),
                    64,
                ),
                _to_nullable_string(
                    _get_payload_value(payload, "user_agent", "userAgent"),
                    255,
                ),
            ),
        )
    except Exception:
        _log_audit_error()


def record_audit_log_for_request(req, payload=None):
    payload = payload or {}
    user = getattr(req, "user", {}) or {}

    record_audit_log(
        {
            **payload,
            "actor_user_id": payload.get(
                "actor_user_id",
                payload.get("actorUserId", user.get("id")),
            ),
            "actor_email": payload.get(
                "actor_email",
                payload.get("actorEmail", user.get("email")),
            ),
            "actor_role": payload.get(
                "actor_role",
                payload.get("actorRole", user.get("role")),
            ),
            "ip_address": payload.get(
                "ip_address",
                payload.get("ipAddress", _get_client_ip(req)),
            ),
            "user_agent": payload.get(
                "user_agent",
                payload.get("userAgent", req.headers.get("User-Agent")),
            ),
        },
    )


def list_audit_logs(filters=None):
    filters = filters or {}
    ensure_audit_logs_table()

    conditions = []
    values = []
    search = filters.get("search", "").strip() if isinstance(filters.get("search"), str) else ""
    role = _normalize_role(filters.get("role"))
    status = filters.get("status") if filters.get("status") in VALID_STATUSES else None
    action = (
        filters.get("action", "").strip()
        if isinstance(filters.get("action"), str) and filters.get("action") != "all"
        else ""
    )
    date_from = _normalize_date_filter(filters.get("dateFrom"))
    date_to = _normalize_date_filter(filters.get("dateTo"))
    limit = _normalize_limit(filters.get("limit"))

    if search:
        like_search = f"%{search}%"
        conditions.append(
            """
            (l.actor_email LIKE %s
              OR au.name LIKE %s
              OR l.target_email LIKE %s
              OR tu.name LIKE %s
              OR l.target_label LIKE %s
              OR l.target_id LIKE %s
              OR l.action LIKE %s
              OR l.message LIKE %s)
            """,
        )
        values.extend([like_search] * 8)

    if role:
        conditions.append("l.actor_role = %s")
        values.append(role)

    if action:
        conditions.append("l.action = %s")
        values.append(action)

    if status:
        conditions.append("l.status = %s")
        values.append(status)

    if date_from:
        conditions.append("DATE(l.created_at) >= %s")
        values.append(date_from)

    if date_to:
        conditions.append("DATE(l.created_at) <= %s")
        values.append(date_to)

    where_clause = f"WHERE {' AND '.join(conditions)}" if conditions else ""

    rows = fetch_all(
        f"""
        SELECT
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
        {where_clause}
        ORDER BY l.created_at DESC, l.id DESC
        LIMIT %s
        """,
        tuple(values + [limit]),
    )

    action_rows = fetch_all(
        """
        SELECT DISTINCT action
        FROM audit_logs
        ORDER BY action ASC
        """,
    )

    return {
        "logs": [_map_audit_log_row(row) for row in rows],
        "actions": [row.get("action") for row in action_rows],
    }
