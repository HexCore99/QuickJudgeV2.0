import { createSlice } from "@reduxjs/toolkit";
import { fetchProfile, saveProfile } from "./profileThunks";

const initialState = {
  user: null,
  submissions: [],
  contests: [],
  achievements: [],
  activities: [],
  difficulties: [],
  ratingHistory: null,
  isLoading: false,
  hasFetched: false,
  error: null,
  isSaving: false,
  saveError: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileError(state) {
      state.error = null;
    },

    clearProfileSaveError(state) {
      state.saveError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasFetched = true;
        state.error = null;
        state.user = action.payload.user || null;
        state.submissions = action.payload.submissions || [];
        state.contests = action.payload.contests || [];
        state.achievements = action.payload.achievements || [];
        state.activities = action.payload.activities || [];
        state.difficulties = action.payload.difficulties || [];
        state.ratingHistory = action.payload.ratingHistory || null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch profile.";
      })

      .addCase(saveProfile.pending, (state) => {
        state.isSaving = true;
        state.saveError = null;
      })
      .addCase(saveProfile.fulfilled, (state, action) => {
        const updatedUser = action.payload.user || action.payload;

        state.isSaving = false;
        state.saveError = null;
        state.user = {
          ...state.user,
          ...updatedUser,
        };
      })
      .addCase(saveProfile.rejected, (state, action) => {
        state.isSaving = false;
        state.saveError = action.payload || "Failed to update profile.";
      });
  },
});

export const { clearProfileError, clearProfileSaveError } =
  profileSlice.actions;

export default profileSlice.reducer;
