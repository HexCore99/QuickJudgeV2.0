import { listAuditLogs } from "../services/auditLog.service.js";
import { errorResponse, successResponse } from "../utils/response.js";

// fetch logs
export async function getAuditLogs(req, res) {
  try {
    const data = await listAuditLogs(req.query);
    return successResponse(res, 200, "Audit logs fetched.", data);
  } catch (error) {
    console.error("Get audit logs error:", error);
    return errorResponse(
      res,
      error.statusCode || 500,
      error.message || "Failed to fetch audit logs.",
    );
  }
}
