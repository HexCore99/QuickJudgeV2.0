import {
  createContestForAdmin,
  createContestAnnouncement,
  deleteContestAnnouncement,
  deleteContestById,
  replyToContestQuery,
  updateContestAnnouncement,
  updateContestSchedule,
} from "../services/contest/adminContest.service.js";
import { finalizePublicContestRating } from "../services/ratings/finalize.service.js";
import { errorResponse, successResponse } from "../utils/response.js";
import {
  validateAnnouncementPayload,
  validateCreateContestPayload,
  validateContestId,
  validateContestSchedulePayload,
  validateNumericId,
  validateQueryAnswer,
} from "../validators/contest.validator.js";
import {
  auditContestAction,
  getAnnouncementTarget,
  getContestQueryTarget,
  getContestTarget,
} from "./contest.controller.js";

export async function createContest(req, res) {
  try {
    const payloadError = validateCreateContestPayload(req.body);

    if (payloadError) {
      await auditContestAction(
        req,
        "CREATE_CONTEST",
        "failed",
        getContestTarget({ title: req.body?.title }),
        payloadError,
      );
      return errorResponse(res, 400, payloadError);
    }

    const data = await createContestForAdmin(req.user.id, req.body);
    await auditContestAction(
      req,
      "CREATE_CONTEST",
      "success",
      getContestTarget(data),
      "Contest created",
    );
    return successResponse(res, 201, "Contest created.", { item: data });
  } catch (error) {
    console.error("Create contest error:", error);
    await auditContestAction(
      req,
      "CREATE_CONTEST",
      "failed",
      getContestTarget({ title: req.body?.title }),
      error.message || "Failed to create contest.",
    );
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to create contest.",
    );
  }
}

export async function updateSchedule(req, res) {
  try {
    const { contestId } = req.params;
    const contestIdError = validateContestId(contestId);

    if (contestIdError) {
      return errorResponse(res, 400, contestIdError);
    }

    const scheduleError = validateContestSchedulePayload(req.body);

    if (scheduleError) {
      await auditContestAction(
        req,
        "UPDATE_CONTEST_SCHEDULE",
        "failed",
        getContestTarget({}, contestId),
        scheduleError,
      );
      return errorResponse(res, 400, scheduleError);
    }

    const data = await updateContestSchedule(contestId, req.body, req.user.id);
    await auditContestAction(
      req,
      "UPDATE_CONTEST_SCHEDULE",
      "success",
      getContestTarget(data, contestId),
      "Contest schedule updated",
    );
    return successResponse(res, 200, "Contest schedule updated.", data);
  } catch (error) {
    console.error("Update contest schedule error:", error);
    await auditContestAction(
      req,
      "UPDATE_CONTEST_SCHEDULE",
      "failed",
      getContestTarget({}, req.params.contestId),
      error.message || "Failed to update contest schedule.",
    );
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to update contest schedule.",
    );
  }
}

export async function deleteContest(req, res) {
  try {
    const { contestId } = req.params;
    const contestIdError = validateContestId(contestId);

    if (contestIdError) {
      await auditContestAction(
        req,
        "DELETE_CONTEST",
        "failed",
        getContestTarget({}, contestId),
        contestIdError,
      );
      return errorResponse(res, 400, contestIdError);
    }

    const data = await deleteContestById(contestId, req.user.id);
    await auditContestAction(
      req,
      "DELETE_CONTEST",
      "success",
      getContestTarget(data, contestId),
      "Contest deleted",
    );
    return successResponse(res, 200, "Contest deleted.", data);
  } catch (error) {
    console.error("Delete contest error:", error);
    await auditContestAction(
      req,
      "DELETE_CONTEST",
      "failed",
      getContestTarget({}, req.params.contestId),
      error.message || "Failed to delete contest.",
    );
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to delete contest.",
    );
  }
}

export async function finalizeRating(req, res) {
  try {
    const { contestId } = req.params;
    const contestIdError = validateContestId(contestId);

    if (contestIdError) {
      await auditContestAction(
        req,
        "FINALIZE_RATING",
        "failed",
        getContestTarget({}, contestId),
        contestIdError,
      );
      return errorResponse(res, 400, contestIdError);
    }

    const data = await finalizePublicContestRating(contestId);
    await auditContestAction(
      req,
      "FINALIZE_RATING",
      "success",
      getContestTarget({}, contestId),
      data.alreadyFinalized
        ? "Contest rating was already finalized"
        : "Contest rating finalized",
    );

    return successResponse(
      res,
      200,
      data.alreadyFinalized
        ? "Contest rating already finalized."
        : "Contest rating finalized.",
      data,
    );
  } catch (error) {
    console.error("Finalize rating error:", error);
    await auditContestAction(
      req,
      "FINALIZE_RATING",
      "failed",
      getContestTarget({}, req.params.contestId),
      error.message || "Failed to finalize contest rating.",
    );
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to finalize contest rating.",
    );
  }
}

export async function createAnnouncement(req, res) {
  try {
    const { contestId } = req.params;
    const contestIdError = validateContestId(contestId);

    if (contestIdError) {
      await auditContestAction(
        req,
        "CREATE_ANNOUNCEMENT",
        "failed",
        getAnnouncementTarget({ title: req.body?.title }, contestId),
        contestIdError,
      );
      return errorResponse(res, 400, contestIdError);
    }

    const payloadError = validateAnnouncementPayload(req.body);

    if (payloadError) {
      await auditContestAction(
        req,
        "CREATE_ANNOUNCEMENT",
        "failed",
        getAnnouncementTarget({ title: req.body?.title }, contestId),
        payloadError,
      );
      return errorResponse(res, 400, payloadError);
    }

    const data = await createContestAnnouncement(contestId, req.body);
    await auditContestAction(
      req,
      "CREATE_ANNOUNCEMENT",
      "success",
      getAnnouncementTarget(data, contestId),
      "Contest announcement created",
    );
    return successResponse(res, 201, "Announcement created.", { item: data });
  } catch (error) {
    console.error("Create announcement error:", error);
    await auditContestAction(
      req,
      "CREATE_ANNOUNCEMENT",
      "failed",
      getAnnouncementTarget({ title: req.body?.title }, req.params.contestId),
      error.message || "Failed to create announcement.",
    );
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to create announcement.",
    );
  }
}

export async function updateAnnouncement(req, res) {
  try {
    const { contestId, announcementId } = req.params;
    const contestIdError = validateContestId(contestId);

    if (contestIdError) {
      await auditContestAction(
        req,
        "UPDATE_ANNOUNCEMENT",
        "failed",
        getAnnouncementTarget({}, contestId, announcementId),
        contestIdError,
      );
      return errorResponse(res, 400, contestIdError);
    }

    const idError = validateNumericId(announcementId, "Announcement id");

    if (idError) {
      await auditContestAction(
        req,
        "UPDATE_ANNOUNCEMENT",
        "failed",
        getAnnouncementTarget({}, contestId, announcementId),
        idError,
      );
      return errorResponse(res, 400, idError);
    }

    const payloadError = validateAnnouncementPayload(req.body);

    if (payloadError) {
      await auditContestAction(
        req,
        "UPDATE_ANNOUNCEMENT",
        "failed",
        getAnnouncementTarget(
          { title: req.body?.title },
          contestId,
          announcementId,
        ),
        payloadError,
      );
      return errorResponse(res, 400, payloadError);
    }

    const data = await updateContestAnnouncement(
      contestId,
      announcementId,
      req.body,
    );
    await auditContestAction(
      req,
      "UPDATE_ANNOUNCEMENT",
      "success",
      getAnnouncementTarget(data, contestId, announcementId),
      "Contest announcement updated",
    );
    return successResponse(res, 200, "Announcement updated.", { item: data });
  } catch (error) {
    console.error("Update announcement error:", error);
    await auditContestAction(
      req,
      "UPDATE_ANNOUNCEMENT",
      "failed",
      getAnnouncementTarget({}, req.params.contestId, req.params.announcementId),
      error.message || "Failed to update announcement.",
    );
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to update announcement.",
    );
  }
}

export async function deleteAnnouncement(req, res) {
  try {
    const { contestId, announcementId } = req.params;
    const contestIdError = validateContestId(contestId);

    if (contestIdError) {
      await auditContestAction(
        req,
        "DELETE_ANNOUNCEMENT",
        "failed",
        getAnnouncementTarget({}, contestId, announcementId),
        contestIdError,
      );
      return errorResponse(res, 400, contestIdError);
    }

    const idError = validateNumericId(announcementId, "Announcement id");

    if (idError) {
      await auditContestAction(
        req,
        "DELETE_ANNOUNCEMENT",
        "failed",
        getAnnouncementTarget({}, contestId, announcementId),
        idError,
      );
      return errorResponse(res, 400, idError);
    }

    const data = await deleteContestAnnouncement(contestId, announcementId);
    await auditContestAction(
      req,
      "DELETE_ANNOUNCEMENT",
      "success",
      getAnnouncementTarget(data, contestId, announcementId),
      "Contest announcement deleted",
    );
    return successResponse(res, 200, "Announcement deleted.", data);
  } catch (error) {
    console.error("Delete announcement error:", error);
    await auditContestAction(
      req,
      "DELETE_ANNOUNCEMENT",
      "failed",
      getAnnouncementTarget({}, req.params.contestId, req.params.announcementId),
      error.message || "Failed to delete announcement.",
    );
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to delete announcement.",
    );
  }
}

export async function replyQuery(req, res) {
  try {
    const { contestId, queryId } = req.params;
    const contestIdError = validateContestId(contestId);

    if (contestIdError) {
      await auditContestAction(
        req,
        "REPLY_QUERY",
        "failed",
        getContestQueryTarget({}, contestId, queryId),
        contestIdError,
      );
      return errorResponse(res, 400, contestIdError);
    }

    const idError = validateNumericId(queryId, "Query id");

    if (idError) {
      await auditContestAction(
        req,
        "REPLY_QUERY",
        "failed",
        getContestQueryTarget({}, contestId, queryId),
        idError,
      );
      return errorResponse(res, 400, idError);
    }

    const answerError = validateQueryAnswer(req.body.answer);

    if (answerError) {
      await auditContestAction(
        req,
        "REPLY_QUERY",
        "failed",
        getContestQueryTarget({}, contestId, queryId),
        answerError,
      );
      return errorResponse(res, 400, answerError);
    }

    const data = await replyToContestQuery(contestId, queryId, req.body.answer);
    await auditContestAction(
      req,
      "REPLY_QUERY",
      "success",
      getContestQueryTarget(data, contestId, queryId),
      "Contest query replied",
    );
    return successResponse(res, 200, "Query replied.", { item: data });
  } catch (error) {
    console.error("Reply query error:", error);
    await auditContestAction(
      req,
      "REPLY_QUERY",
      "failed",
      getContestQueryTarget({}, req.params.contestId, req.params.queryId),
      error.message || "Failed to reply to query.",
    );
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to reply to query.",
    );
  }
}
