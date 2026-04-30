import { createSlice } from "@reduxjs/toolkit";
import { fetchGlobalLeaderboard } from "./leaderboardThunks";

const initialState = {
  data: [],
  isLoading: false,
  hasFetched: false,
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
        state.hasFetched = true;
        state.data = action.payload;
      })
      .addCase(fetchGlobalLeaderboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch global leaderboard.";
      });
  },
});

export default leaderboardSlice.reducer;