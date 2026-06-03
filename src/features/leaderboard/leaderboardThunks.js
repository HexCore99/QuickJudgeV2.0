import { createAsyncThunk } from "@reduxjs/toolkit";
import { getGlobalLeaderboardApi } from "./leaderboardApi";

export const fetchGlobalLeaderboard = createAsyncThunk(
  "leaderboard/fetchGlobalLeaderboard",
  async (_, thunkAPI) => {
    try {
      return await getGlobalLeaderboardApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to fetch leaderboard.",
      );
    }
  },
);
