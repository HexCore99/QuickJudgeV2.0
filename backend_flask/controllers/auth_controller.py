import hashlib
import os
import secrets
from datetime import datetime, timedelta, timezone
from uuid import uuid4

import bcrypt
import jwt
from flask import current_app, jsonify, request

from config.db import execute_write, fetch_one, get_connection
from services.password_reset_service import ensure_password_reset_token_schema
from services.user_handle_service import (
    ensure_user_handle_schema,
    insert_user_with_unique_handle,
)
from services.user_session_service import ensure_user_session_schema
from utils.mailer import send_password_reset_email

PASSWORD_RESET_SUCCESS_MESSAGE = (
    "If that email exists, a reset link has been sent."
)
PASSWORD_RESET_WINDOW_MINUTES = 15


def hash_reset_token(token):
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def get_frontend_url():
    return (os.getenv("FRONTEND_URL") or "http://localhost:5180").rstrip("/")


def create_token(user, session_id):
    payload = {
        "id": user["id"],
        "email": user["email"],
        "role": user["role"],
        "sessionId": session_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
    }

    token = jwt.encode(
        payload,
        os.getenv("JWT_SECRET", "change_this_secret"),
        algorithm="HS256",
    )

    return token.decode("utf-8") if isinstance(token, bytes) else token


def normalize_datetime(value):
    if not value:
        return None

    if isinstance(value, datetime):
        return value

    try:
        return datetime.fromisoformat(str(value))
    except ValueError:
        return None


def format_suspended_until(value):
    suspended_until = normalize_datetime(value)

    if not suspended_until:
        return None

    return suspended_until.strftime("%b %d, %Y, %I:%M %p")


def get_suspended_login_message(user):
    formatted_until = format_suspended_until(user.get("suspended_until"))

    if formatted_until:
        return (
            "This account is temporarily suspended. "
            f"You can log back in after {formatted_until}."
        )

    return "This account is suspended. No restore time is scheduled."


def activate_expired_suspension_for_login(user):
    if user.get("account_status") != "suspended":
        return user

    suspended_until = normalize_datetime(user.get("suspended_until"))

    if not suspended_until or suspended_until > datetime.now():
        return user

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
        "suspended_reason": None,
    }


def signup():
    body = request.get_json(silent=True) or {}
    name = body.get("name").strip() if isinstance(body.get("name"), str) else ""
    email = (
        body.get("email").strip().lower()
        if isinstance(body.get("email"), str)
        else ""
    )
    password = body.get("password")

    try:
        if not name or not email or not password:
            return jsonify(
                {
                    "success": False,
                    "message": "Name,email and password are required",
                },
            ), 400

        if not isinstance(password, str) or len(password) < 6:
            return jsonify(
                {
                    "success": False,
                    "message": "Password must be at least 6 characters",
                },
            ), 400

        ensure_user_handle_schema()
        ensure_user_session_schema()

        existing_user = fetch_one(
            "SELECT id FROM users WHERE email = %s",
            (email,),
        )

        if existing_user:
            return jsonify(
                {
                    "success": False,
                    "message": "Email already exists",
                },
            ), 409

        password_hash = bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt(rounds=10),
        ).decode("utf-8")
        session_id = str(uuid4())
        connection = get_connection()

        try:
            connection.autocommit(False)
            connection.begin()

            result = insert_user_with_unique_handle(
                connection,
                {
                    "name": name,
                    "email": email,
                    "password_hash": password_hash,
                    "role": "student",
                    "account_status": "active",
                },
            )

            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    UPDATE users
                    SET active_session_id = %s
                    WHERE id = %s
                    """,
                    (session_id, result["insert_id"]),
                )

            connection.commit()
        except Exception:
            connection.rollback()
            raise
        finally:
            connection.close()

        user = {
            "id": result["insert_id"],
            "name": name,
            "handle": result["userhandle"],
            "email": email,
            "role": "student",
            "accountStatus": "active",
        }
        token = create_token(user, session_id)

        return jsonify(
            {
                "success": True,
                "message": "Signup Successful",
                "user": user,
                "token": token,
            },
        ), 201
    except Exception:
        current_app.logger.exception("Signup error")
        return jsonify(
            {
                "success": False,
                "message": "Signup failed",
            },
        ), 500


def login():
    body = request.get_json(silent=True) or {}
    email = (
        body.get("email").strip().lower()
        if isinstance(body.get("email"), str)
        else ""
    )
    password = body.get("password")

    try:
        if not email or not password:
            return jsonify(
                {
                    "success": False,
                    "message": "Email and password are required",
                },
            ), 400

        ensure_user_handle_schema()
        ensure_user_session_schema()

        found_user = fetch_one(
            """
            SELECT id, name, userhandle, email, password_hash, role,
                   account_status, suspended_until
            FROM users
            WHERE email = %s
            LIMIT 1
            """,
            (email,),
        )

        if not found_user:
            return jsonify(
                {
                    "success": False,
                    "message": "Invalid email or password",
                },
            ), 401

        found_user = activate_expired_suspension_for_login(found_user)

        try:
            is_password_matched = bcrypt.checkpw(
                password.encode("utf-8"),
                found_user["password_hash"].encode("utf-8"),
            )
        except ValueError:
            is_password_matched = False

        if not is_password_matched:
            return jsonify(
                {
                    "success": False,
                    "message": "Invalid email or password",
                },
            ), 401

        if found_user.get("account_status") == "banned":
            return jsonify(
                {
                    "success": False,
                    "message": "This account is banned.",
                },
            ), 403

        if found_user.get("account_status") == "suspended":
            return jsonify(
                {
                    "success": False,
                    "message": get_suspended_login_message(found_user),
                },
            ), 403

        user = {
            "id": found_user["id"],
            "name": found_user["name"],
            "handle": found_user.get("userhandle") or found_user["name"],
            "email": found_user["email"],
            "role": found_user["role"],
            "accountStatus": found_user.get("account_status") or "active",
        }
        session_id = str(uuid4())

        execute_write(
            """
            UPDATE users
            SET active_session_id = %s
            WHERE id = %s
            """,
            (session_id, user["id"]),
        )

        token = create_token(user, session_id)

        return jsonify(
            {
                "success": True,
                "message": "Login Successful",
                "user": user,
                "token": token,
            },
        ), 200
    except Exception:
        current_app.logger.exception("Login error")
        return jsonify(
            {
                "success": False,
                "message": "Login failed",
            },
        ), 500


def forgot_password():
    body = request.get_json(silent=True) or {}
    email = (
        body.get("email").strip().lower()
        if isinstance(body.get("email"), str)
        else ""
    )

    try:
        if not email:
            return jsonify(
                {
                    "success": False,
                    "message": "Email is required",
                },
            ), 400

        ensure_password_reset_token_schema()

        user = fetch_one(
            "SELECT id, email FROM users WHERE email = %s LIMIT 1",
            (email,),
        )

        if user:
            raw_token = secrets.token_hex(32)
            token_hash = hash_reset_token(raw_token)

            execute_write(
                """
                INSERT INTO password_reset_tokens
                    (user_id, token_hash, expires_at)
                VALUES
                    (%s, %s, DATE_ADD(NOW(), INTERVAL %s MINUTE))
                """,
                (user["id"], token_hash, PASSWORD_RESET_WINDOW_MINUTES),
            )

            reset_link = f"{get_frontend_url()}/reset-password/{raw_token}"

            try:
                send_password_reset_email(user["email"], reset_link)
            except Exception:
                current_app.logger.exception("Password reset email error")

        return jsonify(
            {
                "success": True,
                "message": PASSWORD_RESET_SUCCESS_MESSAGE,
            },
        ), 200
    except Exception:
        current_app.logger.exception("Forgot password error")
        return jsonify(
            {
                "success": False,
                "message": "Failed to process password reset request",
            },
        ), 500


def reset_password():
    body = request.get_json(silent=True) or {}
    token = (
        body.get("token").strip()
        if isinstance(body.get("token"), str)
        else ""
    )
    password = body.get("password")

    try:
        if not token or not password:
            return jsonify(
                {
                    "success": False,
                    "message": "Token and password are required",
                },
            ), 400

        if not isinstance(password, str) or len(password) < 6:
            return jsonify(
                {
                    "success": False,
                    "message": "Password must be at least 6 characters",
                },
            ), 400

        ensure_password_reset_token_schema()
        token_hash = hash_reset_token(token)
        connection = get_connection()

        try:
            connection.autocommit(False)
            connection.begin()

            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT id, user_id
                    FROM password_reset_tokens
                    WHERE token_hash = %s
                      AND used_at IS NULL
                      AND expires_at > NOW()
                    LIMIT 1
                    """,
                    (token_hash,),
                )
                reset_token = cursor.fetchone()

                if not reset_token:
                    connection.rollback()
                    return jsonify(
                        {
                            "success": False,
                            "message": "Invalid or expired reset token",
                        },
                    ), 400

                password_hash = bcrypt.hashpw(
                    password.encode("utf-8"),
                    bcrypt.gensalt(rounds=10),
                ).decode("utf-8")

                cursor.execute(
                    """
                    UPDATE users
                    SET password_hash = %s
                    WHERE id = %s
                    """,
                    (password_hash, reset_token["user_id"]),
                )
                cursor.execute(
                    """
                    UPDATE password_reset_tokens
                    SET used_at = NOW()
                    WHERE id = %s
                      AND used_at IS NULL
                    """,
                    (reset_token["id"],),
                )

                if cursor.rowcount == 0:
                    connection.rollback()
                    return jsonify(
                        {
                            "success": False,
                            "message": "Invalid or expired reset token",
                        },
                    ), 400

            connection.commit()

            return jsonify(
                {
                    "success": True,
                    "message": "Password reset successful",
                },
            ), 200
        except Exception:
            connection.rollback()
            raise
        finally:
            connection.close()
    except Exception:
        current_app.logger.exception("Reset password error")
        return jsonify(
            {
                "success": False,
                "message": "Password reset failed",
            },
        ), 500
