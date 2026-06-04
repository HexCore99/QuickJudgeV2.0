import { getAdminDashboard } from "../services/adminDashboard.service.js";
import { errorResponse, successResponse } from "../utils/response.js";

// get admin dashboard stats
export async function getDashboard(req, res) {
  try {
    const dashboard = await getAdminDashboard(req.user.id);
    return successResponse(res, 200, "Admin dashboard fetched.", {
      dashboard,
    });
  } catch (error) {
    console.error("Get admin dashboard error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to fetch admin dashboard.",
    );
  }
}
