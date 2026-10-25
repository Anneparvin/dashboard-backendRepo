// src/middlewares/auth.middleware.ts
import { RequestHandler } from "express";
import { Role } from "../generated/prisma/client";
import { ApiError } from "../utils/ApiError";
import { verifyToken } from "../utils/jwt";

// ১. Token আছে কিনা ও valid কিনা যাচাই করে
export const authenticate: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next(new ApiError(401, "Authentication required"));
  }

  try {
    const payload = verifyToken(header.split(" ")[1]);
    req.user = { id: payload.userId, role: payload.role };
  } catch {
    return next(new ApiError(401, "Invalid or expired token"));
  }

  next();
};

// ২. Role অনুযায়ী access দেয়, যেমন authorize("MENTOR", "ADMIN")
export const authorize =
  (...roles: Role[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required"));
    }
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, "You do not have permission to perform this action"));
    }
    next();
  };