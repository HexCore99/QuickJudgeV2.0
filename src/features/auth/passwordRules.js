export const MIN_PASSWORD_LENGTH = 8;

export function validateStrongPassword(password, label = "Password") {
  if (typeof password !== "string" || !password) {
    return `${label} is required.`;
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return `${label} must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  if (!/[A-Z]/.test(password)) {
    return `${label} must include at least one uppercase letter.`;
  }

  if (!/[a-z]/.test(password)) {
    return `${label} must include at least one lowercase letter.`;
  }

  if (!/[0-9]/.test(password)) {
    return `${label} must include at least one number.`;
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return `${label} must include at least one special character.`;
  }

  return null;
}

export function getPasswordRuleSummary() {
  return `${MIN_PASSWORD_LENGTH}+ chars, uppercase, lowercase, number, symbol.`;
}
