export const selectAdminUsers = (state) => state.adminUsers.users;
export const selectAdminUsersLoading = (state) => state.adminUsers.isLoading;
export const selectAdminUsersMutating = (state) => state.adminUsers.isMutating;
export const selectAdminUsersError = (state) => state.adminUsers.error;
export const selectAdminUsersActionError = (state) =>
  state.adminUsers.actionError;
