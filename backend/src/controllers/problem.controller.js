import {
  createProblemForAuthor,
  deleteProblemForAuthor,
  getEditorialForAuthor,
  getProblemCloneSourceForAdmin,
  getProblemBankItemById,
  getProblemBankItems,
  getProblemForAuthor,
  getProblemsForAuthor,
  saveEditorialForAuthor,
  updateProblemPublicationForAuthor,
  updateProblemForAuthor,
} from "../services/problem.service.js";
import { recordAuditLogForRequest } from "../services/auditLog.service.js";
import { errorResponse, successResponse } from "../utils/response.js";
import {
  validateProblemId,
  validateProblemPayload,
  validateEditorialPayload,
  validateProblemPublicationPayload,
} from "../validators/problem.validator.js";

function getProblemTarget(item = {}, fallbackId = null) {
  return {
    targetType: "problem",
    targetId: item.id || item.problemId || fallbackId,
    targetLabel: item.title || item.problemTitle || fallbackId,
  };
}

async function auditProblemAction(req, action, status, target, message) {
  await recordAuditLogForRequest(req, {
    action,
    status,
    message,
    ...target,
  });
}

export async function getMyProblems(req, res) {
  try {
    const data = await getProblemsForAuthor(req.user.id);
    return successResponse(res, 200, "Problems fetched.", { items: data });
  } catch (error) {
    console.error("Get problems error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to fetch problems.",
    );
  }
}

export async function getProblemBank(req, res) {
  try {
    const data = await getProblemBankItems();
    return successResponse(res, 200, "Problem bank fetched.", { items: data });
  } catch (error) {
    console.error("Get problem bank error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to fetch problem bank.",
    );
  }
}

// request for fetching one public problem-bank problem by ID
export async function getProblemBankProblem(req, res) {
  try {
    const { problemId } = req.params;
    const idError = validateProblemId(problemId);

    if (idError) {
      return errorResponse(res, 400, idError);
    }

    const data = await getProblemBankItemById(problemId);
    return successResponse(res, 200, "Problem fetched.", { item: data });
  } catch (error) {
    console.error("Get problem bank problem error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to fetch problem.",
    );
  }
}

// fetch a problem’s full data so it can be cloned.
export async function getProblemCloneSource(req, res) {
  try {
    const { problemId } = req.params;
    const idError = validateProblemId(problemId);

    if (idError) {
      return errorResponse(res, 400, idError);
    }

    const data = await getProblemCloneSourceForAdmin(req.user.id, problemId);
    return successResponse(res, 200, "Problem clone source fetched.", {
      item: data,
    });
  } catch (error) {
    console.error("Get problem clone source error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to fetch problem clone source.",
    );
  }
}

export async function getMyProblem(req, res) {
  try {
    const { problemId } = req.params;
    const idError = validateProblemId(problemId);

    if (idError) {
      return errorResponse(res, 400, idError);
    }

    const data = await getProblemForAuthor(req.user.id, problemId);
    return successResponse(res, 200, "Problem fetched.", { item: data });
  } catch (error) {
    console.error("Get problem error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to fetch problem.",
    );
  }
}

export async function createProblem(req, res) {
  try {
    const payloadError = validateProblemPayload(req.body);

    if (payloadError) {
      await auditProblemAction(
        req,
        "CREATE_PROBLEM",
        "failed",
        getProblemTarget({ title: req.body?.title }),
        payloadError,
      );
      return errorResponse(res, 400, payloadError);
    }

    const data = await createProblemForAuthor(req.user.id, req.body);
    await auditProblemAction(
      req,
      "CREATE_PROBLEM",
      "success",
      getProblemTarget(data),
      "Problem created",
    );
    return successResponse(res, 201, "Problem created.", { item: data });
  } catch (error) {
    console.error("Create problem error:", error);
    await auditProblemAction(
      req,
      "CREATE_PROBLEM",
      "failed",
      getProblemTarget({ title: req.body?.title }),
      error.message || "Failed to create problem.",
    );
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to create problem.",
    );
  }
}

export async function updateProblem(req, res) {
  try {
    const { problemId } = req.params;
    const idError = validateProblemId(problemId);

    if (idError) {
      await auditProblemAction(
        req,
        "UPDATE_PROBLEM",
        "failed",
        getProblemTarget({}, problemId),
        idError,
      );
      return errorResponse(res, 400, idError);
    }

    const payloadError = validateProblemPayload(req.body);

    if (payloadError) {
      await auditProblemAction(
        req,
        "UPDATE_PROBLEM",
        "failed",
        getProblemTarget({ title: req.body?.title }, problemId),
        payloadError,
      );
      return errorResponse(res, 400, payloadError);
    }

    const data = await updateProblemForAuthor(req.user.id, problemId, req.body);
    await auditProblemAction(
      req,
      "UPDATE_PROBLEM",
      "success",
      getProblemTarget(data, problemId),
      "Problem updated",
    );
    return successResponse(res, 200, "Problem updated.", { item: data });
  } catch (error) {
    console.error("Update problem error:", error);
    await auditProblemAction(
      req,
      "UPDATE_PROBLEM",
      "failed",
      getProblemTarget({ title: req.body?.title }, req.params.problemId),
      error.message || "Failed to update problem.",
    );
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to update problem.",
    );
  }
}

export async function deleteProblem(req, res) {
  try {
    const { problemId } = req.params;
    const idError = validateProblemId(problemId);

    if (idError) {
      await auditProblemAction(
        req,
        "DELETE_PROBLEM",
        "failed",
        getProblemTarget({}, problemId),
        idError,
      );
      return errorResponse(res, 400, idError);
    }

    const data = await deleteProblemForAuthor(req.user.id, problemId);
    await auditProblemAction(
      req,
      "DELETE_PROBLEM",
      "success",
      getProblemTarget(data, problemId),
      "Problem deleted",
    );
    return successResponse(res, 200, "Problem deleted.", data);
  } catch (error) {
    console.error("Delete problem error:", error);
    await auditProblemAction(
      req,
      "DELETE_PROBLEM",
      "failed",
      getProblemTarget({}, req.params.problemId),
      error.message || "Failed to delete problem.",
    );
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to delete problem.",
    );
  }
}

export async function getProblemEditorial(req, res) {
  try {
    const { problemId } = req.params;
    const idError = validateProblemId(problemId);

    if (idError) {
      await auditProblemAction(
        req,
        "SAVE_EDITORIAL",
        "failed",
        getProblemTarget({}, problemId),
        idError,
      );
      return errorResponse(res, 400, idError);
    }

    const data = await getEditorialForAuthor(req.user.id, problemId);
    return successResponse(res, 200, "Editorial fetched.", { item: data });
  } catch (error) {
    console.error("Get editorial error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to fetch editorial.",
    );
  }
}

export async function saveProblemEditorial(req, res) {
  try {
    const { problemId } = req.params;
    const idError = validateProblemId(problemId);

    if (idError) {
      return errorResponse(res, 400, idError);
    }

    const payloadError = validateEditorialPayload(req.body);

    if (payloadError) {
      await auditProblemAction(
        req,
        "SAVE_EDITORIAL",
        "failed",
        getProblemTarget({}, problemId),
        payloadError,
      );
      return errorResponse(res, 400, payloadError);
    }

    const data = await saveEditorialForAuthor(req.user.id, problemId, req.body);
    await auditProblemAction(
      req,
      "SAVE_EDITORIAL",
      "success",
      getProblemTarget(data, problemId),
      "Problem editorial saved",
    );
    return successResponse(res, 200, "Editorial saved.", { item: data });
  } catch (error) {
    console.error("Save editorial error:", error);
    await auditProblemAction(
      req,
      "SAVE_EDITORIAL",
      "failed",
      getProblemTarget({}, req.params.problemId),
      error.message || "Failed to save editorial.",
    );
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to save editorial.",
    );
  }
}

// publishes or unpublishes a problem and writes audit logs
export async function updateProblemPublication(req, res) {
  try {
    const { problemId } = req.params;
    const idError = validateProblemId(problemId);

    if (idError) {
      await auditProblemAction(
        req,
        "UPDATE_PROBLEM_PUBLICATION",
        "failed",
        getProblemTarget({}, problemId),
        idError,
      );
      return errorResponse(res, 400, idError);
    }

    const payloadError = validateProblemPublicationPayload(req.body);

    if (payloadError) {
      await auditProblemAction(
        req,
        "UPDATE_PROBLEM_PUBLICATION",
        "failed",
        getProblemTarget({}, problemId),
        payloadError,
      );
      return errorResponse(res, 400, payloadError);
    }

    const data = await updateProblemPublicationForAuthor(
      req.user.id,
      problemId,
      req.body.isPublished,
    );
    await auditProblemAction(
      req,
      "UPDATE_PROBLEM_PUBLICATION",
      "success",
      getProblemTarget(data, problemId),
      req.body.isPublished ? "Problem published" : "Problem unpublished",
    );
    return successResponse(res, 200, "Problem publication updated.", {
      item: data,
    });
  } catch (error) {
    console.error("Update problem publication error:", error);
    await auditProblemAction(
      req,
      "UPDATE_PROBLEM_PUBLICATION",
      "failed",
      getProblemTarget({}, req.params.problemId),
      error.message || "Failed to update problem publication.",
    );
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to update problem publication.",
    );
  }
}
