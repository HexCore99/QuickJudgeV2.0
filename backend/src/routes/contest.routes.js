import express from "express";
import {
  getContestDetails,
  getContestProblem,
  getContests,
  registerContest,
  verifyContestPassword,
  getSubmissions,
  getLeaderboard,
  getAnnouncements,
  getQueries,
  postQuery,
} from "../controllers/contest.controller.js";
import {
  createAnnouncement,
  createContest,
  deleteAnnouncement,
  deleteContest,
  finalizeRating,
  replyQuery,
  updateAnnouncement,
  updateSchedule,
} from "../controllers/contestAdmin.controller.js";
import { requireAdmin, requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getContests);
router.post("/", requireAdmin, createContest);
router.get("/:contestId/problems/:problemCode", getContestProblem);
router.get("/:contestId", getContestDetails);
router.post("/:contestId/finalize-rating", requireAdmin, finalizeRating);
router.patch("/:contestId/schedule", requireAdmin, updateSchedule);
router.delete("/:contestId", requireAdmin, deleteContest);
router.post("/:contestId/register", registerContest);
router.post("/:contestId/verify-password", verifyContestPassword);
router.get("/:contestId/submissions", getSubmissions);
router.get("/:contestId/leaderboard", getLeaderboard);
router.get("/:contestId/announcements", getAnnouncements);
router.post("/:contestId/announcements", requireAdmin, createAnnouncement);
router.patch(
  "/:contestId/announcements/:announcementId",
  requireAdmin,
  updateAnnouncement,
);
router.delete(
  "/:contestId/announcements/:announcementId",
  requireAdmin,
  deleteAnnouncement,
);
router.get("/:contestId/queries", getQueries);
router.post("/:contestId/queries", postQuery);
router.patch("/:contestId/queries/:queryId/reply", requireAdmin, replyQuery);

export default router;
