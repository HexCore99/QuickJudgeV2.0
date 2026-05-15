from uuid import uuid4

from config.db import execute_write, fetch_all, fetch_one, get_connection

USER_HANDLE_MAX_LENGTH = 150
USER_HANDLE_INDEX_NAME = "uniq_users_userhandle"
_schema_checked = False


def get_handle_base(name):
    return str(name or "").strip() or "user"


def fit_handle_with_suffix(base, suffix):
    suffix_text = str(suffix)
    max_base_length = max(USER_HANDLE_MAX_LENGTH - len(suffix_text), 1)
    return f"{base[:max_base_length]}{suffix_text}"


def create_pending_handle():
    return f"__pending_{uuid4()}"[:USER_HANDLE_MAX_LENGTH]


def has_user_handle_column():
    return bool(
        fetch_one(
            """
            SELECT COLUMN_NAME
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME = 'users'
              AND COLUMN_NAME = 'userhandle'
            LIMIT 1
            """,
        ),
    )


def has_user_handle_unique_index():
    return bool(
        fetch_one(
            """
            SELECT INDEX_NAME
            FROM INFORMATION_SCHEMA.STATISTICS
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME = 'users'
              AND INDEX_NAME = %s
            LIMIT 1
            """,
            (USER_HANDLE_INDEX_NAME,),
        ),
    )


def is_user_handle_taken(connection, userhandle, exclude_user_id=None):
    params = [userhandle]
    sql = "SELECT id FROM users WHERE userhandle = %s"

    if exclude_user_id:
        sql += " AND id <> %s"
        params.append(exclude_user_id)

    sql += " LIMIT 1"

    with connection.cursor() as cursor:
        cursor.execute(sql, tuple(params))
        return cursor.fetchone() is not None


def get_fallback_handle(connection, base, user_id):
    suffix = str(user_id)
    candidate = fit_handle_with_suffix(base, suffix)
    attempt = 1

    while is_user_handle_taken(connection, candidate, user_id):
        suffix = f"{user_id}{attempt}"
        candidate = fit_handle_with_suffix(base, suffix)
        attempt += 1

    return candidate


def backfill_user_handles():
    rows = fetch_all(
        """
        SELECT id, name, userhandle
        FROM users
        ORDER BY id ASC
        """,
    )
    used_handles = set()

    for row in rows:
        current_handle = str(row.get("userhandle") or "").strip()
        base = get_handle_base(row.get("name"))
        next_handle = current_handle or base

        if next_handle in used_handles:
            next_handle = fit_handle_with_suffix(base, row["id"])

        attempt = 1
        while next_handle in used_handles:
            next_handle = fit_handle_with_suffix(base, f"{row['id']}{attempt}")
            attempt += 1

        if next_handle != row.get("userhandle"):
            execute_write(
                "UPDATE users SET userhandle = %s WHERE id = %s",
                (next_handle, row["id"]),
            )

        used_handles.add(next_handle)


def ensure_user_handle_schema():
    global _schema_checked

    if _schema_checked:
        return

    if not has_user_handle_column():
        execute_write(
            """
            ALTER TABLE users
            ADD COLUMN userhandle VARCHAR(150) NULL AFTER name
            """,
        )

    backfill_user_handles()

    execute_write(
        """
        ALTER TABLE users
        MODIFY userhandle VARCHAR(150) NOT NULL
        """,
    )

    if not has_user_handle_unique_index():
        execute_write(
            f"""
            ALTER TABLE users
            ADD UNIQUE KEY {USER_HANDLE_INDEX_NAME} (userhandle)
            """,
        )

    _schema_checked = True


def assign_user_handle_from_name(connection, user_id, name):
    base = get_handle_base(name)
    userhandle = (
        get_fallback_handle(connection, base, user_id)
        if is_user_handle_taken(connection, base, user_id)
        else base
    )

    with connection.cursor() as cursor:
        cursor.execute(
            "UPDATE users SET userhandle = %s WHERE id = %s",
            (userhandle, user_id),
        )

    return userhandle


def insert_user(connection, payload, userhandle):
    columns = ["name", "userhandle", "email", "password_hash", "role"]
    placeholders = ["%s", "%s", "%s", "%s", "%s"]
    values = [
        payload["name"],
        userhandle,
        payload["email"],
        payload["password_hash"],
        payload["role"],
    ]

    if payload.get("account_status"):
        columns.append("account_status")
        placeholders.append("%s")
        values.append(payload["account_status"])

    with connection.cursor() as cursor:
        cursor.execute(
            f"""
            INSERT INTO users ({", ".join(columns)})
            VALUES ({", ".join(placeholders)})
            """,
            tuple(values),
        )
        return cursor.lastrowid


def is_duplicate_user_handle_error(error):
    if getattr(error, "args", [None])[0] != 1062:
        return False

    return USER_HANDLE_INDEX_NAME in str(error)


def insert_user_with_unique_handle(connection, payload):
    base = get_handle_base(payload["name"])
    base_handle_is_taken = is_user_handle_taken(connection, base)
    initial_handle = create_pending_handle() if base_handle_is_taken else base
    should_apply_fallback = base_handle_is_taken

    try:
        insert_id = insert_user(connection, payload, initial_handle)
    except Exception as error:
        if base_handle_is_taken or not is_duplicate_user_handle_error(error):
            raise

        insert_id = insert_user(connection, payload, create_pending_handle())
        should_apply_fallback = True

    if not should_apply_fallback:
        return {
            "insert_id": insert_id,
            "userhandle": initial_handle,
        }

    userhandle = assign_user_handle_from_name(
        connection,
        insert_id,
        payload["name"],
    )

    return {
        "insert_id": insert_id,
        "userhandle": userhandle,
    }
