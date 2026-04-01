import { History } from "lucide-react";
import ContestSectionTitle from "./ContestSectionTitle";
import PastContestRow from "./PastContestRow";

function PastContestTable({ contests, pastFilter, setPastFilter }) {
  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ContestSectionTitle title="Past Contests" icon={History} />

        <div className="inline-flex w-fit rounded-xl bg-slate-100 p-1">
          {[
            { key: "all", label: "All" },
            { key: "rated", label: "Rated" },
            { key: "unrated", label: "Unrated" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setPastFilter(item.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                pastFilter === item.key
                  ? "bg-white text-amber-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="hidden border-b border-slate-200 bg-slate-50 px-5 py-3 text-[11px] font-bold tracking-[0.18em] text-slate-500 uppercase md:grid md:grid-cols-[2.2fr_0.8fr_0.8fr_180px]">
          <div>Contest</div>
          <div className="text-center">Rank</div>
          <div className="text-center">Questions</div>
          <div className="text-right">Actions</div>
        </div>

        {contests.length > 0 ? (
          contests.map((contest) => (
            <PastContestRow key={contest.id} contest={contest} />
          ))
        ) : (
          <div className="px-6 py-16 text-center text-sm text-slate-500">
            No contests match your filters.
          </div>
        )}
      </div>
    </section>
  );
}

export default PastContestTable;
