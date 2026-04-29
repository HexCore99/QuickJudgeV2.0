import { Crown, Medal, Trophy } from "lucide-react";

function getRankIcon(rank) {
  if (rank === 1) return <Crown size={14} className="text-amber-500" />;
  if (rank === 2) return <Trophy size={14} className="text-slate-400" />;
  if (rank === 3) return <Medal size={14} className="text-amber-700" />;
  return null;
}

function getRankRowClass(rank) {
  if (rank === 1) return "bg-amber-50/70 border-l-2 border-l-amber-400";
  if (rank === 2) return "bg-slate-50/80 border-l-2 border-l-slate-400";
  if (rank === 3) return "bg-orange-50/60 border-l-2 border-l-orange-400";
  return "hover:bg-slate-50/60";
}

function getRankBadgeClass(rank) {
  if (rank === 1) return "bg-amber-100 text-amber-700 ring-1 ring-amber-300";
  if (rank === 2) return "bg-slate-100 text-slate-600 ring-1 ring-slate-300";
  if (rank === 3)
    return "bg-orange-100 text-orange-700 ring-1 ring-orange-300";
  return "bg-slate-100 text-slate-500";
}

function ProblemCell({ result }) {
  if (!result) {
    return (
      <td className="px-3 py-3 text-center">
        <span className="text-slate-300 text-sm">—</span>
      </td>
    );
  }

  if (!result.solved) {
    return (
      <td className="px-3 py-3 text-center">
        <div className="inline-flex flex-col items-center gap-0.5">
          <span className="text-red-400 text-sm font-medium">✗</span>
          {result.attempts > 0 && (
            <span className="text-[10px] text-slate-400">
              -{result.attempts}
            </span>
          )}
        </div>
      </td>
    );
  }

  return (
    <td className="px-3 py-3 text-center">
      <div className="inline-flex flex-col items-center gap-0.5">
        <span className="text-emerald-600 text-sm font-semibold">
          +{result.score}
        </span>
        <span className="text-[10px] text-slate-400 font-mono">
          {result.timeStr}
        </span>
        {result.attempts > 1 && (
          <span className="text-[9px] text-orange-500">
            ({result.attempts} tries)
          </span>
        )}
      </div>
    </td>
  );
}

function ContestLeaderboardTable({ entries, problems, isLive }) {
  if (!entries || entries.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
        No participants yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 w-16">
                Rank
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Participant
              </th>
              {problems.map((p) => (
                <th
                  key={p.code}
                  className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 min-w-[72px]"
                >
                  <span title={p.title}>{p.code}</span>
                </th>
              ))}
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 min-w-[80px]">
                Score
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 min-w-[72px]">
                Penalty
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {entries.map((entry) => (
              <tr
                key={entry.userId}
                className={`transition ${getRankRowClass(entry.rank)}`}
              >
                {/*rank*/}
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

                {/*participant*/}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-xs font-bold text-white shadow-sm">
                      {entry.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">
                        {entry.name}
                      </div>
                      {entry.handle && (
                        <div className="text-[11px] text-slate-400">
                          @{entry.handle}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/*per-problem cells*/}
                {problems.map((p) => (
                  <ProblemCell
                    key={p.code}
                    result={entry.problems?.[p.code]}
                  />
                ))}

                {/*total score*/}
                <td className="px-4 py-3 text-center">
                  <span className="font-mono text-sm font-bold text-slate-900">
                    {entry.totalScore}
                  </span>
                </td>

                {/*penalty*/}
                <td className="px-4 py-3 text-center">
                  <span className="font-mono text-xs text-slate-500">
                    {entry.penalty > 0 ? `+${entry.penalty}` : "—"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isLive && (
        <div className="border-t border-slate-100 bg-slate-50 px-5 py-2.5">
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Live :: The leaderboard updates every minute
          </span>
        </div>
      )}
    </div>
  );
}

export default ContestLeaderboardTable;
