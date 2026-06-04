import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createDiscussionApi,
  createReplyApi,
  deleteDiscussionApi,
  deleteReplyApi,
  getDiscussionsApi,
  updateDiscussionApi,
  updateReplyApi,
} from "./discussionsApi";

export const fetchDiscussions = createAsyncThunk(
  "discussions/fetchDiscussions",
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

export const createDiscussionThunk = createAsyncThunk(
  "discussions/createDiscussion",
  async ({ title, body }, thunkAPI) => {
    try {
      return await createDiscussionApi({ title, body });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to create discussion.",
      );
    }
  },
);

export const updateDiscussionThunk = createAsyncThunk(
  "discussions/updateDiscussion",
  async ({ discussionId, title, body }, thunkAPI) => {
    try {
      return await updateDiscussionApi(discussionId, { title, body });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to update discussion.",
      );
    }
  },
);

export const deleteDiscussionThunk = createAsyncThunk(
  "discussions/deleteDiscussion",
  async (discussionId, thunkAPI) => {
    try {
      await deleteDiscussionApi(discussionId);
      return { id: Number(discussionId) };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to delete discussion.",
      );
    }
  },
);

export const createReplyThunk = createAsyncThunk(
  "discussions/createReply",
  async ({ discussionId, body, parentReplyId = null }, thunkAPI) => {
    try {
      return await createReplyApi(discussionId, { body, parentReplyId });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Failed to create reply.");
    }
  },
);

export const updateReplyThunk = createAsyncThunk(
  "discussions/updateReply",
  async ({ discussionId, replyId, body }, thunkAPI) => {
    try {
      return await updateReplyApi(discussionId, replyId, { body });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Failed to update reply.");
    }
  },
);

export const deleteReplyThunk = createAsyncThunk(
  "discussions/deleteReply",
  async ({ discussionId, replyId }, thunkAPI) => {
    try {
      return await deleteReplyApi(discussionId, replyId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Failed to delete reply.");
    }
  },
);
