import { Clock3 } from "lucide-react";

const VERDICT_STYLES = {
  AC: {
    label: "Accepted",
    className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    dot: "bg-emerald-500",
  },
  WA: {
    label: "Wrong Answer",
    className: "bg-red-50 text-red-600 ring-1 ring-red-200",
    dot: "bg-red-500",
  },
  TLE: {
    label: "Time Limit",
    className: "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
    dot: "bg-orange-400",
  },
  MLE: {
    label: "Memory Limit",
    className: "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
    dot: "bg-purple-400",
  },
  CE: {
    label: "Compile Error",
    className: "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200",
    dot: "bg-yellow-400",
  },
  RE: {
    label: "Runtime Error",
    className: "bg-pink-50 text-pink-700 ring-1 ring-pink-200",
    dot: "bg-pink-500",
  },
  Pending: {
    label: "Pending",
    className: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
    dot: "bg-slate-400 animate-pulse",
  },
};

function VerdictBadge({ verdict }) {
  const style = VERDICT_STYLES[verdict] ?? VERDICT_STYLES["Pending"];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-semibold ${style.className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
}

function ContestSubmissionsTable({ submissions }) {
  if (!submissions || submissions.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
          <Clock3 size={18} />
        </div>
        <p className="text-sm font-medium text-slate-500">No submissions found</p>
        <p className="mt-1 text-xs text-slate-400">
          Submit solution to see results
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Problem
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Verdict
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Language
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Runtime
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Submitted
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {submissions.map((sub, i) => (
              <tr
                key={sub.id ?? i}
                className={`transition hover:bg-slate-50 ${sub.verdict === "AC" ? "bg-emerald-50/30" : ""}`}
              >
                {/*number*/}
                <td className="px-5 py-3 font-mono text-xs text-slate-400">
                  #{submissions.length - i}
                </td>

                {/*problem*/}
                <td className="px-4 py-3">
                  <div className="font-semibold text-slate-900">
                    {sub.problemCode}{" "}
                    <span className="font-normal text-slate-500">
                      — {sub.problemTitle}
                    </span>
                  </div>
                </td>

                {/*verdict*/}
                <td className="px-4 py-3">
                  <VerdictBadge verdict={sub.verdict} />
                </td>

                {/*language*/}
                <td className="px-4 py-3">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                    {sub.language}
                  </span>
                </td>

                {/*runtime*/}
                <td className="px-4 py-3 font-mono text-xs text-slate-500">
                  {sub.runtime ?? "—"}
                </td>

                {/*time*/}
                <td className="px-4 py-3 text-xs text-slate-400">
                  {sub.timeStr}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ContestSubmissionsTable;
