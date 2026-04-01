import "dotenv/config";
import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import { checkDatabaseConnection } from "./config/db.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "QuickJudge backend is running",
  });
});

app.use("/api/auth", authRoutes);
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await checkDatabaseConnection();
    app.listen(PORT, () => {
      console.log(`Server running on on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
  }
}

startServer();
