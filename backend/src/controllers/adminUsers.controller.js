import {
  banUserAccount,
  createAdminUser,
  listAdminUsers,
  suspendUserAccount,
  unsuspendUserAccount,
} from "../services/adminUsers.service.js";
import { recordAuditLogForRequest } from "../services/auditLog.service.js";
import { errorResponse, successResponse } from "../utils/response.js";
import {
  validateBanPayload,
  validateCreateAdminPayload,
  validateSuspendPayload,
  validateUserId,
} from "../validators/adminUsers.validator.js";

function getUserTarget(user = {}, fallbackId = null) {
  return {
    targetType: "user",
    targetId: user.id || fallbackId,
    targetUserId: user.id || fallbackId,
    targetEmail: user.email || null,
    targetLabel: user.handle || user.name || user.email || fallbackId,
  };
}

async function auditAdminUserAction(req, action, status, target, message) {
  await recordAuditLogForRequest(req, {
    action,
    status,
    message,
    ...target,
  });
}

export async function getUsers(req, res) {
  try {
    const users = await listAdminUsers();
    return successResponse(res, 200, "Users fetched.", { users });
  } catch (error) {
    console.error("Get admin users error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to fetch users.",
    );
  }
}

export async function createAdmin(req, res) {
  try {
    const payloadError = validateCreateAdminPayload(req.body);

    if (payloadError) {
      await auditAdminUserAction(
        req,
        "CREATE_ADMIN",
        "failed",
        getUserTarget({
          email: req.body?.email,
          name: req.body?.name,
        }),
        payloadError,
      );
      return errorResponse(res, 400, payloadError);
    }

    const user = await createAdminUser(req.body);
    await auditAdminUserAction(
      req,
      "CREATE_ADMIN",
      "success",
      getUserTarget(user),
      "Admin account created",
    );
    return successResponse(res, 201, "Admin account created.", { user });
  } catch (error) {
    console.error("Create admin user error:", error);
    await auditAdminUserAction(
      req,
      "CREATE_ADMIN",
      "failed",
      getUserTarget({
        email: req.body?.email,
        name: req.body?.name,
      }),
      error.message || "Failed to create admin.",
    );
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to create admin.",
    );
  }
}

export async function suspendUser(req, res) {
  try {
    const { userId } = req.params;
    const idError = validateUserId(userId);

    if (idError) {
      await auditAdminUserAction(
        req,
        "SUSPEND_USER",
        "failed",
        getUserTarget({}, userId),
        idError,
      );
      return errorResponse(res, 400, idError);
    }

    const payloadError = validateSuspendPayload(req.body);

    if (payloadError) {
      await auditAdminUserAction(
        req,
        "SUSPEND_USER",
        "failed",
        getUserTarget({}, userId),
        payloadError,
      );
      return errorResponse(res, 400, payloadError);
    }

    const user = await suspendUserAccount(userId, req.body);
    await auditAdminUserAction(
      req,
      "SUSPEND_USER",
      "success",
      getUserTarget(user, userId),
      "Account suspended",
    );
    return successResponse(res, 200, "Account suspended.", { user });
  } catch (error) {
    console.error("Suspend user error:", error);
    await auditAdminUserAction(
      req,
      "SUSPEND_USER",
      "failed",
      getUserTarget({}, req.params.userId),
      error.message || "Failed to suspend account.",
    );
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to suspend account.",
    );
  }
}

export async function unsuspendUser(req, res) {
  try {
    const { userId } = req.params;
    const idError = validateUserId(userId);

    if (idError) {
      await auditAdminUserAction(
        req,
        "UNSUSPEND_USER",
        "failed",
        getUserTarget({}, userId),
        idError,
      );
      return errorResponse(res, 400, idError);
    }

    const user = await unsuspendUserAccount(userId);
    await auditAdminUserAction(
      req,
      "UNSUSPEND_USER",
      "success",
      getUserTarget(user, userId),
      "Account unsuspended",
    );
    return successResponse(res, 200, "Account unsuspended.", { user });
  } catch (error) {
    console.error("Unsuspend user error:", error);
    await auditAdminUserAction(
      req,
      "UNSUSPEND_USER",
      "failed",
      getUserTarget({}, req.params.userId),
      error.message || "Failed to unsuspend account.",
    );
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to unsuspend account.",
    );
  }
}

export async function banUser(req, res) {
  try {
    const { userId } = req.params;
    const idError = validateUserId(userId);

    if (idError) {
      await auditAdminUserAction(
        req,
        "BAN_USER",
        "failed",
        getUserTarget({}, userId),
        idError,
      );
      return errorResponse(res, 400, idError);
    }

    const payloadError = validateBanPayload(req.body);

    if (payloadError) {
      await auditAdminUserAction(
        req,
        "BAN_USER",
        "failed",
        getUserTarget({}, userId),
        payloadError,
      );
      return errorResponse(res, 400, payloadError);
    }

    const user = await banUserAccount(userId, req.body);
    await auditAdminUserAction(
      req,
      "BAN_USER",
      "success",
      getUserTarget(user, userId),
      "Account banned",
    );
    return successResponse(res, 200, "Account banned.", { user });
  } catch (error) {
    console.error("Ban user error:", error);
    await auditAdminUserAction(
      req,
      "BAN_USER",
      "failed",
      getUserTarget({}, req.params.userId),
      error.message || "Failed to ban account.",
    );
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to ban account.",
    );
  }
}
