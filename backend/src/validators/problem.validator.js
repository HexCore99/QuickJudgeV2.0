const DIFFICULTIES = new Set(["Easy", "Medium", "Hard"]);

function isPositiveNumber(value) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue > 0;
}

function isPositiveInteger(value) {
  const numberValue = Number(value);
  return Number.isInteger(numberValue) && numberValue > 0;
}

export function validateProblemId(problemId) {
  const numberValue = Number(problemId);

  if (!Number.isInteger(numberValue) || numberValue <= 0) {
    return "Problem id must be a positive number.";
  }

  return null;
}

export function validateProblemPayload(payload = {}) {
  const {
    title,
    statement,
    difficulty,
    inputFormat,
    outputFormat,
    constraints,
    points,
    timeLimitSeconds,
    memoryLimitMb,
    tags,
    testCases,
    isPublished,
  } = payload;

  if (typeof title !== "string" || !title.trim()) {
    return "Problem title is required.";
  }

  if (typeof statement !== "string" || !statement.trim()) {
    return "Problem statement is required.";
  }

  if (!DIFFICULTIES.has(difficulty)) {
    return "Difficulty must be Easy, Medium, or Hard.";
  }

  const optionalTextFields = [
    { label: "Input format", value: inputFormat },
    { label: "Output format", value: outputFormat },
    { label: "Constraints", value: constraints },
  ];

  for (const field of optionalTextFields) {
    if (field.value !== undefined && typeof field.value !== "string") {
      return `${field.label} must be a string.`;
    }
  }

  if (!isPositiveInteger(points)) {
    return "Points must be a positive integer.";
  }

  if (!isPositiveNumber(timeLimitSeconds)) {
    return "Time limit must be a positive number.";
  }

  if (!isPositiveInteger(memoryLimitMb)) {
    return "Memory limit must be a positive integer.";
  }

  if (tags !== undefined && !Array.isArray(tags)) {
    return "Tags must be an array.";
  }

  if (Array.isArray(tags)) {
    const hasInvalidTag = tags.some(
      (tag) => typeof tag !== "string" || !tag.trim(),
    );

    if (hasInvalidTag) {
      return "Tags must be non-empty strings.";
    }
  }

  if (testCases !== undefined && !Array.isArray(testCases)) {
    return "Test cases must be an array.";
  }

  if (Array.isArray(testCases)) {
    const hasInvalidTestCase = testCases.some(
      (testCase) =>
        typeof testCase.input !== "string" ||
        typeof testCase.output !== "string",
    );

    if (hasInvalidTestCase) {
      return "Test case input and output must be strings.";
    }
  }

  if (isPublished !== undefined && typeof isPublished !== "boolean") {
    return "Publication status must be true or false.";
  }

  return null;
}

export function validateProblemPublicationPayload({ isPublished } = {}) {
  if (typeof isPublished !== "boolean") {
    return "Publication status must be true or false.";
  }

  return null;
}

export function validateEditorialPayload(payload = {}) {
  const { markdownContent, codeContent, videoLink } = payload;

  const optionalTextFields = [
    { label: "Markdown content", value: markdownContent },
    { label: "Code content", value: codeContent },
    { label: "Video link", value: videoLink },
  ];

  for (const field of optionalTextFields) {
    if (field.value !== undefined && typeof field.value !== "string") {
      return `${field.label} must be a string.`;
    }
  }

  const hasAnyContent = optionalTextFields.some(
    (field) => typeof field.value === "string" && field.value.trim(),
  );

  if (!hasAnyContent) {
    return "Editorial content is required.";
  }

  return null;
}
