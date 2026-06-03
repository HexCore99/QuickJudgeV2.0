export const selectAdminDashboardStats = (state) =>
  state.adminDashboard.stats;
export const selectAdminDashboardContests = (state) =>
  state.adminDashboard.contests;
export const selectAdminDashboardProblems = (state) =>
  state.adminDashboard.problems;
export const selectAdminDashboardLoading = (state) =>
  state.adminDashboard.isLoading;
export const selectAdminDashboardError = (state) =>
  state.adminDashboard.error;
