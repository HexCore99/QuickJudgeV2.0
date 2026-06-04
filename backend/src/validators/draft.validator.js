const SUPPORTED_LANGUAGES = ["c", "cpp", "java", "python", "rust"];
const MAX_SOURCE_CODE_LENGTH = 100000;
const MAX_CUSTOM_INPUT_LENGTH = 20000;
const MAX_CONTEST_ID_LENGTH = 50;
const MAX_CONTEST_PROBLEM_CODE_LENGTH = 20;

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isPositiveInteger(value) {
  const numberValue = Number(value);
  return Number.isInteger(numberValue) && numberValue > 0;
}

function isWithinOptionalLength(value, maxLength) {
  return (
    value === null || value === undefined || String(value).length <= maxLength
  );
}

export function validateDraftQuery({
  problemId,
  contestId,
  contestProblemCode,
} = {}) {
  if (!isPositiveInteger(problemId)) {
    return "Problem id is required.";
  }

  if (!isWithinOptionalLength(contestId, MAX_CONTEST_ID_LENGTH)) {
    return "Contest id is too long.";
  }

  if (
    !isWithinOptionalLength(contestProblemCode, MAX_CONTEST_PROBLEM_CODE_LENGTH)
  ) {
    return "Contest problem code is too long.";
  }

  return null;
}

export function validateSaveDraftPayload({
  problemId,
  contestId,
  contestProblemCode,
  language,
  sourceCode,
  customInput,
} = {}) {
  const queryError = validateDraftQuery({
    problemId,
    contestId,
    contestProblemCode,
  });

  if (queryError) {
    return queryError;
  }

  if (!SUPPORTED_LANGUAGES.includes(language)) {
    return "Unsupported language.";
  }

  if (!hasText(sourceCode)) {
    return "Source code is required.";
  }

  if (sourceCode.length > MAX_SOURCE_CODE_LENGTH) {
    return "Source code is too long.";
  }

  if (
    customInput !== null &&
    customInput !== undefined &&
    typeof customInput !== "string"
  ) {
    return "Custom input must be text.";
  }

  if ((customInput || "").length > MAX_CUSTOM_INPUT_LENGTH) {
    return "Custom input is too long.";
  }

  return null;
}
