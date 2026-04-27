from datetime import datetime, timezone

import bcrypt

from config.db import execute_write, fetch_all, fetch_one

CONTEST_FILTERS = [
    {"key": "all", "label": "All"},
    {"key": "live", "label": "Live"},
    {"key": "upcoming", "label": "Upcoming"},
    {"key": "past", "label": "Past"},
]

MONTH_NAMES = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
]


class ServiceError(Exception):
    def __init__(self, message, status_code=400):
        super().__init__(message)
        self.status_code = status_code


def to_utc_datetime(date_value):
    if isinstance(date_value, datetime):
        if date_value.tzinfo is None:
            return date_value.replace(tzinfo=timezone.utc)

        return date_value.astimezone(timezone.utc)

    normalized = str(date_value).replace("Z", "+00:00")
    parsed = datetime.fromisoformat(normalized)

    if parsed.tzinfo is None:
        return parsed.replace(tzinfo=timezone.utc)

    return parsed.astimezone(timezone.utc)


def format_date(date_value):
    date = to_utc_datetime(date_value)
    return f"{MONTH_NAMES[date.month - 1]} {date.day}, {date.year}"


def format_time(date_value):
    date = to_utc_datetime(date_value)
    return f"{date.hour:02d}:{date.minute:02d} UTC"


def format_duration(total_minutes):
    hours = total_minutes // 60
    minutes = total_minutes % 60

    if hours and minutes:
        return f"{hours}h {minutes}m"

    if hours:
        return f"{hours}h"

    return f"{minutes}m"


def get_tags_map(contest_ids):
    if not contest_ids:
        return {}

    placeholders = ",".join(["%s"] * len(contest_ids))
    rows = fetch_all(
        f"""SELECT contest_id, tag_name
            FROM contest_tags
            WHERE contest_id IN ({placeholders})
            ORDER BY id ASC""",
        tuple(contest_ids),
    )

    tags_map = {}

    for row in rows:
        tags_map.setdefault(row["contest_id"], []).append(row["tag_name"])

    return tags_map


def has_contest_access(user_id, contest_id):
    row = fetch_one(
        """SELECT 1
           FROM contest_access
           WHERE user_id = %s AND contest_id = %s
           LIMIT 1""",
        (user_id, contest_id),
    )

    return row is not None


def get_contests_for_user(user_id):
    live_rows = fetch_all(
        """SELECT
             c.id,
             c.name,
             c.description,
             c.start_time,
             c.duration_minutes,
             c.problems_count,
             c.participants_count,
             c.requires_password
           FROM contests c
           WHERE c.status = 'live'
           ORDER BY c.start_time ASC""",
    )

    upcoming_rows = fetch_all(
        """SELECT
             c.id,
             c.name,
             c.description,
             c.start_time,
             c.duration_minutes,
             c.problems_count,
             c.requires_password,
             EXISTS(
               SELECT 1
               FROM contest_registrations cr
               WHERE cr.contest_id = c.id AND cr.user_id = %s
             ) AS registered
           FROM contests c
           WHERE c.status = 'upcoming'
           ORDER BY registered DESC, c.start_time ASC""",
        (user_id,),
    )

    past_rows = fetch_all(
        """SELECT
             c.id,
             c.name,
             c.start_time,
             c.contest_type,
             c.problems_count,
             c.is_rated,
             c.participants_count,
             COALESCE(r.participated, 0) AS participated,
             r.rank_position,
             COALESCE(r.total_participants, c.participants_count) AS total_participants
           FROM contests c
           LEFT JOIN contest_results r
             ON r.contest_id = c.id AND r.user_id = %s
           WHERE c.status = 'past'
           ORDER BY c.start_time DESC""",
        (user_id,),
    )

    all_contest_ids = [
        *[row["id"] for row in live_rows],
        *[row["id"] for row in upcoming_rows],
        *[row["id"] for row in past_rows],
    ]
    tags_map = get_tags_map(all_contest_ids)

    return {
        "filters": CONTEST_FILTERS,
        "live": [
            {
                "id": row["id"],
                "name": row["name"],
                "desc": row["description"] or "",
                "date": format_date(row["start_time"]),
                "time": format_time(row["start_time"]),
                "duration": format_duration(row["duration_minutes"]),
                "problems": row["problems_count"],
                "participants": row["participants_count"],
                "requiresPassword": bool(row["requires_password"]),
                "tags": tags_map.get(row["id"], []),
            }
            for row in live_rows
        ],
        "upcoming": [
            {
                "id": row["id"],
                "name": row["name"],
                "desc": row["description"] or "",
                "date": format_date(row["start_time"]),
                "time": format_time(row["start_time"]),
                "duration": format_duration(row["duration_minutes"]),
                "problems": row["problems_count"],
                "registered": bool(row["registered"]),
                "tags": tags_map.get(row["id"], []),
            }
            for row in upcoming_rows
        ],
        "past": [
            {
                "id": row["id"],
                "name": row["name"],
                "date": format_date(row["start_time"]),
                "type": row["contest_type"] or "Contest",
                "participated": bool(row["participated"]),
                "rank": row["rank_position"] if row["participated"] else None,
                "total": row["total_participants"] or 0,
                "questions": row["problems_count"] or 0,
                "rated": bool(row["is_rated"]),
                "tags": tags_map.get(row["id"], []),
            }
            for row in past_rows
        ],
    }


def get_contest_details_by_id(user_id, contest_id):
    contest = fetch_one(
        """SELECT
             id,
             name,
             status,
             duration_minutes,
             requires_password
           FROM contests
           WHERE id = %s
           LIMIT 1""",
        (contest_id,),
    )

    if not contest:
        raise ServiceError("Contest not found.", 404)

    if contest["requires_password"] and not has_contest_access(user_id, contest_id):
        raise ServiceError("Contest password required.", 403)

    problem_rows = fetch_all(
        """SELECT
             problem_code,
             title,
             difficulty,
             points
           FROM contest_problems
           WHERE contest_id = %s
           ORDER BY sort_order ASC, problem_code ASC""",
        (contest_id,),
    )

    return {
        "id": contest["id"],
        "title": f"QuickJudge {contest['name']}",
        "statusText": str(contest["status"]).upper(),
        "duration": format_duration(contest["duration_minutes"]),
        "problems": [
            {
                "id": problem["problem_code"],
                "title": problem["title"],
                "difficulty": problem["difficulty"],
                "points": problem["points"],
            }
            for problem in problem_rows
        ],
    }


def register_user_for_upcoming_contest(user_id, contest_id):
    contest = fetch_one(
        """SELECT id, status
           FROM contests
           WHERE id = %s
           LIMIT 1""",
        (contest_id,),
    )

    if not contest:
        raise ServiceError("Contest not found.", 404)

    if contest["status"] != "upcoming":
        raise ServiceError("Only upcoming contests can be registered.", 400)

    execute_write(
        """INSERT INTO contest_registrations (user_id, contest_id)
           VALUES (%s, %s)
           ON DUPLICATE KEY UPDATE contest_id = contest_id""",
        (user_id, contest_id),
    )

    return {"contestId": contest_id}


def verify_contest_password_access(user_id, contest_id, password):
    contest = fetch_one(
        """SELECT id, requires_password, password_hash
           FROM contests
           WHERE id = %s
           LIMIT 1""",
        (contest_id,),
    )

    if not contest:
        raise ServiceError("Contest not found.", 404)

    if not contest["requires_password"]:
        return {"contestId": contest_id}

    password_hash = contest["password_hash"] or ""

    try:
        is_matched = bool(password_hash) and bcrypt.checkpw(
            password.encode("utf-8"),
            password_hash.encode("utf-8"),
        )
    except ValueError:
        is_matched = False

    if not is_matched:
        raise ServiceError("Incorrect contest password.", 401)

    execute_write(
        """INSERT INTO contest_access (user_id, contest_id)
           VALUES (%s, %s)
           ON DUPLICATE KEY UPDATE granted_at = CURRENT_TIMESTAMP""",
        (user_id, contest_id),
    )

    return {"contestId": contest_id}
