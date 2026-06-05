import { validateStrongPassword } from "./password.validator.js";

export function validateProfilePayload(payload = {}) {
  const name = payload.name?.trim();
  const hasEmail = Object.prototype.hasOwnProperty.call(payload, "email");
  const email = payload.email?.trim().toLowerCase() || "";
  const dept = payload.dept?.trim() || "";
  const bio = payload.bio?.trim() || "";
  const git = payload.git?.trim() || "";
  const avatarUrl = payload.avatarUrl?.trim() || "";
  const currentPassword = payload.currentPassword || "";
  const newPassword = payload.newPassword || "";
  const confirmPassword = payload.confirmPassword || "";

  if (!name) {
    return "Name is required.";
  }

  if (name.length > 100) {
    return "Name must be 100 characters or fewer.";
  }

  if (hasEmail && !email) {
    return "Email is required.";
  }

  if (email && email.length > 255) {
    return "Email must be 255 characters or fewer.";
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Enter a valid email address.";
  }

  if (dept.length > 150) {
    return "Department must be 150 characters or fewer.";
  }

  if (bio.length > 1000) {
    return "Bio must be 1000 characters or fewer.";
  }

  if (git.length > 255) {
    return "GitHub URL must be 255 characters or fewer.";
  }

  if (git && !/^https?:\/\/.+/i.test(git)) {
    return "GitHub URL must start with http:// or https://.";
  }

  if (avatarUrl.length > 255) {
    return "Avatar URL must be 255 characters or fewer.";
  }

  if (
    avatarUrl &&
    !/^https?:\/\/.+/i.test(avatarUrl) &&
    !avatarUrl.startsWith("/uploads/avatars/")
  ) {
    return "Avatar URL must be an http(s) URL or a local uploaded avatar path.";
  }

  if ((newPassword || confirmPassword) && !currentPassword) {
    return "Current password is required to change password.";
  }

  if (newPassword || confirmPassword) {
    const passwordError = validateStrongPassword(newPassword, "New password");

    if (passwordError) return passwordError;

    if (newPassword !== confirmPassword) {
      return "New password and confirmation do not match.";
    }
  }

  return null;
}
