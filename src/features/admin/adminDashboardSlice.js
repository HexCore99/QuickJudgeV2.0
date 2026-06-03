import { createSlice } from "@reduxjs/toolkit";
import { fetchAdminDashboard } from "./adminDashboardThunks";

const initialState = {
  stats: [],
  contests: [],
  problems: [],
  isLoading: false,
  error: null,
};

const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = Array.isArray(action.payload?.stats)
          ? action.payload.stats
          : [];
        state.contests = Array.isArray(action.payload?.contests)
          ? action.payload.contests
          : [];
        state.problems = Array.isArray(action.payload?.problems)
          ? action.payload.problems
          : [];
        state.error = null;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch admin dashboard.";
      });
  },
});

export default adminDashboardSlice.reducer;
