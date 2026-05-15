import os
from datetime import datetime
from functools import wraps

import jwt
from flask import jsonify, request

from config.db import execute_write, fetch_one
from services.user_session_service import ensure_user_session_schema

ADMIN_ROLES = ["admin", "super_admin"]
SESSION_EXPIRED_MESSAGE = (
    "Session expired because this account logged in somewhere else."
)


def normalize_datetime(value):
    if not value:
        return None

    if isinstance(value, datetime):
        return value

    try:
        return datetime.fromisoformat(str(value))
    except ValueError:
        return None


def get_active_user_from_token(decoded):
    ensure_user_session_schema()

    user = fetch_one(
        """
        SELECT id, email, role, account_status, suspended_until,
               active_session_id
        FROM users
        WHERE id = %s
        LIMIT 1
        """,
        (decoded.get("id"),),
    )

    if not user:
        return None

    suspended_until = normalize_datetime(user.get("suspended_until"))

    if (
        user.get("account_status") == "suspended"
        and suspended_until
        and suspended_until <= datetime.now()
    ):
        execute_write(
            """
            UPDATE users
            SET account_status = 'active',
                suspended_until = NULL,
                suspended_reason = NULL
            WHERE id = %s
            """,
            (user["id"],),
        )

        return {
            **user,
            "account_status": "active",
            "suspended_until": None,
        }

    return user


def require_auth(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")

        if not auth_header.startswith("Bearer "):
            return jsonify(
                {
                    "success": False,
                    "message": "Unauthorized",
                },
            ), 401

        try:
            token = auth_header.split(" ", 1)[1]
            decoded = jwt.decode(
                token,
                os.getenv("JWT_SECRET", "change_this_secret"),
                algorithms=["HS256"],
            )

            if not decoded.get("sessionId"):
                return jsonify(
                    {
                        "success": False,
                        "message": SESSION_EXPIRED_MESSAGE,
                    },
                ), 401

            user = get_active_user_from_token(decoded)

            if not user:
                return jsonify(
                    {
                        "success": False,
                        "message": "Invalid or expired token",
                    },
                ), 401

            if user.get("account_status") == "banned":
                return jsonify(
                    {
                        "success": False,
                        "message": "This account is banned.",
                    },
                ), 403

            if user.get("account_status") == "suspended":
                return jsonify(
                    {
                        "success": False,
                        "message": (
                            "This account is temporarily suspended."
                            if user.get("suspended_until")
                            else "This account is suspended."
                        ),
                    },
                ), 403

            if decoded.get("sessionId") != user.get("active_session_id"):
                return jsonify(
                    {
                        "success": False,
                        "message": SESSION_EXPIRED_MESSAGE,
                    },
                ), 401

            request.user = {
                "id": user["id"],
                "email": user["email"],
                "role": user["role"],
                "sessionId": decoded["sessionId"],
            }

            return view(*args, **kwargs)
        except jwt.PyJWTError:
            return jsonify(
                {
                    "success": False,
                    "message": "Invalid or expired token",
                },
            ), 401

    return wrapped


def require_admin(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        user = getattr(request, "user", None)

        if not user or user.get("role") not in ADMIN_ROLES:
            return jsonify(
                {
                    "success": False,
                    "message": "Admin access required",
                },
            ), 403

        return view(*args, **kwargs)

    return wrapped


def require_super_admin(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        user = getattr(request, "user", None)

        if not user or user.get("role") != "super_admin":
            return jsonify(
                {
                    "success": False,
                    "message": "Super admin access required",
                },
            ), 403

        return view(*args, **kwargs)

    return wrapped
