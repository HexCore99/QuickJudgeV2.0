import { Link, useOutletContext } from "react-router-dom";
import ProblemDifficultyBadge from "../../problems/components/ProblemDifficultyBadge";
import ProblemStatusDot from "../../problems/components/ProblemStatusDot";

function AdminContestProblemsPage() {
  const { contestDetails, contestId } = useOutletContext();
  const problems = contestDetails?.problems || [];

  if (!problems.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-400">
        No problems are attached to this contest.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {problems.map((problem, index) => (
        <Link
          key={problem.id}
          to={`/admin/contests/${contestId}/problems/${problem.id}`}
          state={{
            backTo: `/admin/contests/${contestId}/problems`,
            problem: {
              ...problem,
              contestTitle: contestDetails.title,
              contestStatus: contestDetails.statusText,
              contestStartTime: contestDetails.startTime,
              contestEndTime: contestDetails.endTime,
              contestDurationMinutes: contestDetails.durationMinutes,
            },
          }}
          aria-label={`Open ${problem.title}`}
          className={`flex items-center justify-between gap-4 px-5 py-3 transition hover:bg-slate-50 ${
            index !== problems.length - 1 ? "border-b border-slate-100" : ""
          }`}
        >
          <div className="flex min-w-0 items-center gap-4">
            <ProblemStatusDot difficulty={problem.difficulty} />
            <span className="w-5 text-sm text-slate-500">{problem.id}</span>
            <span className="truncate text-sm font-semibold text-slate-800">
              {problem.title}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <ProblemDifficultyBadge difficulty={problem.difficulty} />
            <span className="text-xs text-slate-500">{problem.points} pts</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default AdminContestProblemsPage;
