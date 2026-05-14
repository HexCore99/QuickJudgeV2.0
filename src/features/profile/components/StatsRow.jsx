import {
  Check,
  X,
  Flame,
  Flag,
  Trophy,
  ArrowUp,
} from "lucide-react";

const stats = [
  {
    label: "Solved",
    key: "solved",
    delta: (u) => `+${u.solvedDelta} this week`,
    deltaColor: "text-green-600",
    iconBg: "bg-green-600/7",
    Icon: Check,
    iconColor: "text-green-600",
  },
  {
    label: "Submissions",
    key: "totalSubmissions",
    delta: (u) => `${u.acRate} AC rate`,
    deltaColor: "text-slate-500",
    iconBg: "bg-red-600/6",
    Icon: X,
    iconColor: "text-red-600",
  },
  {
    label: "Streak",
    key: "streak",
    suffix: "days",
    delta: (u) => `Best: ${u.bestStreak} days`,
    deltaColor: "text-amber-600",
    iconBg: "bg-amber-600/7",
    Icon: Flame,
    iconColor: "text-amber-600",
  },
  {
    label: "Contests",
    key: "contestCount",
    delta: (u) => `${u.ratedContests} rated`,
    deltaColor: "text-blue-600",
    iconBg: "bg-blue-600/6",
    Icon: Flag,
    iconColor: "text-blue-600",
  },
  {
    label: "Rank",
    key: "rank",
    prefix: "#",
    delta: (u) => (
      <>
        <ArrowUp className="mr-1 inline h-2.5 w-2.5" />
        Up {u.rankDelta}
      </>
    ),
    deltaColor: "text-green-600",
    iconBg: "bg-blue-600/6",
    Icon: Trophy,
    iconColor: "text-blue-600",
  },
];

export default function StatsRow({ user }) {
  return (
    <section className="mb-6 grid grid-cols-5 gap-4">
      {stats.map(
        ({
          label,
          key,
          prefix,
          suffix,
          delta,
          deltaColor,
          iconBg,
          Icon,
          iconColor,
        }) => (
          <div
            key={label}
            className="group relative overflow-hidden rounded-2xl border border-black/7 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
          >
            {/* Hover accent line */}
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

            <div className="mb-3 flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg}`}
              >
                <Icon className={`h-4 w-4 ${iconColor}`} />
              </div>
              <span className="text-xs font-medium text-slate-500">
                {label}
              </span>
            </div>

            <div className="font-mono text-2xl font-bold text-slate-800">
              {prefix}
              {user[key]}
              {suffix && (
                <span className="ml-1 text-sm font-normal text-slate-500">
                  {suffix}
                </span>
              )}
            </div>

            <div className={`mt-1 text-[11px] ${deltaColor}`}>
              {typeof delta === "function" ? delta(user) : delta}
            </div>
          </div>
        ),
      )}
    </section>
  );
}
