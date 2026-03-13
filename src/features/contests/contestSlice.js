import { createSlice } from "@reduxjs/toolkit";
import { fetchContests } from "./contestsThunks";

const initialState = {
  live: [],
  upcoming: [],
  past: [],
  isLoading: false,
  error: null,
};

const contestsSlice = createSlice({
  name: "contests",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.live = action.payload.live;
        state.upcoming = action.payload.upcoming;
        state.past = action.payload.past;
      })
      .addCase(fetchContests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch contests.";
      });
  },
});

export default contestsSlice.reducer;
