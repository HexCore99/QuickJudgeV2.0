import {
  createDiscussionForUser,
  createReplyForUser,
  deleteDiscussionForUser,
  deleteReplyForUser,
  getDiscussionById,
  getDiscussions,
  updateDiscussionForUser,
  updateReplyForUser,
} from "../services/discussion.service.js";
import { errorResponse, successResponse } from "../utils/response.js";
import {
  validateDiscussionId,
  validateDiscussionPayload,
  validateReplyId,
  validateReplyPayload,
} from "../validators/discussion.validator.js";

export async function getDiscussionList(req, res) {
  try {
    const items = await getDiscussions();
    return successResponse(res, 200, "Discussions fetched.", { items });
  } catch (error) {
    console.error("Get discussions error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to fetch discussions.",
    );
  }
}

export async function getDiscussion(req, res) {
  try {
    const { discussionId } = req.params;
    const idError = validateDiscussionId(discussionId);

    if (idError) {
      return errorResponse(res, 400, idError);
    }

    const item = await getDiscussionById(discussionId);
    return successResponse(res, 200, "Discussion fetched.", { item });
  } catch (error) {
    console.error("Get discussion error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to fetch discussion.",
    );
  }
}

export async function createDiscussion(req, res) {
  try {
    const payloadError = validateDiscussionPayload(req.body);

    if (payloadError) {
      return errorResponse(res, 400, payloadError);
    }

    const item = await createDiscussionForUser(req.user.id, req.body);
    return successResponse(res, 201, "Discussion created.", { item });
  } catch (error) {
    console.error("Create discussion error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to create discussion.",
    );
  }
}

export async function updateDiscussion(req, res) {
  try {
    const { discussionId } = req.params;
    const idError = validateDiscussionId(discussionId);

    if (idError) {
      return errorResponse(res, 400, idError);
    }

    const payloadError = validateDiscussionPayload(req.body);

    if (payloadError) {
      return errorResponse(res, 400, payloadError);
    }

    const item = await updateDiscussionForUser(
      req.user.id,
      req.user.role,
      discussionId,
      req.body,
    );

    return successResponse(res, 200, "Discussion updated.", { item });
  } catch (error) {
    console.error("Update discussion error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to update discussion.",
    );
  }
}

export async function deleteDiscussion(req, res) {
  try {
    const { discussionId } = req.params;
    const idError = validateDiscussionId(discussionId);

    if (idError) {
      return errorResponse(res, 400, idError);
    }

    const data = await deleteDiscussionForUser(
      req.user.id,
      req.user.role,
      discussionId,
    );

    return successResponse(res, 200, "Discussion deleted.", data);
  } catch (error) {
    console.error("Delete discussion error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to delete discussion.",
    );
  }
}

export async function createReply(req, res) {
  try {
    const { discussionId } = req.params;
    const idError = validateDiscussionId(discussionId);

    if (idError) {
      return errorResponse(res, 400, idError);
    }

    const payloadError = validateReplyPayload(req.body);

    if (payloadError) {
      return errorResponse(res, 400, payloadError);
    }

    const item = await createReplyForUser(req.user.id, discussionId, req.body);
    return successResponse(res, 201, "Reply created.", { item });
  } catch (error) {
    console.error("Create reply error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to create reply.",
    );
  }
}

export async function updateReply(req, res) {
  try {
    const { discussionId, replyId } = req.params;
    const discussionIdError = validateDiscussionId(discussionId);

    if (discussionIdError) {
      return errorResponse(res, 400, discussionIdError);
    }

    const replyIdError = validateReplyId(replyId);

    if (replyIdError) {
      return errorResponse(res, 400, replyIdError);
    }

    const payloadError = validateReplyPayload(req.body);

    if (payloadError) {
      return errorResponse(res, 400, payloadError);
    }

    const item = await updateReplyForUser(
      req.user.id,
      req.user.role,
      discussionId,
      replyId,
      req.body,
    );

    return successResponse(res, 200, "Reply updated.", { item });
  } catch (error) {
    console.error("Update reply error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to update reply.",
    );
  }
}

export async function deleteReply(req, res) {
  try {
    const { discussionId, replyId } = req.params;
    const discussionIdError = validateDiscussionId(discussionId);

    if (discussionIdError) {
      return errorResponse(res, 400, discussionIdError);
    }

    const replyIdError = validateReplyId(replyId);

    if (replyIdError) {
      return errorResponse(res, 400, replyIdError);
    }

    const item = await deleteReplyForUser(
      req.user.id,
      req.user.role,
      discussionId,
      replyId,
    );

    return successResponse(res, 200, "Reply deleted.", { item });
  } catch (error) {
    console.error("Delete reply error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to delete reply.",
    );
  }
}
