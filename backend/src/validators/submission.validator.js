const SUPPORTED_LANGUAGES = ["c", "cpp", "java", "python", "rust"];

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isPositiveInteger(value) {
  const numberValue = Number(value);
  return Number.isInteger(numberValue) && numberValue > 0;
}

export function validateRunPayload({ problemId, language, sourceCode } = {}) {
  if (!isPositiveInteger(problemId)) {
    return "Problem id is required.";
  }

  if (!SUPPORTED_LANGUAGES.includes(language)) {
    return "Unsupported language.";
  }

  if (!hasText(sourceCode)) {
    return "Source code is required.";
  }

  return null;
}

export function validateSubmitPayload(payload = {}) {
  return validateRunPayload(payload);
}
