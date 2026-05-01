import { Send } from "lucide-react";
import { getInitialColor } from "./discussionDetailsHelpers";

export default function ReplyComposer({
  user,
  replyBody,
  onReplyBodyChange,
  onSubmit,
}) {
  return (
    <div className="border-t border-slate-200/80 bg-slate-50/50 px-7 py-4">
      <form onSubmit={onSubmit} className="flex gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${getInitialColor(user.name)}`}
        >
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex min-w-0 flex-1 gap-2">
          <textarea
            value={replyBody}
            onChange={(e) => onReplyBodyChange(e.target.value)}
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
  );
}
