export const selectGlobalLeaderboard = (state) => state.leaderboard.data;
export const selectGlobalLeaderboardLoading = (state) =>
  state.leaderboard.isLoading;
export const selectGlobalLeaderboardHasFetched = (state) =>
  state.leaderboard.hasFetched;
export const selectGlobalLeaderboardError = (state) => state.leaderboard.error;