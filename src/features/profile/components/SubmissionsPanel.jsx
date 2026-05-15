import { useState } from "react";
import { ChevronDown } from "lucide-react";

const verdictBg = {
  ac: "bg-green-600/8 text-green-600",
  wa: "bg-red-600/8 text-red-600",
  tle: "bg-amber-500/8 text-amber-500",
  re: "bg-red-600/5 text-red-700",
  ce: "bg-slate-500/8 text-slate-600",
};

const filters = [
  { k: "all", l: "All" },
  { k: "ac", l: "AC" },
  { k: "wa", l: "WA" },
  { k: "other", l: "Other" },
];

export default function SubmissionsPanel({
  submissions,
  allSubmissions = submissions,
  onOpenSubmission,
  onToast,
  title = "Recent Submissions",
  totalCount = 583,
  emptyMessage = "No submissions match this filter.",
  problemHint = "click to open",
  verdictHint = "click for code",
  showParticipant = false,
  participantHeader = "PARTICIPANT",
  timeHeader = "TIME",
  memoryHeader = "MEMORY",
  languageHeader = "LANG",
  showFooter = true,
  showLoadMore = true,
  onLoadMore,
  onProblemClick,
}) {
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all" ? submissions : submissions.filter((s) => s.f === filter);
  const problemColumnClass = showParticipant ? "col-span-3" : "col-span-5";

  function handleProblemClick(submission) {
    if (onProblemClick) {
      onProblemClick(submission);
      return;
    }

    onToast?.(
      `Navigating to: ${submission.problem} (${submission.id})`,
      "info",
    );
  }

  function handleLoadMore() {
    if (onLoadMore) {
      onLoadMore();
      return;
    }

    onToast?.("Loading more...", "info");
  }

  return (
    <section className="rounded-2xl border border-black/7 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold text-slate-800">{title}</h2>
        <div className="flex gap-1 rounded-[10px] bg-slate-100 p-1">
          {filters.map((f) => (
            <button
              key={f.k}
              onClick={() => setFilter(f.k)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                filter === f.k
                  ? "bg-amber-600/7 text-amber-600"
                  : "text-slate-500 hover:bg-slate-200/60 hover:text-slate-700"
              }`}
            >
              {f.l}
            </button>
          ))}
        </div>
      </div>

      {/* Column headers */}
      <div className="hidden grid-cols-12 gap-2 rounded-xl border border-amber-200 bg-amber-100/70 px-4 py-3 text-[11px] font-semibold tracking-wider text-amber-800 shadow-sm sm:grid">
        <div className={problemColumnClass}>
          PROBLEM
          {problemHint && (
            <span className="ml-1 text-[9px] font-normal opacity-50">
              {problemHint}
            </span>
          )}
        </div>
        {showParticipant && (
          <div className="col-span-2 text-left">{participantHeader}</div>
        )}
        <div className="col-span-2 text-center">
          VERDICT
          {verdictHint && (
            <span className="text-[9px] font-normal opacity-50">
              {" "}
              {verdictHint}
            </span>
          )}
        </div>
        <div className="col-span-2 text-center">{timeHeader}</div>
        <div className="col-span-2 text-center">{memoryHeader}</div>
        <div className="col-span-1 text-right">{languageHeader}</div>
      </div>

      {/* Rows */}
      <div className="mt-1 space-y-1">
        {filtered.length === 0 && (
          <div className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-400">
            {emptyMessage}
          </div>
        )}

        {filtered.map((s, index) => {
          const globalIdx = allSubmissions.findIndex(
            (sub) => sub.id === s.id && sub.at === s.at,
          );
          const canOpenSubmission =
            typeof onOpenSubmission === "function" && globalIdx >= 0;
          const canOpenProblem =
            typeof onProblemClick === "function" ||
            typeof onToast === "function";

          return (
            <div
              key={`${s.id}-${s.at}`}
              className={`grid grid-cols-12 items-center gap-2 rounded-xl border px-4 py-3 transition-colors ${
                index % 2 === 0
                  ? "border-amber-100 bg-amber-50/55 hover:bg-amber-50"
                  : "border-sky-100 bg-sky-50/55 hover:bg-sky-50"
              }`}
            >
              <div className={problemColumnClass}>
                {canOpenProblem ? (
                  <button
                    className="block truncate text-left text-sm font-medium text-slate-800 transition-colors hover:text-amber-600 hover:underline hover:underline-offset-2"
                    onClick={() => handleProblemClick(s)}
                  >
                    {s.problem}
                  </button>
                ) : (
                  <div className="truncate text-sm font-medium text-slate-800">
                    {s.problem}
                  </div>
                )}
                {showParticipant && s.participant && (
                  <div className="mt-1 truncate text-xs font-medium text-slate-500 sm:hidden">
                    {s.participant}
                  </div>
                )}
                <div className="font-mono text-[10px] text-slate-400">
                  {s.id}
                </div>
              </div>
              {showParticipant && (
                <div className="col-span-2 hidden min-w-0 sm:block">
                  <div className="truncate text-sm font-semibold text-slate-700">
                    {s.participant || "Unknown student"}
                  </div>
                </div>
              )}
              <div className="col-span-2 text-center">
                <button
                  disabled={!canOpenSubmission}
                  className={`rounded-md px-2.5 py-0.5 font-mono text-[11px] font-semibold tracking-wide transition-all ${
                    canOpenSubmission
                      ? "cursor-pointer hover:scale-105"
                      : "cursor-default"
                  } ${verdictBg[s.verdict.toLowerCase()] || verdictBg.ce}`}
                  onClick={() =>
                    canOpenSubmission && onOpenSubmission(globalIdx)
                  }
                >
                  {s.verdict}
                </button>
              </div>
              <div className="col-span-2 hidden text-center font-mono text-xs text-slate-400 sm:block">
                {s.time}
              </div>
              <div className="col-span-2 hidden text-center font-mono text-xs text-slate-400 sm:block">
                {s.mem}
              </div>
              <div className="col-span-1 hidden text-right text-[11px] font-medium text-slate-400 sm:block">
                {s.lang}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {showFooter && (
        <div className="mt-5 flex items-center justify-between border-t border-black/7 pt-4">
          <span className="text-xs text-slate-400">
            Showing {filtered.length} of {totalCount}
          </span>
          {showLoadMore && (
            <button
              onClick={handleLoadMore}
              className="flex items-center gap-1 text-xs font-medium text-amber-600 transition-colors hover:text-amber-700"
            >
              Load More
              <ChevronDown className="h-3 w-3" />
            </button>
          )}
        </div>
      )}
    </section>
  );
}
