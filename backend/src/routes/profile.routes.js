import express from "express";
import {
  getProfile,
  uploadProfileAvatar,
  updateProfile,
} from "../controllers/profile.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getProfile);
router.post("/avatar", uploadProfileAvatar);
router.patch("/", updateProfile);

export default router;
