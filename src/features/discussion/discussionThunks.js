import { createAsyncThunk } from "@reduxjs/toolkit";
import { getDiscussionsApi } from "./discussionAPI";

export const fetchDiscussions = createAsyncThunk(
  "discussion/fetchDiscussions",
  async (_, thunkAPI) => {
    try {
      return await getDiscussionsApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to fetch discussions.",
      );
    }
  },
);
