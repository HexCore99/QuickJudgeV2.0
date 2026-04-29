import { createSelector } from "@reduxjs/toolkit";

export const selectProfileState = (state) => state.profile;
export const selectProfileUser = (state) => state.profile.user;
export const selectProfileSubmissions = (state) => state.profile.submissions;
export const selectProfileContests = (state) => state.profile.contests;
export const selectProfileAchievements = (state) => state.profile.achievements;
export const selectProfileActivities = (state) => state.profile.activities;
export const selectProfileDifficulties = (state) => state.profile.difficulties;
export const selectProfileRatingHistory = (state) =>
  state.profile.ratingHistory;
export const selectProfileLoading = (state) => state.profile.isLoading;
export const selectProfileHasFetched = (state) => state.profile.hasFetched;
export const selectProfileError = (state) => state.profile.error;
export const selectProfileSaving = (state) => state.profile.isSaving;
export const selectProfileSaveError = (state) => state.profile.saveError;

export const selectProfileContestCount = createSelector(
  [selectProfileContests],
  (contests) => contests.length,
);

export const selectProfileSubmissionCount = createSelector(
  [selectProfileSubmissions],
  (submissions) => submissions.length,
);
