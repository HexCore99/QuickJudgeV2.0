import { Check, Pencil, Trash2, X } from "lucide-react";
import { getInitialColor, timeAgo } from "./discussionDetailsHelpers";

export default function DiscussionContent({
  discussion,
  isDiscussionOwner,
  isEditingDiscussion,
  editTitle,
  editBody,
  onEditTitleChange,
  onEditBodyChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDeleteDiscussion,
}) {
  const avatarColor = getInitialColor(discussion.authorName);

  return (
    <div className="border-b border-slate-100 px-7 py-6">
      {isEditingDiscussion ? (
        <div className="space-y-4">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => onEditTitleChange(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-lg font-bold text-slate-800 transition outline-none focus:border-amber-300 focus:ring-4 focus:ring-amber-100/70"
          />
          <textarea
            value={editBody}
            onChange={(e) => onEditBodyChange(e.target.value)}
            rows={8}
            className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-relaxed text-slate-700 transition outline-none focus:border-amber-300 focus:ring-4 focus:ring-amber-100/70"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onSaveEdit}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700"
            >
              <Check className="h-3.5 w-3.5" />
              Save Changes
            </button>
            <button
              type="button"
              onClick={onCancelEdit}
              className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100"
            >
              <X className="h-3.5 w-3.5" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-start justify-between gap-4">
            <h2 className="text-xl leading-snug font-bold tracking-tight text-slate-800">
              {discussion.title}
            </h2>

            {isDiscussionOwner && (
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={onStartEdit}
                  className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                  title="Edit discussion"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={onDeleteDiscussion}
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
            <span className="text-[11px] text-slate-400">&middot;</span>
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
  );
}
