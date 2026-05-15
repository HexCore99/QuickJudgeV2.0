import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createContestApi,
  getContestDetailsApi,
  getContestsApi,
  registerUpcomingContestApi,
  verifyContestPasswordApi,
  updateContestScheduleApi,
  deleteContestApi,
  getContestSubmissionsApi,
  getContestLeaderboardApi,
  getContestAnnouncementsApi,
  createContestAnnouncementApi,
  updateContestAnnouncementApi,
  deleteContestAnnouncementApi,
  getContestQueriesApi,
  submitQueryApi,
  replyContestQueryApi,
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

export const createContestThunk = createAsyncThunk(
  "contests/createContest",
  async (payload, thunkAPI) => {
    try {
      return await createContestApi(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to create contest.",
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

export const updateContestScheduleThunk = createAsyncThunk(
  "contests/updateContestSchedule",
  async ({ contestId, startTime, endTime }, thunkAPI) => {
    try {
      return await updateContestScheduleApi(contestId, { startTime, endTime });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to update contest schedule.",
      );
    }
  },
);

export const deleteContestThunk = createAsyncThunk(
  "contests/deleteContest",
  async (contestId, thunkAPI) => {
    try {
      return await deleteContestApi(contestId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to delete contest.",
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
        error.message || "Failed to fetch submissions.",
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

export const fetchContestAnnouncements = createAsyncThunk(
  "contests/fetchContestAnnouncements",
  async (contestId, thunkAPI) => {
    try {
      return await getContestAnnouncementsApi(contestId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to fetch announcements.",
      );
    }
  },
);

export const createContestAnnouncement = createAsyncThunk(
  "contests/createContestAnnouncement",
  async ({ contestId, title, body }, thunkAPI) => {
    try {
      return await createContestAnnouncementApi(contestId, { title, body });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to create announcement.",
      );
    }
  },
);

export const updateContestAnnouncement = createAsyncThunk(
  "contests/updateContestAnnouncement",
  async ({ contestId, announcementId, title, body }, thunkAPI) => {
    try {
      return await updateContestAnnouncementApi(contestId, announcementId, {
        title,
        body,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to update announcement.",
      );
    }
  },
);

export const deleteContestAnnouncement = createAsyncThunk(
  "contests/deleteContestAnnouncement",
  async ({ contestId, announcementId }, thunkAPI) => {
    try {
      return await deleteContestAnnouncementApi(contestId, announcementId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to delete announcement.",
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
        error.message || "Failed to fetch queries.",
      );
    }
  },
);

export const submitQuery = createAsyncThunk(
  "contests/submitQuery",
  async ({ contestId, question }, thunkAPI) => {
    try {
      return await submitQueryApi(contestId, question);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to submit query.",
      );
    }
  },
);

export const replyContestQuery = createAsyncThunk(
  "contests/replyContestQuery",
  async ({ contestId, queryId, answer }, thunkAPI) => {
    try {
      return await replyContestQueryApi(contestId, queryId, answer);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to reply to query.",
      );
    }
  },
);
//
