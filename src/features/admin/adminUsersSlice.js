import { createSlice } from "@reduxjs/toolkit";
import {
  banAdminUserThunk,
  createAdminUserThunk,
  fetchAdminUsers,
  suspendAdminUserThunk,
  unsuspendAdminUserThunk,
} from "./adminUsersThunks";

const initialState = {
  users: [],
  isLoading: false,
  isMutating: false,
  error: null,
  actionError: null,
};

function upsertUser(users, nextUser) {
  const index = users.findIndex((user) => user.id === nextUser.id);

  if (index === -1) {
    users.unshift(nextUser);
    return;
  }

  users[index] = nextUser;
}

const adminUsersSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {
    clearAdminUsersActionError(state) {
      state.actionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch users.";
      })
      .addMatcher(
        (action) =>
          [
            createAdminUserThunk.pending.type,
            suspendAdminUserThunk.pending.type,
            unsuspendAdminUserThunk.pending.type,
            banAdminUserThunk.pending.type,
          ].includes(action.type),
        (state) => {
          state.isMutating = true;
          state.actionError = null;
        },
      )
      .addMatcher(
        (action) =>
          [
            createAdminUserThunk.fulfilled.type,
            suspendAdminUserThunk.fulfilled.type,
            unsuspendAdminUserThunk.fulfilled.type,
            banAdminUserThunk.fulfilled.type,
          ].includes(action.type),
        (state, action) => {
          state.isMutating = false;
          state.actionError = null;

          if (action.payload) {
            upsertUser(state.users, action.payload);
          }
        },
      )
      .addMatcher(
        (action) =>
          [
            createAdminUserThunk.rejected.type,
            suspendAdminUserThunk.rejected.type,
            unsuspendAdminUserThunk.rejected.type,
            banAdminUserThunk.rejected.type,
          ].includes(action.type),
        (state, action) => {
          state.isMutating = false;
          state.actionError = action.payload || "Action failed.";
        },
      );
  },
});

export const { clearAdminUsersActionError } = adminUsersSlice.actions;

export default adminUsersSlice.reducer;
