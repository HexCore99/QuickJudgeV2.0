import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { BarChart3, RefreshCw } from "lucide-react";
import {
  selectLeaderboard,
  selectLeaderboardError,
  selectLeaderboardLoading,
} from "../../contestsSelectors";
import { fetchContestLeaderboard } from "../../contestsThunks";
import ContestLeaderboardTable from "./ContestLeaderboardTable";

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

/*EndtempData */

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

function ContestLeaderboardPage() {
  const dispatch = useDispatch();
  const { contestDetails, contestId } = useOutletContext();

  const leaderboard = useSelector(selectLeaderboard);
  const isLoading = useSelector(selectLeaderboardLoading);
  const error = useSelector(selectLeaderboardError);

  const problems = contestDetails?.problems ?? [];
  const isLive = contestDetails?.statusText?.toLowerCase().includes("live");

  useEffect(() => {
    dispatch(fetchContestLeaderboard(contestId));
  }, [dispatch, contestId]);

  // temporredux
  const entries =
    leaderboard?.entries ??
    (problems.length > 0 ? buildMockLeaderboard(problems) : []);

  const lbProblems =
    leaderboard?.problems ??
    problems.map((p) => ({ code: p.problem_code ?? p.code ?? p.id, title: p.title, points: p.points }));

  function handleRefresh() {
    dispatch(fetchContestLeaderboard(contestId));
  }

  return (
    <div className="space-y-4">
      {/*header_row*/}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 size={16} className="text-amber-600" />
          <span className="text-sm font-semibold text-slate-700">
            Standings
          </span>
          {isLive && (
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-200">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Live
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw
            size={12}
            className={isLoading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/*errorbanner*/}
      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-700">
          {error} — showing sample data below.
        </div>
      )}

      {/*statsbar*/}
      <LeaderboardStatsBar entries={entries} problems={lbProblems} />

      {/*skeleton*/}
      {isLoading && !entries.length ? (
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-xl bg-slate-100"
            />
          ))}
        </div>
      ) : (
        <ContestLeaderboardTable
          entries={entries}
          problems={lbProblems}
          isLive={isLive}
        />
      )}
    </div>
  );
}

export default ContestLeaderboardPage;