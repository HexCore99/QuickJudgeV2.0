export function validateContestId(contestId) {
  if (!contestId || typeof contestId !== "string" || !contestId.trim()) {
    return "Contest id is required.";
  }

  return null;
}

export function validateContestPassword(password) {
  if (typeof password !== "string" || !password.trim()) {
    return "Contest password is required.";
  }

  return null;
}
