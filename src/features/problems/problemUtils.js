export function normalizeDifficulty(difficulty) {
  return String(difficulty || "medium").trim().toLowerCase();
}

export function formatDifficultyLabel(difficulty) {
  const normalizedDifficulty = normalizeDifficulty(difficulty);

  return (
    normalizedDifficulty.charAt(0).toUpperCase() + normalizedDifficulty.slice(1)
  );
}
