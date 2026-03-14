import { createSlice } from "@reduxjs/toolkit";
import {
  fetchContestDetails,
  fetchContests,
  verifyContestPassword,
} from "./contestsThunks";

const initialState = {
  live: [],
  upcoming: [],
  past: [],
  isLoading: false,
  error: null,

  passwordModal: {
    isOpen: false,
    contest: null,
    password: "",
    error: null,
    isSubmitting: false,
  },

  contestDetails: {
    data: null,
    isLoading: false,
    error: null,
  },
};

const contestSlice = createSlice({
  name: "contests",
  initialState,
  reducers: {
    openContestPasswordModal(state, action) {
      state.passwordModal.isOpen = true;
      state.passwordModal.contest = action.payload;
      state.passwordModal.password = "";
      state.passwordModal.error = null;
      state.passwordModal.isSubmitting = false;
    },

    closeContestPasswordModal(state) {
      state.passwordModal.isOpen = false;
      state.passwordModal.contest = null;
      state.passwordModal.password = "";
      state.passwordModal.error = null;
      state.passwordModal.isSubmitting = false;
    },
    setContestPasswordInput(state, action) {
      state.passwordModal.password = action.payload;
    },
    clearContestPasswordError(state) {
      state.passwordModal.error = null;
    },
    clearContestDetails(state) {
      state.contestDetails.data = null;
      state.contestDetails.isLoading = false;
      state.contestDetails.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.live = action.payload.live;
        state.upcoming = action.payload.upcoming;
        state.past = action.payload.past;
      })
      .addCase(fetchContests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch contests.";
      })

      .addCase(verifyContestPassword.pending, (state) => {
        state.passwordModal.isSubmitting = true;
        state.passwordModal.error = null;
      })
      .addCase(verifyContestPassword.fulfilled, (state) => {
        state.passwordModal.isSubmitting = false;
        state.passwordModal.isOpen = false;
        state.passwordModal.contest = null;
        state.passwordModal.password = "";
        state.passwordModal.error = null;
      })
      .addCase(verifyContestPassword.rejected, (state, action) => {
        state.passwordModal.isSubmitting = false;
        state.passwordModal.error =
          action.payload || "Incorrect contest password.";
      })

      .addCase(fetchContestDetails.pending, (state) => {
        state.contestDetails.isLoading = true;
        state.contestDetails.error = null;
      })
      .addCase(fetchContestDetails.fulfilled, (state, action) => {
        state.contestDetails.isLoading = false;
        state.contestDetails.data = action.payload;
      })
      .addCase(fetchContestDetails.rejected, (state, action) => {
        state.contestDetails.isLoading = false;
        state.contestDetails.error =
          action.payload || "Failed to fetch contest details.";
      });
  },
});

export const {
  openContestPasswordModal,
  closeContestPasswordModal,
  setContestPasswordInput,
  clearContestPasswordError,
  clearContestDetails,
} = contestSlice.actions;

export default contestSlice.reducer;
