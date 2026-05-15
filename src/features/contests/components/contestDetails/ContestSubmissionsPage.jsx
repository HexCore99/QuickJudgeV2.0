import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchContestSubmissions } from "../../../contests/contestsThunks";
import { clearSubmissions } from "../../../contests/contestsSlice";
import {
  selectContestSubmissions,
  selectContestSubmissionsLoading,
  selectContestSubmissionsError,
} from "../../../contests/contestsSelectors";
import SubmissionsPanel from "../../../profile/components/SubmissionsPanel";
import SubmissionSlidePanel from "../../../profile/components/SubmissionSlidePanel";

const VERDICT_CODES = {
  Accepted: "AC",
  "Wrong Answer": "WA",
  "Time Limit Exceeded": "TLE",
  "Runtime Error": "RE",
  "Compilation Error": "CE",
};

function timeAgo(dateStr) {
  const submittedTime = new Date(dateStr).getTime();
  if (Number.isNaN(submittedTime)) return "--";

  const diff = Math.max(0, Math.floor((Date.now() - submittedTime) / 1000));
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function getFilterKey(verdict) {
  if (verdict === "AC") return "ac";
  if (verdict === "WA") return "wa";
  return "other";
}

function mapContestSubmission(submission) {
  const verdict = VERDICT_CODES[submission.verdict] || submission.verdict;
  const verdictCode = String(verdict || "CE").toUpperCase();
  const sourceCode =
    submission.code ?? submission.sourceCode ?? submission.source_code;

  return {
    problem: submission.problemTitle || `Problem ${submission.problemCode}`,
    id: `Submission #${submission.id}`,
    verdict: verdictCode,
    time: timeAgo(submission.submittedAt),
    timeLabel: "Submitted Ago",
    mem:
      submission.memory ??
      submission.mem ??
      (submission.memoryKb ? `${submission.memoryKb} KB` : "--"),
    lang: submission.language,
    f: getFilterKey(verdictCode),
    at: submission.submittedAt || String(submission.id),
    tc:
      submission.testCases ||
      submission.tc ||
      submission.testCaseNote ||
      "Judge test-case details are not available for this contest submission.",
    code:
      sourceCode ||
      "Source code is not available for this contest submission yet.\n\nThe current contest submissions API returns verdict metadata only.",
  };
}

function ContestSubmissionsPage() {
  const dispatch = useDispatch();
  const { contestId } = useParams();
  const [selectedSubmissionIndex, setSelectedSubmissionIndex] = useState(null);

  const submissions = useSelector(selectContestSubmissions);
  const isLoading = useSelector(selectContestSubmissionsLoading);
  const error = useSelector(selectContestSubmissionsError);

  useEffect(() => {
    dispatch(fetchContestSubmissions(contestId));
    return () => {
      dispatch(clearSubmissions());
    };
  }, [dispatch, contestId]);

  const submissionRows = useMemo(
    () => submissions.map(mapContestSubmission),
    [submissions],
  );
  const selectedSubmission =
    selectedSubmissionIndex === null
      ? null
      : submissionRows[selectedSubmissionIndex];

  function openSubmission(index) {
    if (index >= 0 && index < submissionRows.length) {
      setSelectedSubmissionIndex(index);
    }
  }

  function closeSubmission() {
    setSelectedSubmissionIndex(null);
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-400">
        Loading submissions...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!submissions.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-400">
        No submissions yet. Submit a solution to see it here.
      </div>
    );
  }

  return (
    <>
      <SubmissionSlidePanel
        submission={selectedSubmission}
        isOpen={selectedSubmissionIndex !== null}
        onClose={closeSubmission}
      />
      <SubmissionsPanel
        submissions={submissionRows}
        allSubmissions={submissionRows}
        onOpenSubmission={openSubmission}
        totalCount={submissionRows.length}
        emptyMessage="No submissions match this verdict filter."
        problemHint=""
        verdictHint="click for code"
        showLoadMore={false}
      />
    </>
  );
}

export default ContestSubmissionsPage;
