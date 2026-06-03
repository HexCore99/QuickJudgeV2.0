export const selectGlobalLeaderboard = (state) => state.leaderboard.entries;
export const selectGlobalLeaderboardLoading = (state) =>
  state.leaderboard.isLoading;
export const selectGlobalLeaderboardError = (state) => state.leaderboard.error;
