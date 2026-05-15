from collections import defaultdict, deque
from functools import wraps
from time import time

from flask import jsonify, request

_buckets = defaultdict(deque)


def _get_client_ip():
    forwarded_for = request.headers.get("X-Forwarded-For", "")

    if forwarded_for:
        return forwarded_for.split(",", 1)[0].strip()

    return request.remote_addr or "unknown"


def _get_user_key():
    user = getattr(request, "user", None) or {}

    if user.get("id"):
        return f"user:{user['id']}"

    return _get_client_ip()


def rate_limit(window_ms, limit, message, key_func=None):
    window_seconds = window_ms / 1000

    def decorator(view):
        @wraps(view)
        def wrapped(*args, **kwargs):
            now = time()
            key_source = key_func() if key_func else _get_client_ip()
            key = (request.path, key_source)
            bucket = _buckets[key]

            while bucket and now - bucket[0] >= window_seconds:
                bucket.popleft()

            if len(bucket) >= limit:
                return jsonify(
                    {
                        "success": False,
                        "message": message,
                    },
                ), 429

            bucket.append(now)
            return view(*args, **kwargs)

        return wrapped

    return decorator


run_code_limiter = rate_limit(
    60 * 1000,
    20,
    "Too many run requests. Please wait a moment.",
    key_func=_get_user_key,
)

submit_code_limiter = rate_limit(
    60 * 1000,
    8,
    "Too many submissions. Please wait before submitting again.",
    key_func=_get_user_key,
)
