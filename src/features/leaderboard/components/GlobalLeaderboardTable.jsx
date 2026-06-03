import { Crown, Medal, Trophy } from "lucide-react";

const TIERS = [
  {
    min: 2400,
    label: "Grandmaster",
    color: "text-red-600",
    bg: "bg-red-50",
    ring: "ring-red-300",
  },
  {
    min: 2100,
    label: "Master",
    color: "text-orange-600",
    bg: "bg-orange-50",
    ring: "ring-orange-300",
  },
  {
    min: 1900,
    label: "Candidate",
    color: "text-violet-600",
    bg: "bg-violet-50",
    ring: "ring-violet-300",
  },
  {
    min: 1600,
    label: "Expert",
    color: "text-blue-600",
    bg: "bg-blue-50",
    ring: "ring-blue-300",
  },
  {
    min: 1400,
    label: "Specialist",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    ring: "ring-cyan-300",
  },
  {
    min: 1200,
    label: "Pupil",
    color: "text-green-600",
    bg: "bg-green-50",
    ring: "ring-green-300",
  },
  {
    min: 0,
    label: "Newbie",
    color: "text-slate-500",
    bg: "bg-slate-100",
    ring: "ring-slate-300",
  },
];

const AVATAR_GRADIENTS = [
  "from-amber-400 to-orange-500",
  "from-sky-400 to-blue-500",
  "from-emerald-400 to-teal-500",
  "from-violet-400 to-purple-500",
  "from-rose-400 to-pink-500",
  "from-lime-400 to-green-500",
  "from-cyan-400 to-sky-500",
];

function getTier(rating) {
  return TIERS.find((tier) => rating >= tier.min) ?? TIERS[TIERS.length - 1];
}

function avatarGradient(username) {
  const idx = (username?.charCodeAt(0) ?? 0) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[idx];
}

function getRankIcon(rank) {
  if (rank === 1) return <Crown size={14} className="text-amber-500" />;
  if (rank === 2) return <Trophy size={14} className="text-slate-400" />;
  if (rank === 3) return <Medal size={14} className="text-amber-700" />;
  return null;
}

function getRankRowClass(rank) {
  if (rank === 1) return "border-l-2 border-l-amber-400 bg-amber-50/70";
  if (rank === 2) return "border-l-2 border-l-slate-400 bg-slate-50/80";
  if (rank === 3) return "border-l-2 border-l-orange-400 bg-orange-50/60";
  return "hover:bg-slate-50/60";
}

function getRankBadgeClass(rank) {
  if (rank === 1) return "bg-amber-100 text-amber-700 ring-1 ring-amber-300";
  if (rank === 2) return "bg-slate-100 text-slate-600 ring-1 ring-slate-300";
  if (rank === 3) return "bg-orange-100 text-orange-700 ring-1 ring-orange-300";
  return "bg-slate-100 text-slate-500";
}

function GlobalLeaderboardTable({ entries }) {
  if (!entries || entries.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
        No users on the leaderboard yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="w-16 px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">
                Rank
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">
                Username
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold tracking-wider text-slate-500 uppercase">
                Rating
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold tracking-wider text-slate-500 uppercase">
                Total Solved
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {entries.map((entry) => {
              const tier = getTier(entry.rating);

              return (
                <tr
                  key={entry.userId}
                  className={`transition ${getRankRowClass(entry.rank)}`}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold ${getRankBadgeClass(entry.rank)}`}
                      >
                        {entry.rank}
                      </span>
                      {getRankIcon(entry.rank)}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${avatarGradient(entry.username)} text-xs font-bold text-white shadow-sm`}
                      >
                        {entry.username?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-900">
                        {entry.username}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <div className="inline-flex flex-col items-center gap-0.5">
                      <span
                        className={`font-mono text-sm font-bold ${tier.color}`}
                      >
                        {entry.rating}
                      </span>
                      <span
                        className={`inline-block rounded px-1.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase ring-1 ${tier.bg} ${tier.color} ${tier.ring}`}
                      >
                        {tier.label}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span className="font-mono text-sm font-semibold text-slate-700">
                      {entry.totalSolved}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GlobalLeaderboardTable;
