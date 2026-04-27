from flask import current_app, g, request

from services.contest_service import (
    ServiceError,
    get_contest_details_by_id,
    get_contests_for_user,
    register_user_for_upcoming_contest,
    verify_contest_password_access,
)
from utils.response import error_response, success_response
from validators.contest_validator import validate_contest_id, validate_contest_password


def get_contests():
    try:
        data = get_contests_for_user(g.user["id"])

        return success_response(200, "Contests fetched successfully.", data)
    except Exception as error:
        current_app.logger.exception("Get contests error")
        return error_response(
            getattr(error, "status_code", 500),
            str(error) or "Failed to fetch contests.",
        )


def get_contest_details(contest_id):
    try:
        validation_error = validate_contest_id(contest_id)

        if validation_error:
            return error_response(400, validation_error)

        data = get_contest_details_by_id(g.user["id"], contest_id)

        return success_response(200, "Contest details fetched successfully.", data)
    except Exception as error:
        current_app.logger.exception("Get contest details error")
        return error_response(
            getattr(error, "status_code", 500),
            str(error) or "Failed to fetch contest details.",
        )


def register_contest(contest_id):
    try:
        validation_error = validate_contest_id(contest_id)

        if validation_error:
            return error_response(400, validation_error)

        data = register_user_for_upcoming_contest(g.user["id"], contest_id)

        return success_response(200, "Contest registration successful.", data)
    except Exception as error:
        current_app.logger.exception("Register contest error")
        return error_response(
            getattr(error, "status_code", 500),
            str(error) or "Failed to register for contest.",
        )


def verify_contest_password(contest_id):
    try:
        contest_id_error = validate_contest_id(contest_id)

        if contest_id_error:
            return error_response(400, contest_id_error)

        body = request.get_json(silent=True) or {}
        password_error = validate_contest_password(body.get("password"))

        if password_error:
            return error_response(400, password_error)

        data = verify_contest_password_access(
            g.user["id"],
            contest_id,
            body.get("password"),
        )

        return success_response(200, "Contest password verified successfully.", data)
    except ServiceError as error:
        current_app.logger.exception("Verify contest password error")
        return error_response(error.status_code, str(error))
    except Exception as error:
        current_app.logger.exception("Verify contest password error")
        return error_response(
            getattr(error, "status_code", 500),
            str(error) or "Password verification failed.",
        )
