import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getContestAnnouncementsApi,
  getContestDetailsApi,
  getContestLeaderboardApi,
  getContestQueriesApi,
  getContestSubmissionsApi,
  getContestsApi,
  registerUpcomingContestApi,
  submitContestQueryApi,
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

export const registerUpcomingContest = createAsyncThunk(
  "contests/registerUpcomingContest",
  async (contestId, thunkAPI) => {
    try {
      return await registerUpcomingContestApi(contestId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to register for contest.",
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

export const fetchContestLeaderboard = createAsyncThunk(
  "contests/fetchContestLeaderboard",
  async (contestId, thunkAPI) => {
    try {
      return await getContestLeaderboardApi(contestId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to fetch leaderboard.",
      );
    }
  },
);

export const fetchContestSubmissions = createAsyncThunk(
  "contests/fetchContestSubmissions",
  async (contestId, thunkAPI) => {
    try {
      return await getContestSubmissionsApi(contestId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to fetch contest submissions.",
      );
    }
  },
);

export const fetchContestAnnouncements = createAsyncThunk(
  "contests/fetchContestAnnouncements",
  async (contestId, thunkAPI) => {
    try {
      return await getContestAnnouncementsApi(contestId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to fetch contest announcements.",
      );
    }
  },
);

export const fetchContestQueries = createAsyncThunk(
  "contests/fetchContestQueries",
  async (contestId, thunkAPI) => {
    try {
      return await getContestQueriesApi(contestId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to fetch contest queries.",
      );
    }
  },
);

export const submitQuery = createAsyncThunk(
  "contests/submitQuery",
  async ({ contestId, question }, thunkAPI) => {
    try {
      return await submitContestQueryApi({ contestId, question });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to submit your question.",
      );
    }
  },
);
