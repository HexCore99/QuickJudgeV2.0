import { createSlice } from "@reduxjs/toolkit";
import { fetchProfile, saveProfile } from "./profileThunks";

const emptyRatingHistory = {
  "6m": [],
  "1y": [],
  all: [],
};

export const emptyProfileData = {
  profile: {
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
  },
  submissions: [],
  contests: [],
  achievements: [],
  activities: [],
  ratingHistory: emptyRatingHistory,
  difficulties: [
    {
      label: "Easy",
      solved: 0,
      total: 0,
      color: "#16a34a",
      tw: "bg-green-600",
    },
    {
      label: "Medium",
      solved: 0,
      total: 0,
      color: "#d97706",
      tw: "bg-amber-500",
    },
    { label: "Hard", solved: 0, total: 0, color: "#dc2626", tw: "bg-red-600" },
  ],
};

function normalizeProfilePayload(payload = {}) {
  return {
    ...emptyProfileData,
    ...payload,
    profile: {
      ...emptyProfileData.profile,
      ...(payload.profile || {}),
    },
    ratingHistory: {
      ...emptyProfileData.ratingHistory,
      ...(payload.ratingHistory || {}),
    },
    submissions: payload.submissions || [],
    contests: payload.contests || [],
    achievements: payload.achievements || [],
    activities: payload.activities || [],
    difficulties: payload.difficulties || emptyProfileData.difficulties,
  };
}

const initialState = {
  data: emptyProfileData,
  isLoading: false,
  hasFetched: false,
  isSaving: false,
  error: null,
  saveError: null,
};

function resetProfileState(state) {
  state.data = emptyProfileData;
  state.isLoading = false;
  state.hasFetched = false;
  state.isSaving = false;
  state.error = null;
  state.saveError = null;
}

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileError(state) {
      state.error = null;
      state.saveError = null;
    },
    resetProfile: resetProfileState,
  },
  extraReducers: (builder) => {
    builder
      .addCase("auth/logout", resetProfileState)
      .addCase("auth/loginUser/fulfilled", resetProfileState)
      .addCase("auth/signupUser/fulfilled", resetProfileState)
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasFetched = true;
        state.error = null;
        state.data = normalizeProfilePayload(action.payload);
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
        state.data = normalizeProfilePayload(action.payload);
      })
      .addCase(saveProfile.rejected, (state, action) => {
        state.isSaving = false;
        state.saveError = action.payload || "Failed to update profile.";
      });
  },
});

export const { clearProfileError, resetProfile } = profileSlice.actions;

export default profileSlice.reducer;
