const FIRST_RATED_CONTEST_BASELINE = 500;
const MAX_RATING_DELTA = 150;

export function calculateRatingDelta(rank, totalParticipants) {
  if (totalParticipants <= 1) {
    return 0;
  }

  const rankPercentile = (totalParticipants - rank) / (totalParticipants - 1);

  return Math.round((rankPercentile - 0.5) * 2 * MAX_RATING_DELTA);
}

export function getEffectiveOldRating(oldRating) {
  return oldRating > 0 ? oldRating : FIRST_RATED_CONTEST_BASELINE;
}

export function calculateNewRating(
  oldRating,
  ratingDelta,
  { applyBaseline = true } = {},
) {
  const baseRating = applyBaseline
    ? getEffectiveOldRating(oldRating)
    : oldRating;
  return Math.max(0, baseRating + ratingDelta);
}
