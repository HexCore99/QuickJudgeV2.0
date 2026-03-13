import { CalendarDays, Lock } from "lucide-react";

function getBadgeClasses(status) {
  if (status === "live") {
    return "bg-emerald-100 text-emerald-700";
  }
  if (status === "upcoming") {
    return "bg-sky-100 text-sky-700";
  }

  return "bg-slate-100 text-slate-500";
}

function getBadgeText(status) {
  if (status === "live") return "LIVE";
  if (status === "upcoming") return "UPCOMING";
  return "ENDED";
}

function ContestListCard({ contest }) {
  const isLive = contest.status === "live";
  const isUpcoming = contest.status === "upcoming";
  const isEnded = contest.status === "ended";
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <span
        className={`inline-flex rounded-md px-2 py-1 text-xs font-bold uppercase ${getBadgeClasses(contest.status)} `}
      >
        {getBadgeText(contest.status)}
      </span>

      <h3 className="mt-3 text-lg font-black text-slate-900">
        {contest.title}
      </h3>
      <p className="mt-2 text-sm text-slate-500">{contest.description}</p>

      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
        <span className="inline-flex items-center gap-1">
          {<CalendarDays size={14} />}
          {contest.date}
        </span>

        <span>{contest.duration}</span>
        <span>{contest.problems}</span>
      </div>

      <div className="mt-4">
        {isLive ? (
          <button className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
            Enter Contest
          </button>
        ) : null}

        {isUpcoming ? (
          <button
            disabled
            className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-400"
          >
            <Lock size={14} />
            Enter Contest
          </button>
        ) : null}

        {isEnded ? (
          <button className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
            View Results
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default ContestListCard;
