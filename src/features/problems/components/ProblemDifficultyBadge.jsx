import {
  formatDifficultyLabel,
  normalizeDifficulty,
} from "../problemUtils";

function ProblemDifficultyBadge({ difficulty }) {
  const difficultyClasses = {
    easy: "bg-emerald-100 text-emerald-700",
    medium: "bg-amber-100 text-amber-700",
    hard: "bg-rose-100 text-rose-700",
  };
  const normalizedDifficulty = normalizeDifficulty(difficulty);

  return (
    <span
      className={`rounded-md px-2 py-1 text-xs ${
        difficultyClasses[normalizedDifficulty] || "bg-slate-100 text-slate-600"
      }`}
    >
      {formatDifficultyLabel(normalizedDifficulty)}
    </span>
  );
}

export default ProblemDifficultyBadge;
