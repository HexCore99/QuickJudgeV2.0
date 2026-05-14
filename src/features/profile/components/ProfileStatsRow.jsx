import { Check, Flame, Send, Trophy } from "lucide-react";

const statItems = [
  {
    label: "Solved",
    key: "solved",
    iconBg: "bg-green-600/7",
    Icon: Check,
    iconColor: "text-green-600",
  },
  {
    label: "Submissions",
    key: "totalSubmissions",
    iconBg: "bg-blue-600/6",
    Icon: Send,
    iconColor: "text-blue-600",
  },
  {
    label: "Streak",
    key: "streak",
    suffix: "days",
    iconBg: "bg-amber-600/7",
    Icon: Flame,
    iconColor: "text-amber-600",
  },
  {
    label: "Rank",
    key: "rank",
    prefix: "#",
    iconBg: "bg-blue-600/6",
    Icon: Trophy,
    iconColor: "text-blue-600",
  },
];

export default function ProfileStatsRow({ user }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {statItems.map((item) => {
        const StatIcon = item.Icon;
        const value = user[item.key] ?? "--";
        const shouldShowPrefix = item.prefix && value !== "--";

        return (
          <div
            key={item.label}
            className="group relative overflow-hidden rounded-xl bg-slate-50/80 p-3.5"
          >
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="mb-2 flex items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-lg ${item.iconBg}`}
              >
                <StatIcon className={`h-3 w-3 ${item.iconColor}`} />
              </div>
              <span className="text-[10px] font-medium text-slate-400">
                {item.label}
              </span>
            </div>
            <div className="font-mono text-lg font-bold text-slate-800">
              {shouldShowPrefix && item.prefix}
              {value}
              {item.suffix && (
                <span className="ml-1 text-[11px] font-normal text-slate-400">
                  {item.suffix}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
