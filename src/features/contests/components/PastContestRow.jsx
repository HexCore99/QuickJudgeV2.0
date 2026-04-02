import { Link } from "react-router-dom";

function getContestTypeClasses(type) {
  const styles = {
    Weekly: "bg-amber-50 text-amber-700 border border-amber-200",
    Monthly: "bg-blue-50 text-blue-700 border border-blue-200",
    Blitz: "bg-orange-50 text-orange-700 border border-orange-200",
    Night: "bg-violet-50 text-violet-700 border border-violet-200",
    Special: "bg-red-50 text-red-700 border border-red-200",
  };

  return styles[type] || "bg-slate-50 text-slate-700 border border-slate-200";
}

function PastContestRow({ contest }) {
  return (
    <Link
      to={`/student/${contest.id}/problems`}
      className="group grid gap-3 border-b border-slate-100 px-5 py-4 transition hover:bg-slate-50 md:grid-cols-[2.2fr_1.4fr_0.8fr_0.8fr] md:items-center"
    >
      {/* contest*/}
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h4 className="text-sm font-semibold text-slate-900">
            QuickJudge {contest.name}
          </h4>

          <span
            className={`rounded px-1.5 py-0.5 text-[9px] font-semibold tracking-wide uppercase ${
              contest.rated
                ? "bg-amber-50 text-amber-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {contest.rated ? "Rated" : "Unrated"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span
            className={`rounded-md px-2 py-1 text-[11px] font-semibold ${getContestTypeClasses(
              contest.type,
            )}`}
          >
            {contest.type}
          </span>

          <span>{contest.date}</span>
        </div>
      </div>

      {/* tag*/}
      <div className="flex flex-wrap gap-2">
        {contest.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 ring-1 ring-slate-200"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* rank*/}
      <div className="text-left md:text-center">
        <div className="font-mono text-sm font-bold text-slate-900">
          {contest.participated ? `#${contest.rank}` : "-"}
        </div>

        <div className="text-[11px] text-slate-500">
          {contest.participated ? `of ${contest.total}` : "not participated"}
        </div>
      </div>

      {/* question*/}
      <div className="text-left md:text-center">
        <div className="font-mono text-sm font-bold text-slate-900">
          {contest.questions}
        </div>
        <div className="text-[11px] text-slate-500">questions</div>
      </div>
    </Link>
  );
}

export default PastContestRow;
