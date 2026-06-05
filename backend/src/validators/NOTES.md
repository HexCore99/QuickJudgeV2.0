# Validators Notes

Validators do lightweight request checks before controllers call services. They should return a message string when invalid and `null` when valid.

## Password Rule

### `password.validator.js`

- Owns the backend strong-password rule.
- Main exports:
  - `MIN_PASSWORD_LENGTH`
  - `validateStrongPassword(password, label = "Password")`
- Current rule:
  - at least 8 characters
  - at least one uppercase letter
  - at least one lowercase letter
  - at least one number
  - at least one special character
- Returns one clear message at a time, which is easier to show in the UI than one large regex failure.
- Used by signup/reset auth logic, create-admin validation, and profile password-change validation.

## File Map

### `adminUsers.validator.js`

- Validates super-admin user-management payloads.
- `validateCreateAdminPayload()` uses `validateStrongPassword()` for new admin passwords.

### `profile.validator.js`

- Validates profile updates.
- `validateProfilePayload()` uses `validateStrongPassword(newPassword, "New password")` when a user changes password.

### `contest.validator.js`

- Validates contest ids, contest password input, contest problem code, announcements, contest creation payloads, and schedule changes.

### `discussion.validator.js`

- Validates discussion/reply ids plus discussion and reply payloads.

### `draft.validator.js`

- Validates code draft query params and save payloads.

### `problem.validator.js`

- Validates problem ids, problem payloads, publication updates, and editorials.

### `submission.validator.js`

- Validates run/submit code payloads.
