import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getContestDetailsApi,
  getContestsApi,
  verifyContestPasswordApi,
} from "./contestsApi";

export const fetchContests = createAsyncThunk(
  "contests/fetchContests",
  async (_, thunkAPI) => {
    try {
      return await getContestsApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to fetch contests.",
      );
    }
  },
);

export const verifyContestPassword = createAsyncThunk(
  "contests/verifyContestPassword",
  async ({ contestId, password }, thunkAPI) => {
    try {
      return await verifyContestPasswordApi({ contestId, password });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Password verification failed.",
      );
    }
  },
);

export const fetchContestDetails = createAsyncThunk(
  "contests/fetchContestDetails",
  async (contestId, thunkAPI) => {
    try {
      return await getContestDetailsApi(contestId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to fetch contest details.",
      );
    }
  },
);
