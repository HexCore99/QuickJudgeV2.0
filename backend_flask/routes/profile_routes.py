from controllers.profile_controller import (
    get_profile,
    update_profile,
    upload_profile_avatar,
)
from middleware.auth_middleware import require_auth


def register_profile_routes(app):
    app.get("/api/profile")(require_auth(get_profile))
    app.post("/api/profile/avatar")(require_auth(upload_profile_avatar))
    app.patch("/api/profile")(require_auth(update_profile))
