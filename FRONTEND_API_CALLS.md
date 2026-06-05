# Frontend API Calls

Frontend API files wrap `fetch(...)` calls and are triggered by pages, components, or Redux thunks.
The `.jsx` names below show where each API call starts from the UI.

## Auth API Calls

### `authApi.js`

- `signupApi()` is triggered from `SignupPage.jsx`.
- `loginApi()` is triggered from `LoginPage.jsx`.
- `forgotPasswordApi()` is triggered from `ForgotPasswordPage.jsx`.
- `resetPasswordApi()` is triggered from `ResetPasswordPage.jsx`.

## Profile API Calls

### `profileApi.js`

- `getProfileApi()` is triggered from `ProfilePage.jsx`, `AdminSettingsPage.jsx`, and `ProfileDropdown.jsx`.
- `getProfileSubmissionsApi()` is triggered from `ProfilePage.jsx` for the paginated submissions tab.
- `updateProfileApi()` is triggered from `ProfilePage.jsx` and `AdminSettingsPage.jsx`.
- `uploadProfileAvatarApi()` is triggered from `ProfilePage.jsx` and `AdminSettingsPage.jsx`.

## Contest API Calls

### `contestsApi.js`

- `getContestsApi()` is triggered from `PastContestsPage.jsx`, `ContestPage.jsx`, `CreateContestPage.jsx`, and `AdminContestsPage.jsx`.
- `createContestApi()` is triggered from `CreateContestPage.jsx`.
- `registerUpcomingContestApi()` is triggered from `ContestPage.jsx`.
- `verifyContestPasswordApi()` is triggered from `ContestPage.jsx`.
- `getContestDetailsApi()` is triggered from `ProblemPage.jsx`, `ContestLayoutPage.jsx`, and `AdminContestLayoutPage.jsx`.
- `getContestProblemApi()` is triggered from `ProblemPage.jsx`.
- `updateContestScheduleApi()` is triggered from `CreateContestPage.jsx`.
- `deleteContestApi()` is triggered from `AdminContestsPage.jsx`.
- `getContestSubmissionsApi()` is triggered from `ContestSubmissionsPage.jsx` and `AdminContestSubmissionsPage.jsx`.
- `getContestLeaderboardApi()` is triggered from `ContestLeaderboardPage.jsx`.
- `getContestAnnouncementsApi()` is triggered from `ContestAnnouncementsPage.jsx`, `AdminContestAnnouncementsPage.jsx`, and `ContestTabs.jsx`.
- `createContestAnnouncementApi()` is triggered from `AdminContestAnnouncementsPage.jsx`.
- `updateContestAnnouncementApi()` is triggered from `AdminContestAnnouncementsPage.jsx`.
- `deleteContestAnnouncementApi()` is triggered from `AdminContestAnnouncementsPage.jsx`.
- `getContestQueriesApi()` is triggered from `ContestQueriesPage.jsx` and `AdminContestQueriesPage.jsx`.
- `submitQueryApi()` is triggered from `ContestQueriesPage.jsx`.
- `replyContestQueryApi()` is triggered from `AdminContestQueriesPage.jsx`.

## Problem API Calls

### `problemsApi.js`

- `getProblemBankApi()` is triggered from `StudentProblemBankPage.jsx`, `CreateContestPage.jsx`, and `ProblemBreakdown.jsx`.
- `getProblemBankApi()` sends `page`, `limit`, `search`, and `difficulty` when triggered from the paginated student problem-bank page.
- `getProblemBankProblemApi()` is triggered from `ProblemPage.jsx`.
- `getMyProblemsApi()` is triggered from `ProblemBankPage.jsx`, `EditorialsPage.jsx`, and `CreateContestPage.jsx`.
- `getMyProblemsApi()` sends `page`, `limit`, `search`, and `difficulty` when triggered from the paginated admin problem-bank page.
- `getMyProblemApi()` is triggered from `CreateProblemPage.jsx`.
- `getProblemCloneSourceApi()` is triggered from `CreateContestPage.jsx`.
- `createProblemApi()` is triggered from `CreateProblemPage.jsx`.
- `updateProblemApi()` is triggered from `CreateProblemPage.jsx`.
- `deleteProblemApi()` is triggered from `ProblemBankPage.jsx`.
- `updateProblemPublicationApi()` is triggered from `ProblemBankPage.jsx`.
- `getProblemEditorialApi()` is triggered from `EditorialsPage.jsx`.
- `saveProblemEditorialApi()` is triggered from `EditorialsPage.jsx`.

## Submission API Calls

### `submissionsApi.js`

- `runCodeApi()` is triggered from `CodeEditorPanel.jsx`.
- `submitCodeApi()` is triggered from `CodeEditorPanel.jsx`.
- `getProblemSubmissionsApi()` is triggered from `ProblemStatement.jsx`.

## Draft API Calls

### `draftsApi.js`

- `getDraftApi()` is triggered from `CodeEditorPanel.jsx`.
- `saveDraftApi()` is triggered from `CodeEditorPanel.jsx`.
- `deleteDraftApi()` is exported, but no `.jsx` file currently triggers it.

## Discussion API Calls

### `discussionsApi.js`

- `getDiscussionsApi()` is triggered from `DiscussionPage.jsx`.
- `createDiscussionApi()` is triggered from `CreateDiscussionForm.jsx`.
- `updateDiscussionApi()` is triggered from `DiscussionDetail.jsx`.
- `deleteDiscussionApi()` is triggered from `DiscussionDetail.jsx`.
- `createReplyApi()` is triggered from `DiscussionDetail.jsx`.
- `updateReplyApi()` is triggered from `DiscussionDetail.jsx`.
- `deleteReplyApi()` is triggered from `DiscussionDetail.jsx`.

## Leaderboard API Calls

### `leaderboardApi.js`

- `getGlobalLeaderboardApi()` is triggered from `GlobalLeaderboardPage.jsx`.

## Admin API Calls

### `adminDashboardApi.js`

- `getAdminDashboardApi()` is triggered from `AdminDashboard.jsx`.

### `adminAuditLogsApi.js`

- `getAdminAuditLogsApi()` is triggered from `AdminAuditLogsPage.jsx`.

### `adminUsersApi.js`

- `getAdminUsersApi()` is triggered from `AdminUsersPage.jsx`.
- `createAdminUserApi()` is triggered from `AdminUsersPage.jsx`.
- `suspendAdminUserApi()` is triggered from `AdminUsersPage.jsx`.
- `unsuspendAdminUserApi()` is triggered from `AdminUsersPage.jsx`.
- `banAdminUserApi()` is triggered from `AdminUsersPage.jsx`.
