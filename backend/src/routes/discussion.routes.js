import express from "express";
import {
  createDiscussion,
  createReply,
  deleteDiscussion,
  deleteReply,
  getDiscussion,
  getDiscussionList,
  updateDiscussion,
  updateReply,
} from "../controllers/discussion.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getDiscussionList);
router.post("/", createDiscussion);
router.get("/:discussionId", getDiscussion);
router.patch("/:discussionId", updateDiscussion);
router.delete("/:discussionId", deleteDiscussion);
router.post("/:discussionId/replies", createReply);
router.patch("/:discussionId/replies/:replyId", updateReply);
router.delete("/:discussionId/replies/:replyId", deleteReply);

export default router;
