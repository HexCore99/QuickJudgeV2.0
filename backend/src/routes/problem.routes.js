import express from "express";
import {
  createProblem,
  deleteProblem,
  getMyProblem,
  getMyProblems,
  getProblemBank,
  getProblemBankProblem,
  getProblemCloneSource,
  getProblemEditorial,
  saveProblemEditorial,
  updateProblemPublication,
  updateProblem,
} from "../controllers/problem.controller.js";
import { requireAdmin, requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.get("/bank", getProblemBank);
router.get("/bank/:problemId", getProblemBankProblem);

router.use(requireAdmin);
router.get("/mine", getMyProblems);
router.get("/clone-sources/:problemId", getProblemCloneSource);
router.post("/", createProblem);
router.get("/:problemId/editorial", getProblemEditorial);
router.put("/:problemId/editorial", saveProblemEditorial);
router.patch("/:problemId/publication", updateProblemPublication);
router.get("/:problemId", getMyProblem);
router.patch("/:problemId", updateProblem);
router.delete("/:problemId", deleteProblem);

export default router;
