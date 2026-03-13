export const selectLiveContests = (state) => state.contests.live;
export const selectUpcomingContests = (state) => state.contests.upcoming;
export const selectPastContests = (state) => state.contests.past;
export const selectContestsLoading = (state) => state.contests.isLoading;
export const selectContestsError = (state) => state.contests.error;
