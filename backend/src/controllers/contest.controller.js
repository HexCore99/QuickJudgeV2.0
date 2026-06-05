import {
  registerUserForUpcomingContest,
  verifyContestPasswordAccess,
} from "../services/studentContest/access.service.js";
import {
  getContestAnnouncements,
  getContestQueries,
  submitContestQuery,
} from "../services/studentContest/communication.service.js";
import {
  getContestDetailsById,
  getContestProblemDetailByCode,
} from "../services/studentContest/details.service.js";
import { getContestLeaderboard } from "../services/studentContest/leaderboard.service.js";
import { getContestsForUser } from "../services/contest/contestList.service.js";
import { getContestSubmissions } from "../services/studentContest/submissions.service.js";
import { errorResponse, successResponse } from "../utils/response.js";
import {
  validateContestId,
  validateContestPassword,
  validateContestProblemCode,
} from "../validators/contest.validator.js";
import { recordAuditLogForRequest } from "../services/auditLog.service.js";

export function getContestTarget(item = {}, fallbackId = null) {
  return {
    targetType: "contest",
    targetId: item.id || item.contestId || fallbackId,
    targetLabel: item.title || item.name || item.contestName || fallbackId,
  };
}

export function getAnnouncementTarget(
  item = {},
  contestId = null,
  fallbackId = null,
) {
  return {
    targetType: "contest_announcement",
    targetId: item.id || fallbackId,
    targetLabel: item.title || fallbackId,
    metadata: {
      contestId,
    },
  };
}

export function getContestQueryTarget(
  item = {},
  contestId = null,
  fallbackId = null,
) {
  return {
    targetType: "contest_query",
    targetId: item.id || fallbackId,
    targetUserId: item.userId || null,
    targetLabel: item.username || item.question || fallbackId,
    metadata: {
      contestId,
    },
  };
}

// writes an audit log entry for a contest-related action.
export async function auditContestAction(req, action, status, target, message) {
  await recordAuditLogForRequest(req, {
    action,
    status,
    message,
    ...target,
  });
}

export async function getContests(req, res) {
  try {
    const data = await getContestsForUser(req.user.id, req.user.role);

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

    const data = await getContestDetailsById(
      req.user.id,
      contestId,
      req.user.role,
    );

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

// fetches one problem inside a contest.

export async function getContestProblem(req, res) {
  try {
    const { contestId, problemCode } = req.params;
    const contestIdError = validateContestId(contestId);

    if (contestIdError) {
      await auditContestAction(
        req,
        "UPDATE_CONTEST_SCHEDULE",
        "failed",
        getContestTarget({}, contestId),
        contestIdError,
      );
      return errorResponse(res, 400, contestIdError);
    }

    const problemCodeError = validateContestProblemCode(problemCode);

    if (problemCodeError) {
      return errorResponse(res, 400, problemCodeError);
    }

    const data = await getContestProblemDetailByCode(
      req.user.id,
      contestId,
      problemCode,
      req.user.role,
    );

    return successResponse(res, 200, "Contest problem fetched.", {
      item: data,
    });
  } catch (error) {
    console.error("Get contest problem error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to fetch contest problem.",
    );
  }
}

// registers the current user for an upcoming contest
export async function registerContest(req, res) {
  try {
    const contestId = req.params.contestId;
    const validationError = validateContestId(contestId);

    if (validationError) {
      await auditContestAction(
        req,
        "REGISTER_CONTEST",
        "failed",
        getContestTarget({}, contestId),
        validationError,
      );
      return errorResponse(res, 400, validationError);
    }

    const data = await registerUserForUpcomingContest(req.user.id, contestId);
    await auditContestAction(
      req,
      "REGISTER_CONTEST",
      "success",
      getContestTarget(data, contestId),
      "Contest registration successful",
    );

    return successResponse(res, 200, "Contest registration successful.", data);
  } catch (error) {
    console.error("Register contest error:", error);
    await auditContestAction(
      req,
      "REGISTER_CONTEST",
      "failed",
      getContestTarget({}, req.params.contestId),
      error.message || "Failed to register for contest.",
    );
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
      await auditContestAction(
        req,
        "VERIFY_CONTEST_PASSWORD",
        "failed",
        getContestTarget({}, contestId),
        contestIdError,
      );
      return errorResponse(res, 400, contestIdError);
    }

    const passwordError = validateContestPassword(req.body.password);

    if (passwordError) {
      await auditContestAction(
        req,
        "VERIFY_CONTEST_PASSWORD",
        "failed",
        getContestTarget({}, contestId),
        passwordError,
      );
      return errorResponse(res, 400, passwordError);
    }

    const data = await verifyContestPasswordAccess(
      req.user.id,
      contestId,
      req.body.password,
    );
    await auditContestAction(
      req,
      "VERIFY_CONTEST_PASSWORD",
      "success",
      getContestTarget(data, contestId),
      "Contest password verified",
    );

    return successResponse(
      res,
      200,
      "Contest password verified successfully.",
      data,
    );
  } catch (error) {
    console.error("Verify contest password error:", error);
    await auditContestAction(
      req,
      "VERIFY_CONTEST_PASSWORD",
      "failed",
      getContestTarget({}, req.params.contestId),
      error.message || "Password verification failed.",
    );
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Password verification failed.",
    );
  }
}

// fetches contest submissions for the current user/admin.
export async function getSubmissions(req, res) {
  try {
    const { contestId } = req.params;
    const data = await getContestSubmissions(
      req.user.id,
      contestId,
      req.user.role,
    );
    return successResponse(res, 200, "Submissions fetched.", { items: data });
  } catch (error) {
    console.error("Get submissions error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to fetch submissions.",
    );
  }
}

// fetches the leaderboard for one contest.
export async function getLeaderboard(req, res) {
  try {
    const { contestId } = req.params;
    const data = await getContestLeaderboard(contestId, req.user.id);
    return successResponse(res, 200, "Leaderboard fetched.", { items: data });
  } catch (error) {
    console.error("Get leaderboard error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to fetch leaderboard.",
    );
  }
}

export async function getAnnouncements(req, res) {
  try {
    const { contestId } = req.params;
    const data = await getContestAnnouncements(contestId);
    return successResponse(res, 200, "Announcements fetched.", { items: data });
  } catch (error) {
    console.error("Get announcements error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to fetch announcements.",
    );
  }
}

export async function getQueries(req, res) {
  try {
    const { contestId } = req.params;
    const data = await getContestQueries(contestId);
    return successResponse(res, 200, "Queries fetched.", { items: data });
  } catch (error) {
    console.error("Get queries error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to fetch queries.",
    );
  }
}

// ets a user submit a question/query for a contest
export async function postQuery(req, res) {
  try {
    const { contestId } = req.params;
    const { question } = req.body;
    const data = await submitContestQuery(req.user.id, contestId, question);
    await auditContestAction(
      req,
      "SUBMIT_QUERY",
      "success",
      getContestQueryTarget(data, contestId),
      "Contest query submitted",
    );
    return successResponse(res, 201, "Query submitted.", { item: data });
  } catch (error) {
    console.error("Post query error:", error);
    await auditContestAction(
      req,
      "SUBMIT_QUERY",
      "failed",
      getContestQueryTarget({ question: req.body?.question }, req.params.contestId),
      error.message || "Failed to submit query.",
    );
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to submit query.",
    );
  }
}
