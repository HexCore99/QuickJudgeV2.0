import { useOutletContext } from "react-router-dom";
import { Send } from "lucide-react";
import ContestSubmissionsTable from "../../../features/contests/components/contestDetails/ContestSubmissionsTable";

/* Temp data, pore backend nibo */
const MOCK_SUBMISSIONS = [
  {
    id: 9,
    problemCode: "D",
    problemTitle: "Shortest Route Rebuild",
    verdict: "TLE",
    language: "C++17",
    runtime: "2001ms",
    timeStr: "1h 47m ago",
  },
  {
    id: 8,
    problemCode: "C",
    problemTitle: "Tree Teleport",
    verdict: "AC",
    language: "C++17",
    runtime: "84ms",
    timeStr: "1h 22m ago",
  },
  {
    id: 7,
    problemCode: "C",
    problemTitle: "Tree Teleport",
    verdict: "WA",
    language: "C++17",
    runtime: "76ms",
    timeStr: "1h 31m ago",
  },
  {
    id: 6,
    problemCode: "B",
    problemTitle: "Greedy Interval Merge",
    verdict: "AC",
    language: "C++17",
    runtime: "42ms",
    timeStr: "58m ago",
  },
  {
    id: 5,
    problemCode: "B",
    problemTitle: "Greedy Interval Merge",
    verdict: "CE",
    language: "C++17",
    runtime: null,
    timeStr: "1h 04m ago",
  },
  {
    id: 4,
    problemCode: "A",
    problemTitle: "Minimum Path in DAG",
    verdict: "AC",
    language: "Python 3",
    runtime: "210ms",
    timeStr: "1h 49m ago",
  },
  {
    id: 3,
    problemCode: "A",
    problemTitle: "Minimum Path in DAG",
    verdict: "WA",
    language: "Python 3",
    runtime: "188ms",
    timeStr: "1h 55m ago",
  },
];

function SubmissionsSummaryBar({ submissions }) {
  const total = submissions.length;
  const accepted = new Set(
    submissions.filter((s) => s.verdict === "AC").map((s) => s.problemCode),
  ).size;
  const pending = submissions.filter((s) => s.verdict === "Pending").length;

  return (
    <div className="mb-5 flex flex-wrap gap-3">
      {[
        {
          label: "Total",
          value: total,
          className: "border-slate-200 text-slate-900",
        },
        {
          label: "Accepted",
          value: accepted,
          sub: "problems",
          className: "border-emerald-200 bg-emerald-50/50 text-emerald-700",
        },
        pending > 0 && {
          label: "Judging",
          value: pending,
          className: "border-amber-200 bg-amber-50/50 text-amber-700",
        },
      ]
        .filter(Boolean)
        .map(({ label, value, sub, className }) => (
          <div
            key={label}
            className={`rounded-xl border bg-white px-5 py-3 text-center shadow-sm ${className}`}
          >
            <div className="text-xl font-black tabular-nums">{value}</div>
            <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest opacity-70">
              {sub ?? label}
            </div>
          </div>
        ))}
    </div>
  );
}

function ContestSubmissionsPage() {
  const { contestDetails } = useOutletContext();
  // pore backend use hobe
  const submissions = MOCK_SUBMISSIONS;

  return (
    <div className="space-y-4">
      
      <div className="flex items-center gap-2">
        <Send size={15} className="text-amber-600" />
        <span className="text-sm font-semibold text-slate-700">
          My Submissions
        </span>
        <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
          {submissions.length}
        </span>
      </div>

      <SubmissionsSummaryBar submissions={submissions} />

      <ContestSubmissionsTable submissions={submissions} />
    </div>
  );
}

export default ContestSubmissionsPage;

