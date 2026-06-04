import { createSlice } from "@reduxjs/toolkit";
import {
  createDiscussionThunk,
  createReplyThunk,
  deleteDiscussionThunk,
  deleteReplyThunk,
  fetchDiscussions,
  updateDiscussionThunk,
  updateReplyThunk,
} from "./discussionsThunks";

function buildList(discussions) {
  return discussions.map((discussion) => ({
    id: discussion.id,
    title: discussion.title,
    authorName: discussion.authorName,
    replyCount: discussion.replies?.length || 0,
    createdAt: discussion.createdAt,
  }));
}

function replaceDiscussion(state, discussion) {
  const index = state.discussions.findIndex((item) => item.id === discussion.id);

  if (index === -1) {
    state.discussions.unshift(discussion);
  } else {
    state.discussions[index] = discussion;
  }

  state.list = buildList(state.discussions);
}

const initialState = {
  list: [],
  discussions: [],
  selectedId: null,
  mode: "idle",
  editingDiscussionId: null,
  editingReplyId: null,
  isLoading: false,
  error: null,
  isSaving: false,
  saveError: null,
};

const discussionsSlice = createSlice({
  name: "discussions",
  initialState,
  reducers: {
    selectDiscussion(state, action) {
      state.selectedId = action.payload;
      state.mode = "viewing";
      state.editingDiscussionId = null;
      state.editingReplyId = null;
      state.saveError = null;
    },

    startCreating(state) {
      state.mode = "creating";
      state.selectedId = null;
      state.editingDiscussionId = null;
      state.editingReplyId = null;
      state.saveError = null;
    },

    cancelCreating(state) {
      state.mode = state.selectedId ? "viewing" : "idle";
      state.saveError = null;
    },

    startEditingDiscussion(state, action) {
      state.editingDiscussionId = action.payload;
      state.editingReplyId = null;
      state.saveError = null;
    },

    cancelEditingDiscussion(state) {
      state.editingDiscussionId = null;
      state.saveError = null;
    },

    startEditingReply(state, action) {
      state.editingReplyId = action.payload;
      state.editingDiscussionId = null;
      state.saveError = null;
    },

    cancelEditingReply(state) {
      state.editingReplyId = null;
      state.saveError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchDiscussions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDiscussions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.discussions = action.payload || [];
        state.list = buildList(state.discussions);
        state.error = null;

        if (
          state.selectedId &&
          !state.discussions.some((item) => item.id === state.selectedId)
        ) {
          state.selectedId = null;
          state.mode = "idle";
        }
      })
      .addCase(fetchDiscussions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch discussions.";
      })

      .addCase(createDiscussionThunk.pending, (state) => {
        state.isSaving = true;
        state.saveError = null;
      })
      .addCase(createDiscussionThunk.fulfilled, (state, action) => {
        state.isSaving = false;
        replaceDiscussion(state, action.payload);
        state.selectedId = action.payload.id;
        state.mode = "viewing";
      })
      .addCase(createDiscussionThunk.rejected, (state, action) => {
        state.isSaving = false;
        state.saveError = action.payload || "Failed to create discussion.";
      })

      .addCase(updateDiscussionThunk.pending, (state) => {
        state.isSaving = true;
        state.saveError = null;
      })
      .addCase(updateDiscussionThunk.fulfilled, (state, action) => {
        state.isSaving = false;
        replaceDiscussion(state, action.payload);
        state.editingDiscussionId = null;
      })
      .addCase(updateDiscussionThunk.rejected, (state, action) => {
        state.isSaving = false;
        state.saveError = action.payload || "Failed to update discussion.";
      })

      .addCase(deleteDiscussionThunk.fulfilled, (state, action) => {
        const id = action.payload.id;
        state.discussions = state.discussions.filter((item) => item.id !== id);
        state.list = buildList(state.discussions);

        if (state.selectedId === id) {
          state.selectedId = null;
          state.mode = "idle";
        }

        state.editingDiscussionId = null;
      })
      .addCase(deleteDiscussionThunk.rejected, (state, action) => {
        state.saveError = action.payload || "Failed to delete discussion.";
      })

      .addCase(createReplyThunk.fulfilled, (state, action) => {
        replaceDiscussion(state, action.payload);
      })
      .addCase(createReplyThunk.rejected, (state, action) => {
        state.saveError = action.payload || "Failed to create reply.";
      })

      .addCase(updateReplyThunk.fulfilled, (state, action) => {
        replaceDiscussion(state, action.payload);
        state.editingReplyId = null;
      })
      .addCase(updateReplyThunk.rejected, (state, action) => {
        state.saveError = action.payload || "Failed to update reply.";
      })

      .addCase(deleteReplyThunk.fulfilled, (state, action) => {
        replaceDiscussion(state, action.payload);
        state.editingReplyId = null;
      })
      .addCase(deleteReplyThunk.rejected, (state, action) => {
        state.saveError = action.payload || "Failed to delete reply.";
      });
  },
});

export const {
  selectDiscussion,
  startCreating,
  cancelCreating,
  startEditingDiscussion,
  cancelEditingDiscussion,
  startEditingReply,
  cancelEditingReply,
} = discussionsSlice.actions;

export default discussionsSlice.reducer;
