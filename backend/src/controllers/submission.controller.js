import { getSubmissionsForProblem } from "../services/submissions/history.service.js";
import { runCodeForProblem } from "../services/submissions/judging.service.js";
import { submitCodeForProblem } from "../services/submissions/persistence.service.js";
import { createHash } from "node:crypto";
import { recordAuditLogForRequest } from "../services/auditLog.service.js";
import { errorResponse, successResponse } from "../utils/response.js";
import {
  validateRunPayload,
  validateSubmitPayload,
} from "../validators/submission.validator.js";

const activeSubmissionKeys = new Set();

// creates a unique hash key for one exact submission attempt. used for tracking dupe
function buildSubmissionLockKey(userId, payload) {
  return createHash("sha256")
    .update(
      JSON.stringify({
        userId,
        problemId: payload.problemId,
        contestId: payload.contestId || "",
        contestProblemCode: payload.contestProblemCode || "",
        language: payload.language,
        sourceCode: payload.sourceCode,
      }),
    )
    .digest("hex");
}

function getSubmissionTarget(item = {}, payload = {}) {
  return {
    targetType: "submission",
    targetId: item.id || null,
    targetLabel:
      item.problemTitle ||
      payload.contestProblemCode ||
      payload.problemId ||
      "Submission",
    metadata: {
      problemId: item.problemId || payload.problemId || null,
      contestId: item.contestId || payload.contestId || null,
      contestProblemCode:
        item.contestProblemCode || payload.contestProblemCode || null,
      language: item.language || payload.language || null,
      verdict: item.verdict || null,
    },
  };
}

// writes an audit log entry for a submit-code action.
async function auditSubmitCode(req, status, target, message) {
  await recordAuditLogForRequest(req, {
    action: "SUBMIT_CODE",
    status,
    message,
    ...target,
  });
}

export async function runCode(req, res) {
  try {
    const validationError = validateRunPayload(req.body);

    if (validationError) {
      return errorResponse(res, 400, validationError);
    }

    const result = await runCodeForProblem(req.user.id, req.body);

    return successResponse(res, 200, "Code executed.", { result });
  } catch (error) {
    console.error("Run code error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to run code.",
    );
  }
}


export async function submitCode(req, res) {
  let submissionKey = null;
  let didLockSubmission = false;

  try {
    const validationError = validateSubmitPayload(req.body);

    if (validationError) {
      await auditSubmitCode(
        req,
        "failed",
        getSubmissionTarget({}, req.body),
        validationError,
      );
      return errorResponse(res, 400, validationError);
    }

    submissionKey = buildSubmissionLockKey(req.user.id, req.body);

    if (activeSubmissionKeys.has(submissionKey)) {
      await auditSubmitCode(
        req,
        "failed",
        getSubmissionTarget({}, req.body),
        "This exact code is already being submitted.",
      );
      return errorResponse(
        res,
        409,
        "This exact code is already being submitted. Please wait for the current submission to finish.",
      );
    }

    activeSubmissionKeys.add(submissionKey);
    didLockSubmission = true;

    const submission = await submitCodeForProblem(req.user.id, req.body);
    await auditSubmitCode(
      req,
      "success",
      getSubmissionTarget(submission, req.body),
      `Code submitted with ${submission.verdictLabel || submission.verdict}`,
    );
    return successResponse(res, 201, "Code submitted.", { item: submission });
  } catch (error) {
    console.error("Submit code error:", error);
    await auditSubmitCode(
      req,
      "failed",
      getSubmissionTarget({}, req.body),
      error.message || "Failed to submit code.",
    );
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to submit code.",
    );
  } finally {
    if (didLockSubmission && submissionKey) {
      activeSubmissionKeys.delete(submissionKey);
    }
  }
}

export async function getProblemSubmissions(req, res) {
  try {
    const problemId = Number(req.query.problemId);

    if (!Number.isInteger(problemId) || problemId <= 0) {
      return errorResponse(res, 400, "Problem id is required.");
    }

    const items = await getSubmissionsForProblem(req.user.id, {
      problemId,
      contestId: req.query.contestId || null,
      contestProblemCode: req.query.contestProblemCode || null,
    });

    return successResponse(res, 200, "Submissions fetched.", { items });
  } catch (error) {
    console.error("Get problem submissions error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to fetch submissions.",
    );
  }
}
