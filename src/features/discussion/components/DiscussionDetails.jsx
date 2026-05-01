import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectActiveDiscussion,
  selectEditingDiscussionId,
} from "../discussionSelectors";
import {
  addReply,
  cancelEditingDiscussion,
  deleteDiscussion,
  saveEditDiscussion,
  startEditingDiscussion,
} from "../discussionSlice";
import DiscussionContent from "./DiscussionContent";
import RepliesSection from "./RepliesSection";
import ReplyComposer from "./ReplyComposer";
import { buildReplyTree } from "./discussionDetailsHelpers";

export default function DiscussionDetails() {
  const dispatch = useDispatch();
  const discussion = useSelector(selectActiveDiscussion);
  const editingDiscussionId = useSelector(selectEditingDiscussionId);
  const [replyBody, setReplyBody] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  const userString = localStorage.getItem("qj_user");
  const user = userString ? JSON.parse(userString) : { id: 1, name: "Guest" };

  if (!discussion) return null;

  const isDiscussionOwner = discussion.authorId === user.id;
  const isEditingDiscussion = editingDiscussionId === discussion.id;
  const replyTree = buildReplyTree(discussion.replies);

  function handleSendReply(e) {
    e.preventDefault();
    if (!replyBody.trim()) return;

    dispatch(
      addReply({
        discussionId: discussion.id,
        parentReplyId: null,
        body: replyBody.trim(),
        userId: user.id,
        authorName: user.name,
      }),
    );
    setReplyBody("");
  }

  function handleStartEdit() {
    setEditTitle(discussion.title);
    setEditBody(discussion.body);
    dispatch(startEditingDiscussion(discussion.id));
  }

  function handleSaveEdit() {
    if (!editTitle.trim() || !editBody.trim()) return;

    dispatch(
      saveEditDiscussion({
        id: discussion.id,
        title: editTitle.trim(),
        body: editBody.trim(),
      }),
    );
  }

  function handleDeleteDiscussion() {
    dispatch(deleteDiscussion(discussion.id));
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <DiscussionContent
          discussion={discussion}
          isDiscussionOwner={isDiscussionOwner}
          isEditingDiscussion={isEditingDiscussion}
          editTitle={editTitle}
          editBody={editBody}
          onEditTitleChange={setEditTitle}
          onEditBodyChange={setEditBody}
          onStartEdit={handleStartEdit}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={() => dispatch(cancelEditingDiscussion())}
          onDeleteDiscussion={handleDeleteDiscussion}
        />

        <RepliesSection
          discussion={discussion}
          replyTree={replyTree}
          user={user}
        />
      </div>

      <ReplyComposer
        user={user}
        replyBody={replyBody}
        onReplyBodyChange={setReplyBody}
        onSubmit={handleSendReply}
      />
    </div>
  );
}
