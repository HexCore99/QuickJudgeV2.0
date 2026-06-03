import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { clearSubmissions } from "../../contests/contestsSlice";
import {
  selectContestSubmissions,
  selectContestSubmissionsError,
  selectContestSubmissionsLoading,
} from "../../contests/contestsSelectors";
import { fetchContestSubmissions } from "../../contests/contestsThunks";
import SubmissionSlidePanel from "../../profile/components/SubmissionSlidePanel";
import SubmissionsPanel from "../../profile/components/SubmissionsPanel";

const VERDICT_CODES = {
  Accepted: "AC",
  "Wrong Answer": "WA",
  "Time Limit Exceeded": "TLE",
  "Runtime Error": "RE",
  "Compilation Error": "CE",
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getFilterKey(verdict) {
  if (verdict === "AC") return "ac";
  if (verdict === "WA") return "wa";
  return "other";
}

function mapAdminSubmission(submission) {
  const verdict = VERDICT_CODES[submission.verdict] || submission.verdict;
  const verdictCode = String(verdict || "CE").toUpperCase();
  const participant = submission.username || "Unknown student";
  const sourceCode =
    submission.code ?? submission.sourceCode ?? submission.source_code;

  return {
    problem: `Problem ${submission.problemCode}`,
    id: `Submission #${submission.id}`,
    participant,
    verdict: verdictCode,
    time: formatDate(submission.submittedAt),
    timeLabel: "Submitted",
    mem: submission.memory ?? submission.mem ?? "--",
    lang: submission.language,
    f: getFilterKey(verdictCode),
    at: submission.submittedAt || String(submission.id),
    tc:
      submission.testCases ||
      submission.tc ||
      "Judge test-case details are not available for this contest submission.",
    code:
      sourceCode ||
      "Source code is not available for this contest submission yet.\n\nThe current contest submissions API returns verdict metadata only.",
  };
}

function AdminContestSubmissionsPage() {
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
    () => submissions.map(mapAdminSubmission),
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
        No submissions yet.
      </div>
    );
  }

  return (
    <>
      <SubmissionSlidePanel
        submission={selectedSubmission}
        isOpen={selectedSubmissionIndex !== null}
        onClose={closeSubmission}
        onToast={() => {}}
      />
      <SubmissionsPanel
        submissions={submissionRows}
        allSubmissions={submissionRows}
        onOpenSubmission={openSubmission}
        title="All Contest Submissions"
        totalCount={submissionRows.length}
        emptyMessage="No submissions match this verdict filter."
        problemHint=""
        showParticipant
        verdictHint="click for code"
        timeHeader="SUBMITTED"
        memoryHeader="MEMORY"
        languageHeader="LANG"
        showLoadMore={false}
      />
    </>
  );
}

export default AdminContestSubmissionsPage;
