import { getGlobalLeaderboard } from "../services/leaderboard.service.js";
import { errorResponse, successResponse } from "../utils/response.js";

// handles the API request for fetching the global leaderboard.
export async function getLeaderboard(req, res) {
  try {
    const items = await getGlobalLeaderboard({
      limit: req.query.limit,
    });

    return successResponse(res, 200, "Leaderboard fetched.", { items });
  } catch (error) {
    console.error("Get global leaderboard error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to fetch leaderboard.",
    );
  }
}
