import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  getContestDetailsApi,
  getContestProblemApi,
} from "../../../features/contests/contestsApi";
import CodeEditorPanel from "../../../features/problems/components/CodeEditorPanel";
import ProblemStatement from "../../../features/problems/components/ProblemStatement";
import ProblemTopBar from "../../../features/problems/components/ProblemTopBar";
import SplitPane from "../../../features/problems/components/SplitPane";
import { getProblemBankProblemApi } from "../../../features/problems/problemsApi";

function splitLines(value) {
  if (Array.isArray(value)) {
    return value;
  }

  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeSamples(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((sample) => ({
      input: sample.input || "",
      output: sample.output || "",
    }))
    .filter((sample) => sample.input || sample.output);
}

function normalizeProblemDetail({ problemId, baseProblem = {}, contestTitle }) {
  const timeLimit =
    baseProblem.timeLimit ||
    (baseProblem.timeLimitSeconds
      ? `${baseProblem.timeLimitSeconds} ${
          Number(baseProblem.timeLimitSeconds) === 1 ? "second" : "seconds"
        }`
      : "1 second");
  const memoryLimit =
    baseProblem.memoryLimit ||
    (baseProblem.memoryLimitMb
      ? `${baseProblem.memoryLimitMb} MB`
      : "256 MB");

  return {
    ...baseProblem,
    id: baseProblem.id || problemId,
    title: baseProblem.title || "Problem unavailable",
    difficulty: baseProblem.difficulty || "Medium",
    description:
      baseProblem.description ||
      baseProblem.statement ||
      "Problem details could not be loaded from the backend.",
    inputSpec: baseProblem.inputSpec || baseProblem.inputFormat || "",
    outputSpec: baseProblem.outputSpec || baseProblem.outputFormat || "",
    constraints: splitLines(baseProblem.constraints),
    samples: normalizeSamples(baseProblem.samples || baseProblem.testCases),
    tags: Array.isArray(baseProblem.tags) ? baseProblem.tags : [],
    hasEditorial: Boolean(baseProblem.hasEditorial),
    timeLimit,
    memoryLimit,
    contestTitle: contestTitle || baseProblem.contestTitle || null,
  };
}

function ProblemPage() {
  const location = useLocation();
  const { contestId, problemId } = useParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const [contestProblemMeta, setContestProblemMeta] = useState(null);
  const [standaloneProblemMeta, setStandaloneProblemMeta] = useState(null);
  const [submissionRefreshKey, setSubmissionRefreshKey] = useState(0);

  const routeProblem = location.state?.problem || null;

  useEffect(() => {
    let isMounted = true;

    async function hydrateContestProblem() {
      if (!contestId) {
        return;
      }

      try {
        const problem = await getContestProblemApi(contestId, problemId);

        if (!isMounted) {
          return;
        }

        setContestProblemMeta({
          ...routeProblem,
          ...problem,
        });
      } catch {
        try {
          const response = await getContestDetailsApi(contestId);
          const selectedProblem = response?.problems?.find(
            (problem) => String(problem.id) === String(problemId),
          );

          if (!isMounted || !selectedProblem) {
            return;
          }

          setContestProblemMeta({
            ...routeProblem,
            ...selectedProblem,
            contestTitle: response.title,
            contestStatus: response.statusText,
            contestStartTime: response.startTime,
            contestEndTime: response.endTime,
            contestDurationMinutes: response.durationMinutes,
          });
        } catch {
          if (!isMounted) {
            return;
          }

          setContestProblemMeta((prev) => prev || routeProblem || null);
        }
      }
    }

    hydrateContestProblem();

    return () => {
      isMounted = false;
    };
  }, [contestId, problemId, routeProblem]);

  useEffect(() => {
    let isMounted = true;

    async function hydrateStandaloneProblem() {
      if (contestId) {
        return;
      }

      try {
        const problem = await getProblemBankProblemApi(problemId);

        if (isMounted) {
          setStandaloneProblemMeta(problem);
        }
      } catch (error) {
        if (isMounted) {
          setStandaloneProblemMeta({
            ...(routeProblem || {}),
            id: problemId,
            loadError: error.message || "Failed to fetch problem.",
          });
        }
      }
    }

    hydrateStandaloneProblem();

    return () => {
      isMounted = false;
    };
  }, [contestId, problemId, routeProblem]);

  const resolvedProblemMeta = useMemo(() => {
    if (contestId) {
      return contestProblemMeta || routeProblem || { id: problemId };
    }

    return standaloneProblemMeta || routeProblem || { id: problemId };
  }, [
    contestId,
    contestProblemMeta,
    problemId,
    routeProblem,
    standaloneProblemMeta,
  ]);

  const problem = useMemo(
    () =>
      normalizeProblemDetail({
        problemId,
        baseProblem: resolvedProblemMeta,
        contestTitle:
          contestProblemMeta?.contestTitle ||
          routeProblem?.contestTitle ||
          null,
      }),
    [contestProblemMeta, problemId, resolvedProblemMeta, routeProblem],
  );

  const backTo =
    location.state?.backTo ||
    (contestId
      ? `/student/contests/${contestId}/problems`
      : "/student/problems");

  const handleExpandToggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const handleSubmissionStored = useCallback(() => {
    setSubmissionRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <div className="flex h-screen min-h-0 flex-col overflow-hidden bg-slate-50 text-slate-900">
      <ProblemTopBar
        backTo={backTo}
        contestTitle={problem.contestTitle}
        contestEndTime={problem.contestEndTime}
        showContestTimer={Boolean(contestId)}
      />

      <div className="min-h-0 flex-1">
        <SplitPane
          left={
            <ProblemStatement
              problem={problem}
              contestId={contestId}
              submissionRefreshKey={submissionRefreshKey}
            />
          }
          right={
            <CodeEditorPanel
              problem={problem}
              contestId={contestId}
              isExpanded={isExpanded}
              onExpandToggle={handleExpandToggle}
              onSubmissionStored={handleSubmissionStored}
            />
          }
          defaultLeftWidth={42}
          minLeftWidth={25}
          maxLeftWidth={70}
          isExpanded={isExpanded}
        />
      </div>
    </div>
  );
}

export default ProblemPage;
