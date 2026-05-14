from config.db import execute_write, fetch_one

_schema_checked = False


def ensure_user_session_schema():
    global _schema_checked

    if _schema_checked:
        return

    row = fetch_one(
        """
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'users'
          AND COLUMN_NAME = 'active_session_id'
        LIMIT 1
        """,
    )

    if not row:
        execute_write(
            """
            ALTER TABLE users
            ADD COLUMN active_session_id VARCHAR(64) NULL
            """,
        )

    _schema_checked = True
