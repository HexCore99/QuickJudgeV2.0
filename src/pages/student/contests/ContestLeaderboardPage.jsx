import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { BarChart3, RefreshCw } from "lucide-react";
import {
  selectLeaderboard,
  selectLeaderboardError,
  selectLeaderboardLoading,
} from "../../../features/contests/contestsSelectors";
import { fetchContestLeaderboard } from "../../../features/contests/contestsThunks";
import ContestLeaderboardTable from "../../../features/contests/components/contestDetails/ContestLeaderboardTable";

/* Temporary data */
function buildMockLeaderboard(problems) {
  const names = [
    "cipher_x",
    "neovim_god",
    "segfault7",
    "nullptr_t",
    "bytewitch",
    "rekursiv",
    "hashbrown",
    "queuepain",
    "loophole9",
    "stackover",
    "ac_machine",
    "binSearch",
    "greedy_pig",
    "dp_wizard",
    "bitmaskPR",
  ];
    function fmt(mins) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h${String(m).padStart(2, "0")}m` : `${m}m`;
  }

  return names.map((name, i) => {
    const rank = i + 1;
    const problemResults = {};
    let totalScore = 0;
    let penalty = 0;

    problems.forEach((p) => {
      const roll = Math.random();
      if (roll < 0.15) return; // not attempted

      const solved = roll < 0.8;
      const attempts = solved
        ? Math.floor(Math.random() * 3) + 1
        : Math.floor(Math.random() * 4) + 1;
      const timeMin = solved
        ? Math.floor(Math.random() * 110) + 5
        : 0;

      if (solved) {
        const score = p.points - (attempts - 1) * 10;
        totalScore += score;
        penalty += timeMin + (attempts - 1) * 20;
        problemResults[p.code] = {
          solved: true,
          score,
          timeStr: fmt(timeMin),
          attempts,
        };
      } else {
        problemResults[p.code] = { solved: false, attempts };
      }
    });

    return {
      rank,
      userId: `u${i + 1}`,
      name,
      handle: name,
      problems: problemResults,
      totalScore,
      penalty,
    };
  })
    .sort((a, b) => b.totalScore - a.totalScore || a.penalty - b.penalty)
    .map((entry, idx) => ({ ...entry, rank: idx + 1 }));
}

/*End of temp */

function LeaderboardStatsBar({ entries, problems }) {
  if (!entries?.length) return null;

  const topScore = entries[0]?.totalScore ?? 0;
  const solvedAll = entries.filter(
    (e) =>
      Object.values(e.problems || {}).filter((p) => p.solved).length ===
      problems.length,
  ).length;

  const avgScore =
    entries.length > 0
      ? Math.round(
          entries.reduce((s, e) => s + e.totalScore, 0) / entries.length,
        )
      : 0;

  return (
    <div className="mb-5 grid grid-cols-3 gap-3 sm:grid-cols-3">
      {[
        { label: "Participants", value: entries.length },
        { label: "Top Score", value: topScore },
        { label: "Full Solves", value: solvedAll },
        
      ].map(({ label, value }) => (
        <div
          key={label}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center shadow-sm"
        >
          <div className="text-xl font-black text-slate-900 tabular-nums">
            {value}
          </div>
          <div className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-slate-400">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}