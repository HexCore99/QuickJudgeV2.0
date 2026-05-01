import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  MessageCircle,
  Send,
  Pencil,
  Trash2,
  X,
  Check,
  User,
  Reply,
  CornerDownRight,
} from "lucide-react";
import {
  selectActiveDiscussion,
  selectEditingDiscussionId,
  selectEditingReplyId,
} from "../discussionSelectors";
import {
  addReply,
  startEditingDiscussion,
  cancelEditingDiscussion,
  saveEditDiscussion,
  deleteDiscussion,
  startEditingReply,
  cancelEditingReply,
  saveEditReply,
  deleteReply,
} from "../discussionSlice";

function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getInitialColor(name) {
  const colors = [
    "bg-amber-100 text-amber-700",
    "bg-sky-100 text-sky-700",
    "bg-emerald-100 text-emerald-700",
    "bg-violet-100 text-violet-700",
    "bg-rose-100 text-rose-700",
    "bg-teal-100 text-teal-700",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// Build a tree from flat replies array
function buildReplyTree(replies) {
  const map = new Map();
  const roots = [];

  // Initialize map
  for (const reply of replies) {
    map.set(reply.id, { ...reply, children: [] });
  }

  // Build tree
  for (const reply of replies) {
    const node = map.get(reply.id);
    if (reply.parentReplyId && map.has(reply.parentReplyId)) {
      map.get(reply.parentReplyId).children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

// ── Inline Reply Form ──────────────────────────────────────
function InlineReplyForm({
  discussionId,
  parentReplyId,
  authorName,
  onClose,
  user,
}) {
  const dispatch = useDispatch();
  const [body, setBody] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!body.trim()) return;

    dispatch(
      addReply({
        discussionId,
        parentReplyId,
        body: body.trim(),
        userId: user.id,
        authorName: user.name,
      }),
    );
    setBody("");
    onClose();
  }

  return (
    <div className="mt-2 mb-1 flex gap-2">
      <CornerDownRight className="mt-2 h-3.5 w-3.5 shrink-0 text-slate-300" />
      <form onSubmit={handleSubmit} className="flex min-w-0 flex-1 gap-2">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={`Reply to ${authorName}...`}
          rows={1}
          autoFocus
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose();
          }}
          className="min-h-[34px] flex-1 resize-none rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] text-slate-700 transition outline-none placeholder:text-slate-400 focus:border-amber-300 focus:ring-3 focus:ring-amber-100/70"
        />
        <button
          type="submit"
          disabled={!body.trim()}
          className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg bg-amber-600 text-white shadow-sm transition hover:bg-amber-700 disabled:opacity-40"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
}

// ── Recursive Reply Node ───────────────────────────────────
function ReplyNode({ node, discussionId, depth, user }) {
  const dispatch = useDispatch();
  const editingReplyId = useSelector(selectEditingReplyId);
  const isEditing = editingReplyId === node.id;
  const isOwner = node.userId === user.id;
  const [editBody, setEditBody] = useState(node.body);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const avatarColor = getInitialColor(node.authorName);
  const hasChildren = node.children.length > 0;

  // Limit visual nesting depth for readability (indent up to 4 levels)
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
      {/* Thread line connector */}
      {depth > 0 && (
        <div className="absolute top-0 -left-3 h-full w-px bg-slate-200/70" />
      )}

      <div className="group relative py-3">
        {/* Horizontal connector for nested replies */}
        {depth > 0 && (
          <div className="absolute top-[22px] -left-3 h-px w-3 bg-slate-200/70" />
        )}

        <div className="flex gap-2.5">
          {/* Avatar */}
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${avatarColor}`}
          >
            {node.authorName.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            {/* Header */}
            <div className="mb-0.5 flex items-center gap-2">
              <span className="text-[13px] font-semibold text-slate-700">
                {node.authorName}
              </span>
              <span className="text-[11px] text-slate-400">
                {timeAgo(node.createdAt)}
              </span>

              {/* Actions (owner edit/delete + reply) */}
              <div className="ml-auto flex items-center gap-0.5 opacity-0 transition group-hover:opacity-100">
                {/* Reply button — always visible on hover */}
                <button
                  type="button"
                  onClick={() => setShowReplyForm((v) => !v)}
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

            {/* Body */}
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

            {/* Inline reply form */}
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

      {/* Recursive children */}
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

// ── Main Detail Component ──────────────────────────────────
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

  const avatarColor = getInitialColor(discussion.authorName);

  return (
    <div className="flex h-full flex-col">
      {/* Discussion Header + Body */}
      <div className="flex-1 overflow-y-auto">
        <div className="border-b border-slate-100 px-7 py-6">
          {isEditingDiscussion ? (
            /* ── Editing Mode ── */
            <div className="space-y-4">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-lg font-bold text-slate-800 transition outline-none focus:border-amber-300 focus:ring-4 focus:ring-amber-100/70"
              />
              <textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                rows={8}
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-relaxed text-slate-700 transition outline-none focus:border-amber-300 focus:ring-4 focus:ring-amber-100/70"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700"
                >
                  <Check className="h-3.5 w-3.5" />
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => dispatch(cancelEditingDiscussion())}
                  className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100"
                >
                  <X className="h-3.5 w-3.5" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* ── Viewing Mode ── */
            <>
              <div className="mb-4 flex items-start justify-between gap-4">
                <h2 className="text-xl leading-snug font-bold tracking-tight text-slate-800">
                  {discussion.title}
                </h2>

                {isDiscussionOwner && (
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={handleStartEdit}
                      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                      title="Edit discussion"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteDiscussion}
                      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                      title="Delete discussion"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="mb-5 flex items-center gap-2.5">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold ${avatarColor}`}
                >
                  {discussion.authorName.charAt(0).toUpperCase()}
                </div>
                <span className="text-[13px] font-medium text-slate-600">
                  {discussion.authorName}
                </span>
                <span className="text-[11px] text-slate-400">·</span>
                <span className="text-[11px] text-slate-400">
                  {timeAgo(discussion.createdAt)}
                </span>
              </div>

              <div className="text-[14px] leading-[1.8] whitespace-pre-wrap text-slate-600">
                {discussion.body}
              </div>
            </>
          )}
        </div>

        {/* Replies Section */}
        <div className="px-7 pt-5 pb-2">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-700">
              Replies
              <span className="ml-1.5 text-slate-400">
                ({discussion.replies.length})
              </span>
            </h3>
          </div>
        </div>

        {discussion.replies.length === 0 ? (
          <div className="flex flex-col items-center px-7 py-10 text-center">
            <User className="mb-2 h-8 w-8 text-slate-200" />
            <p className="text-sm text-slate-400">
              No replies yet — be the first to respond!
            </p>
          </div>
        ) : (
          <div className="px-7 pb-4">
            {replyTree.map((rootNode) => (
              <ReplyNode
                key={rootNode.id}
                node={rootNode}
                discussionId={discussion.id}
                depth={0}
                user={user}
              />
            ))}
          </div>
        )}
      </div>

      {/* Top-level Reply Input */}
      <div className="border-t border-slate-200/80 bg-slate-50/50 px-7 py-4">
        <form onSubmit={handleSendReply} className="flex gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${getInitialColor(user.name)}`}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex min-w-0 flex-1 gap-2">
            <textarea
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              placeholder="Write a reply..."
              rows={1}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
              }}
              className="min-h-[38px] flex-1 resize-none rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition outline-none placeholder:text-slate-400 focus:border-amber-300 focus:ring-4 focus:ring-amber-100/70"
            />
            <button
              type="submit"
              disabled={!replyBody.trim()}
              className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-xl bg-amber-600 text-white shadow-sm transition hover:bg-amber-700 disabled:opacity-40 disabled:hover:bg-amber-600"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
