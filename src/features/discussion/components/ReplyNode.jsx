import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Check, Pencil, Reply, Trash2, X } from "lucide-react";
import { selectEditingReplyId } from "../discussionSelectors";
import {
  cancelEditingReply,
  deleteReply,
  saveEditReply,
  startEditingReply,
} from "../discussionSlice";
import InlineReplyForm from "./InlineReplyForm";
import { getInitialColor, timeAgo } from "./discussionDetailsHelpers";

export default function ReplyNode({ node, discussionId, depth, user }) {
  const dispatch = useDispatch();
  const editingReplyId = useSelector(selectEditingReplyId);
  const isEditing = editingReplyId === node.id;
  const isOwner = node.userId === user.id;
  const [editBody, setEditBody] = useState(node.body);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const avatarColor = getInitialColor(node.authorName);
  const hasChildren = node.children.length > 0;
  const visualDepth = Math.min(depth, 4);

  function handleSave() {
    if (!editBody.trim()) return;

    dispatch(
      saveEditReply({
        discussionId,
        replyId: node.id,
        body: editBody.trim(),
      }),
    );
  }

  function handleDelete() {
    dispatch(deleteReply({ discussionId, replyId: node.id }));
  }

  return (
    <div
      className={depth > 0 ? "relative" : ""}
      style={depth > 0 ? { marginLeft: `${visualDepth * 24}px` } : undefined}
    >
      {depth > 0 && (
        <div className="absolute top-0 -left-3 h-full w-px bg-slate-200/70" />
      )}

      <div className="group relative py-3">
        {depth > 0 && (
          <div className="absolute top-[22px] -left-3 h-px w-3 bg-slate-200/70" />
        )}

        <div className="flex gap-2.5">
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${avatarColor}`}
          >
            {node.authorName.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-0.5 flex items-center gap-2">
              <span className="text-[13px] font-semibold text-slate-700">
                {node.authorName}
              </span>
              <span className="text-[11px] text-slate-400">
                {timeAgo(node.createdAt)}
              </span>

              <div className="ml-auto flex items-center gap-0.5 opacity-0 transition group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => setShowReplyForm((value) => !value)}
                  className="rounded-md p-1 text-slate-400 transition hover:bg-amber-50 hover:text-amber-600"
                  title="Reply"
                >
                  <Reply className="h-3 w-3" />
                </button>

                {isOwner && !isEditing && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setEditBody(node.body);
                        dispatch(startEditingReply(node.id));
                      }}
                      className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                      title="Edit reply"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="rounded-md p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                      title="Delete reply"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-[13px] text-slate-700 transition outline-none focus:border-amber-300 focus:ring-4 focus:ring-amber-100/70"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex items-center gap-1 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-amber-700"
                  >
                    <Check className="h-3 w-3" />
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => dispatch(cancelEditingReply())}
                    className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-100"
                  >
                    <X className="h-3 w-3" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-[13px] leading-relaxed whitespace-pre-wrap text-slate-600">
                {node.body}
              </p>
            )}

            {showReplyForm && (
              <InlineReplyForm
                discussionId={discussionId}
                parentReplyId={node.id}
                authorName={node.authorName}
                onClose={() => setShowReplyForm(false)}
                user={user}
              />
            )}
          </div>
        </div>
      </div>

      {hasChildren && (
        <div>
          {node.children.map((child) => (
            <ReplyNode
              key={child.id}
              node={child}
              discussionId={discussionId}
              depth={depth + 1}
              user={user}
            />
          ))}
        </div>
      )}
    </div>
  );
}
