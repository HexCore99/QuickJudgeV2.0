import { createSlice } from "@reduxjs/toolkit";
import { fetchDiscussions } from "./discussionThunks";

const initialState = {
  items: [],
  selectedId: null,
  isCreating: false,
  editingDiscussionId: null,
  editingReplyId: null,
  isLoading: false,
  hasFetched: false,
  error: null,
};

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function findDiscussion(state, discussionId) {
  return state.items.find((discussion) => discussion.id === discussionId);
}

function collectReplyBranchIds(replies, rootReplyId) {
  const ids = new Set([rootReplyId]);
  let changed = true;

  while (changed) {
    changed = false;

    for (const reply of replies) {
      if (
        reply.parentReplyId &&
        ids.has(reply.parentReplyId) &&
        !ids.has(reply.id)
      ) {
        ids.add(reply.id);
        changed = true;
      }
    }
  }

  return ids;
}

const discussionSlice = createSlice({
  name: "discussion",
  initialState,
  reducers: {
    selectDiscussion(state, action) {
      state.selectedId = action.payload;
      state.isCreating = false;
      state.editingDiscussionId = null;
      state.editingReplyId = null;
    },

    startCreating(state) {
      state.isCreating = true;
      state.selectedId = null;
      state.editingDiscussionId = null;
      state.editingReplyId = null;
    },

    cancelCreating(state) {
      state.isCreating = false;
    },

    createDiscussion(state, action) {
      const id = createId("disc");
      const now = new Date().toISOString();

      state.items.unshift({
        id,
        title: action.payload.title,
        body: action.payload.body,
        authorId: action.payload.authorId,
        authorName: action.payload.authorName || "Guest",
        createdAt: now,
        replies: [],
      });
      state.selectedId = id;
      state.isCreating = false;
    },

    startEditingDiscussion(state, action) {
      state.editingDiscussionId = action.payload;
      state.editingReplyId = null;
    },

    cancelEditingDiscussion(state) {
      state.editingDiscussionId = null;
    },

    saveEditDiscussion(state, action) {
      const discussion = findDiscussion(state, action.payload.id);

      if (!discussion) return;

      discussion.title = action.payload.title;
      discussion.body = action.payload.body;
      state.editingDiscussionId = null;
    },

    deleteDiscussion(state, action) {
      state.items = state.items.filter(
        (discussion) => discussion.id !== action.payload,
      );

      if (state.selectedId === action.payload) {
        state.selectedId = null;
      }

      if (state.editingDiscussionId === action.payload) {
        state.editingDiscussionId = null;
      }
    },

    addReply(state, action) {
      const discussion = findDiscussion(state, action.payload.discussionId);

      if (!discussion) return;

      discussion.replies.push({
        id: createId("reply"),
        parentReplyId: action.payload.parentReplyId,
        userId: action.payload.userId,
        authorName: action.payload.authorName || "Guest",
        body: action.payload.body,
        createdAt: new Date().toISOString(),
      });
    },

    startEditingReply(state, action) {
      state.editingReplyId = action.payload;
      state.editingDiscussionId = null;
    },

    cancelEditingReply(state) {
      state.editingReplyId = null;
    },

    saveEditReply(state, action) {
      const discussion = findDiscussion(state, action.payload.discussionId);
      const reply = discussion?.replies.find(
        (item) => item.id === action.payload.replyId,
      );

      if (!reply) return;

      reply.body = action.payload.body;
      state.editingReplyId = null;
    },

    deleteReply(state, action) {
      const discussion = findDiscussion(state, action.payload.discussionId);

      if (!discussion) return;

      const replyIdsToDelete = collectReplyBranchIds(
        discussion.replies,
        action.payload.replyId,
      );

      discussion.replies = discussion.replies.filter(
        (reply) => !replyIdsToDelete.has(reply.id),
      );

      if (replyIdsToDelete.has(state.editingReplyId)) {
        state.editingReplyId = null;
      }
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
        state.hasFetched = true;
        state.error = null;
        state.items = action.payload || [];
      })
      .addCase(fetchDiscussions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch discussions.";
      });
  },
});

export const {
  selectDiscussion,
  startCreating,
  cancelCreating,
  createDiscussion,
  startEditingDiscussion,
  cancelEditingDiscussion,
  saveEditDiscussion,
  deleteDiscussion,
  addReply,
  startEditingReply,
  cancelEditingReply,
  saveEditReply,
  deleteReply,
} = discussionSlice.actions;

export default discussionSlice.reducer;
