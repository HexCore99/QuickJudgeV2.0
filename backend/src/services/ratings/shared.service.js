export function createServiceError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function pad(value) {
  return String(value).padStart(2, "0");
}

export function formatSqlDate(value) {
  const date = value instanceof Date ? value : new Date(value);

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// Builds a public profile ID using the user's join year and numeric user ID.
export function getPublicId(user) {
  const joinedDate = user.created_at ? new Date(user.created_at) : null;
  const year =
    joinedDate && !Number.isNaN(joinedDate.getTime())
      ? joinedDate.getFullYear()
      : new Date().getFullYear();

  return `QJ-${year}-${String(user.user_id).padStart(4, "0")}`;
}

// JUDGE TIESRS
export function getRatingTier(rating) {
  if (rating <= 0) return "UNRATED";
  if (rating >= 2400) return "MASTER";
  if (rating >= 2000) return "ELITE";
  if (rating >= 1600) return "EXPERT";
  if (rating >= 1200) return "PUPIL";
  return "NEWBIE";
}

export function getPlaceholders(values) {
  return values.map(() => "?").join(", ");
}
