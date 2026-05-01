import { useState } from "react";
import { useDispatch } from "react-redux";
import { CornerDownRight, Send, X } from "lucide-react";
import { addReply } from "../discussionSlice";

export default function InlineReplyForm({
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
