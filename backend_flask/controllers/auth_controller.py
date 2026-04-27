import os
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from flask import current_app, jsonify, request

from config.db import execute_write, fetch_one


def create_token(user):
    payload = {
        "id": user["id"],
        "email": user["email"],
        "role": user["role"],
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
    }

    return jwt.encode(payload, os.getenv("JWT_SECRET"), algorithm="HS256")


def signup():
    try:
        body = request.get_json(silent=True) or {}
        name = body.get("name")
        email = body.get("email")
        password = body.get("password")

        if not name or not email or not password:
            return jsonify(
                {
                    "success": False,
                    "message": "Name,email and password are required",
                },
            ), 400

        if len(password) < 6:
            return jsonify(
                {
                    "success": False,
                    "message": "Password must be at least 6 characters",
                },
            ), 400

        trimmed_name = name.strip()
        trimmed_email = email.strip().lower()
        existing_user = fetch_one(
            "SELECT id FROM users WHERE email = %s",
            (trimmed_email,),
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

        user_id = execute_write(
            "INSERT INTO users(name,email,password_hash,role) VALUES(%s,%s,%s,%s)",
            (trimmed_name, trimmed_email, password_hash, "student"),
        )

        user = {
            "id": user_id,
            "name": trimmed_name,
            "email": trimmed_email,
            "role": "student",
        }
        token = create_token(user)

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
    try:
        body = request.get_json(silent=True) or {}
        email = body.get("email")
        password = body.get("password")

        if not email or not password:
            return jsonify(
                {
                    "success": False,
                    "message": "Email and password are required",
                },
            ), 400

        trimmed_email = email.strip().lower()
        found_user = fetch_one(
            "SELECT id,name,email,password_hash,role FROM users WHERE email=%s",
            (trimmed_email,),
        )

        if not found_user:
            return jsonify(
                {
                    "success": False,
                    "message": "Invalid email or password",
                },
            ), 401

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

        user = {
            "id": found_user["id"],
            "name": found_user["name"],
            "email": found_user["email"],
            "role": found_user["role"],
        }
        token = create_token(user)

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
