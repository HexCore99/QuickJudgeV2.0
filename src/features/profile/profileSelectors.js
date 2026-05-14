export const selectProfileData = (state) => state.profile.data;
export const selectProfileUser = (state) => state.profile.data.profile;
export const selectProfileSubmissions = (state) =>
  state.profile.data.submissions;
export const selectProfileContests = (state) => state.profile.data.contests;
export const selectProfileAchievements = (state) =>
  state.profile.data.achievements;
export const selectProfileActivities = (state) => state.profile.data.activities;
export const selectProfileRatingHistory = (state) =>
  state.profile.data.ratingHistory;
export const selectProfileDifficulties = (state) =>
  state.profile.data.difficulties;
export const selectProfileLoading = (state) => state.profile.isLoading;
export const selectProfileHasFetched = (state) => state.profile.hasFetched;
export const selectProfileSaving = (state) => state.profile.isSaving;
export const selectProfileError = (state) => state.profile.error;
export const selectProfileSaveError = (state) => state.profile.saveError;
