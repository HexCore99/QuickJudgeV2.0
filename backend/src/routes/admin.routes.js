import express from "express";
import { getDashboard } from "../controllers/adminDashboard.controller.js";
import {
  banUser,
  createAdmin,
  getUsers,
  suspendUser,
  unsuspendUser,
} from "../controllers/adminUsers.controller.js";
import { getAuditLogs } from "../controllers/auditLog.controller.js";
import {
  requireAdmin,
  requireAuth,
  requireSuperAdmin,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/dashboard", getDashboard);
router.get("/users", requireSuperAdmin, getUsers);
router.post("/users/admin", requireSuperAdmin, createAdmin);
router.patch("/users/:userId/suspend", requireSuperAdmin, suspendUser);
router.patch("/users/:userId/unsuspend", requireSuperAdmin, unsuspendUser);
router.patch("/users/:userId/ban", requireSuperAdmin, banUser);
router.get("/logs", requireSuperAdmin, getAuditLogs);

export default router;
