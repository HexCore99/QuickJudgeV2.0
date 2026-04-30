import { createSlice } from "@reduxjs/toolkit";
import {
  fetchContestAnnouncements,
  fetchContestDetails,
  fetchContestLeaderboard,
  fetchContestQueries,
  fetchContestSubmissions,
  fetchContests,
  registerUpcomingContest,
  submitQuery,
  verifyContestPassword,
} from "./contestsThunks";

const initialState = {
  live: [],
  upcoming: [],
  past: [],
  filters: [],
  isLoading: false,
  hasFetched: false,
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

  leaderboard: {
    data: null,
    isLoading: false,
    error: null,
  },

  submissions: {
    data: [],
    isLoading: false,
    error: null,
  },

  announcements: {
    data: [],
    isLoading: false,
    error: null,
  },

  queries: {
    data: [],
    isLoading: false,
    error: null,
    isSubmitting: false,
    submitError: null,
  },
};

const contestsSlice = createSlice({
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
      state.passwordModal.error = null;
    },

    clearContestPasswordError(state) {
      state.passwordModal.error = null;
    },

    clearContestDetails(state) {
      state.contestDetails.data = null;
      state.contestDetails.isLoading = false;
      state.contestDetails.error = null;
      state.leaderboard.data = null;
      state.leaderboard.isLoading = false;
      state.leaderboard.error = null;
      state.submissions.data = [];
      state.submissions.isLoading = false;
      state.submissions.error = null;
      state.announcements.data = [];
      state.announcements.isLoading = false;
      state.announcements.error = null;
      state.queries.data = [];
      state.queries.isLoading = false;
      state.queries.error = null;
      state.queries.isSubmitting = false;
      state.queries.submitError = null;
    },

    clearQueries(state) {
      state.queries.data = [];
      state.queries.isLoading = false;
      state.queries.error = null;
      state.queries.isSubmitting = false;
      state.queries.submitError = null;
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
        state.hasFetched = true;
        state.error = null;
        state.filters = action.payload.filters || [];
        state.live = action.payload.live || [];
        state.upcoming = action.payload.upcoming || [];
        state.past = action.payload.past || [];
      })
      .addCase(fetchContests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch contests.";
      })

      .addCase(registerUpcomingContest.fulfilled, (state, action) => {
        const contest = state.upcoming.find(
          (item) => item.id === action.payload.contestId,
        );

        if (contest) {
          contest.registered = true;
        }
      })
      .addCase(registerUpcomingContest.rejected, (state, action) => {
        state.error = action.payload || "Failed to register for contest.";
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
      })

      .addCase(fetchContestLeaderboard.pending, (state) => {
        state.leaderboard.isLoading = true;
        state.leaderboard.error = null;
      })
      .addCase(fetchContestLeaderboard.fulfilled, (state, action) => {
        state.leaderboard.isLoading = false;
        state.leaderboard.data = action.payload;
      })
      .addCase(fetchContestLeaderboard.rejected, (state, action) => {
        state.leaderboard.isLoading = false;
        state.leaderboard.error =
          action.payload || "Failed to fetch leaderboard.";
      })

      .addCase(fetchContestSubmissions.pending, (state) => {
        state.submissions.isLoading = true;
        state.submissions.error = null;
      })
      .addCase(fetchContestSubmissions.fulfilled, (state, action) => {
        state.submissions.isLoading = false;
        state.submissions.data = action.payload || [];
      })
      .addCase(fetchContestSubmissions.rejected, (state, action) => {
        state.submissions.isLoading = false;
        state.submissions.error =
          action.payload || "Failed to fetch contest submissions.";
      })

      .addCase(fetchContestAnnouncements.pending, (state) => {
        state.announcements.isLoading = true;
        state.announcements.error = null;
      })
      .addCase(fetchContestAnnouncements.fulfilled, (state, action) => {
        state.announcements.isLoading = false;
        state.announcements.data = action.payload || [];
      })
      .addCase(fetchContestAnnouncements.rejected, (state, action) => {
        state.announcements.isLoading = false;
        state.announcements.error =
          action.payload || "Failed to fetch contest announcements.";
      })

      .addCase(fetchContestQueries.pending, (state) => {
        state.queries.isLoading = true;
        state.queries.error = null;
      })
      .addCase(fetchContestQueries.fulfilled, (state, action) => {
        state.queries.isLoading = false;
        state.queries.data = action.payload || [];
      })
      .addCase(fetchContestQueries.rejected, (state, action) => {
        state.queries.isLoading = false;
        state.queries.error =
          action.payload || "Failed to fetch contest queries.";
      })

      .addCase(submitQuery.pending, (state) => {
        state.queries.isSubmitting = true;
        state.queries.submitError = null;
      })
      .addCase(submitQuery.fulfilled, (state, action) => {
        state.queries.isSubmitting = false;
        state.queries.data = [action.payload, ...state.queries.data];
      })
      .addCase(submitQuery.rejected, (state, action) => {
        state.queries.isSubmitting = false;
        state.queries.submitError =
          action.payload || "Failed to submit your question.";
      });
  },
});

export const {
  openContestPasswordModal,
  closeContestPasswordModal,
  setContestPasswordInput,
  clearContestPasswordError,
  clearContestDetails,
  clearQueries,
} = contestsSlice.actions;

export default contestsSlice.reducer;
