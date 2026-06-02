import { saveProfileAvatarForUser } from "../services/profile/avatar.service.js";
import { getProfileForUser } from "../services/profile/read.service.js";
import { updateProfileForUser } from "../services/profile/update.service.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { validateProfilePayload } from "../validators/profile.validator.js";

export async function getProfile(req, res) {
  try {
    const data = await getProfileForUser(req.user.id);
    return successResponse(res, 200, "Profile fetched successfully.", data);
  } catch (error) {
    console.error("Get profile error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to fetch profile.",
    );
  }
}

export async function updateProfile(req, res) {
  try {
    const validationError = validateProfilePayload(req.body);

    if (validationError) {
      return errorResponse(res, 400, validationError);
    }

    const data = await updateProfileForUser(req.user.id, req.body);
    return successResponse(res, 200, "Profile updated successfully.", data);
  } catch (error) {
    console.error("Update profile error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to update profile.",
    );
  }
}

export async function uploadProfileAvatar(req, res) {
  try {
    const data = await saveProfileAvatarForUser(
      req.user.id,
      req.body?.imageData,
    );

    return successResponse(
      res,
      201,
      "Profile image uploaded successfully.",
      data,
    );
  } catch (error) {
    console.error("Upload profile avatar error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to upload profile image.",
    );
  }
}
