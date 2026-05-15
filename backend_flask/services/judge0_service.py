import base64
import json
import os
import time
from urllib.error import HTTPError
from urllib.request import Request, urlopen

DEFAULT_JUDGE0_BASE_URL = "https://ce.judge0.com"
LANGUAGE_IDS = {
    "c": 50,
    "cpp": 54,
    "java": 62,
    "python": 71,
    "rust": 73,
}
TEXT_RESULT_FIELDS = ["stdout", "stderr", "compile_output", "message"]


def _encode_base64(value):
    return base64.b64encode(str(value or "").encode("utf-8")).decode("ascii")


def _decode_base64(value):
    if not isinstance(value, str) or not value:
        return value

    return base64.b64decode(value.encode("ascii")).decode("utf-8")


def _decode_judge0_text_fields(result):
    if not isinstance(result, dict):
        return result

    decoded = {**result}

    for field in TEXT_RESULT_FIELDS:
        decoded[field] = _decode_base64(decoded.get(field))

    return decoded


def _get_judge0_base_url():
    return (os.getenv("JUDGE0_BASE_URL") or DEFAULT_JUDGE0_BASE_URL).rstrip("/")


def _get_judge0_headers():
    headers = {
        "Content-Type": "application/json",
    }

    auth_token = os.getenv("JUDGE0_AUTH_TOKEN")
    rapidapi_key = os.getenv("JUDGE0_RAPIDAPI_KEY")

    if auth_token:
        headers["X-Auth-Token"] = auth_token

    if rapidapi_key:
        headers["X-RapidAPI-Key"] = rapidapi_key
        headers["X-RapidAPI-Host"] = (
            os.getenv("JUDGE0_RAPIDAPI_HOST") or "judge0-ce.p.rapidapi.com"
        )

    return headers


def _parse_judge0_response(response):
    raw_data = response.read().decode("utf-8")

    try:
        return json.loads(raw_data or "{}")
    except json.JSONDecodeError:
        return {}


def _request_json(url, headers, method="GET", payload=None):
    body = None

    if payload is not None:
        body = json.dumps(payload).encode("utf-8")

    request = Request(url, data=body, headers=headers, method=method)

    try:
        with urlopen(request, timeout=30) as response:
            return _parse_judge0_response(response)
    except HTTPError as error:
        data = _parse_judge0_response(error)
        message = (
            data.get("error")
            or data.get("message")
            or f"Judge0 request failed with status {error.code}."
        )
        raise RuntimeError(message) from error


def get_language_id(language):
    return LANGUAGE_IDS.get(language)


def run_judge0_submission(
    language,
    source_code,
    stdin="",
    time_limit_seconds=1,
    memory_limit_mb=256,
):
    language_id = get_language_id(language)

    if not language_id:
        raise RuntimeError("Unsupported language.")

    base_url = _get_judge0_base_url()
    headers = _get_judge0_headers()
    created = _request_json(
        f"{base_url}/submissions?base64_encoded=true&wait=false",
        headers,
        method="POST",
        payload={
            "language_id": language_id,
            "source_code": _encode_base64(source_code),
            "stdin": _encode_base64(stdin),
            "cpu_time_limit": float(time_limit_seconds or 1),
            "memory_limit": int(memory_limit_mb or 256) * 1024,
        },
    )

    token = created.get("token")

    if not token:
        return _decode_judge0_text_fields(created)

    for attempt in range(25):
        time.sleep(0.5 if attempt < 3 else 1)
        result = _request_json(
            f"{base_url}/submissions/{token}?base64_encoded=true",
            headers,
        )
        status = result.get("status") or {}

        try:
            status_id = int(status.get("id") or 0)
        except (TypeError, ValueError):
            status_id = 0

        if status_id > 2:
            return _decode_judge0_text_fields(result)

    raise RuntimeError("Judge0 submission timed out while waiting for a result.")
