import { MessageSquarePlus } from "lucide-react";

export default function EmptyState({ onCreateClick }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 py-24 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm ring-1 ring-amber-200/60">
        <MessageSquarePlus className="h-9 w-9 text-amber-500" />
      </div>

      <h3 className="mb-2 text-lg font-semibold tracking-tight text-slate-700">
        No discussion selected
      </h3>
      <p className="mb-8 max-w-xs text-sm leading-relaxed text-slate-400">
        Pick a thread from the list, or start a new conversation with the
        community.
      </p>

      <button
        type="button"
        onClick={onCreateClick}
        className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-amber-700 hover:shadow-md active:scale-[0.98]"
      >
        <MessageSquarePlus className="h-4 w-4" />
        Start a Discussion
      </button>
    </div>
  );
}
