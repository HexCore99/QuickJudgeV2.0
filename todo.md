# TODOs

## Pending

- [x] Add max login attempts

## Completed

- [x] SuperAdmin Audit Logs
- [x] Add solved count in the contest leaderboard
  > Solved count should **not** affect score calculation.
- [x] Make `userhandle` unique system-wide
  - First, use the actual username as the handle.
  - If it is already taken, append the user ID to make it unique.
  - Add a unique constraint on the `userhandle` column in the database.
- [x] Save draft code from the editor in the database
  - Load the saved draft when the user opens the editor again.
- [x] Login Logs for Admins and SuperAdmins inside contests
- [x] One session at a time
- [x] Add a secure **Forgot Password** feature
- [x] Prevent admins from viewing problems after the contest starts
