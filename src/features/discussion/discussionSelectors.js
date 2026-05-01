import { createSelector } from "@reduxjs/toolkit";

export const selectDiscussionState = (state) => state.discussion;
export const selectDiscussions = (state) => state.discussion.items;
export const selectSelectedId = (state) => state.discussion.selectedId;
export const selectDiscussionIsCreating = (state) =>
  state.discussion.isCreating;
export const selectEditingDiscussionId = (state) =>
  state.discussion.editingDiscussionId;
export const selectEditingReplyId = (state) => state.discussion.editingReplyId;
export const selectDiscussionLoading = (state) => state.discussion.isLoading;
export const selectDiscussionHasFetched = (state) =>
  state.discussion.hasFetched;
export const selectDiscussionError = (state) => state.discussion.error;

export const selectDiscussionList = createSelector(
  [selectDiscussions],
  (discussions) =>
    discussions.map((discussion) => ({
      id: discussion.id,
      title: discussion.title,
      authorName: discussion.authorName,
      createdAt: discussion.createdAt,
      replyCount: discussion.replies.length,
    })),
);

export const selectActiveDiscussion = createSelector(
  [selectDiscussions, selectSelectedId],
  (discussions, selectedId) =>
    discussions.find((discussion) => discussion.id === selectedId) || null,
);
