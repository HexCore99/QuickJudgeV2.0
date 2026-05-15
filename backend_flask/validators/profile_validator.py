import re


def _text(value):
    return value.strip() if isinstance(value, str) else ""


def validate_profile_payload(payload=None):
    payload = payload or {}
    name = _text(payload.get("name"))
    has_email = "email" in payload
    email = _text(payload.get("email")).lower()
    dept = _text(payload.get("dept"))
    bio = _text(payload.get("bio"))
    git = _text(payload.get("git"))
    avatar_url = _text(payload.get("avatarUrl"))
    current_password = payload.get("currentPassword") or ""
    new_password = payload.get("newPassword") or ""
    confirm_password = payload.get("confirmPassword") or ""

    if not name:
        return "Name is required."

    if len(name) > 100:
        return "Name must be 100 characters or fewer."

    if has_email and not email:
        return "Email is required."

    if email and len(email) > 255:
        return "Email must be 255 characters or fewer."

    if email and not re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", email):
        return "Enter a valid email address."

    if len(dept) > 150:
        return "Department must be 150 characters or fewer."

    if len(bio) > 1000:
        return "Bio must be 1000 characters or fewer."

    if len(git) > 255:
        return "GitHub URL must be 255 characters or fewer."

    if git and not re.match(r"^https?://.+", git, flags=re.IGNORECASE):
        return "GitHub URL must start with http:// or https://."

    if len(avatar_url) > 255:
        return "Avatar URL must be 255 characters or fewer."

    if (
        avatar_url
        and not re.match(r"^https?://.+", avatar_url, flags=re.IGNORECASE)
        and not avatar_url.startswith("/uploads/avatars/")
    ):
        return "Avatar URL must be an http(s) URL or a local uploaded avatar path."

    if (new_password or confirm_password) and not current_password:
        return "Current password is required to change password."

    if new_password or confirm_password:
        if len(new_password) < 6:
            return "New password must be at least 6 characters."

        if new_password != confirm_password:
            return "New password and confirmation do not match."

    return None
