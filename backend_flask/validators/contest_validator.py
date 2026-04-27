def validate_contest_id(contest_id):
    if not isinstance(contest_id, str) or not contest_id.strip():
        return "Contest id is required."

    return None


def validate_contest_password(password):
    if not isinstance(password, str) or not password.strip():
        return "Contest password is required."

    return None
