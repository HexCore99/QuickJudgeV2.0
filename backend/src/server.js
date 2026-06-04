import "./config/env.js";
import cors from "cors";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import contestRoutes from "./routes/contest.routes.js";
import discussionRoutes from "./routes/discussion.routes.js";
import draftRoutes from "./routes/draft.routes.js";
import leaderboardRoutes from "./routes/leaderboard.routes.js";
import problemRoutes from "./routes/problem.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import { checkDatabaseConnection } from "./config/db.js";
import { startContestRatingFinalizationScheduler } from "./services/contest/contestRatingScheduler.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json({ limit: "4mb" }));
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "QuickJudge backend is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contests", contestRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/drafts", draftRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/submissions", submissionRoutes);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await checkDatabaseConnection();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      startContestRatingFinalizationScheduler();
    });
  } catch (error) {
    console.error("Failed to start server", error);
  }
}

startServer();
