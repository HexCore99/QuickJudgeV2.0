import { createAsyncThunk } from "@reduxjs/toolkit";
import { getProfileApi, updateProfileApi } from "./profileApi";

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, thunkAPI) => {
    try {
      return await getProfileApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to fetch profile.",
      );
    }
  },
);

export const saveProfile = createAsyncThunk(
  "profile/saveProfile",
  async (profileData, thunkAPI) => {
    try {
      return await updateProfileApi(profileData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to update profile.",
      );
    }
  },
);
