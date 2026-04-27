from flask import Blueprint

from controllers.contest_controller import (
    get_contest_details,
    get_contests,
    register_contest,
    verify_contest_password,
)
from middleware.auth_middleware import require_auth

contest_bp = Blueprint("contests", __name__)

protected_get_contests = require_auth(get_contests)

contest_bp.get("")(protected_get_contests)
contest_bp.get("/")(protected_get_contests)
contest_bp.get("/<contest_id>")(require_auth(get_contest_details))
contest_bp.post("/<contest_id>/register")(require_auth(register_contest))
contest_bp.post("/<contest_id>/verify-password")(require_auth(verify_contest_password))
