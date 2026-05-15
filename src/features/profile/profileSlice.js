import { createSlice } from "@reduxjs/toolkit";
import { loginUser, signupUser } from "../auth/authThunks";
import { fetchProfile, saveProfile } from "./profileThunks";

const emptyProfile = {
  name: "",
  handle: "",
  email: "",
  dept: "",
  bio: "",
  git: "",
  avatarUrl: "",
  id: "",
  joinedDate: "",
  rating: 0,
  ratingDelta: "+0",
  ratingTier: "UNRATED",
  rank: "--",
  rankDelta: 0,
  solved: 0,
  solvedDelta: 0,
  totalSubmissions: 0,
  acRate: "0%",
  streak: 0,
  bestStreak: 0,
  contestCount: 0,
  ratedContests: 0,
};

const initialState = {
  user: { ...emptyProfile },
  submissions: [],
  contests: [],
  achievements: [],
  ratingHistory: { "6m": [], "1y": [], all: [] },
  difficulties: [],
  activities: [],
  isLoading: false,
  isSaving: false,
  hasFetched: false,
  error: null,
  saveError: null,
};

function getProfileFromAuthUser(user = {}) {
  return {
    ...emptyProfile,
    name: user.name || "",
    handle: user.handle || user.userhandle || user.name || "",
    email: user.email || "",
    id: user.id ? `User #${user.id}` : "",
  };
}

function resetProfileState(state, user = null) {
  state.user = user ? getProfileFromAuthUser(user) : { ...emptyProfile };
  state.submissions = [];
  state.contests = [];
  state.achievements = [];
  state.ratingHistory = { "6m": [], "1y": [], all: [] };
  state.difficulties = [];
  state.activities = [];
  state.isLoading = false;
  state.isSaving = false;
  state.hasFetched = false;
  state.error = null;
  state.saveError = null;
}

function applyProfilePayload(state, payload = {}) {
  state.user = { ...emptyProfile, ...(payload.profile || {}) };
  state.submissions = payload.submissions || [];
  state.contests = payload.contests || [];
  state.achievements = payload.achievements || [];
  state.ratingHistory = payload.ratingHistory || { "6m": [], "1y": [], all: [] };
  state.difficulties = payload.difficulties || [];
  state.activities = payload.activities || [];
}

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileErrors(state) {
      state.error = null;
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
        applyProfilePayload(state, action.payload);
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
        state.isSaving = false;
        state.hasFetched = true;
        state.saveError = null;
        applyProfilePayload(state, action.payload);
      })
      .addCase(saveProfile.rejected, (state, action) => {
        state.isSaving = false;
        state.saveError = action.payload || "Failed to update profile.";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        resetProfileState(state, action.payload?.user);
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        resetProfileState(state, action.payload?.user);
      })
      .addCase("auth/logout", (state) => {
        resetProfileState(state);
      });
  },
});

export const { clearProfileErrors } = profileSlice.actions;

export default profileSlice.reducer;
