import {
  getContestDetailsById,
  getContestsForUser,
  registerUserForUpcomingContest,
  verifyContestPasswordAccess,
} from "../services/contest.service.js";
import { errorResponse, successResponse } from "../utils/response.js";
import {
  validateContestId,
  validateContestPassword,
} from "../validators/contest.validator.js";

export async function getContests(req, res) {
  try {
    const data = await getContestsForUser(req.user.id);

    return successResponse(res, 200, "Contests fetched successfully.", data);
  } catch (error) {
    console.error("Get contests error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to fetch contests.",
    );
  }
}

export async function getContestDetails(req, res) {
  try {
    const contestId = req.params.contestId;
    const validationError = validateContestId(contestId);

    if (validationError) {
      return errorResponse(res, 400, validationError);
    }

    const data = await getContestDetailsById(req.user.id, contestId);

    return successResponse(
      res,
      200,
      "Contest details fetched successfully.",
      data,
    );
  } catch (error) {
    console.error("Get contest details error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to fetch contest details.",
    );
  }
}

export async function registerContest(req, res) {
  try {
    const contestId = req.params.contestId;
    const validationError = validateContestId(contestId);

    if (validationError) {
      return errorResponse(res, 400, validationError);
    }

    const data = await registerUserForUpcomingContest(req.user.id, contestId);

    return successResponse(res, 200, "Contest registration successful.", data);
  } catch (error) {
    console.error("Register contest error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to register for contest.",
    );
  }
}

export async function verifyContestPassword(req, res) {
  try {
    const contestId = req.params.contestId;
    const contestIdError = validateContestId(contestId);

    if (contestIdError) {
      return errorResponse(res, 400, contestIdError);
    }

    const passwordError = validateContestPassword(req.body.password);

    if (passwordError) {
      return errorResponse(res, 400, passwordError);
    }

    const data = await verifyContestPasswordAccess(
      req.user.id,
      contestId,
      req.body.password,
    );

    return successResponse(
      res,
      200,
      "Contest password verified successfully.",
      data,
    );
  } catch (error) {
    console.error("Verify contest password error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Password verification failed.",
    );
  }
}
