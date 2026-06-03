import express from "express";
import {
  getProblemSubmissions,
  runCode,
  submitCode,
} from "../controllers/submission.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  runCodeLimiter,
  submitCodeLimiter,
} from "../middleware/rateLimit.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getProblemSubmissions);
router.post("/run", runCodeLimiter, runCode);
router.post("/submit", submitCodeLimiter, submitCode);

export default router;
