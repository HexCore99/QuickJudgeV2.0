import {
  deleteCodeDraft,
  getCodeDraft,
  saveCodeDraft,
} from "../services/draft.service.js";
import { errorResponse, successResponse } from "../utils/response.js";
import {
  validateDraftQuery,
  validateSaveDraftPayload,
} from "../validators/draft.validator.js";

export async function getDraft(req, res) {
  try {
    const validationError = validateDraftQuery(req.query);

    if (validationError) {
      return errorResponse(res, 400, validationError);
    }

    const item = await getCodeDraft(req.user.id, {
      problemId: req.query.problemId,
      contestId: req.query.contestId,
      contestProblemCode: req.query.contestProblemCode,
    });

    return successResponse(res, 200, "Draft fetched.", { item });
  } catch (error) {
    console.error("Get draft error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to fetch draft.",
    );
  }
}

export async function saveDraft(req, res) {
  try {
    const validationError = validateSaveDraftPayload(req.body);

    if (validationError) {
      return errorResponse(res, 400, validationError);
    }

    const item = await saveCodeDraft(req.user.id, req.body);

    return successResponse(res, 200, "Draft saved.", { item });
  } catch (error) {
    console.error("Save draft error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to save draft.",
    );
  }
}

export async function deleteDraft(req, res) {
  try {
    const validationError = validateDraftQuery(req.query);

    if (validationError) {
      return errorResponse(res, 400, validationError);
    }

    await deleteCodeDraft(req.user.id, {
      problemId: req.query.problemId,
      contestId: req.query.contestId,
      contestProblemCode: req.query.contestProblemCode,
    });

    return successResponse(res, 200, "Draft deleted.");
  } catch (error) {
    console.error("Delete draft error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to delete draft.",
    );
  }
}
