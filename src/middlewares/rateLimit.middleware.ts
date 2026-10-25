// src/middlewares/rateLimit.middleware.ts
import rateLimit from "express-rate-limit";
import { ApiError } from "../utils/ApiError";

// Submission: প্রতি student ১৫ মিনিটে সর্বোচ্চ ৫টা (user id দিয়ে গণনা)
export const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => req.user!.id, // authenticate এর পরে বসাতে হবে
  handler: (_req, _res, next) =>
    next(new ApiError(429, "Too many submissions. Please try again after a few minutes.")),
});

// Login/Signup: প্রতি IP থেকে ১৫ মিনিটে সর্বোচ্চ ২০টা (brute force ঠেকাতে)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: (_req, _res, next) =>
    next(new ApiError(429, "Too many attempts. Please try again later.")),
});