import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getContestDetailsApi } from "../../../features/contests/contestsApi";
import CodeEditorPanel from "../../../features/problems/components/CodeEditorPanel";
import ProblemStatement from "../../../features/problems/components/ProblemStatement";
import ProblemTopBar from "../../../features/problems/components/ProblemTopBar";
import SplitPane from "../../../features/problems/components/SplitPane";
import { getProblemMockDetail } from "../../../features/problems/problemMockData";
import { PROBLEM_BANK_ITEMS } from "../../../features/problems/problemBankMockData";

function ProblemPage() {
  const location = useLocation();
  const { contestId, problemId } = useParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const [contestProblemMeta, setContestProblemMeta] = useState(null);

  const routeProblem = location.state?.problem || null;
  const standaloneProblem =
    PROBLEM_BANK_ITEMS.find((problem) => String(problem.id) === String(problemId)) ||
    null;

  useEffect(() => {
    let isMounted = true;

    async function hydrateContestProblem() {
      if (!contestId) {
        return;
      }

      if (routeProblem?.contestTitle && routeProblem?.difficulty) {
        return;
      }

      try {
        const response = await getContestDetailsApi(contestId);
        const selectedProblem = response?.problems?.find(
          (problem) => String(problem.id) === String(problemId),
        );

        if (!isMounted || !selectedProblem) {
          return;
        }

        setContestProblemMeta({
          ...selectedProblem,
          contestTitle: response.title,
        });
      } catch {
        if (!isMounted) {
          return;
        }

        setContestProblemMeta((prev) => prev || null);
      }
    }

    hydrateContestProblem();

    return () => {
      isMounted = false;
    };
  }, [contestId, problemId, routeProblem]);

  const resolvedProblemMeta = useMemo(
    () =>
      routeProblem ||
      standaloneProblem ||
      contestProblemMeta || { id: problemId },
    [contestProblemMeta, problemId, routeProblem, standaloneProblem],
  );

  const problem = useMemo(
    () =>
      getProblemMockDetail({
        problemId,
        baseProblem: resolvedProblemMeta,
        contestTitle:
          routeProblem?.contestTitle ||
          contestProblemMeta?.contestTitle ||
          null,
      }),
    [contestProblemMeta, problemId, resolvedProblemMeta, routeProblem],
  );

  const backTo = contestId
    ? `/student/${contestId}/problems`
    : "/student/problems";

  const handleExpandToggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <div className="flex h-screen min-h-0 flex-col overflow-hidden bg-slate-50 text-slate-900">
      <ProblemTopBar
        backTo={backTo}
        contestTitle={problem.contestTitle}
        showContestTimer={Boolean(contestId)}
      />

      <div className="min-h-0 flex-1">
        <SplitPane
          left={<ProblemStatement problem={problem} />}
          right={
            <CodeEditorPanel
              isExpanded={isExpanded}
              onExpandToggle={handleExpandToggle}
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