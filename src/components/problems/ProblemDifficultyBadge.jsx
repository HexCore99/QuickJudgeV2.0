function ProblemDifficultyBadge({ difficulty }) {
  const difficultyClasses = {
    easy: "bg-emerald-100 text-emerald-700",
    medium: "bg-amber-100 text-amber-700",
    hard: "bg-rose-100 text-rose-700",
  };

  return (
    <span
      className={`rounded-md px-2 py-1 text-xs ${
        difficultyClasses[difficulty] || "bg-slate-100 text-slate-600"
      }`}
    >
      {difficulty}
    </span>
  );
}

export default ProblemDifficultyBadge;
