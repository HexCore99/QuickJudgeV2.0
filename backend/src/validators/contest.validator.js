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

export function validateContestProblemCode(problemCode) {
  if (!problemCode || typeof problemCode !== "string" || !problemCode.trim()) {
    return "Contest problem code is required.";
  }

  return null;
}

export function validateNumericId(value, label) {
  const numberValue = Number(value);

  if (!Number.isInteger(numberValue) || numberValue <= 0) {
    return `${label} must be a positive number.`;
  }

  return null;
}

export function validateQueryAnswer(answer) {
  if (typeof answer !== "string" || !answer.trim()) {
    return "Reply cannot be empty.";
  }

  return null;
}

export function validateAnnouncementPayload({ title, body } = {}) {
  if (typeof title !== "string" || !title.trim()) {
    return "Announcement title is required.";
  }

  if (typeof body !== "string" || !body.trim()) {
    return "Announcement body is required.";
  }

  return null;
}

export function validateCreateContestPayload({
  title,
  startTime,
  endTime,
  isRated,
  requiresPassword,
  password,
  problemIds,
  problems,
} = {}) {
  if (typeof title !== "string" || !title.trim()) {
    return "Contest title is required.";
  }

  const scheduleError = validateContestSchedulePayload({ startTime, endTime });

  if (scheduleError) {
    return scheduleError;
  }

  const hasProblemDrafts = Array.isArray(problems) && problems.length > 0;
  const hasProblemIds = Array.isArray(problemIds) && problemIds.length > 0;

  if (!hasProblemDrafts && !hasProblemIds) {
    return "Select at least one problem for the contest.";
  }

  const hasInvalidProblemId = (problemIds || []).some((problemId) => {
    const numberValue = Number(problemId);
    return !Number.isInteger(numberValue) || numberValue <= 0;
  });

  if (hasInvalidProblemId) {
    return "Every selected problem must have a valid id.";
  }

  if (hasProblemDrafts) {
    const hasInvalidProblemDraft = problems.some((problem) => {
      const sourceProblemId = Number(
        problem.sourceProblemId ?? problem.problemId ?? problem.id,
      );

      return (
        !Number.isInteger(sourceProblemId) ||
        sourceProblemId <= 0 ||
        typeof problem.title !== "string" ||
        !problem.title.trim() ||
        typeof problem.statement !== "string" ||
        !problem.statement.trim()
      );
    });

    if (hasInvalidProblemDraft) {
      return "Every contest problem copy needs a source id, title, and statement.";
    }

    const hasInvalidTestCases = problems.some(
      (problem) =>
        problem.testCases !== undefined &&
        (!Array.isArray(problem.testCases) ||
          problem.testCases.some(
            (testCase) =>
              typeof testCase.input !== "string" ||
              typeof testCase.output !== "string",
          )),
    );

    if (hasInvalidTestCases) {
      return "Contest problem test cases must include input and output text.";
    }
  }

  if (Boolean(isRated) && Boolean(requiresPassword)) {
    return "Rated contests must be public.";
  }

  if (
    Boolean(requiresPassword) &&
    (typeof password !== "string" || !password.trim())
  ) {
    return "Contest password is required for private contests.";
  }

  return null;
}

export function validateContestSchedulePayload({ startTime, endTime } = {}) {
  if (typeof startTime !== "string" || !startTime.trim()) {
    return "Start time is required.";
  }

  if (typeof endTime !== "string" || !endTime.trim()) {
    return "End time is required.";
  }

  const startDate = new Date(startTime);
  const endDate = new Date(endTime);

  if (Number.isNaN(startDate.getTime())) {
    return "Start time is invalid.";
  }

  if (Number.isNaN(endDate.getTime())) {
    return "End time is invalid.";
  }

  if (endDate <= startDate) {
    return "End time must be after start time.";
  }

  return null;
}
