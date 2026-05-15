from flask import current_app, request

from services.profile_service import (
    get_profile_for_user,
    save_profile_avatar_for_user,
    update_profile_for_user,
)
from utils.response import error_response, success_response
from validators.profile_validator import validate_profile_payload


def _body():
    return request.get_json(silent=True) or {}


def _error_status(error):
    return getattr(error, "status_code", 500)


def get_profile():
    try:
        data = get_profile_for_user(request.user["id"])
        return success_response(200, "Profile fetched successfully.", data)
    except Exception as error:
        current_app.logger.exception("Get profile error")
        return error_response(
            _error_status(error),
            str(error) or "Failed to fetch profile.",
        )


def update_profile():
    payload = _body()

    try:
        validation_error = validate_profile_payload(payload)

        if validation_error:
            return error_response(400, validation_error)

        data = update_profile_for_user(request.user["id"], payload)
        return success_response(200, "Profile updated successfully.", data)
    except Exception as error:
        current_app.logger.exception("Update profile error")
        return error_response(
            _error_status(error),
            str(error) or "Failed to update profile.",
        )


def upload_profile_avatar():
    payload = _body()

    try:
        data = save_profile_avatar_for_user(
            request.user["id"],
            payload.get("imageData"),
        )
        return success_response(201, "Profile image uploaded successfully.", data)
    except Exception as error:
        current_app.logger.exception("Upload profile avatar error")
        return error_response(
            _error_status(error),
            str(error) or "Failed to upload profile image.",
        )
