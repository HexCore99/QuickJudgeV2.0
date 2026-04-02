import ProblemStatusDot from "../../problems/ProblemStatusDot.jsx";
import ProblemTitleLink from "../../problems/ProblemTitleLink.jsx";
import ProblemDifficultyBadge from "../../problems/ProblemDifficultyBadge.jsx";

function ContestProblemsTable({ problems }) {
  return (
    <div className="mx-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {problems.map((problem, index) => (
        <div
          key={problem.id}
          className={`flex items-center justify-between gap-4 px-5 py-3 transition hover:bg-slate-100 ${index !== problems.length - 1 ? "border-b border-slate-200" : ""}`}
        >
          <div className="flex min-w-0 items-center gap-4">
            <ProblemStatusDot difficulty={problem.difficulty} />
            <span className="w-5 text-sm text-slate-500">{problem.id}</span>
            <ProblemTitleLink
              to={`/student/problem/${problem.id}`}
              title={problem.title}
            />
          </div>

          <div className="flex items-center gap-4">
            <ProblemDifficultyBadge difficulty={problem.difficulty} />
            <span className="text-xs text-slate-500">{problem.points} pts</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ContestProblemsTable;
