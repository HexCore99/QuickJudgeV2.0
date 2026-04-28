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
  allSubmissions,
  onOpenSubmission,
  onToast,
}) {
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all"
      ? submissions
      : submissions.filter((s) => s.f === filter);

  return (
    <section className="rounded-2xl border border-black/7 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold text-slate-800">Recent Submissions</h2>
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
      <div className="hidden grid-cols-12 gap-2 px-4 py-2 text-[11px] font-medium tracking-wider text-slate-400 sm:grid">
        <div className="col-span-5">
          PROBLEM{" "}
          <span className="ml-1 text-[9px] font-normal opacity-50">
            click to open
          </span>
        </div>
        <div className="col-span-2 text-center">
          VERDICT{" "}
          <span className="text-[9px] font-normal opacity-50">
            click for code
          </span>
        </div>
        <div className="col-span-2 text-center">TIME</div>
        <div className="col-span-2 text-center">MEMORY</div>
        <div className="col-span-1 text-right">LANG</div>
      </div>

      {/* Rows */}
      <div className="mt-1 space-y-1">
        {filtered.map((s) => {
          const globalIdx = allSubmissions.findIndex(
            (sub) => sub.id === s.id && sub.at === s.at,
          );
          return (
            <div
              key={s.id + s.at}
              className="grid grid-cols-12 items-center gap-2 rounded-xl px-4 py-3 transition-colors hover:bg-slate-50"
            >
              <div className="col-span-5">
                <button
                  className="block truncate text-left text-sm font-medium text-slate-800 transition-colors hover:text-amber-600 hover:underline hover:underline-offset-2"
                  onClick={() =>
                    onToast(
                      `Navigating to: ${s.problem} (${s.id})`,
                      "info",
                    )
                  }
                >
                  {s.problem}
                </button>
                <div className="font-mono text-[10px] text-slate-400">
                  {s.id}
                </div>
              </div>
              <div className="col-span-2 text-center">
                <button
                  className={`cursor-pointer rounded-md px-2.5 py-0.5 font-mono text-[11px] font-semibold tracking-wide transition-all hover:scale-105 ${
                    verdictBg[s.verdict.toLowerCase()] || verdictBg.ce
                  }`}
                  onClick={() => onOpenSubmission(globalIdx)}
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
      <div className="mt-5 flex items-center justify-between border-t border-black/7 pt-4">
        <span className="text-xs text-slate-400">
          Showing {filtered.length} of 583
        </span>
        <button
          onClick={() => onToast("Loading more...", "info")}
          className="flex items-center gap-1 text-xs font-medium text-amber-600 transition-colors hover:text-amber-700"
        >
          Load More
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>
    </section>
  );
}
