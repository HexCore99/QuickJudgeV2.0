import { useState } from "react";
import {
  Flag,
  Medal,
  BarChart3,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";

const filterOptions = [
  { k: "all", l: "All" },
  { k: "rated", l: "Rated" },
  { k: "unrated", l: "Unrated" },
];

export default function ContestsPanel({ contests, onToast }) {
  const [view, setView] = useState("all");

  const rated = contests.filter((c) => c.rated);
  const bestRank = Math.min(...rated.map((c) => c.rank));
  const avgRank = Math.round(
    rated.reduce((s, c) => s + c.rank, 0) / rated.length,
  );
  const posDeltas = rated.filter((c) => c.delta > 0).length;

  const filtered =
    view === "all"
      ? contests
      : view === "rated"
        ? rated
        : contests.filter((c) => !c.rated);

  const summaryCards = [
    {
      l: "Total",
      v: contests.length,
      Icon: Flag,
      co: "text-blue-600",
      bg: "bg-blue-600/6",
    },
    {
      l: "Best Rank",
      v: `#${bestRank}`,
      Icon: Medal,
      co: "text-amber-600",
      bg: "bg-amber-600/7",
    },
    {
      l: "Avg Rank",
      v: `#${avgRank}`,
      Icon: BarChart3,
      co: "text-violet-600",
      bg: "bg-violet-600/6",
    },
    {
      l: "Positive",
      v: `${posDeltas}/${rated.length}`,
      Icon: TrendingUp,
      co: "text-green-600",
      bg: "bg-green-600/6",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-black/7 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        {/* Header */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold text-slate-800">
            Contests{" "}
            <span className="ml-2 font-mono text-xs text-slate-400">
              {contests.length} participated
            </span>
          </h2>
          <div className="flex gap-1 rounded-[10px] bg-slate-100 p-1">
            {filterOptions.map((f) => (
              <button
                key={f.k}
                onClick={() => setView(f.k)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                  view === f.k
                    ? "bg-amber-600/7 text-amber-600"
                    : "text-slate-500 hover:bg-slate-200/60 hover:text-slate-700"
                }`}
              >
                {f.l}
              </button>
            ))}
          </div>
        </div>

        {/* Summary stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {summaryCards.map(({ l, v, Icon, co, bg }) => (
            <div
              key={l}
              className="rounded-xl border border-black/7 bg-slate-50 p-3"
            >
              <div className="mb-1.5 flex items-center gap-2">
                <Icon className={`h-2.5 w-2.5 ${co}`} />
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                  {l}
                </span>
              </div>
              <div className="font-mono text-lg font-bold text-slate-800">
                {v}
              </div>
            </div>
          ))}
        </div>

        {/* Contest list */}
        <div className="space-y-1">
          {filtered.map((c) => {
            const deltaColor =
              c.delta > 0
                ? "text-green-600"
                : c.delta < 0
                  ? "text-red-600"
                  : "text-slate-400";
            const DeltaIcon =
              c.delta > 0 ? ArrowUp : c.delta < 0 ? ArrowDown : Minus;
            const deltaLabel = (c.delta > 0 ? "+" : "") + c.delta;

            return (
              <div
                key={c.id}
                className="grid cursor-pointer grid-cols-12 items-center gap-2 rounded-xl px-4 py-3.5 transition-colors hover:bg-slate-50"
                onClick={() =>
                  onToast(
                    `Navigating to contest: ${c.name} (${c.id})`,
                    "info",
                  )
                }
              >
                <div className="col-span-5">
                  <div className="text-sm font-medium text-slate-800">
                    {c.name}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-400">
                      {c.id}
                    </span>
                    {c.rated ? (
                      <span className="rounded bg-amber-600/8 px-1.5 py-0.5 text-[9px] font-medium text-amber-600">
                        RATED
                      </span>
                    ) : (
                      <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[9px] font-medium text-slate-500">
                        UNRATED
                      </span>
                    )}
                  </div>
                </div>

                <div className="col-span-2 hidden text-center sm:block">
                  <div className="font-mono text-sm font-medium text-slate-800">
                    #{c.rank}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    of {c.total}
                  </div>
                </div>

                <div className="col-span-2 hidden text-center sm:block">
                  <div className="font-mono text-sm font-medium text-slate-800">
                    {c.solved}
                  </div>
                  <div className="text-[10px] text-slate-400">solved</div>
                </div>

                <div className="col-span-3 text-center">
                  {c.rated ? (
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-mono text-[11px] text-slate-400">
                        {c.before}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 font-mono text-xs font-semibold ${deltaColor}`}
                      >
                        <DeltaIcon className="h-2.5 w-2.5" />
                        {deltaLabel}
                      </span>
                      <span className="font-mono text-[11px] text-slate-400">
                        {c.after}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
