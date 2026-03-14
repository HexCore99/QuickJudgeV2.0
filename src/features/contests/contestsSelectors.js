export const selectLiveContests = (state) => state.contests.live;
export const selectUpcomingContests = (state) => state.contests.upcoming;
export const selectPastContests = (state) => state.contests.past;
export const selectContestsLoading = (state) => state.contests.isLoading;
export const selectContestsError = (state) => state.contests.error;

export const selectContestPasswordModal = (state) =>
  state.contests.passwordModal;

export const selectContestDetails = (state) =>
  state.contests.contestDetails.data;
export const selectContestDetailsLoading = (state) =>
  state.contests.contestDetails.isLoading;
export const selectContestDetailsError = (state) =>
  state.contests.contestDetails.error;
