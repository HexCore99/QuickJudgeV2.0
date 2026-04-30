import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { Send } from "lucide-react";
import ContestSubmissionsTable from "./components/contestDetails/ContestSubmissionsTable";
import {
  selectContestSubmissions,
  selectContestSubmissionsError,
  selectContestSubmissionsLoading,
} from "./contestsSelectors";
import { fetchContestSubmissions } from "./contestsThunks";

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
  const dispatch = useDispatch();
  const { contestId } = useOutletContext();

  const submissions = useSelector(selectContestSubmissions);
  const isLoading = useSelector(selectContestSubmissionsLoading);
  const error = useSelector(selectContestSubmissionsError);

  useEffect(() => {
    if (contestId) {
      dispatch(fetchContestSubmissions(contestId));
    }
  }, [dispatch, contestId]);

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

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-xl bg-slate-100"
            />
          ))}
        </div>
      ) : (
        <>
          <SubmissionsSummaryBar submissions={submissions} />
          <ContestSubmissionsTable submissions={submissions} />
        </>
      )}
    </div>
  );
}

export default ContestSubmissionsPage;

