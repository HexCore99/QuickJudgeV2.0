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
