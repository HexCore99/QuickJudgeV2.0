import express from "express";
import rateLimit from "express-rate-limit";
import {
  forgotPassword,
  login,
  resetPassword,
  signup,
} from "../controllers/auth.controller.js";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 10 * 15 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later",
  },
});

const signupLimiter = rateLimit({
  windowMs: 10 * 15 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many signup attempts. Please Try again later",
  },
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many reset requests. Please try again later.",
  },
});

router.post("/login", loginLimiter, login);
router.post("/signup", signupLimiter, signup);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
