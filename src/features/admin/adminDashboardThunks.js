import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAdminDashboardApi } from "./adminDashboardApi";

export const fetchAdminDashboard = createAsyncThunk(
  "adminDashboard/fetchAdminDashboard",
  async (_, thunkAPI) => {
    try {
      return await getAdminDashboardApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to fetch admin dashboard.",
      );
    }
  },
);
