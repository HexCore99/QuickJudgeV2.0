import { useEffect, useMemo, useRef } from "react";
import { PROBLEM_BANK_ITEMS } from "../../problems/problemBankMockData";

const DIFFICULTY_META = {
  Easy: { color: "#16a34a", tw: "bg-green-600" },
  Medium: { color: "#d97706", tw: "bg-amber-500" },
  Hard: { color: "#dc2626", tw: "bg-red-600" },
};

function normalizeDifficulty(value) {
  const normalized = String(value || "Medium")
    .trim()
    .toLowerCase();

  if (normalized === "easy") return "Easy";
  if (normalized === "hard") return "Hard";
  return "Medium";
}

function hasAnyBreakdownTotal(difficulties) {
  return difficulties.some((difficulty) => Number(difficulty.total) > 0);
}

function buildPublicProblemBreakdown(publicProblems, submissions) {
  const solvedPublicProblemIds = new Set(
    submissions
      .filter(
        (submission) =>
          submission.verdict === "AC" && submission.isScored !== false,
      )
      .map((submission) => Number(submission.problemId))
      .filter((problemId) => Number.isInteger(problemId) && problemId > 0),
  );

  const rowsByDifficulty = ["Easy", "Medium", "Hard"].reduce(
    (acc, difficulty) => {
      acc[difficulty] = {
        label: difficulty,
        ...DIFFICULTY_META[difficulty],
        solved: 0,
        total: 0,
      };
      return acc;
    },
    {},
  );

  publicProblems.forEach((problem) => {
    const difficulty = normalizeDifficulty(problem.difficulty);
    const problemId = Number(problem.id);

    rowsByDifficulty[difficulty].total += 1;

    if (
      Number.isInteger(problemId) &&
      solvedPublicProblemIds.has(problemId)
    ) {
      rowsByDifficulty[difficulty].solved += 1;
    }
  });

  return ["Easy", "Medium", "Hard"].map(
    (difficulty) => rowsByDifficulty[difficulty],
  );
}

export default function ProblemBreakdown({ difficulties = [], submissions = [] }) {
  const barRefs = useRef([]);
  const needsPublicProblemFallback = !hasAnyBreakdownTotal(difficulties);

  const displayDifficulties = useMemo(() => {
    if (needsPublicProblemFallback) {
      return buildPublicProblemBreakdown(PROBLEM_BANK_ITEMS, submissions);
    }

    return difficulties;
  }, [difficulties, needsPublicProblemFallback, submissions]);

  useEffect(() => {
    const timer = setTimeout(() => {
      barRefs.current.forEach((bar) => {
        if (bar) {
          const targetWidth = bar.getAttribute("data-w");
          bar.style.width = `${targetWidth}%`;
        }
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [displayDifficulties]);

  return (
    <div>
      <h2 className="mb-4 text-[11px] font-medium tracking-wider text-slate-400 uppercase">
        Problem Breakdown
      </h2>
      <div className="space-y-4">
        {displayDifficulties.map((difficulty, index) => {
          const total = Number(difficulty.total) || 0;
          const solved = Number(difficulty.solved) || 0;
          const pct =
            total > 0 ? Math.max(Math.round((solved / total) * 100), 2) : 0;

          return (
            <div key={difficulty.label}>
              <div className="mb-1.5 flex items-center justify-between">
                <span
                  className="flex items-center gap-2 text-sm font-medium"
                  style={{ color: difficulty.color }}
                >
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: difficulty.color }}
                  />
                  {difficulty.label}
                </span>
                <span className="font-mono text-xs text-slate-500">
                  {solved} / {total}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  ref={(el) => {
                    barRefs.current[index] = el;
                  }}
                  data-w={pct}
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: "0%",
                    background: difficulty.color,
                    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
