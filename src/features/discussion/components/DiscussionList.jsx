import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MessageSquarePlus, MessageCircle } from "lucide-react";
import AppSearchInput from "../../../components/common/AppSearchInput";
import { selectDiscussionList, selectSelectedId } from "../discussionSelectors";
import { selectDiscussion, startCreating } from "../discussionSlice";

function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function DiscussionList() {
  const dispatch = useDispatch();
  const list = useSelector(selectDiscussionList);
  const selectedId = useSelector(selectSelectedId);
  const [search, setSearch] = useState("");

  const query = search.trim().toLowerCase();
  const filtered = query
    ? list.filter((d) => d.title.toLowerCase().includes(query))
    : list;

  return (
    <div className="flex h-full flex-col">
      {/* Search + New button */}
      <div className="space-y-3 border-b border-slate-200/80 px-4 py-4">
        <AppSearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search discussions..."
          containerClassName="w-full"
          inputClassName="!h-10 !rounded-xl !text-[13px]"
        />

        <button
          type="button"
          onClick={() => dispatch(startCreating())}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-amber-700 hover:shadow-md active:scale-[0.98]"
        >
          <MessageSquarePlus className="h-4 w-4" />
          New Discussion
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-slate-400">
            {query
              ? "No discussions match your search."
              : "No discussions yet."}
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filtered.map((item, idx) => {
              const isActive = selectedId === item.id;
              return (
                <li
                  key={item.id}
                  style={{
                    animation: `fadeSlideDown 0.35s cubic-bezier(0.22,1,0.36,1) ${idx * 40}ms both`,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => dispatch(selectDiscussion(item.id))}
                    className={`group flex w-full items-start gap-3 px-4 py-3.5 text-left transition ${
                      isActive
                        ? "border-l-[3px] border-amber-500 bg-amber-50/70"
                        : "border-l-[3px] border-transparent hover:bg-slate-50"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p
                        className={`mb-1 truncate text-[13.5px] leading-snug font-semibold ${
                          isActive
                            ? "text-amber-800"
                            : "text-slate-700 group-hover:text-slate-900"
                        }`}
                      >
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 text-[11.5px] text-slate-400">
                        <span>{item.authorName}</span>
                        <span>·</span>
                        <span>{timeAgo(item.createdAt)}</span>
                      </div>
                    </div>

                    {/* Reply count badge */}
                    <div
                      className={`mt-0.5 flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        isActive
                          ? "bg-amber-100 text-amber-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <MessageCircle className="h-3 w-3" />
                      {item.replyCount}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
