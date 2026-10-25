// src/app.ts
import express, { Application } from "express";
import cors from "cors";
import { errorMiddleware, notFoundMiddleware } from "./middlewares/error.middleware";
import authRoutes from "./modules/auth/auth.routes";
import submissionRoutes from "./modules/submission/submission.routes";
import { env } from "./config/env";
import reviewRoutes from "./modules/review/review.routes";

const app: Application = express();

// Render/Railway-র মতো proxy-র পেছনে চললে আসল user-এর IP পেতে (rate limit-এর জন্য জরুরি)
if (env.nodeEnv === "production") {
  app.set("trust proxy", 1);
}

app.use(
  cors({
    origin: env.clientUrl.split(",").map((url) => url.trim()), // একাধিক হলে কমা দিয়ে
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/review", reviewRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy" });
});

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;