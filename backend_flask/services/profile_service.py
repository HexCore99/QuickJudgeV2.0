import base64
import re
from datetime import datetime, timedelta
from pathlib import Path
from uuid import uuid4

import bcrypt

from config.db import fetch_all, fetch_one, get_connection
from services.problem_service import ensure_problem_tables
from services.submission_scoring_service import ensure_submission_scoring_schema
from services.user_handle_service import (
    assign_user_handle_from_name,
    ensure_user_handle_schema,
)

UPLOAD_ROOT = Path(__file__).resolve().parents[2] / "backend" / "uploads"
AVATAR_UPLOAD_DIR = UPLOAD_ROOT / "avatars"
AVATAR_UPLOAD_URL_PREFIX = "/uploads/avatars/"
MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024
AVATAR_EXTENSION_BY_MIME = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
}
DIFFICULTY_META = {
    "Easy": {"label": "Easy", "color": "#16a34a", "tw": "bg-green-600"},
    "Medium": {"label": "Medium", "color": "#d97706", "tw": "bg-amber-500"},
    "Hard": {"label": "Hard", "color": "#dc2626", "tw": "bg-red-600"},
}


class ServiceError(Exception):
    def __init__(self, message, status_code=400):
        super().__init__(message)
        self.status_code = status_code


def _to_number(value, default=0):
    try:
        return int(value if value is not None else default)
    except (TypeError, ValueError):
        return default


def _to_datetime(value):
    if not value:
        return None

    if isinstance(value, datetime):
        return value

    try:
        return datetime.fromisoformat(str(value).replace("Z", "+00:00"))
    except ValueError:
        return None


def _format_date_time(value):
    date = _to_datetime(value)
    return date.strftime("%Y-%m-%d %H:%M:%S") if date else ""


def _format_date_only(value):
    date = _to_datetime(value)
    return date.strftime("%Y-%m-%d") if date else ""


def _format_joined_date(value):
    date = _to_datetime(value)
    return date.strftime("%b %Y") if date else ""


def _format_rating_label(value):
    date = _to_datetime(value)
    return date.strftime("%b") if date else ""


def _format_signed_number(value):
    number = _to_number(value)
    return f"{'+' if number >= 0 else ''}{number}"


def _format_runtime(runtime_ms):
    if runtime_ms is None:
        return "--"

    number = _to_number(runtime_ms)

    if number < 1000:
        return f"{number}ms"

    return f"{number / 1000:.2f}s"


def _format_memory(memory_kb):
    if memory_kb is None:
        return "--"

    number = _to_number(memory_kb)

    if number < 1024:
        return f"{number} KB"

    return f"{number / 1024:.1f} MB"


def _format_relative_time(value):
    date = _to_datetime(value)

    if not date:
        return ""

    now = datetime.now(date.tzinfo) if date.tzinfo else datetime.now()
    seconds = max(0, int(now.timestamp() - date.timestamp()))

    if seconds < 60:
        return "Just now"

    minutes = seconds // 60
    if minutes < 60:
        return f"{minutes} min ago"

    hours = minutes // 60
    if hours < 24:
        return f"{hours} hour{'s' if hours != 1 else ''} ago"

    days = hours // 24
    if days == 1:
        return "Yesterday"

    if days < 30:
        return f"{days} days ago"

    return _format_date_only(value)


def _get_public_id(user):
    date = _to_datetime(user.get("created_at"))
    year = date.year if date else datetime.now().year
    return f"QJ-{year}-{str(user.get('id')).zfill(4)}"


def _get_rating_tier(rating):
    rating = _to_number(rating)

    if rating <= 0:
        return "UNRATED"

    if rating >= 2400:
        return "MASTER"

    if rating >= 2000:
        return "ELITE"

    if rating >= 1600:
        return "EXPERT"

    if rating >= 1200:
        return "PUPIL"

    return "NEWBIE"


def _get_verdict_flag(verdict):
    normalized = str(verdict or "").upper()

    if normalized in {"AC", "WA", "TLE", "RE", "CE"}:
        return normalized.lower()

    return "other"


def _parse_avatar_image_data(image_data):
    match = re.match(
        r"^data:(image/(?:jpeg|png|webp|gif));base64,([A-Za-z0-9+/=]+)$",
        str(image_data or ""),
        flags=re.IGNORECASE,
    )

    if not match:
        raise ServiceError("Upload a valid JPG, PNG, WEBP, or GIF image.")

    mime_type = match.group(1).lower()
    extension = AVATAR_EXTENSION_BY_MIME.get(mime_type)
    data = base64.b64decode(match.group(2))

    if not extension or not data:
        raise ServiceError("Upload a valid image file.")

    if len(data) > MAX_AVATAR_SIZE_BYTES:
        raise ServiceError("Profile image must be 2 MB or smaller.")

    return data, extension


def _get_avatar_file_path_from_url(avatar_url):
    cleaned_url = str(avatar_url or "").strip().split("?", 1)[0].split("#", 1)[0]

    if not cleaned_url.startswith(AVATAR_UPLOAD_URL_PREFIX):
        return None

    file_name = cleaned_url[len(AVATAR_UPLOAD_URL_PREFIX) :]
    safe_file_name = Path(file_name).name

    if (
        not file_name
        or safe_file_name != file_name
        or not re.match(r"^avatar-\d+-[0-9a-f-]+\.(?:jpg|png|webp|gif)$", safe_file_name, flags=re.IGNORECASE)
    ):
        return None

    file_path = (AVATAR_UPLOAD_DIR / safe_file_name).resolve()

    try:
        file_path.relative_to(AVATAR_UPLOAD_DIR.resolve())
    except ValueError:
        return None

    return file_path


def _delete_avatar_file_safely(avatar_url):
    file_path = _get_avatar_file_path_from_url(avatar_url)

    if not file_path:
        return

    try:
        file_path.unlink(missing_ok=True)
    except OSError:
        return


def _build_rating_history(rows):
    all_rows = [
        {
            "l": row.get("label") or _format_rating_label(row.get("rating_date")),
            "v": _to_number(row.get("rating")),
            "date": _to_datetime(row.get("rating_date")),
        }
        for row in rows
    ]
    dated_rows = [row for row in all_rows if row.get("date")]
    now = datetime.now()
    six_months_ago = now - timedelta(days=183)
    one_year_ago = now - timedelta(days=365)

    def pick_range(start_date):
        return [
            {"l": row["l"], "v": row["v"]}
            for row in dated_rows
            if row["date"].replace(tzinfo=None) >= start_date
        ]

    return {
        "6m": pick_range(six_months_ago),
        "1y": pick_range(one_year_ago),
        "all": [{"l": row["l"], "v": row["v"]} for row in all_rows],
    }


def _map_submission(row):
    display_id = (
        row.get("problem_id")
        or row.get("contest_problem_code")
        or row.get("contest_id")
        or f"SUB-{row.get('id')}"
    )

    return {
        "submissionId": row.get("id"),
        "problem": row.get("problem_title") or "Untitled Problem",
        "id": str(display_id),
        "verdict": row.get("verdict"),
        "time": _format_runtime(row.get("runtime_ms")),
        "mem": _format_memory(row.get("memory_kb")),
        "lang": row.get("language"),
        "diff": "Medium",
        "f": _get_verdict_flag(row.get("verdict")),
        "at": _format_date_time(row.get("submitted_at")),
        "contest": row.get("contest_name") or None,
        "code": row.get("source_code") or "",
        "tc": row.get("test_case_note") or "",
        "isScored": bool(row.get("is_scored") if row.get("is_scored") is not None else True),
    }


def _map_contest(row):
    return {
        "id": row.get("contest_code"),
        "name": row.get("contest_name"),
        "date": _format_date_only(row.get("contest_date")),
        "rank": row.get("rank_position") or "--",
        "total": _to_number(row.get("participants_count")),
        "solved": f"{_to_number(row.get('solved_count'))}/{_to_number(row.get('total_problems'))}",
        "delta": _to_number(row.get("rating_delta")),
        "before": row.get("rating_before") or "--",
        "after": row.get("rating_after") or "--",
        "rated": bool(row.get("is_rated")),
        "private": bool(row.get("requires_password")),
    }


def _map_activity(row):
    base = {
        "type": row.get("activity_type"),
        "time": _format_relative_time(row.get("occurred_at")),
    }

    if row.get("activity_type") in {"solve", "fail"}:
        return {
            **base,
            "problem": row.get("problem_title") or row.get("title") or "Untitled Problem",
            "id": row.get("problem_code") or f"SUB-{row.get('related_submission_id') or row.get('id')}",
            "verdict": row.get("verdict") or ("AC" if row.get("activity_type") == "solve" else "WA"),
        }

    if row.get("activity_type") == "rating":
        return {
            **base,
            "title": row.get("title") or "Rating updated",
            "change": _format_signed_number(row.get("rating_change")),
        }

    if row.get("activity_type") == "contest":
        return {
            **base,
            "title": row.get("contest_name") or row.get("title") or "Contest",
            "result": row.get("result_text") or "",
        }

    return {
        **base,
        "title": row.get("title") or "Profile activity",
    }


def _get_user_row(user_id):
    row = fetch_one(
        """
        SELECT id, name, userhandle, email, password_hash, role, created_at
        FROM users
        WHERE id = %s
        LIMIT 1
        """,
        (user_id,),
    )

    if not row:
        raise ServiceError("User not found.", 404)

    return row


def _ensure_profile_row(user):
    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO user_profiles (user_id, public_id, rating, rating_tier)
                VALUES (%s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE user_id = user_id
                """,
                (user["id"], _get_public_id(user), 0, "UNRATED"),
            )


def _get_profile_row(user_id):
    return fetch_one(
        """
        SELECT user_id, public_id, department, bio, github_url, avatar_url,
               rating, rating_delta, rating_tier, global_rank, rank_delta,
               solved_count, solved_delta, total_submissions, current_streak,
               best_streak, contest_count, rated_contest_count, created_at, updated_at
        FROM user_profiles
        WHERE user_id = %s
        LIMIT 1
        """,
        (user_id,),
    )


def _get_submission_stats(user_id):
    ensure_submission_scoring_schema()
    row = fetch_one(
        """
        SELECT
          COUNT(*) AS total_submissions,
          COALESCE(SUM(CASE WHEN verdict = 'AC' AND is_scored = 1 THEN 1 ELSE 0 END), 0) AS accepted_submissions,
          COUNT(DISTINCT CASE
            WHEN verdict != 'AC' THEN NULL
            WHEN is_scored != 1 THEN NULL
            WHEN problem_id IS NOT NULL THEN CONCAT('problem:', problem_id)
            WHEN contest_id IS NOT NULL THEN CONCAT('contest:', contest_id, ':', contest_problem_code)
            ELSE problem_title
          END) AS solved_count
        FROM submissions
        WHERE user_id = %s
        """,
        (user_id,),
    )

    return row or {
        "total_submissions": 0,
        "accepted_submissions": 0,
        "solved_count": 0,
    }


def _get_submissions(user_id):
    ensure_submission_scoring_schema()
    rows = fetch_all(
        """
        SELECT id, problem_id, contest_id, contest_problem_code, problem_title,
               contest_name, language, source_code, verdict, runtime_ms,
               memory_kb, test_case_note, is_scored, submitted_at
        FROM submissions
        WHERE user_id = %s
        ORDER BY submitted_at DESC, id DESC
        LIMIT 50
        """,
        (user_id,),
    )
    return [_map_submission(row) for row in rows]


def _get_contests(user_id):
    ensure_submission_scoring_schema()
    history_rows = fetch_all(
        """
        SELECT id, contest_code, contest_name, contest_date, rank_position,
               participants_count, solved_count, total_problems, rating_delta,
               rating_before, rating_after, is_rated, 0 AS requires_password
        FROM user_contests
        WHERE user_id = %s
        ORDER BY contest_date DESC, id DESC
        """,
        (user_id,),
    )
    participation_rows = fetch_all(
        """
        SELECT
          c.id AS contest_code,
          c.name AS contest_name,
          c.start_time AS contest_date,
          cr.rank_position,
          COALESCE(
            NULLIF(cr.total_participants, 0),
            NULLIF(c.participants_count, 0),
            participant_counts.total_participants,
            0
          ) AS participants_count,
          COALESCE(cr.solved_count, solved_counts.solved_count, 0) AS solved_count,
          COALESCE(NULLIF(c.problems_count, 0), problem_counts.total_problems, 0) AS total_problems,
          0 AS rating_delta,
          NULL AS rating_before,
          NULL AS rating_after,
          c.is_rated,
          c.requires_password
        FROM contests c
        INNER JOIN (
          SELECT contest_id
          FROM submissions
          WHERE user_id = %s AND contest_id IS NOT NULL AND is_scored = 1
          UNION
          SELECT contest_id
          FROM contest_submissions
          WHERE user_id = %s AND is_scored = 1
        ) participated_contests
          ON participated_contests.contest_id = c.id
        LEFT JOIN contest_results cr
          ON cr.contest_id = c.id
         AND cr.user_id = %s
         AND cr.participated = 1
        LEFT JOIN (
          SELECT contest_id, COUNT(DISTINCT user_id) AS total_participants
          FROM (
            SELECT contest_id, user_id
            FROM submissions
            WHERE contest_id IS NOT NULL AND is_scored = 1
            UNION
            SELECT contest_id, user_id
            FROM contest_submissions
            WHERE is_scored = 1
          ) participant_source
          GROUP BY contest_id
        ) participant_counts
          ON participant_counts.contest_id = c.id
        LEFT JOIN (
          SELECT contest_id, COUNT(DISTINCT problem_code) AS solved_count
          FROM (
            SELECT contest_id, contest_problem_code AS problem_code
            FROM submissions
            WHERE user_id = %s AND verdict = 'AC' AND is_scored = 1
            UNION
            SELECT contest_id, problem_code
            FROM contest_submissions
            WHERE user_id = %s AND verdict = 'Accepted' AND is_scored = 1
          ) solved_source
          WHERE problem_code IS NOT NULL
          GROUP BY contest_id
        ) solved_counts
          ON solved_counts.contest_id = c.id
        LEFT JOIN (
          SELECT contest_id, COUNT(*) AS total_problems
          FROM contest_problems
          GROUP BY contest_id
        ) problem_counts
          ON problem_counts.contest_id = c.id
        ORDER BY c.start_time DESC, c.id DESC
        """,
        (user_id, user_id, user_id, user_id, user_id),
    )
    rows_by_contest_code = {}

    for row in participation_rows:
        rows_by_contest_code[row.get("contest_code")] = row

    for row in history_rows:
        rows_by_contest_code[row.get("contest_code")] = row

    rows = sorted(
        rows_by_contest_code.values(),
        key=lambda row: (
            _to_datetime(row.get("contest_date")) or datetime.min,
            str(row.get("contest_code") or ""),
        ),
        reverse=True,
    )
    return [_map_contest(row) for row in rows]


def _get_rating_history(user_id):
    rows = fetch_all(
        """
        SELECT rating_date, rating, label
        FROM user_rating_history
        WHERE user_id = %s
        ORDER BY rating_date ASC, id ASC
        """,
        (user_id,),
    )
    return _build_rating_history(rows)


def _get_difficulty_stats(user_id):
    ensure_problem_tables()
    ensure_submission_scoring_schema()
    rows = fetch_all(
        """
        SELECT
          p.difficulty,
          COUNT(DISTINCT p.id) AS total_count,
          COUNT(DISTINCT CASE WHEN s.id IS NOT NULL THEN p.id ELSE NULL END) AS solved_count
        FROM problems p
        LEFT JOIN submissions s
          ON s.problem_id = p.id
         AND s.user_id = %s
         AND s.verdict = 'AC'
         AND s.is_scored = 1
        WHERE p.is_published = 1
        GROUP BY p.difficulty
        """,
        (user_id,),
    )
    row_map = {row.get("difficulty"): row for row in rows}

    return [
        {
            **DIFFICULTY_META[difficulty],
            "solved": _to_number(row_map.get(difficulty, {}).get("solved_count")),
            "total": _to_number(row_map.get(difficulty, {}).get("total_count")),
        }
        for difficulty in ["Easy", "Medium", "Hard"]
    ]


def _get_activities(user_id):
    rows = fetch_all(
        """
        SELECT id, activity_type, title, problem_code, problem_title, verdict,
               rating_change, contest_code, contest_name, result_text,
               related_submission_id, related_achievement_code, occurred_at
        FROM user_activities
        WHERE user_id = %s
        ORDER BY occurred_at DESC, id DESC
        LIMIT 30
        """,
        (user_id,),
    )
    return [_map_activity(row) for row in rows]


def _map_profile(user, profile, submission_stats):
    rating = _to_number(profile.get("rating"))
    total_submissions = (
        _to_number(submission_stats.get("total_submissions"))
        or _to_number(profile.get("total_submissions"))
    )
    accepted_submissions = _to_number(submission_stats.get("accepted_submissions"))
    solved_count = (
        _to_number(submission_stats.get("solved_count"))
        or _to_number(profile.get("solved_count"))
    )
    ac_rate = (
        f"{(accepted_submissions / total_submissions) * 100:.1f}%"
        if total_submissions
        else "0%"
    )

    return {
        "name": user.get("name"),
        "handle": user.get("userhandle") or user.get("name"),
        "email": user.get("email"),
        "dept": profile.get("department") or "",
        "bio": profile.get("bio") or "",
        "git": profile.get("github_url") or "",
        "avatarUrl": profile.get("avatar_url") or "",
        "id": profile.get("public_id") or _get_public_id(user),
        "joinedDate": _format_joined_date(user.get("created_at")),
        "rating": rating,
        "ratingDelta": _format_signed_number(profile.get("rating_delta")),
        "ratingTier": profile.get("rating_tier") or _get_rating_tier(rating),
        "rank": profile.get("global_rank") or "--",
        "rankDelta": _to_number(profile.get("rank_delta")),
        "solved": solved_count,
        "solvedDelta": _to_number(profile.get("solved_delta")),
        "totalSubmissions": total_submissions,
        "acRate": ac_rate,
        "streak": _to_number(profile.get("current_streak")),
        "bestStreak": _to_number(profile.get("best_streak")),
        "contestCount": _to_number(profile.get("contest_count")),
        "ratedContests": _to_number(profile.get("rated_contest_count")),
    }


def get_profile_for_user(user_id):
    ensure_user_handle_schema()
    user = _get_user_row(user_id)
    _ensure_profile_row(user)

    profile_row = _get_profile_row(user_id)
    submission_stats = _get_submission_stats(user_id)
    profile = _map_profile(user, profile_row, submission_stats)

    return {
        "profile": profile,
        "submissions": _get_submissions(user_id),
        "contests": _get_contests(user_id),
        "achievements": [],
        "ratingHistory": _get_rating_history(user_id),
        "difficulties": _get_difficulty_stats(user_id),
        "activities": _get_activities(user_id),
    }


def update_profile_for_user(user_id, payload):
    payload = payload or {}
    ensure_user_handle_schema()
    user = _get_user_row(user_id)
    _ensure_profile_row(user)
    connection = get_connection()
    previous_avatar_url = ""
    should_delete_previous_avatar = False
    name = payload.get("name", "").strip()
    email = (payload.get("email", "").strip().lower() or user.get("email"))
    department = payload.get("dept", "").strip() or None
    bio = payload.get("bio", "").strip() or None
    github_url = payload.get("git", "").strip() or None
    avatar_url = payload.get("avatarUrl", "").strip() or None
    current_password = payload.get("currentPassword") or ""
    new_password = payload.get("newPassword") or ""
    is_email_changing = email != user.get("email")
    is_password_changing = bool(new_password)

    try:
        connection.autocommit(False)

        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT avatar_url
                FROM user_profiles
                WHERE user_id = %s
                LIMIT 1
                """,
                (user_id,),
            )
            profile_row = cursor.fetchone() or {}
            previous_avatar_url = profile_row.get("avatar_url") or ""

        if is_email_changing or is_password_changing:
            password_hash = str(user.get("password_hash") or "").encode()
            try:
                is_current_password_valid = bcrypt.checkpw(
                    current_password.encode(),
                    password_hash,
                )
            except ValueError:
                is_current_password_valid = False

            if not is_current_password_valid:
                raise ServiceError("Current password is incorrect.", 401)

        if is_email_changing:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT id
                    FROM users
                    WHERE email = %s AND id <> %s
                    LIMIT 1
                    """,
                    (email, user_id),
                )

                if cursor.fetchone():
                    raise ServiceError("Email already exists.", 409)

        with connection.cursor() as cursor:
            if is_password_changing:
                next_password_hash = bcrypt.hashpw(
                    new_password.encode(),
                    bcrypt.gensalt(),
                ).decode()
                cursor.execute(
                    """
                    UPDATE users
                    SET name = %s, email = %s, password_hash = %s
                    WHERE id = %s
                    """,
                    (name, email, next_password_hash, user_id),
                )
            else:
                cursor.execute(
                    """
                    UPDATE users
                    SET name = %s, email = %s
                    WHERE id = %s
                    """,
                    (name, email, user_id),
                )

        assign_user_handle_from_name(connection, user_id, name)

        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO user_profiles
                 (user_id, public_id, department, bio, github_url, avatar_url)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE
                  department = VALUES(department),
                  bio = VALUES(bio),
                  github_url = VALUES(github_url),
                  avatar_url = VALUES(avatar_url),
                  updated_at = CURRENT_TIMESTAMP
                """,
                (
                    user_id,
                    _get_public_id(user),
                    department,
                    bio,
                    github_url,
                    avatar_url,
                ),
            )

        connection.commit()
        should_delete_previous_avatar = bool(
            previous_avatar_url
            and avatar_url
            and previous_avatar_url != avatar_url
            and _get_avatar_file_path_from_url(previous_avatar_url)
        )
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()

    if should_delete_previous_avatar:
        _delete_avatar_file_safely(previous_avatar_url)

    return {
        **get_profile_for_user(user_id),
        "passwordChanged": is_password_changing,
    }


def save_profile_avatar_for_user(user_id, image_data):
    _get_user_row(user_id)
    data, extension = _parse_avatar_image_data(image_data)
    AVATAR_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    file_name = f"avatar-{user_id}-{uuid4()}.{extension}"
    file_path = AVATAR_UPLOAD_DIR / file_name
    file_path.write_bytes(data)

    return {"avatarUrl": f"{AVATAR_UPLOAD_URL_PREFIX}{file_name}"}
