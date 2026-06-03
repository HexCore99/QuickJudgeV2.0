import { createSlice } from "@reduxjs/toolkit";
import { fetchGlobalLeaderboard } from "./leaderboardThunks";

const initialState = {
  entries: [],
  isLoading: false,
  error: null,
};

const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGlobalLeaderboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGlobalLeaderboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.entries = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchGlobalLeaderboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch leaderboard.";
      });
  },
});

export default leaderboardSlice.reducer;
