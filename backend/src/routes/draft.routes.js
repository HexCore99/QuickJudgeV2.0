import express from "express";
import {
  deleteDraft,
  getDraft,
  saveDraft,
} from "../controllers/draft.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getDraft);
router.put("/", saveDraft);
router.delete("/", deleteDraft);

export default router;
