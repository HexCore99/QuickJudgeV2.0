import { CalendarDays, Clock3, Code2, Hourglass, Users } from "lucide-react";

function Tag({ children }) {
  return (
    <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
      {children}
    </span>
  );
}

function Info({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-500">
      <Icon className="h-3.5 w-3.5" />
      <span>{children}</span>
    </div>
  );
}

function ContestListCard({ contest, type = "live" }) {
  const isLive = type === "live";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
        isLive ? "border-emerald-200" : "border-slate-200"
      }`}
    >
      <div
        className={`absolute inset-y-0 left-0 w-1 ${
          isLive ? "bg-emerald-500" : "bg-blue-500"
        }`}
      />

      <div className="ml-3">
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <h3 className="text-base font-bold text-slate-900">
            QuickJudge {contest.name}
          </h3>

          <span
            className={`inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-[10px] font-bold tracking-[0.18em] uppercase ${
              isLive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-blue-50 text-blue-700"
            }`}
          >
            {isLive && (
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            )}
            {isLive ? "Live" : "Upcoming"}
          </span>
        </div>

        <p className="mb-4 text-sm text-slate-500">{contest.desc}</p>

        <div className="mb-4 flex flex-wrap gap-2">
          {contest.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>

        <div className="mb-5 flex flex-wrap gap-x-5 gap-y-2">
          <Info icon={CalendarDays}>{contest.date}</Info>
          <Info icon={Clock3}>{contest.time}</Info>
          <Info icon={Hourglass}>{contest.duration}</Info>
          <Info icon={Code2}>{contest.problems} problems</Info>
          {isLive && <Info icon={Users}>{contest.participants} joined</Info>}
        </div>

        <button
          className={`rounded-xl px-4 py-2 text-sm font-semibold text-white transition hover:scale-[1.02] ${
            isLive
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLive ? "Enter Contest" : "Register"}
        </button>
      </div>
    </div>
  );
}

export default ContestListCard;
