import express from "express";
import { getLeaderboard } from "../controllers/leaderboard.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getLeaderboard);

export default router;
