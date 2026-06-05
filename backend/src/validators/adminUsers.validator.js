import { validateStrongPassword } from "./password.validator.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateUserId(userId) {
  const numericId = Number(userId);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    return "Valid user id is required.";
  }

  return null;
}

export function validateCreateAdminPayload(payload = {}) {
  const name = payload.name?.trim();
  const email = payload.email?.trim().toLowerCase();
  const password = payload.password || "";

  if (!name || !email || !password) {
    return "Name, email, and password are required.";
  }

  if (name.length > 100) {
    return "Name must be 100 characters or fewer.";
  }

  if (email.length > 150 || !EMAIL_PATTERN.test(email)) {
    return "Enter a valid email address.";
  }

  const passwordError = validateStrongPassword(password);

  if (passwordError) return passwordError;

  return null;
}

export function validateSuspendPayload(payload = {}) {
  const suspendedUntil = payload.suspendedUntil || null;
  const reason = payload.reason?.trim() || "";

  if (reason.length > 1000) {
    return "Suspension reason must be 1000 characters or fewer.";
  }

  if (!suspendedUntil) {
    return null;
  }

  const suspendedDate = new Date(suspendedUntil);

  if (
    Number.isNaN(suspendedDate.getTime()) ||
    suspendedDate.getTime() <= Date.now()
  ) {
    return "Suspension expiry must be a future date and time.";
  }

  return null;
}

export function validateBanPayload(payload = {}) {
  const reason = payload.reason?.trim() || "";

  if (reason.length > 1000) {
    return "Ban reason must be 1000 characters or fewer.";
  }

  return null;
}
