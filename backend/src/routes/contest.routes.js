import express from "express";
import {
  getContestDetails,
  getContests,
  registerContest,
  verifyContestPassword,
} from "../controllers/contest.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getContests);
router.get("/:contestId", getContestDetails);
router.post("/:contestId/register", registerContest);
router.post("/:contestId/verify-password", verifyContestPassword);

export default router;
