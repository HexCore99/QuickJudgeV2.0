import { getContestSessionLogsForAdmin } from "../services/contest/contestSessionLog.service.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { validateContestId } from "../validators/contest.validator.js";

export async function getContestSessionLogs(req, res) {
  try {
    const { contestId } = req.params;
    const contestIdError = validateContestId(contestId);

    if (contestIdError) {
      return errorResponse(res, 400, contestIdError);
    }

    const data = await getContestSessionLogsForAdmin(
      contestId,
      req.user.id,
      req.user.role,
    );

    return successResponse(res, 200, "Contest session logs fetched.", data);
  } catch (error) {
    console.error("Get contest session logs error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to fetch contest session logs.",
    );
  }
}
