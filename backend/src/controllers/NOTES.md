# Controllers Notes

Controllers translate HTTP requests into validation, service calls, audit logs, and JSON responses.

## Auth Password Flow

### `auth.controller.js`

- `signup()` validates the new account password with `validateStrongPassword()` before hashing and saving the user.
- `resetPassword()` validates the new password with `validateStrongPassword()` before updating the stored password hash.
- The password rule itself lives in `backend/src/validators/password.validator.js`.
- `login()` does not check password strength; it only compares the submitted password against the stored hash.

## Main Controller Groups

### `adminUsers.controller.js`

- Handles super-admin user management and relies on `adminUsers.validator.js` for create/suspend/ban payload checks.

### `profile.controller.js`

- Handles profile reads, paginated profile-submission reads, profile updates, and avatar uploads.
- `getProfileSubmissions()` reads `page`, `limit`, and `filter` query params before calling the profile read service.
- Password-change validation happens in `profile.validator.js`.

### Other controllers

- `contest.controller.js` handles student/shared contest actions.
- `contestAdmin.controller.js` handles admin contest mutations.
- `problem.controller.js` handles problem CRUD/editorials/publication.
- `problem.controller.js` also passes `page`, `limit`, `search`, and `difficulty` query params into paginated problem-bank and admin-owned problem-list reads.
- `submission.controller.js` handles run/submit/history.
- `discussion.controller.js` handles discussion posts and replies.
- `auditLog.controller.js`, `adminDashboard.controller.js`, `leaderboard.controller.js`, and `draft.controller.js` are thin wrappers around their matching services.
