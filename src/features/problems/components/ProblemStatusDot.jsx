import { normalizeDifficulty } from "../problemUtils";

function ProblemStatusDot({ difficulty }) {
  const dotClasses = {
    easy: "bg-emerald-500",
    medium: "bg-amber-500",
    hard: "bg-red-600",
  };
  const normalizedDifficulty = normalizeDifficulty(difficulty);

  return (
    <span
      className={`h-3 w-3 rounded-full ${dotClasses[normalizedDifficulty] || "bg-slate-300"}`}
    />
  );
}

export default ProblemStatusDot;
