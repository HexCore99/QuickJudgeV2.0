import os
from functools import wraps

import jwt
from flask import g, jsonify, request


def require_auth(route_handler):
    @wraps(route_handler)
    def wrapper(*args, **kwargs):
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
                os.getenv("JWT_SECRET"),
                algorithms=["HS256"],
            )

            g.user = {
                "id": decoded.get("id"),
                "email": decoded.get("email"),
                "role": decoded.get("role"),
            }

            return route_handler(*args, **kwargs)
        except Exception:
            return jsonify(
                {
                    "success": False,
                    "message": "Invalid or expired token",
                },
            ), 401

    return wrapper
