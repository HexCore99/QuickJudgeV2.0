import { createSelector } from "@reduxjs/toolkit";

export const selectContestFilters = (state) => state.contests.filters;
export const selectLiveContests = (state) => state.contests.live;
export const selectUpcomingContests = (state) => state.contests.upcoming;
export const selectPastContests = (state) => state.contests.past;
export const selectContestsLoading = (state) => state.contests.isLoading;
export const selectContestsHasFetched = (state) => state.contests.hasFetched;
export const selectContestsError = (state) => state.contests.error;

export const selectContestPasswordModal = (state) =>
  state.contests.passwordModal;

export const selectContestDetails = (state) =>
  state.contests.contestDetails.data;
export const selectContestDetailsLoading = (state) =>
  state.contests.contestDetails.isLoading;
export const selectContestDetailsError = (state) =>
  state.contests.contestDetails.error;

// Submissions
export const selectContestSubmissions = (state) =>
  state.contests.submissions.data;
export const selectContestSubmissionsLoading = (state) =>
  state.contests.submissions.isLoading;
export const selectContestSubmissionsError = (state) =>
  state.contests.submissions.error;

// Leaderboard
export const selectContestLeaderboard = (state) =>
  state.contests.leaderboard.data;
export const selectContestLeaderboardLoading = (state) =>
  state.contests.leaderboard.isLoading;
export const selectContestLeaderboardError = (state) =>
  state.contests.leaderboard.error;

// Announcements
export const selectContestAnnouncements = (state) =>
  state.contests.announcements.data;
export const selectContestAnnouncementsLoading = (state) =>
  state.contests.announcements.isLoading;
export const selectContestAnnouncementsError = (state) =>
  state.contests.announcements.error;
export const selectContestAnnouncementsSaving = (state) =>
  state.contests.announcements.isSaving;
export const selectContestAnnouncementsSaveError = (state) =>
  state.contests.announcements.saveError;

// Queries
export const selectContestQueries = (state) => state.contests.queries.data;
export const selectContestQueriesLoading = (state) =>
  state.contests.queries.isLoading;
export const selectContestQueriesError = (state) =>
  state.contests.queries.error;
export const selectContestQueriesSubmitting = (state) =>
  state.contests.queries.isSubmitting;
export const selectContestQueriesSubmitError = (state) =>
  state.contests.queries.submitError;
export const selectContestQueriesReplyingId = (state) =>
  state.contests.queries.replyingId;
export const selectContestQueriesReplyError = (state) =>
  state.contests.queries.replyError;

export const selectSortedUpcomingContests = createSelector(
  [selectUpcomingContests],
  (upcoming) =>
    [...upcoming].sort(
      (a, b) => Number(Boolean(b.registered)) - Number(Boolean(a.registered)),
    ),
);

export const selectRegisteredUpcomingIds = createSelector(
  [selectUpcomingContests],
  (upcoming) =>
    upcoming
      .filter((contest) => contest.registered)
      .map((contest) => contest.id),
);
//
