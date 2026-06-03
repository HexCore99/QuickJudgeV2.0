import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  banAdminUserApi,
  createAdminUserApi,
  getAdminUsersApi,
  suspendAdminUserApi,
  unsuspendAdminUserApi,
} from "./adminUsersApi";

export const fetchAdminUsers = createAsyncThunk(
  "adminUsers/fetchAdminUsers",
  async (_, thunkAPI) => {
    try {
      return await getAdminUsersApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to fetch users.",
      );
    }
  },
);

export const createAdminUserThunk = createAsyncThunk(
  "adminUsers/createAdminUser",
  async (payload, thunkAPI) => {
    try {
      return await createAdminUserApi(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to create admin.",
      );
    }
  },
);

export const suspendAdminUserThunk = createAsyncThunk(
  "adminUsers/suspendAdminUser",
  async (payload, thunkAPI) => {
    try {
      return await suspendAdminUserApi(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to suspend account.",
      );
    }
  },
);

export const unsuspendAdminUserThunk = createAsyncThunk(
  "adminUsers/unsuspendAdminUser",
  async (userId, thunkAPI) => {
    try {
      return await unsuspendAdminUserApi(userId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to unsuspend account.",
      );
    }
  },
);

export const banAdminUserThunk = createAsyncThunk(
  "adminUsers/banAdminUser",
  async (payload, thunkAPI) => {
    try {
      return await banAdminUserApi(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to ban account.",
      );
    }
  },
);
